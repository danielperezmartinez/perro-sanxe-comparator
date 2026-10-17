-- Baseline del esquema remoto (proyecto wvzrilklvpaqzvehwyya), reconstruido el
-- 2026-10-16 a partir del catálogo de Postgres con consultas SELECT de solo
-- lectura. Hasta ahora el DDL vivía repartido entre el panel, el MCP y
-- scraping/sql/; esta migración lo versiona tal cual está en producción,
-- **incluidos sus fallos conocidos** (search_path mutable, pg_net accesible a
-- anon, falta de índice en precios_historico y políticas SELECT (true) sin
-- comentario de excepción). Los tests de supabase/tests/ los detectan; se
-- corrigen en migraciones posteriores (ver docs/Tareas/).
--
-- Ojo: el historial de migraciones del remoto tiene otras versiones
-- (001_initial_schema_v3 … rework_search_articulos_laxo_relevancia). Antes de
-- usar `supabase db push` contra el remoto hay que alinear el historial con
-- `supabase migration repair` (ver la tarea de endurecer Supabase).

-- Extensiones -----------------------------------------------------------------

create extension if not exists pg_trgm with schema public;
create extension if not exists unaccent with schema public;
-- Instalada en el remoto sin uso (residuo del scraper demo). Supabase concede
-- USAGE/EXECUTE sobre el esquema net a anon y authenticated al instalarla.
create extension if not exists pg_net;

-- Funciones auxiliares -----------------------------------------------------------

create or replace function public.immutable_unaccent(text)
returns text
language plpgsql
immutable parallel safe strict
as $function$
BEGIN
    RETURN unaccent('unaccent'::regdictionary, $1);
END;
$function$;

-- Tablas -----------------------------------------------------------------------

create table if not exists public.articulos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  imagen_url text,
  supermercado text not null,
  categoria text,
  ultima_actualizacion timestamptz default timezone('utc'::text, now()),
  search_vector tsvector generated always as
    (to_tsvector('spanish'::regconfig, public.immutable_unaccent(nombre))) stored,
  external_id text
);

create table if not exists public.precios_historico (
  id uuid primary key default gen_random_uuid(),
  articulo_id uuid not null references public.articulos(id) on delete cascade,
  precio numeric not null,
  precio_por_unidad numeric,
  provincia text default 'NACIONAL'::text,
  fecha_registro timestamptz default timezone('utc'::text, now())
);

create index if not exists articulos_search_idx
  on public.articulos using gin (search_vector);
create index if not exists articulos_nombre_trgm_idx
  on public.articulos using gin (public.immutable_unaccent(nombre) gin_trgm_ops);
create unique index if not exists articulos_supermercado_external_id_key
  on public.articulos (supermercado, external_id);

-- Regla de oro: descartar inserts sin cambio de precio ------------------------

create or replace function public.check_price_change()
returns trigger
language plpgsql
as $function$
DECLARE
    latest_record RECORD;
BEGIN
    SELECT precio, precio_por_unidad INTO latest_record
    FROM precios_historico
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

drop trigger if exists trg_check_price_change on public.precios_historico;
create trigger trg_check_price_change
  before insert on public.precios_historico
  for each row execute function public.check_price_change();

-- RPC --------------------------------------------------------------------------

create or replace function public.search_articulos_laxo(search_query text)
returns table(id uuid, nombre text, imagen_url text, supermercado text, categoria text,
              precio numeric, precio_por_unidad numeric, provincia text,
              ultima_actualizacion timestamptz)
language plpgsql
stable
as $function$
DECLARE
    normalized text := immutable_unaccent(coalesce(search_query, ''));
    tsq_text text;
    fts_query tsquery;
    ts_matches integer;
BEGIN
    -- Build an AND prefix-query from the stemmed lexemes of the input so that
    -- multi-word queries require EVERY term (AND) and the last token matches by
    -- prefix for incremental typing: "tomate pe" -> 'pe:* & tomat:*'. Spanish
    -- stopwords ("y", "de"...) are dropped by the dictionary. This replaces the
    -- previous trigram OR clause, which flooded results with anything sharing a
    -- few characters (e.g. "Zumo Tomate Brik" for "tomate pera").
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
    FROM articulos a
    LEFT JOIN LATERAL (
        SELECT precios_historico.precio, precios_historico.precio_por_unidad, precios_historico.provincia
        FROM precios_historico
        WHERE articulo_id = a.id
        ORDER BY fecha_registro DESC
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
        FROM articulos a
        LEFT JOIN LATERAL (
            SELECT precios_historico.precio, precios_historico.precio_por_unidad, precios_historico.provincia
            FROM precios_historico
            WHERE articulo_id = a.id
            ORDER BY fecha_registro DESC
            LIMIT 1
        ) ph ON true
        WHERE immutable_unaccent(a.nombre) % normalized
        ORDER BY similarity(immutable_unaccent(a.nombre), normalized) DESC, a.nombre
        LIMIT 50;
    END IF;
END;
$function$;

create or replace function public.ultimos_precios(p_articulo_ids uuid[], p_provincia text)
returns table(articulo_id uuid, precio numeric, precio_por_unidad numeric)
language sql
stable
set search_path = ''
as $function$
  select distinct on (ph.articulo_id)
    ph.articulo_id, ph.precio, ph.precio_por_unidad
  from public.precios_historico ph
  where ph.articulo_id = any(p_articulo_ids)
    and ph.provincia = p_provincia
  order by ph.articulo_id, ph.fecha_registro desc
$function$;

-- Permisos y RLS (estado del remoto) -------------------------------------------

alter table public.articulos enable row level security;
alter table public.precios_historico enable row level security;

revoke all on public.articulos, public.precios_historico from anon, authenticated;
grant select, references, trigger on public.articulos, public.precios_historico
  to anon, authenticated;

drop policy if exists select_articulos_public on public.articulos;
create policy select_articulos_public on public.articulos
  for select to anon, authenticated using (true);

drop policy if exists select_precios_historico_public on public.precios_historico;
create policy select_precios_historico_public on public.precios_historico
  for select to anon, authenticated using (true);
