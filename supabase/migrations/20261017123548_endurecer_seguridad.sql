-- Endurecimiento tras la auditoría del 2026-10-16 (docs/Tareas/Endurecer
-- Supabase (pg_net, search_path, índice y comentarios de excepción).md).
-- Deja en verde supabase/tests/00_seguridad_catalogo.test.sql.

-- 1. pg_net: instalada sin uso desde que se retiró el scraper demo, y con
--    USAGE/EXECUTE para anon y authenticated. Se elimina; si algún día hace
--    falta, se reinstala revocando esos permisos (el test 6 lo vigila).
drop extension if exists pg_net;

-- 2. search_path fijo y vacío en todas las funciones propias, con los objetos
--    cualificados por esquema. Mismas firmas y mismo comportamiento.

create or replace function public.immutable_unaccent(text)
returns text
language plpgsql
immutable parallel safe strict
set search_path = ''
as $function$
BEGIN
    RETURN public.unaccent('public.unaccent'::regdictionary, $1);
END;
$function$;

create or replace function public.check_price_change()
returns trigger
language plpgsql
set search_path = ''
as $function$
DECLARE
    latest_record RECORD;
BEGIN
    SELECT precio, precio_por_unidad INTO latest_record
    FROM public.precios_historico
    WHERE articulo_id = NEW.articulo_id AND provincia = NEW.provincia
    ORDER BY fecha_registro DESC
    LIMIT 1;

    IF FOUND THEN
        IF latest_record.precio = NEW.precio AND
           (latest_record.precio_por_unidad IS NOT DISTINCT FROM NEW.precio_por_unidad) THEN
            -- Price hasn't changed, ignore the insert
            RETURN NULL;
        END IF;
    END IF;

    RETURN NEW;
END;
$function$;

create or replace function public.search_articulos_laxo(search_query text)
returns table(id uuid, nombre text, imagen_url text, supermercado text, categoria text,
              precio numeric, precio_por_unidad numeric, provincia text,
              ultima_actualizacion timestamptz)
language plpgsql
stable
set search_path = ''
as $function$
DECLARE
    normalized text := public.immutable_unaccent(coalesce(search_query, ''));
    tsq_text text;
    fts_query tsquery;
    ts_matches integer;
BEGIN
    -- Build an AND prefix-query from the stemmed lexemes of the input so that
    -- multi-word queries require EVERY term (AND) and the last token matches by
    -- prefix for incremental typing: "tomate pe" -> 'pe:* & tomat:*'. Spanish
    -- stopwords ("y", "de"...) are dropped by the dictionary.
    SELECT string_agg(lexeme || ':*', ' & ')
      INTO tsq_text
      FROM unnest(to_tsvector('spanish', normalized)) AS t(lexeme, positions, weights);

    -- Empty input or only stopwords: nothing to search.
    IF tsq_text IS NULL OR tsq_text = '' THEN
        RETURN;
    END IF;

    fts_query := to_tsquery('spanish', tsq_text);

    RETURN QUERY
    SELECT a.id, a.nombre, a.imagen_url, a.supermercado, a.categoria,
           ph.precio, ph.precio_por_unidad, ph.provincia, a.ultima_actualizacion
    FROM public.articulos a
    LEFT JOIN LATERAL (
        SELECT p.precio, p.precio_por_unidad, p.provincia
        FROM public.precios_historico p
        WHERE p.articulo_id = a.id
        ORDER BY p.fecha_registro DESC
        LIMIT 1
    ) ph ON true
    WHERE a.search_vector @@ fts_query
    ORDER BY ts_rank(a.search_vector, fts_query) DESC, a.nombre
    LIMIT 50;

    GET DIAGNOSTICS ts_matches = ROW_COUNT;

    -- Typo-tolerance fallback: ONLY when full-text search found nothing, fall
    -- back to trigram similarity on the whole name (e.g. "tomate perra" -> ...).
    IF ts_matches = 0 THEN
        RETURN QUERY
        SELECT a.id, a.nombre, a.imagen_url, a.supermercado, a.categoria,
               ph.precio, ph.precio_por_unidad, ph.provincia, a.ultima_actualizacion
        FROM public.articulos a
        LEFT JOIN LATERAL (
            SELECT p.precio, p.precio_por_unidad, p.provincia
            FROM public.precios_historico p
            WHERE p.articulo_id = a.id
            ORDER BY p.fecha_registro DESC
            LIMIT 1
        ) ph ON true
        WHERE public.immutable_unaccent(a.nombre) OPERATOR(public.%) normalized
        ORDER BY public.similarity(public.immutable_unaccent(a.nombre), normalized) DESC, a.nombre
        LIMIT 50;
    END IF;
END;
$function$;

-- 3. Índice para "último precio por artículo y provincia" (regla de oro,
--    ultimos_precios y el LATERAL del buscador). Cubre también la FK.
create index if not exists precios_historico_articulo_provincia_fecha_idx
  on public.precios_historico (articulo_id, provincia, fecha_registro desc);

-- 4. Las políticas SELECT (true) apuntan a su excepción escrita en
--    docs/Seguridad/.
comment on policy select_articulos_public on public.articulos
  is 'excepcion: Excepción - public.articulos';
comment on policy select_precios_historico_public on public.precios_historico
  is 'excepcion: Excepción - public.precios_historico';
