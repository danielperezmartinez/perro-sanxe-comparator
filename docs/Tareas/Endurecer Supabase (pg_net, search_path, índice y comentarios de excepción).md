---
Nombre: Endurecer Supabase (pg_net, search_path, índice y comentarios de excepción)
Estado: Pendiente
Resumen: Prioridad media (auditoría 2026-10-16). Poner en verde supabase/tests/00_seguridad_catalogo.test.sql, que hoy falla en 4 de 9 tests: pg_net instalado sin uso y ejecutable por anon y authenticated; search_path mutable en search_articulos_laxo, check_price_change e immutable_unaccent; falta el índice en precios_historico(articulo_id, provincia, fecha_registro desc); y las políticas SELECT (true) no llevan el comentario excepcion. Todo en migraciones del repo, probado en local y aplicado al remoto solo con OK.
Decisiones:
  - La migración baseline 20261016000000_baseline_esquema_remoto.sql versiona el esquema tal como está en producción, con sus fallos, para que los tests los detecten. Las correcciones van en migraciones posteriores.
Bloqueada: []
Fecha de creación: 2026-10-16T23:55:00+02:00
Última modificación: 2026-10-16T23:55:00+02:00
---

# Endurecer Supabase (pg_net, search_path, índice y comentarios de excepción)

## Objetivo

Cumplir el apartado "Backend y datos (Supabase)" de
[[README#Seguridad, coste y cumplimiento]] y dejar en verde el job `rls` de
`.github/workflows/seguridad.yml`.

## Fallos actuales (`supabase test db` en local, 2026-10-16)

| Test | Fallo |
| --- | --- |
| 3 | `select_articulos_public` y `select_precios_historico_public` sin comentario `excepcion:` |
| 6 | `anon`/`authenticated` ejecutan `net.http_get`, `net.http_post`, etc. |
| 8 | `immutable_unaccent`, `check_price_change`, `search_articulos_laxo` sin `search_path` |
| 9 | FK `precios_historico_articulo_id_fkey` sin índice |

## Alcance propuesto

1. Migración nueva que:
   - elimine `pg_net` (sin uso desde que se retiró el scraper demo) o, si se
     mantiene, revoque `USAGE` en `net` y `EXECUTE` en sus funciones a `anon` y
     `authenticated`;
   - fije `search_path` en las tres funciones, cualificando los objetos con su
     esquema (`public.unaccent`, `public.precios_historico`…);
   - cree el índice `precios_historico (articulo_id, provincia, fecha_registro desc)`;
   - comente las políticas con `excepcion: Excepción - public.articulos` y
     `excepcion: Excepción - public.precios_historico`.
2. `supabase db reset` + `supabase test db` en local, todo en verde.
3. Alinear el historial de migraciones del remoto (`supabase migration repair`)
   y aplicar al remoto **solo con OK del usuario**.
4. Cuando el job `rls` esté verde, marcarlo como obligatorio en `main`.

## Verificación

<!-- Salida de supabase test db y del job rls. -->
