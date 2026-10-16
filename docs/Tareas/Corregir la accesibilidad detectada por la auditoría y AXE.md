---
Nombre: Corregir la accesibilidad detectada por la auditoría y AXE
Estado: Pendiente
Resumen: Prioridad baja (auditoría 2026-10-16). El AXE nuevo (pnpm test:a11y) falla en la vista de resultados porque el cdk-virtual-scroll-viewport no es accesible con teclado (scrollable-region-focusable, serious). La auditoría manual añade textos de 9-10 px, resultados sin región aria-live y un spinner sin nombre accesible. Hay que dejar AXE en verde y repasar a mano teclado y lector de pantalla.
Decisiones: []
Bloqueada: []
Fecha de creación: 2026-10-16T23:55:00+02:00
Última modificación: 2026-10-16T23:55:00+02:00
---

# Corregir la accesibilidad detectada por la auditoría y AXE

## Objetivo

Cumplir "Accesibilidad" de [[README#Seguridad, coste y cumplimiento]] (WCAG 2.2
AA) y dejar en verde el job `a11y` de `.github/workflows/seguridad.yml`.

## Hallazgos

- **AXE (`pnpm build && pnpm test:a11y`, 2026-10-16):** `/` sin búsqueda pasa;
  con resultados ("leche") falla `scrollable-region-focusable` en
  `cdk-virtual-scroll-viewport`.
- Auditoría manual: textos de 9-10 px (por debajo de lo legible, revisar escalado
  con zoom al 200 %), los resultados cambian sin anunciarse (falta `aria-live`) y
  el spinner de carga no tiene nombre accesible.

## Alcance propuesto

1. `tabindex="0"` y nombre accesible en el viewport, o navegación por teclado
   entre filas.
2. Región `aria-live="polite"` con el número de resultados.
3. Spinner con `role="status"` y texto oculto ("Cargando resultados").
4. Tamaños mínimos de texto según
   [[Decisiones visuales/Ajuste de contraste AA de la paleta Videoclub|las decisiones visuales]]
   (crear una decisión nueva si cambia la escala tipográfica).
5. Revisión manual con teclado y lector de pantalla; marcarla en la
   [[Seguridad/Checklist de lanzamiento|checklist]].

## Verificación

<!-- pnpm test:a11y en verde y job a11y en verde. -->
