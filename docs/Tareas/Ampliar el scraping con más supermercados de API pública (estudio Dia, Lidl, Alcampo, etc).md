---
Nombre: Ampliar el scraping con más supermercados de API pública (estudio Dia, Lidl, Alcampo, etc)
Estado: En curso
Resumen: Estudio de viabilidad para sumar supermercados a la ingesta (hoy Mercadona + Consum). Se sondearon empíricamente (curl con UA de navegador, mismas cabeceras que scraping/src/http.ts) las APIs internas de las principales cadenas de España. Hallazgo clave -> Dia expone una API JSON abierta y limpia (tienda web SPA), con precio y precio_por_unidad directos, equivalente en calidad a Consum: candidato recomendado para implementar ya. Lidl también responde JSON abierto pero su catálogo mezcla bazar/no-alimentación, es promocional/temporal y NO trae precio de referencia por unidad: baja prioridad. Alcampo y BonPreu-Esclat corren sobre Ocado Smart Platform (GraphQL con sesión): target duro como Carrefour. El Corte Inglés/Hipercor (Akamai), Alimerka y Coviran (Cloudflare "Just a moment") tienen anti-bot: descartados de momento. Eroski sirve HTML (Tapestry SSR), no JSON. Segunda tanda pedida por el usuario (Aldi, masymas, bonÀrea, Family Cash, Lidl): ninguna es candidato limpio -> Aldi no vende alimentación online en España (Next.js de folletos, sin precio/unidad ni catálogo comprable); masymas son dos cadenas, la de Asturias (masymas.es) es un PHP legacy ISO-8859-1 sin API y la de Fornés (masymas.com) es SSR sin API de producto JSON; bonÀrea (bonarea-online.com) es HTML SSR ASP.NET sin API JSON evidente (pero sin anti-bot); Family Cash es WordPress+WooCommerce pero no expone namespace REST de producto (solo wp/v2). Decisión mantenida: el único a implementar ahora es Dia.
Decisiones:
  - Dia es el próximo super a implementar. API GET https://www.dia.es/api/v1/search-back/search?q=<termino>&page=<n> -> JSON 200 con search_items[], pagination{page_number,page_size(30),total_pages} y total_items. Cada item trae object_id/sku_id (SKU), display_name, image (relativa; host https://www.dia.es/product_images/... verificado 200 jpeg), l1/l2_category_description y prices{price, price_per_unit, measure_unit(LITRO/KILO), currency}. Mapea 1:1 al contrato NormalizedArticulo sin acrobacias.
  - RESUELTO (recon en navegador, 2026-08-23): el endpoint de listado por categoría es GET /api/v1/plp-back/l1/all/{L1}/reduced?category_id={subCat}&page={n} (page 1-indexado). Truco de enumeración: pasando el MISMO id de categoría de primer nivel (L1) en la ruta y en category_id, devuelve el nodo "Todo X" con TODOS los productos de esa L1; así basta recorrer las ~31 categorías L1 y paginar cada una siguiendo pagination.next_url (con guarda de página vacía/incompleta). El árbol de L1 se tomó del estado SSR embebido de una página de categoría. Implementado en scraping/src/supers/dia.ts.
  - Prices de Dia están geolocalizados por código postal (la respuesta por defecto trae cart.postal_code=28041, Madrid). Para el MVP se registran como NACIONAL igual que Mercadona (precio del almacén/CP por defecto); el desglose por provincia queda fuera de alcance, coherente con la tarea de ingesta.
  - Lidl NO se implementa por ahora: GET https://www.lidl.es/q/api/search?assortment=ES&locale=es_ES&q=<t>&version=2.0.0 responde JSON (engine mindshift, items[].gridbox.data) pero sin precio_por_unidad (solo price + packaging.text tipo "6x1,5l"), con precios promocionales (startDate/endDate) y catálogo mayoritariamente no-alimentario. Calidad insuficiente para un comparador de alimentación.
  - Alcampo y BonPreu-Esclat: plataforma Ocado Smart Platform (el HTML de compraonline.alcampo.es contiene "osp"/"graphql"; los /api/vX REST dan "Not Found" en texto plano). Requieren recon de GraphQL + tokens de sesión; se agrupan con Carrefour como "API con protección/sesión".
  - Descartados por anti-bot activo: El Corte Inglés / Supermercado / Hipercor / Supercor (Akamai, "Access Denied" 403), Alimerka y Coviran (Cloudflare challenge). Eroski usa render HTML server-side (Apache Tapestry), sin API JSON pública -> scraping HTML, no encaja con el patrón actual de ingesters JSON.
