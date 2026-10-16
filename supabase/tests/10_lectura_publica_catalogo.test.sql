-- Aislamiento de las tablas del catálogo de precios. Aquí no hay datos por
-- usuario (no hay owner_id): la regla es que anon y authenticated solo LEEN y
-- que la escritura queda reservada a la clave secreta del scraper, que salta
-- RLS. La lectura pública está justificada en docs/Seguridad/ (notas
-- "Excepción - public.articulos" y "Excepción - public.precios_historico").
begin;
create extension if not exists pgtap with schema extensions;
select plan(14);

-- Datos de prueba como propietario (se revierten al final).
insert into public.articulos (id, nombre, supermercado, external_id)
values ('00000000-0000-0000-0000-0000000000a1', 'Tomate pera prueba', 'TEST', 'test-1');
insert into public.precios_historico (articulo_id, precio, precio_por_unidad)
values ('00000000-0000-0000-0000-0000000000a1', 1.50, 3.00);

-- anon -------------------------------------------------------------------------
set local request.jwt.claims = '{"role":"anon"}';
set local role anon;

select isnt_empty($$ select 1 from public.articulos $$, 'anon lee articulos');
select isnt_empty($$ select 1 from public.precios_historico $$, 'anon lee precios_historico');
select isnt_empty(
  $$ select 1 from public.search_articulos_laxo('tomate pera') $$,
  'anon usa el buscador RPC');

select throws_ok(
  $$ insert into public.articulos (nombre, supermercado) values ('x', 'TEST') $$,
  '42501', null, 'anon no inserta en articulos');
select throws_ok(
  $$ update public.articulos set nombre = 'x' $$,
  '42501', null, 'anon no modifica articulos');
select throws_ok(
  $$ delete from public.articulos $$,
  '42501', null, 'anon no borra articulos');
select throws_ok(
  $$ insert into public.precios_historico (articulo_id, precio)
     values ('00000000-0000-0000-0000-0000000000a1', 9.99) $$,
  '42501', null, 'anon no inserta en precios_historico');
select throws_ok(
  $$ update public.precios_historico set precio = 0 $$,
  '42501', null, 'anon no modifica precios_historico');
select throws_ok(
  $$ delete from public.precios_historico $$,
  '42501', null, 'anon no borra precios_historico');
select throws_ok(
  $$ truncate public.precios_historico $$,
  '42501', null, 'anon no vacía precios_historico');

-- authenticated (cualquier usuario con sesión) -----------------------------------
reset role;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-00000000000b","role":"authenticated"}';
set local role authenticated;

select isnt_empty($$ select 1 from public.articulos $$, 'authenticated lee articulos');
select throws_ok(
  $$ insert into public.articulos (nombre, supermercado) values ('x', 'TEST') $$,
  '42501', null, 'authenticated no inserta en articulos');
select throws_ok(
  $$ update public.precios_historico set precio = 0 $$,
  '42501', null, 'authenticated no modifica precios_historico');
select throws_ok(
  $$ delete from public.articulos $$,
  '42501', null, 'authenticated no borra articulos');

select * from finish();
rollback;
