---
Nombre: Cerrar RLS abierto en Supabase y arreglar el buscador roto
Estado: Hecha
Resumen: RLS estaba desactivado en articulos y precios_historico (el rol anon tenía SELECT/INSERT/UPDATE/DELETE/TRUNCATE completos); se activó RLS con políticas de solo lectura para anon/authenticated y se revocó la escritura. Al verificar, se encontró y arregló un bug independiente que tenía el buscador roto en producción (columna ambigua en search_articulos_laxo).
Decisiones:
  - anon/authenticated solo pueden SELECT en articulos y precios_historico; la escritura (scraping) queda reservada a la clave service_role, que salta RLS.
  - La clave anon del proyecto (JWT, role anon) es pública por diseño y se commitea en src/environments/environment.ts (ver docs/README.md, sección 1 de "Framework, stack y patrones de código" / Arquitectura de datos); lo que nunca debe exponerse es la clave service_role.
  - search_articulos_laxo tenía una ambigüedad de columnas (precio/precio_por_unidad/provincia coinciden con los nombres de las columnas de RETURNS TABLE) que rompía toda búsqueda, sin relación con RLS; se corrigió cualificando las columnas de la subconsulta LATERAL con el nombre de la tabla.
Bloqueada: []
Fecha de creación: 2026-08-22T23:30:00+02:00
Última modificación: 2026-08-22T23:30:00+02:00
---

# Cerrar RLS abierto en Supabase y arreglar el buscador roto

## Objetivo

El usuario preguntó si la clave de Supabase en `environment.ts` debía
gestionarse como clave pública (commiteable) en vez de como credencial
privada. Al revisar el proyecto real con el MCP de Supabase se confirmó que
la clave es efectivamente la clave anon (`role: "anon"` en el JWT) — pública
por diseño — pero se encontró que la base de datos estaba completamente
abierta: **RLS desactivado** en `articulos` y `precios_historico`, con el
rol `anon` teniendo `SELECT`, `INSERT`, `UPDATE`, `DELETE` y `TRUNCATE`
sobre ambas tablas (advisory de seguridad de Supabase, nivel `ERROR`/
`critical`). Cualquiera con la clave anon (visible por diseño en cualquier
cliente) podía borrar o vaciar las tablas.

## Alcance realizado

1. **RLS + políticas** (migración `enable_rls_articulos_precios_historico`):
   - `REVOKE INSERT, UPDATE, DELETE, TRUNCATE` sobre ambas tablas a `anon` y
     `authenticated`.
   - `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` en ambas.
   - Política `SELECT` pública (`USING (true)`) para `anon`/`authenticated`
     en ambas tablas — el catálogo de precios no tiene datos sensibles ni
     por-usuario, así que la lectura pública es intencional.
   - Se comprobó antes de aplicar que `search_articulos_laxo` es
     `SECURITY INVOKER` (no `DEFINER`), así que necesitaba la política de
     lectura para seguir funcionando tras activar RLS.
2. **Bug de columna ambigua en `search_articulos_laxo`** (migración
   `fix_search_articulos_laxo_ambiguous_column`), encontrado al verificar
   que la búsqueda seguía funcionando tras el cambio de RLS: la función
   `RETURNS TABLE(..., precio, precio_por_unidad, provincia, ...)` convierte
   esos nombres en variables PL/pgSQL, que colisionaban con las columnas del
   mismo nombre de `precios_historico` dentro del `SELECT` de la subconsulta
   `LATERAL`. Se cualificaron esas columnas con `precios_historico.` para
   desambiguar. Este bug era previo y no tenía relación con RLS: fallaba
   igual ejecutado como `postgres` sin RLS de por medio.
3. `docs/README.md` actualizado: sección 1 (clave anon commiteable, clave
   service_role nunca) y "Arquitectura de datos" (nota de seguridad RLS).

## Verificación

- `get_advisors` (security): el advisory `rls_disabled_in_public`
  (`ERROR`) desapareció tras la primera migración. Quedan solo `WARN` de
  menor prioridad (search_path mutable en 3 funciones, extensiones en
  `public`) — no abordados en este cambio, quedan como mejora futura.
- Tras arreglar la función: `select * from search_articulos_laxo('leche')`
  (como `postgres`, vía MCP) y una petición HTTP directa a
  `/rest/v1/rpc/search_articulos_laxo` con la clave `anon` real (la misma
  que usa el cliente) devuelven `HTTP 200` con datos reales
  (`Leche Entera Pascual`, Mercadona).

## Resultado

Base de datos cerrada en escritura para el cliente público y buscador
funcionando de nuevo en producción. Ver `docs/README.md` para el estado
vigente de la política de RLS y del manejo de claves.
