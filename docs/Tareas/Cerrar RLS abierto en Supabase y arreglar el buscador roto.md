---
Nombre: Cerrar RLS abierto en Supabase y arreglar el buscador roto
Estado: Hecha
Resumen: RLS estaba desactivado en articulos y precios_historico (el rol anon tenía SELECT/INSERT/UPDATE/DELETE/TRUNCATE completos); se activó RLS con políticas de solo lectura para anon/authenticated y se revocó la escritura. Al verificar, se encontró y arregló un bug independiente que tenía el buscador roto en producción (columna ambigua en search_articulos_laxo). En una verificación posterior en navegador real se encontró un tercer bug, en el frontend: el buscador seguía sin funcionar porque el resource() de App nunca se re-ejecutaba al escribir.
Decisiones:
  - anon/authenticated solo pueden SELECT en articulos y precios_historico; la escritura (scraping) queda reservada a la clave service_role, que salta RLS.
  - La clave anon del proyecto (JWT, role anon) es pública por diseño y se commitea en src/environments/environment.ts (ver docs/README.md, sección 1 de "Framework, stack y patrones de código" / Arquitectura de datos); lo que nunca debe exponerse es la clave service_role.
  - search_articulos_laxo tenía una ambigüedad de columnas (precio/precio_por_unidad/provincia coinciden con los nombres de las columnas de RETURNS TABLE) que rompía toda búsqueda, sin relación con RLS; se corrigió cualificando las columnas de la subconsulta LATERAL con el nombre de la tabla.
  - Angular resource() solo es reactivo a través de la función `params`; leer signals directamente dentro de `loader` no crea dependencia reactiva (loader corre en contexto no rastreado) y el resource nunca se recarga. El searchResults de src/app/app.ts leía searchQuery()/selectedProvincia() dentro del loader sin `params`, así que la búsqueda nunca llegaba a pedir datos a Supabase tras la carga inicial. Se corrigió añadiendo `params: () => ({ query, provincia })` y leyendo esos valores desde `params` dentro del loader. Regla general para el proyecto: todo resource() debe declarar sus dependencias reactivas vía `params`, nunca leyendo signals sueltos dentro de `loader`.
Bloqueada: []
Fecha de creación: 2026-08-22T23:30:00+02:00
Última modificación: 2026-08-23T13:15:00+02:00
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

## Adenda 2026-08-23: el buscador seguía roto en el frontend

Tras desplegar en Vercel, el usuario detectó que la búsqueda no traía
resultados. La verificación anterior de este mismo documento sólo probó la
RPC directamente (MCP de Supabase y curl con la clave anon) y no la app
real en navegador, así que no detectó este tercer bug, independiente de los
dos anteriores.

**Causa:** en `src/app/app.ts`, `searchResults` se definía como

```ts
resource<ArticuloResult[], unknown>({
  loader: async ({ abortSignal }) => {
    const q = this.searchQuery();
    const p = this.selectedProvincia();
    ...
  }
});
```

`resource()` de Angular solo reacciona a cambios cuando se declara una
función `params`; leer signals directamente dentro de `loader` no registra
ninguna dependencia (el `loader` se ejecuta en un contexto no rastreado por
diseño). Sin `params`, el `loader` se ejecuta una única vez al crear el
recurso — con `searchQuery()` todavía vacío — y nunca se vuelve a ejecutar
al escribir en el buscador ni al cambiar de provincia. El bug no daba
ningún error visible: `searchResults.value()` simplemente se quedaba
siempre en `[]`.

**Fix:** se añadió `params: () => ({ query: this.searchQuery(), provincia:
this.selectedProvincia() })` y el `loader` pasó a leer `query`/`provincia`
desde `params` en vez de leer los signals directamente.

**Verificación:** `pnpm start` local + Chrome (MCP `claude-in-chrome`).
Antes del fix, buscar "leche" o "queso" mostraba "0 encontrados" pese a que
`curl` contra `search_articulos_laxo` con la clave publishable devolvía
decenas de resultados reales. Tras el fix, la misma búsqueda en el
navegador muestra "50 encontrados" para "queso", con el sello "MÁS BARATO"
en el resultado con menor `precio_por_unidad`. `pnpm test` sigue en verde
(11/11).

**Regla para el proyecto:** cualquier `resource()` nuevo debe declarar sus
dependencias reactivas en `params`; no leer signals sueltos dentro de
`loader`.