Bloqueada: []
Fecha de creación: 2026-08-23T18:00:00+02:00
Última modificación: 2026-08-23T18:00:00+02:00
---

# Ampliar el scraping con más supermercados de API pública (estudio Dia, Lidl, Alcampo, etc)

## Contexto

La ingesta real funciona en producción para Mercadona y Consum (ver
[[Implementar la ingesta real de precios (Mercadona, Consum, Carrefour)]]).
Carrefour quedó aparcado por anti-bot
([[Implementar la ingesta de Carrefour (API con protección anti-bot)]]). El
usuario pide estudiar qué otras cadenas de España tienen una API pública tipo
Mercadona/Consum para valorar sumarlas. El contrato a cumplir es el
`SuperIngester` -> `NormalizedArticulo` de `scraping/src/supers/types.ts`
(externalId, nombre, imagenUrl, supermercado, categoria, precio,
precioPorUnidad, provincia).

## Método

Sondeo empírico con `curl` usando el User-Agent de navegador y las cabeceras
de `scraping/src/http.ts` (Accept JSON, Accept-Language es-ES). Se buscó, por
cada cadena, un endpoint JSON de búsqueda/catálogo y se inspeccionó si trae los
campos que exige el contrato (sobre todo **precio** y **precio por unidad**).

## Resultados

| Super | Estado | Endpoint / plataforma | Notas |
|---|---|---|---|
| **Dia** | ✅ **Recomendado** | `GET dia.es/api/v1/search-back/search?q=&page=` | JSON limpio: `prices.price`, `prices.price_per_unit`, `measure_unit`, `sku_id`, categorías, imagen. Falta hallar el PLP para enumerar todo el catálogo. Precios por CP (28041 por defecto). |
| **Lidl** | ⚠️ Baja prioridad | `GET lidl.es/q/api/search?...` | JSON abierto (mindshift) pero sin precio/unidad, promocional y con mucho bazar/no-alimentación. |
| **Alcampo** | 🔒 Duro | Ocado Smart Platform (GraphQL, `osp`) | Requiere sesión/tokens. Como Carrefour. |
| **BonPreu / Esclat** | 🔒 Duro | Ocado Smart Platform | Igual que Alcampo. |
| **El Corte Inglés / Hipercor / Supercor** | ⛔ Anti-bot | Akamai (403 "Access Denied") | Descartado de momento. |
| **Alimerka** | ⛔ Anti-bot | Cloudflare ("Just a moment") | Descartado de momento. |
| **Coviran** | ⛔ Anti-bot | Cloudflare challenge | Descartado de momento. |
| **Eroski** | ❌ No JSON | Apache Tapestry (HTML SSR) | Habría que scrapear HTML; no encaja con el patrón de ingesters JSON. |
| **Gadis** | ❔ Sin API evidente | Next.js / SSR | Alcanzable (no bloquea) pero sin endpoint JSON adivinado; recon pendiente si interesa. |

### Segunda tanda (Aldi, masymas, bonÀrea, Family Cash, Lidl)

