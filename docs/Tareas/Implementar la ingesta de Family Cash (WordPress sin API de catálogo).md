---
Nombre: Implementar la ingesta de Family Cash (WordPress sin API de catálogo)
Estado: Planificando
Resumen: familycash.es es WordPress con WooCommerce instalado, pero el WP REST solo expone el namespace wp/v2: las rutas de producto (wc/store, wc/v3, wp/v2/product) dan rest_no_route. No hay API pública de catálogo y probablemente el sitio no vende online (parece marketing corporativo). Objetivo: confirmar si Family Cash tiene tienda online real y, si aparece, hallar su fuente de datos; hoy no hay endpoint utilizable.
Bloqueada: []
Fecha de creación: 2026-08-23T18:30:00+02:00
Última modificación: 2026-08-23T18:30:00+02:00
---

# Implementar la ingesta de Family Cash (WordPress sin API de catálogo)

Parte del estudio [[Ampliar el scraping con más supermercados de API pública (estudio Dia, Lidl, Alcampo, etc)]].

## Hallazgos del recon (2026-08-23)

- `https://www.familycash.es/` → WordPress (WooCommerce detectado en el HTML).
- `wp-json` responde, pero `namespaces` = solo `oembed, akismet, contact-form-7, google-site-kit, regenerate-thumbnails, wp/v2, wp-site-health, wp-block-editor`. **No** hay `wc/store` ni `wc/v3`.
- `wp/v2/product`, `wc/store/v1/products`, `wc/v3/products` → `rest_no_route` (404 JSON).
- Sin CPT de producto expuesto: parece web corporativa/marketing, no ecommerce.

## Posible workaround (para cuando se aborde)

1. Confirmar si existe una tienda online real (¿otro subdominio/plataforma?). Si venden online, ver de dónde saca los productos el frontend.
2. Si el catálogo se publica como páginas WordPress, valorar scraping HTML de esas páginas.
3. Si no hay venta online, descartar (no hay precios que comparar).

## Decisión actual

Sin API de catálogo y probablemente sin ecommerce. Prioridad muy baja hasta confirmar que venden online.
