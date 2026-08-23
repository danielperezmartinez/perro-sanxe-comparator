---
Nombre: Implementar la ingesta real de precios (Mercadona, Consum, Carrefour)
Estado: Hecha
Resumen: Construir el sistema de recolección de datos real (hasta ahora inexistente en código; la BD solo tenía 4 artículos y ~9k precios falsos de demo). Scraping vía las APIs JSON internas de los supermercados, ejecutado por un CRON en GitHub Actions, escribiendo con la clave secreta (salta RLS) y aplicando la regla de oro. Mercadona y Consum implementados, verificados y EN PRODUCCIÓN (13.630 artículos reales, 1 precio por artículo, 0 duplicados). Carrefour se separa a su propia tarea [[Implementar la ingesta de Carrefour (API con protección anti-bot)]] porque su API responde 403 y requiere recon propio.
Decisiones:
  - Fuente de datos: APIs JSON internas de cada super (no HTML). Mercadona (tienda.mercadona.es/api) y Consum (tienda.consum.es/api/rest/V1.0) confirmadas accesibles y mapeadas; Carrefour da 403 y necesita recon propio.
  - Ejecución en GitHub Actions (no Supabase Edge), con secretos SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY. Parámetro localidad opcional vía workflow_dispatch.
  - Clave natural del artículo: nueva columna articulos.external_id (la SKU del super) + índice único parcial (supermercado, external_id). Cambio de esquema en la migración 001.
  - Provincia: para el MVP toda la ingesta se registra como 'NACIONAL'; el desglose por provincia/almacén queda para después.
  - Datos de demo (4 artículos + ~9k precios aleatorios) se eliminan (migración 002) al entrar la ingesta real (aprobado por el usuario, es destructivo).
  - Runtime del scraper: TypeScript ejecutado nativamente por Node >=24 (type stripping) con fetch global; sin dependencias nuevas (solo @supabase/supabase-js, ya presente) y sin tocar allowBuilds de pnpm.
Bloqueada: []
Fecha de creación: 2026-08-22T21:30:00+02:00
Última modificación: 2026-08-23T13:00:00+02:00
---

# Implementar la ingesta real de precios (Mercadona, Consum, Carrefour)

## Objetivo

Hacer funcionar la recolección de datos, que la documentación (`docs/README.md`,
sección "Lógica de scraping") describía como arquitectura objetivo pero que **no
existía en código**. La base de datos solo contenía datos de demo: 4 artículos
con imágenes `placehold.co` y ~9.154 filas de `precios_historico` con precios
aleatorios. El buscador y RLS ya estaban hechos (ver
[[Cerrar RLS abierto en Supabase y arreglar el buscador roto]]); faltaba toda la
tubería de ingesta.

## Alcance

1. **Migración de esquema** (`scraping/sql/001_...`): columna `articulos.external_id`
   (SKU del super) + índice único parcial `(supermercado, external_id)`, y RPC
   `ultimos_precios(p_articulo_ids uuid[], p_provincia text)` con `DISTINCT ON`
   para resolver la regla de oro en una sola llamada por lote.
2. **Limpieza de demo** (`scraping/sql/002_...`, destructivo, aprobado): vacía
   `articulos` y `precios_historico`.
3. **Tubería de scraping** en `scraping/` (Node 24 + TS nativo, `fetch` global):
   - `src/supers/mercadona.ts`, `consum.ts` — ingesters implementados.
   - `src/supers/carrefour.ts` — stub; recon pendiente (403).
   - `src/sink/supabase-writer.ts` — upsert de `articulos` + regla de oro sobre
     `precios_historico` con la clave `service_role`.
   - `src/http.ts` — `fetchJson` con reintentos + rotación de user-agents.
   - `src/run.ts` — orquestador (`--super`, `--localidad`, `--dry-run`), dedup
     por `(supermercado, external_id)`.
4. **GitHub Actions** (`.github/workflows/scrape.yml`): CRON diario +
   `workflow_dispatch` con inputs `super`/`localidad`.

## Estado / pendiente

- [x] Recon y mapeo de Mercadona y Consum.
- [x] Migración 001 aplicada en Supabase vía MCP (external_id + índice único NO
      parcial + RPC `ultimos_precios`).
