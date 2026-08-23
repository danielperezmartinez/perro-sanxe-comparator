-- Migración 002 — Limpieza de los datos de demo (DESTRUCTIVO)
-- Aprobado por el usuario. Elimina el catálogo sembrado de ejemplo (imágenes
-- placehold.co y precios aleatorios), identificable porque es anterior a la
-- columna external_id y por tanto tiene external_id IS NULL.
--
-- Se borra SOLO la demo (external_id IS NULL) y no todo, para no tocar los
-- artículos reales ya ingestados. El borrado de articulos arrastra sus
-- precios_historico por la FK (ON DELETE) -> se borran primero los precios.
-- Requiere service_role. Idempotente.

delete from public.precios_historico
where articulo_id in (select id from public.articulos where external_id is null);

delete from public.articulos
where external_id is null;
