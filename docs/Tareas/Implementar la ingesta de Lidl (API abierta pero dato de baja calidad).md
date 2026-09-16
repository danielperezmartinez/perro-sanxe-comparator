---
Nombre: Implementar la ingesta de Lidl (API abierta pero dato de baja calidad)
Estado: Planificando
Resumen: Lidl expone una API JSON pública y sin anti-bot (GET https://www.lidl.es/q/api/search?assortment=ES&locale=es_ES&q=<t>&version=2.0.0, motor "mindshift", items en items[].gridbox.data). El problema no es el acceso sino la CALIDAD del dato para un comparador de alimentación: no trae precio por unidad de referencia (solo price + packaging.text tipo "6x1,5l"), los precios son promocionales/temporales (startDate/endDate) y el catálogo online español es mayoritariamente bazar/no-alimentación (el 1.º de "leche" fue un espumador Silvercrest). Objetivo: si algún día se aborda, buscar un workaround para extraer solo alimentación con precio/unidad utilizable.
Bloqueada: []
Fecha de creación: 2026-08-23T18:30:00+02:00
Última modificación: 2026-08-23T18:30:00+02:00
---

# Implementar la ingesta de Lidl (API abierta pero dato de baja calidad)

Parte del estudio [[Ampliar el scraping con más supermercados de API pública (estudio Dia, Lidl, Alcampo, etc)]].

## Hallazgos del recon (2026-08-23)

- Endpoint: `GET https://www.lidl.es/q/api/search?assortment=ES&locale=es_ES&q=<termino>&version=2.0.0` → HTTP 200, `application/mindshift.search+json`. Sin anti-bot con UA de navegador.
- Estructura: `items[].gridbox.data` con `fullTitle`, `brand`, `price{ price, packaging{text}, startDate, endDate, discount... }`.
- **Sin `price_per_unit`**: habría que derivarlo parseando `packaging.text` ("6x1,5l", "8x21 g"), poco fiable.
- Precios **promocionales y temporales** (campos de vigencia), no PVP estable.
- Catálogo online ES = sobre todo bazar/textil/electrónica; alimentación de surtido semanal, no comprable a domicilio como super.

## Posible workaround (para cuando se aborde)

1. Filtrar por las categorías/facetas de alimentación del propio buscador (excluir bazar) en vez de buscar por término suelto.
2. Derivar `precio_por_unidad` desde `packaging.text` con un parser de cantidades (kg/L/uds) — aceptando que fallará en formatos raros.
3. Marcar los precios como promocionales (posible columna/flag futura) para no mezclarlos con PVP estables de otros supers.
4. Evaluar si el resultado aporta valor real al comparador o si Lidl se descarta definitivamente por calidad de dato.

## Decisión actual

No implementar hasta resolver el precio/unidad y el filtrado a alimentación. Prioridad baja.