- [x] Limpieza de demo aplicada (borrado acotado `external_id IS NULL`, no
      truncate): BD queda solo con datos reales.
- [x] Ingesters Mercadona y Consum, writer, orquestador, workflow.
- [x] Regla de oro y contratos de BD verificados contra producción real.
- [x] Secretos dados de alta en GitHub (`SUPABASE_URL`, `SUPABASE_SECRET_KEY`) y
      primera ejecución completa del workflow verificada: 13.630 artículos
      reales (Consum 9.291 + Mercadona 4.339), 1 precio por artículo, 0
      duplicados, 0 datos demo.
- [→] Carrefour: separado a su propia tarea
      [[Implementar la ingesta de Carrefour (API con protección anti-bot)]].
- [ ] (Futuro) desglose por provincia en vez de 'NACIONAL' — pendiente, fuera
      del alcance de esta tarea.

## Sistema demo previo descubierto y retirado

Al verificar con la publishable key se descubrió el verdadero "a medias": una
Edge Function desplegada `scraper` (no en el repo) que era un **simulador**
(4 productos hardcodeados con precios `Math.random()`, fetch a `example.com`),
invocada **cada hora** por un `pg_cron` `invoke-scraper-every-hour`
(`net.http_post` a `/functions/v1/scraper`). Era el origen de los ~9k precios
falsos. Acciones:

- `pg_cron` desprogramado con `cron.unschedule('invoke-scraper-every-hour')`
  (el `UPDATE cron.job` directo daba permiso denegado con el rol del MCP).
- La Edge Function `scraper` sigue desplegada pero ya nadie la invoca; **queda
  pendiente borrarla desde el dashboard** (el MCP no expone borrado de Edge
  Functions; además tiene `verify_jwt=false`, o sea es invocable públicamente).
- Regla de oro: se confirmó que ya existe el trigger BD `trg_check_price_change`
  (compara `precio` y `precio_por_unidad`), consistente con el writer.
- Migración del cliente Angular a la publishable key nueva
  (`sb_publishable_...`) en `environment.ts`, para poder desactivar las claves
  legacy sin romper la app. Verificada contra la RPC del buscador (HTTP 200).

## Verificación

- Dry-run local de Mercadona y Consum (fetch + normalización): OK. Mapeo de
  precios correcto con datos reales — Mercadona Aceite 5L → precio 17.75 € (PVP)
  / precio_por_unidad 3.55 €/L; Consum Rabanito → 1.15 € / 4.60 €/kg.
- `tsc --noEmit` sobre `scraping/tsconfig.json`: exit 0.
- **Contra producción (MCP):** insertados 6 artículos reales ejercitando el
  mismo contrato del writer (`ON CONFLICT (supermercado, external_id)` + RPC
  `ultimos_precios` + regla de oro). Reejecución idéntica → 0 precios nuevos;
  con un precio alterado → 1 cambio detectado. Índice único recreado NO parcial
  (un índice parcial NO es inferible por el `ON CONFLICT` sin WHERE que genera
  supabase-js, habría roto el upsert). `search_articulos_laxo('aceite')`
  devuelve los artículos reales con sus precios. `get_advisors` security: solo
  WARN preexistentes; `ultimos_precios` sin advisory (search_path fijo).
- Nota: los 3 artículos de Mercadona y 3 de Consum de la prueba tienen
  `imagen_url` de marcador; el primer run real los corrige por upsert.

## Resultado

Sistema de ingesta **funcionando en producción** para Mercadona y Consum, con
CRON diario en GitHub Actions (05:00 UTC) + `workflow_dispatch`. Tras la primera
ejecución completa: 13.630 artículos reales, 1 precio por artículo, sin
duplicados y sin datos demo. Verificado que un super que falla (Carrefour) no
impide que los demás completen, y ajustado el run por defecto a
`mercadona,consum` para que el CRON no se marque en rojo por el stub de
Carrefour. Actions subidas a v5 (Node 24). Tarea completada; Carrefour continúa
en [[Implementar la ingesta de Carrefour (API con protección anti-bot)]].
