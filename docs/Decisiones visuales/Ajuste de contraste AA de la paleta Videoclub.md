---
Número: 4
Estado: Aceptada
Ámbito: Tokens
Resumen: Paleta "Videoclub" y tipografía del Tique de Barrio, con dos colores de texto corregidos para cumplir el contraste WCAG AA (4.5:1) sobre el papel del tique. Reemplaza a la decisión Nº1 completa.
Reemplaza: "[[Paleta y tipografía del Tique de Barrio]]"
Decisión: |
  Restablece íntegramente [[Paleta y tipografía del Tique de Barrio]] (Nº1),
  con dos valores de color corregidos tras medir su contraste real
  (luminancia relativa WCAG) durante la implementación — algo que esa
  decisión ya dejaba pendiente de verificar. El resto de la decisión Nº1 no
  cambia; se repite aquí completa para que esta nota sea autosuficiente.

  **Tipografía (2 familias, vía Google Fonts) — sin cambios respecto a Nº1:**
  - `Luckiest Guy` — logo/wordmark ("PERRO SANXE"), titulares grandes
    ("COMPARA PRECIOS. SIN LÍOS.") y el texto del sello "MÁS BARATO".
  - `Space Mono` (400 y 700) — todo lo demás: sufijo "COMPARATOR", subtítulos,
    etiquetas, selector de provincia, buscador, nombres de artículo,
    supermercado/categoría, fechas y precios.
  - Regla de reparto: la tipografía jocosa nunca se usa para precios ni datos
    reales — solo para marca y titulares.

  **Color — paleta "Videoclub":**
  - Fondo de mostrador: `#3d1f3a` (móvil y panel de marca en escritorio);
    `#2c1729` (panel derecho en escritorio, algo más oscuro).
  - Papel del tique: `#f2e3da`, con textura de grano sutil.
  - Tinta (texto e iconos sobre el papel): `#2c2417`.
  - **Texto secundario/metadatos sobre papel — CORREGIDO:** `#6a5c46`
    (antes `#7a6f57`, que medía 3.96:1 sobre el papel — insuficiente para AA;
    `#6a5c46` mide **5.18:1**).
  - Borde discontinuo del tique: `#d4b8bd`.
  - **Acento principal (enlaces, sello "MÁS BARATO", "SIN LÍOS." sobre
    papel) — CORREGIDO:** `#a02f5e` (antes `#b6376b`, que medía 4.48:1 sobre
    el papel — por debajo del mínimo AA por un margen mínimo; `#a02f5e` mide
    **5.48:1**). Su variante hover pasa de `#932b54` a `#7d2247` en la misma
    dirección (no sujeta a la misma exigencia de contraste al ser un estado
    de hover, pero se mantiene coherente).
  - Acento del titular en escritorio (sobre fondo morado oscuro, no sobre
    papel): `#4fd6c0` — sin cambios, ya medía contraste holgado (~8:1).
  - Píldora de precio/unidad: `#2f7d74` (más barato, ~4.9:1 con texto blanco)
    / `#8a6c80` (resto, ~4.6:1 con texto blanco) — sin cambios, ya cumplían.
  - Texto muted sobre fondo morado (subtítulo del hero en escritorio):
    `#cbb9c8` — sin cambios, ya medía contraste holgado (~7.8:1).
Consecuencias: |
  - `tailwind.config.js`: tokens `tique-muted` y `tique-accent` /
    `tique-accent-hover` actualizados a los valores corregidos; el resto de
    tokens de color y de `fontFamily` no cambia.
  - El SVG del sello "MÁS BARATO" en `ResultRow` usa el valor corregido de
    `tique-accent` en su atributo `stroke` (color literal, no token de
    Tailwind, por tratarse de un SVG inline).
  - El lienzo de diseño original (Artifact) y las capturas ya compartidas con
    el usuario conservan los valores previos; no se ha republicado el lienzo
    por este ajuste — su propósito (acordar dirección y tipografía) ya se
    cumplió, y el cambio es una corrección de accesibilidad de bajo nivel, no
    un cambio de dirección visual.
  - Ya no queda ningún punto de contraste pendiente de verificar de esta
    paleta.
Fecha de creación: 2026-08-22T23:30:00+02:00
Última modificación: 2026-08-22T23:30:00+02:00
---

# Ajuste de contraste AA de la paleta Videoclub

## Contexto

[[Paleta y tipografía del Tique de Barrio]] dejaba explícitamente pendiente
de verificar, en su campo `Consecuencias`, el contraste AA de `#7a6f57`
sobre `#f2e3da`. Al implementar el rediseño (ver [[Implementar el rediseño
Tique de Barrio en la app]]) se hizo esa verificación con la fórmula de
luminancia relativa de WCAG y se encontró que ese color, y también
`#b6376b` (no señalado explícitamente antes, pero del mismo tipo de riesgo
por ser texto pequeño sobre el papel), quedaban por debajo del mínimo AA de
4.5:1 para texto normal. El proyecto exige cumplir WCAG AA (ver
`docs/README.md`), así que se corrigen ambos valores en vez de dejarlos
como excepción.

## Decisión

Ver el campo `Decisión` de las propiedades de esta nota para la paleta y
tipografía completas, con los dos valores corregidos señalados.

## Consecuencias

Ver el campo `Consecuencias` de las propiedades de esta nota.
