---
Nombre: Implementar la ingesta de Eroski (web HTML SSR, sin API JSON)
Estado: Planificando
Resumen: El supermercado online de Eroski (supermercado.eroski.es) renderiza en servidor con Apache Tapestry: devuelve HTML completo (no JSON) y no se detectó una API JSON pública de catálogo. No hay anti-bot (responde 200). Objetivo: valorar scraping del HTML del listado por categoría o hallar el endpoint JSON del buscador/app como workaround.
Bloqueada: []
Fecha de creación: 2026-08-23T18:30:00+02:00
Última modificación: 2026-08-23T18:30:00+02:00
---

# Implementar la ingesta de Eroski (web HTML SSR, sin API JSON)

Parte del estudio [[Ampliar el scraping con más supermercados de API pública (estudio Dia, Lidl, Alcampo, etc)]].

## Hallazgos del recon (2026-08-23)

- `https://supermercado.eroski.es/es/search/results/?q=leche` → HTTP 200 pero `text/html` (framework Apache Tapestry 5.6.2), ~1 MB de HTML.
- Sin API JSON de catálogo evidente; sin anti-bot.

## Posible workaround (para cuando se aborde)

1. Scraping del HTML del listado por categoría/búsqueda: parsear tarjetas de producto (nombre, precio, precio/unidad, imagen, id) con un parser (regex acotado o cheerio) — rompe el patrón "solo APIs JSON" del scraper actual, valorar coste de mantenimiento.
2. Inspeccionar con Claude-in-Chrome si hay llamadas XHR/JSON al paginar o filtrar (Tapestry a veces expone "event" endpoints JSON).
3. Buscar la API de la app móvil de Eroski.

## Decisión actual

No hay API JSON limpia; requeriría scraping HTML o recon del buscador/app. Prioridad media-baja (accesible, pero fuera del patrón actual).
