---
Nombre: Corregir textos engañosos de la interfaz (tiempo real, unidad y sello MÁS BARATO)
Estado: Pendiente
Resumen: Prioridad media (auditoría 2026-10-16, consumo). La web promete precios "en tiempo real" cuando el dato se actualiza una vez al día (y la provincia siempre es NACIONAL); muestra "/ ud" cuando el precio por unidad es €/kg o €/L; y el sello "MÁS BARATO" compara productos distintos. Hay que ajustar los textos y la lógica del sello para no inducir a error. No es asesoramiento legal.
Decisiones: []
Bloqueada: []
Fecha de creación: 2026-10-16T23:55:00+02:00
Última modificación: 2026-10-16T23:55:00+02:00
---

# Corregir textos engañosos de la interfaz (tiempo real, unidad y sello MÁS BARATO)

## Objetivo

Que la información que da la web sea exacta (normativa de consumo y prácticas
comerciales desleales).

> Esto no es asesoramiento legal.

## Hallazgos

- `src/app/app.html`: "Encuentra el súper más barato de tu zona, en tiempo real".
  El scraper corre una vez al día y solo para `NACIONAL`.
- La unidad del precio por unidad se muestra como "/ ud" aunque sea €/kg o €/L.
- El sello "MÁS BARATO" se pone al resultado más barato de la lista, que mezcla
  productos distintos (relacionado con
  [[Agrupar resultados por categoría normalizada para comparar entre supermercados]]).

## Alcance propuesto

1. Texto: "precios actualizados a diario" y mostrar la fecha del dato.
2. Unidad real (€/kg, €/L, €/ud) a partir del dato de la ingesta.
3. Sello solo entre productos comparables, o renombrarlo ("precio por kg más
   bajo de esta búsqueda").
4. Actualizar también el "Propósito del proyecto" del README, que dice "en
   tiempo real".

## Verificación

<!-- Tests de ResultRow/App y AXE en verde. -->
