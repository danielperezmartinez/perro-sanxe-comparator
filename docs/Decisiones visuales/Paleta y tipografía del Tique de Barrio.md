---
Número: 1
Estado: Aceptada
Ámbito: Tokens
Resumen: Paleta "Videoclub" (morado berenjena + sello magenta + verde azulado) y pareja tipográfica Luckiest Guy / Space Mono para el rediseño "Tique de Barrio", en sustitución completa del theme oscuro inspirado en Linear.
Decisión: |
  Se sustituye la paleta y tipografía inspiradas en Linear (documentadas de forma
  informal en `.gemini/DESIGN.md`: Inter Variable, negro casi puro, indigo
  `#5e6ad2`) por la paleta y tipografía del "Tique de Barrio", explorada y
  acordada en un lienzo de diseño con el usuario.

  **Tipografía (2 familias, vía Google Fonts):**
  - `Luckiest Guy` — logo/wordmark ("PERRO SANXE"), titulares grandes
    ("COMPARA PRECIOS. SIN LÍOS.") y el texto del sello "MÁS BARATO". Es la
    voz de la broma/marca: rotulador de mercadillo, gamberra a propósito.
  - `Space Mono` (400 y 700) — todo lo demás: sufijo "COMPARATOR", subtítulos,
    etiquetas, selector de provincia, buscador, nombres de artículo,
    supermercado/categoría, fechas y precios. Es la voz de los datos: mono de
    impresora de tique, legible y creíble aunque el resto sea gamberro.
  - Regla de reparto: la tipografía jocosa NUNCA se usa para precios ni datos
    reales — solo para marca y titulares. Así el diseño es "cutre" a propósito
    sin dejar de inspirar confianza en los números.

  **Color — paleta "Videoclub":**
  - Fondo de mostrador (fuera del tique): `#3d1f3a` (morado berenjena). En
    escritorio, el panel derecho que enmarca el tique usa un morado más oscuro,
    `#2c1729`, para diferenciarlo del panel de marca izquierdo.
  - Papel del tique: `#f2e3da` (crudo rosado envejecido), con una textura de
    grano sutil (`radial-gradient` de puntos al 5% de opacidad en el color de
    la tinta).
  - Tinta (texto e iconos sobre el papel): `#2c2417`, no negro puro — evita
    dureza y da aspecto de tinta impresa.
  - Texto secundario/metadatos sobre papel: `#7a6f57`.
  - Borde discontinuo del tique (separadores, cajas): `#d4b8bd`.
  - Acento principal (enlaces, sello "MÁS BARATO", "SIN LÍOS." sobre papel):
    `#b6376b` (magenta).
  - Acento del titular en escritorio (sobre fondo morado oscuro, no sobre
    papel): `#4fd6c0` (verde azulado neón) — guiño VHS/synthwave; da el
    contraste que el magenta no daría bien sobre fondo oscuro.
  - Píldora de precio/unidad: `#2f7d74` (verde azulado) para el artículo más
    barato, `#8a6c80` (malva neutro) para el resto.
  - Texto muted sobre fondo morado (subtítulo del hero en escritorio):
    `#cbb9c8`.
Consecuencias: |
  - Deja obsoletos los tokens `linear-*` de `tailwind.config.js` y las clases
    `.linear-card` / `.linear-button-*` / `.linear-input` de `src/styles.css`;
    habrá que sustituirlos (o añadir un nuevo set de tokens junto a ellos y
    retirar los antiguos) al implementar este diseño en la app real.
  - `Inter Variable` y `Berkeley Mono` dejan de usarse; el `font-feature-settings:
    "cv01", "ss03"` global de Linear ya no aplica.
  - Pendiente de verificar en implementación: contraste AA de `#7a6f57` sobre
    `#f2e3da` (visualmente holgado en el lienzo, pero hay que comprobarlo con
    una herramienta de contraste antes de darlo por bueno, por la regla WCAG AA
    del proyecto).
  - Referencia visual (no es la fuente de verdad, solo apoyo): lienzo de diseño
    "Perro Sanxe — Tique de Barrio" publicado durante la sesión de diseño.
Fecha de creación: 2026-08-22T20:00:00+02:00
Última modificación: 2026-08-22T20:00:00+02:00
---

# Paleta y tipografía del Tique de Barrio

## Contexto

El theme visual original de la app (ver [[Catálogo técnico]] y el histórico
`.gemini/DESIGN.md`) era una copia literal del dark theme de Linear.app,
aplicada sin adaptación a una app de consumo para comparar precios de
supermercado. No transmitía la personalidad del producto ni encajaba con su
público.

Se exploraron con el usuario, sobre un lienzo de diseño, cuatro direcciones
completamente distintas (recibo de tique, mercado fresco, panel de datos
claro, etiqueta de precio) y se eligió la de **recibo de tique**, pidiendo
explícitamente una estética "cutre pero cool" — retro y desenfadada a
propósito, sin que eso signifique descuidada — con una tipografía que
incitase a la jocosidad, y con buen comportamiento responsive.

Sobre esa dirección elegida se probaron después varias paletas de color
("Mercadillo", "Bar de barrio", "Videoclub") y el usuario se quedó con
**Videoclub**.

## Decisión

Ver el campo `Decisión` de las propiedades de esta nota para el detalle
completo de tipografías y valores de color.

## Consecuencias

Ver el campo `Consecuencias` de las propiedades de esta nota.