| Super | Estado | Plataforma | Notas |
|---|---|---|---|
| **Lidl** | ⚠️ Baja prioridad | mindshift (`lidl.es/q/api/search`) | JSON abierto, pero sin precio/unidad, promocional y mucho bazar. (Ya en la tabla anterior.) |
| **Aldi** | ❌ No viable | Next.js (folletos) | No vende alimentación online en España. `__NEXT_DATA__` menciona "price"/"product" pero sin `€` ni precio por unidad ni catálogo comprable. |
| **masymas (Asturias)** | ❌ No viable | PHP legacy (masymas.es) | Sitio ISO-8859-1 con condicionales IE8, `portada_geolocalizada.php`. Sin API. |
| **masymas (Fornés/Levante)** | ❔ Sin API evidente | SSR (masymas.com) | Solo `/api/js`; sin endpoint de producto JSON. El hint "osp" del recon fue falso positivo. |
| **bonÀrea** | ❔ Sin API evidente | ASP.NET SSR (bonarea-online.com) | Tienda en dominio aparte; HTML server-side, sin API JSON evidente. Sin anti-bot (recon posible si interesa). |
| **Family Cash** | ❌ No viable | WordPress + WooCommerce (`familycash.es`) | WP REST activo pero solo namespace `wp/v2`; `wc/store` y `wc/v3` dan `rest_no_route` y no hay CPT `product`. Sin API pública de catálogo. |

### Ejemplo de producto Dia (real)

```json
{
  "display_name": "Leche semidesnatada Dia Láctea pack 6 x 1 L",
  "object_id": "504P6", "sku_id": "504P6",
  "image": "/product_images/504P6/504P6_ISO_0_ES.jpg",
  "l1_category_description": "Huevos, leche y mantequilla",
  "l2_category_description": "Leche",
  "prices": { "price": 5.04, "price_per_unit": 0.84, "measure_unit": "LITRO", "currency": "EUR" }
}
```

## Recomendación

1. **Implementar Dia** como tercer ingester (`scraping/src/supers/dia.ts`),
   registrándolo en `INGESTERS` y en `DEFAULT_SUPERS` de `scraping/src/run.ts`.
   Único trabajo previo: cerrar el recon del endpoint PLP para enumerar el
   catálogo completo (o iterar categorías conocidas como fallback).
2. **Lidl, Alcampo, BonPreu**: no ahora. Lidl por calidad de dato; Alcampo y
   BonPreu por ser plataforma con sesión (misma clase que Carrefour).
3. **Anti-bot (ECI/Hipercor, Alimerka, Coviran)**: descartados hasta abordar la
   estrategia anti-bot común con Carrefour.

## Implementación de Dia (2026-08-23)

- [x] Recon del endpoint de navegación por categoría de Dia (Claude-in-Chrome):
      la página de categoría es SSR (`/{slug}/c/{L###}`) y embebe el estado con
      `pagination.next_url` -> reveló `/api/v1/plp-back/l1/all/{L1}/reduced`.
      Descubierto además que `category_id={L1}` (mismo id) da el nodo "Todo".
- [x] `scraping/src/supers/dia.ts`: itera las 28 categorías L1 reales (se
      omiten las transversales Novedades/Verano/Sin gluten para no duplicar) y
      pagina cada una; normaliza `prices.price`/`price_per_unit`, imagen con
      host absoluto, `external_id = sku_id`, categoría = nombre L1.
- [x] Alta en `scraping/src/run.ts` (`INGESTERS` + `DEFAULT_SUPERS` ->
      `mercadona,consum,dia`, así entra en el CRON diario) y docs
      (`scraping/README.md`, `docs/README.md`).
- [x] Verificado: `tsc --noEmit -p scraping/tsconfig.json` exit 0; dry-run
      `--super=dia --max=45` OK (45 artículos, 45 únicos); muestra real con
      mapeo correcto (p. ej. Melón 3,54 € / 0,59 €/kg, imagen 200 jpeg).
- [ ] Pendiente: primera ejecución real en producción (workflow_dispatch o el
      CRON) para confirmar volumen y regla de oro contra la BD.

## Pendiente (otros)

- [ ] (Futuro) Estrategia anti-bot para el grupo Carrefour/Alcampo/ECI.
