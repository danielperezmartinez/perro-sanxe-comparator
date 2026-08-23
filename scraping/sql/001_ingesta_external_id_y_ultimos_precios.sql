-- Migración 001 — Soporte para la ingesta real de precios
-- Aplicar con la clave service_role (SQL editor de Supabase o MCP).
-- Idempotente: se puede reejecutar sin efectos secundarios.

-- 1. Clave natural del artículo: la SKU del supermercado de origen.
--    Permite deduplicar e identificar el mismo artículo entre ejecuciones del
--    scraping sin depender del nombre (que puede variar).
alter table public.articulos
  add column if not exists external_id text;

-- Índice único (NO parcial) sobre (supermercado, external_id): un external_id
-- es único dentro de un supermercado. Debe ser NO parcial para que
-- `ON CONFLICT (supermercado, external_id)` (lo que genera el upsert de
-- supabase-js, sin cláusula WHERE) pueda inferirlo como árbitro; un índice
-- parcial no es inferible sin repetir su predicado, que supabase-js no emite.
-- Las filas con external_id NULL no colisionan entre sí (NULLs distintos por
-- defecto en un índice único), así que no hace falta el filtro parcial.
create unique index if not exists articulos_supermercado_external_id_key
  on public.articulos (supermercado, external_id);

-- 2. RPC para la "regla de oro": último precio conocido de cada artículo en una
--    provincia dada. DISTINCT ON resuelve en una sola consulta el último
--    registro por artículo (PostgREST no expresa DISTINCT ON directamente).
--    security invoker + search_path fijo para no reintroducir el advisory de
--    search_path mutable; el scraping la invoca con service_role (salta RLS).
create or replace function public.ultimos_precios(
  p_articulo_ids uuid[],
  p_provincia text
)
returns table (
  articulo_id uuid,
  precio numeric,
  precio_por_unidad numeric
)
language sql
stable
security invoker
set search_path = ''
as $$
  select distinct on (ph.articulo_id)
    ph.articulo_id, ph.precio, ph.precio_por_unidad
  from public.precios_historico ph
  where ph.articulo_id = any(p_articulo_ids)
    and ph.provincia = p_provincia
  order by ph.articulo_id, ph.fecha_registro desc
$$;
