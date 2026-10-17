-- Comportamiento de las funciones del catálogo tras fijar search_path = ''
-- (buscador laxo, fallback por trigramas y regla de oro del histórico).
begin;
create extension if not exists pgtap with schema extensions;
select plan(5);

insert into public.articulos (id, nombre, supermercado, external_id)
values ('00000000-0000-0000-0000-0000000000c1', 'Tomate pera ecológico', 'TEST', 'test-c1');
insert into public.precios_historico (articulo_id, precio, precio_por_unidad)
values ('00000000-0000-0000-0000-0000000000c1', 2.00, 4.00);

-- Regla de oro: el mismo precio no crea fila nueva; un precio distinto sí.
insert into public.precios_historico (articulo_id, precio, precio_por_unidad)
values ('00000000-0000-0000-0000-0000000000c1', 2.00, 4.00);
select is(
  (select count(*)::int from public.precios_historico
   where articulo_id = '00000000-0000-0000-0000-0000000000c1'),
  1, 'Un precio sin cambios no se inserta');
-- now() es fijo dentro de la transacción: fecha explícita para que sea el último.
insert into public.precios_historico (articulo_id, precio, precio_por_unidad, fecha_registro)
values ('00000000-0000-0000-0000-0000000000c1', 2.10, 4.20, now() + interval '1 minute');
select is(
  (select count(*)::int from public.precios_historico
   where articulo_id = '00000000-0000-0000-0000-0000000000c1'),
  2, 'Un precio distinto sí se inserta');

set local request.jwt.claims = '{"role":"anon"}';
set local role anon;

select is(
  (select precio from public.search_articulos_laxo('ecologico')
   where id = '00000000-0000-0000-0000-0000000000c1'),
  2.10::numeric, 'El buscador devuelve el último precio, sin tildes');
select isnt_empty(
  $$ select 1 from public.search_articulos_laxo('tomate pe')
     where id = '00000000-0000-0000-0000-0000000000c1' $$,
  'El buscador acepta prefijos');
select isnt_empty(
  $$ select 1 from public.search_articulos_laxo('tomatte perra ecolojico')
     where id = '00000000-0000-0000-0000-0000000000c1' $$,
  'El fallback por trigramas tolera errores');

select * from finish();
rollback;
