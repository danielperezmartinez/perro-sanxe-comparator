---
Nombre: Implementar la ingesta de Carrefour (API con protección anti-bot)
Estado: Pendiente
Resumen: Añadir Carrefour al sistema de ingesta ya en marcha (ver [[Implementar la ingesta real de precios (Mercadona, Consum, Carrefour)]]). Sus endpoints JSON candidatos responden HTTP 403 con una petición simple (protección anti-bot), así que requiere un recon propio antes de implementar el ingester. El andamiaje ya existe; basta implementar el contrato SuperIngester en scraping/src/supers/carrefour.ts y volver a añadir 'carrefour' a DEFAULT_SUPERS en run.ts.
Decisiones:
  - Se separó de la tarea de ingesta principal (Mercadona/Consum, ya Hecha) para no bloquear su cierre.
  - Mantener el mismo patrón que Mercadona/Consum, con APIs JSON internas, contrato SuperIngester (async generator de NormalizedArticulo) y escritura por el writer común con la regla de oro. No introducir scraping de HTML salvo que no haya más remedio.
Bloqueada: []
Fecha de creación: 2026-08-23T13:00:00+02:00
Última modificación: 2026-08-23T13:00:00+02:00
---

# Implementar la ingesta de Carrefour (API con protección anti-bot)

## Objetivo

Completar la cobertura de supermercados añadiendo Carrefour al sistema de
recolección ya operativo para Mercadona y Consum (ver
[[Implementar la ingesta real de precios (Mercadona, Consum, Carrefour)]] y
`scraping/README.md`).

## Contexto / estado del recon

- Los endpoints JSON candidatos de `carrefour.es` probados (2026-08-22)
  respondían **HTTP 403** con una petición simple (User-Agent de navegador +
  `Accept: application/json`). Carrefour tiene protección anti-bot: probablemente
  exige cookies de sesión / tokens obtenidos al navegar, cabeceras concretas, o
  un handshake previo.
- Hoy `scraping/src/supers/carrefour.ts` es un **stub** que lanza error a
  propósito, y Carrefour está **fuera de `DEFAULT_SUPERS`** en `run.ts` (solo se
  ejecuta con `--super=carrefour`), para que el CRON diario no falle.

## Alcance

1. **Recon** de la fuente real: inspeccionar el tráfico del navegador en
   `tienda`/`carrefour.es` (DevTools → Network) para identificar el endpoint
   JSON del catálogo, sus cabeceras/cookies y el esquema de producto y precio.
2. **Implementar** `carrefour.ts` como `SuperIngester` (async generator de
   `NormalizedArticulo`), mapeando `precio` (PVP) y `precio_por_unidad`, con
   `external_id` = SKU de Carrefour.
3. **Reactivar** Carrefour: añadir `'carrefour'` a `DEFAULT_SUPERS` en
   `scraping/src/run.ts` una vez funcione.
4. Manejo de errores: reutilizar `fetchJson` (reintentos + rotación de
   user-agents); si hace falta, extenderlo para cookies/cabeceras específicas.

## Criterio de aceptación

- `node scraping/src/run.ts --super=carrefour --dry-run --max=50` devuelve
  artículos normalizados reales.
- Ejecución real escribe artículos de Carrefour con la regla de oro (sin
  duplicados por `(supermercado, external_id)`).
- El CRON diario sigue en verde con Carrefour incluido.
