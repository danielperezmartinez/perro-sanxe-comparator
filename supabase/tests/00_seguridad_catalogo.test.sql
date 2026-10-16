-- Comprobación genérica del catálogo de Postgres (sistema "Seguridad, coste y
-- cumplimiento" de docs/, v1). Falla ante los patrones prohibidos sin tener que
-- escribir un test por tabla. Se ejecuta con `supabase test db` contra la base
-- local, construida solo con las migraciones del repo.
--
-- Los tests 8 y 9 son propios de este proyecto: search_path fijo en TODAS las
-- funciones propias (no solo las SECURITY DEFINER) e índice en cada clave
-- foránea. Se añadieron porque esos dos fallos se colaron con las skills de
-- Supabase instaladas.
begin;
create extension if not exists pgtap with schema extensions;
select plan(9);

-- Esquemas propios del proyecto.
create temp table _esquemas(nombre text) on commit drop;
insert into _esquemas values ('public');

-- Funciones propias: las del esquema que no pertenecen a una extensión.
create temp view _funciones_propias as
  select p.oid, p.prosecdef, p.proconfig
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname in (select nombre from _esquemas)
    and not exists (
      select 1 from pg_depend d
      where d.classid = 'pg_proc'::regclass and d.objid = p.oid and d.deptype = 'e'
    );

-- 1. Toda tabla propia tiene RLS activado.
select is_empty($$
  select n.nspname || '.' || c.relname
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
  where c.relkind in ('r', 'p')
    and n.nspname in (select nombre from _esquemas)
    and not c.relrowsecurity
$$, 'Toda tabla propia tiene RLS activado');

-- 2. Ninguna política de escritura es USING/WITH CHECK (true).
select is_empty($$
  select n.nspname || '.' || c.relname || ' · ' || p.polname
  from pg_policy p
  join pg_class c on c.oid = p.polrelid
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname in (select nombre from _esquemas)
    and p.polcmd in ('a', 'w', 'd', '*')
    and (pg_get_expr(p.polqual, p.polrelid) in ('true', '(true)')
      or pg_get_expr(p.polwithcheck, p.polrelid) in ('true', '(true)'))
$$, 'Ninguna política de INSERT/UPDATE/DELETE/ALL es (true)');

-- 3. Una política SELECT (true) solo existe con excepción escrita.
select is_empty($$
  select n.nspname || '.' || c.relname || ' · ' || p.polname
  from pg_policy p
  join pg_class c on c.oid = p.polrelid
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname in (select nombre from _esquemas)
    and p.polcmd = 'r'
    and pg_get_expr(p.polqual, p.polrelid) in ('true', '(true)')
    and coalesce(obj_description(p.oid, 'pg_policy'), '') not like 'excepcion:%'
$$, 'Las políticas SELECT (true) tienen excepción escrita');

-- 4. Toda función SECURITY DEFINER fija search_path vacío.
select is_empty($$
  select oid::regprocedure::text from _funciones_propias
  where prosecdef
    and not exists (
      select 1 from unnest(coalesce(proconfig, '{}')) cfg
      where cfg in ('search_path=""', 'search_path=')
    )
$$, 'Las funciones SECURITY DEFINER tienen search_path vacío');

-- 5. anon no ejecuta funciones SECURITY DEFINER salvo excepción escrita.
select is_empty($$
  select oid::regprocedure::text from _funciones_propias
  where prosecdef
    and has_function_privilege('anon', oid, 'EXECUTE')
    and coalesce(obj_description(oid, 'pg_proc'), '') not like 'excepcion:%'
$$, 'anon no ejecuta funciones SECURITY DEFINER sin excepción');

-- 6. Extensiones con salida a red fuera del alcance de anon y authenticated.
--    Al instalar pg_net, Supabase concede acceso a anon y authenticated por
--    defecto, así que este test falla hasta que una migración lo revoca (o
--    elimina la extensión si no se usa). Si se reinstala, el test lo detecta.
select is_empty($$
  select r.rolname || ' → ' || p.oid::regprocedure::text
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  cross join (values ('anon'), ('authenticated')) r(rolname)
  where n.nspname in ('net', 'http')
    and has_schema_privilege(r.rolname, n.oid, 'USAGE')
    and has_function_privilege(r.rolname, p.oid, 'EXECUTE')
$$, 'pg_net/http no son ejecutables por anon ni authenticated');

-- 7. Todo bucket tiene límite de tamaño.
select is_empty($$
  select id from storage.buckets where file_size_limit is null
$$, 'Todo bucket tiene file_size_limit');

-- 8. (Proyecto) Toda función propia fija search_path (lint
--    function_search_path_mutable del Security Advisor).
select is_empty($$
  select oid::regprocedure::text from _funciones_propias
  where not exists (
    select 1 from unnest(coalesce(proconfig, '{}')) cfg
    where cfg like 'search_path=%'
  )
$$, 'Toda función propia fija search_path');

-- 9. (Proyecto) Toda clave foránea tiene un índice que empieza por sus columnas
--    (lint unindexed_foreign_keys del Performance Advisor).
select is_empty($$
  select c.conrelid::regclass::text || ' · ' || c.conname
  from pg_constraint c
  join pg_namespace n on n.oid = c.connamespace
  where c.contype = 'f'
    and n.nspname in (select nombre from _esquemas)
    and not exists (
      select 1 from pg_index i
      where i.indrelid = c.conrelid
        and (i.indkey::int2[])[0:array_length(c.conkey, 1) - 1] = c.conkey
    )
$$, 'Toda clave foránea tiene índice');

select * from finish();
rollback;
