---
Nombre: Pedir permiso a Mercadona y Consum o buscar una fuente autorizada
Estado: Pendiente
Resumen: "Mercadona y Consum están pausados en el scraper porque su robots.txt prohíbe /api. Para reactivarlos hace falta un permiso escrito o una fuente autorizada (API pública, feed o acuerdo). Incluye revisar los términos de uso de Mercadona, Consum y Dia y el derecho sui generis de bases de datos de la UE. No es asesoramiento legal."
Decisiones: []
Bloqueada: []
Fecha de creación: 2026-10-17T01:45:00+02:00
Última modificación: 2026-10-17T01:45:00+02:00
---

# Pedir permiso a Mercadona y Consum o buscar una fuente autorizada

## Contexto

Sale de [[Adecuar el scraper actual a robots.txt y a las reglas de scraping]].
El 2026-10-17 el usuario decidió pausar Mercadona y Consum (lista `PAUSED` de
`scraping/src/run.ts`) hasta tener permiso. Sus artículos y precios ya
guardados siguen en la base de datos y se muestran, pero no se actualizan.

> Esto no es asesoramiento legal. Ante dudas concretas sobre robots.txt, los
> términos de uso o el derecho *sui generis* (Directiva 96/9/CE, arts. 133-137
> del TRLPI), consulta a un profesional.

## Alcance propuesto

1. Escribir a Mercadona y a Consum explicando el proyecto (sin ánimo de lucro,
   una consulta al día, user-agent identificable) y pedir permiso o un feed.
2. Revisar los términos de uso de los tres súper (incluido Dia, que sigue
   activo) y anotar el resultado en la
   [[Seguridad/Checklist de lanzamiento|checklist]].
3. Decidir qué hacer con los datos ya guardados de Mercadona y Consum si no hay
   permiso (mantenerlos con su fecha, o borrarlos con una migración aprobada).
4. Si llega el permiso: quitarlos de `PAUSED`, volver a añadirlos a
   `DEFAULT_SUPERS` y guardar la prueba del permiso aquí.

## Verificación

<!-- Qué se ejecutó y dónde. -->
