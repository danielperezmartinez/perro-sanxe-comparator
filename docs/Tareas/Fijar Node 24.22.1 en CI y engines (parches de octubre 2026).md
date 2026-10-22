---
Nombre: Fijar Node 24.22.1 en CI y engines (parches de octubre 2026)
Estado: Hecha
Resumen: "Prioridad alta. Los workflows pedían node-version 24 y tomaban el Node de la caché del runner (24.21.0, anterior a las versiones de seguridad de Node del 21-oct-2026, p. ej. CVE-2026-111497 en Brotli). El scraping diario descarga respuestas de terceros con fetch(). Se fija 24.22.1 en scrape.yml y seguridad.yml y engines.node pasa a >=24.22.1 <25."
Decisiones:
  - "Política común de las webs del usuario: versión exacta en setup-node (sin check-latest), la misma en todo el repo y engines.node con el mínimo parcheado; la versión de Node solo cambia por PR."
  - "Pedir solo gzip en el cliente HTTP del scraper queda fuera de esta tarea."
Bloqueada: []
Fecha de creación: 2026-10-23T00:20:00+02:00
Última modificación: 2026-10-23T00:40:00+02:00
---

# Fijar Node 24.22.1 en CI y engines (parches de octubre 2026)

## Contexto

Node publicó el 21-oct-2026 versiones de seguridad (22.23.4, 24.22.1, 26.12.1).
El run programado del scraping del 22-oct usó Node 24.21.0 desde la caché del
runner porque `actions/setup-node` recibía `node-version: 24`.

## Alcance

1. `.github/workflows/scrape.yml` y `.github/workflows/seguridad.yml`:
   `node-version: '24.22.1'`.
2. `package.json`: `engines.node` → `">=24.22.1 <25"`. No hay otros sitios que
   fijen Node (`.nvmrc`, `useNodeVersion`, `mise.toml`).
3. Versión 0.5.4 → 0.5.5.

## Verificación

- [x] PR #9 integrada con squash (commit `65becae`). Los tres checks de
      `Seguridad` en verde (run 39864537330); setup-node: «Acquiring 24.22.1».
- [x] Despliegue de producción de `65becae` en `READY`. El log de build de
      Vercel no imprime el patch de Node (proyecto en `24.x`); pnpm no avisa de
      engines no soportados con `>=24.22.1 <25`, así que es ≥ 24.22.1
      (comprobación indirecta).
- [x] Scraping lanzado a mano (run 39865310446) con Node 24.22.1: Dia, 5812
      artículos, 4 precios nuevos, sin errores.
