---
Nombre: Implementar el rediseño Tique de Barrio en la app
Estado: Pendiente
Resumen: Llevar a código el rediseño visual "Tique de Barrio" (paleta Videoclub) acordado con el usuario, sustituyendo el theme actual inspirado en Linear en tailwind.config.js, src/styles.css y src/app/app.html.
Bloqueada: []
Fecha de creación: 2026-08-22T21:00:00+02:00
Última modificación: 2026-08-22T21:00:00+02:00
---

# Implementar el rediseño Tique de Barrio en la app

## Objetivo

El usuario ha aprobado el rediseño visual "Tique de Barrio" (paleta
"Videoclub") tras una sesión de diseño, y las decisiones ya están
documentadas en el sistema de Decisiones visuales:

- [[Paleta y tipografía del Tique de Barrio]]
- [[Anatomía del componente tique]]
- [[Estrategia responsive del tique]]

Falta llevarlo del lienzo de diseño al código real de la aplicación. Hoy
`tailwind.config.js` y `src/styles.css` todavía definen los tokens `linear-*`
y las clases `.linear-card` / `.linear-input` / `.linear-button-*` del theme
anterior inspirado en Linear, y `src/app/app.html` los usa directamente.

## Alcance

- `tailwind.config.js`: sustituir (o añadir junto a, hasta completar la
  migración) los tokens de color `linear-*` por los de la paleta Videoclub, y
  las familias `sans`/`mono` por `Luckiest Guy` y `Space Mono`.
- `src/styles.css`: sustituir `.linear-card`, `.linear-input` y
  `.linear-button-*` por las clases de componente del tique (papel, borde
  perforado, borde discontinuo, sello "MÁS BARATO").
- `src/app/app.html` / `src/app/app.ts`: reestructurar la plantilla según la
  anatomía del componente tique (cabecera con selector de provincia real,
  buscador con etiqueta visible, filas de resultado con sello en el más
  barato) y aplicar la estrategia responsive de dos columnas en escritorio.
- Añadir el `<link>` de Google Fonts para `Luckiest Guy` y `Space Mono` (o
  decidir si se auto-hospedan las fuentes, según la convención del proyecto).
- Verificar en la implementación real los puntos dejados pendientes en las
  decisiones: contraste AA del texto secundario sobre el papel, breakpoint
  exacto para el layout de escritorio y comportamiento en tablet.
- Pasar las comprobaciones AXE y los mínimos WCAG AA que exige el proyecto
  (ver `docs/README.md`, sección de accesibilidad) con el nuevo diseño.

## Verificación

<!-- Rellenar al completar la tarea: qué se comprobó y con qué resultado. -->

## Resultado

<!-- Rellenar al completar la tarea. -->
