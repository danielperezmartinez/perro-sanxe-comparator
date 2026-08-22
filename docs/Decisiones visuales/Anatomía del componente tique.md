---
Número: 2
Estado: Aceptada
Ámbito: Componente
Resumen: Anatomía del componente "tique" (recibo de supermercado) que sustituye a las tarjetas .linear-card como contenedor principal de la pantalla de búsqueda y resultados.
Decisión: |
  El contenido de la app (cabecera, buscador y resultados) vive dentro de un
  único componente visual con forma de tique de supermercado, apoyado sobre un
  fondo de "mostrador" a pantalla completa. Partes, de arriba a abajo:

  1. **Borde perforado superior** — franja de 9px con puntos del color del
     fondo sobre el papel, simulando el troquelado de un tique real.
  2. **Cabecera** — icono de huella + wordmark "PERRO SANXE" (Luckiest Guy) +
     sufijo "COMPARATOR" (Space Mono, mayúsculas, letter-spacing); debajo,
     una fila con el subtítulo "TIQUE DE COMPARACIÓN DE PRECIOS" a la
     izquierda y la fecha a la derecha; debajo, el selector de provincia como
     un `<select>` real con flecha superpuesta (no un texto estático).
  3. **Titular** — "COMPARA PRECIOS. SIN LÍOS." centrado, segunda línea en el
     color de acento.
  4. **Buscador** — etiqueta visible "¿QUÉ ANDAS BUSCANDO?" encima de un campo
     con icono de lupa, borde discontinuo y una altura mínima de 48px (objetivo
     táctil accesible).
  5. **Fila de metadatos de resultados** — "N ENCONTRADOS" a la izquierda,
     "ORDEN: €/UD" a la derecha.
  6. **Filas de resultado**, separadas por línea discontinua: nombre del
     artículo en mayúsculas y negrita; línea de supermercado y categoría;
     fila inferior con "ACTUALIZADO: …" a la izquierda y, a la derecha, el
     precio grande y una píldora de precio/unidad. El artículo más barato de
     la lista lleva además un sello "MÁS BARATO" dibujado a mano (un óvalo
     SVG irregular, no una elipse perfecta) rotado unos grados, superpuesto en
     la esquina superior derecha de su fila.
  7. **Borde perforado inferior**, igual que el superior.

  El tique entero se rota ligeramente (-0.4° en móvil, +0.6° en escritorio)
  para dar la sensación de un objeto físico real y no un rectángulo perfecto.

  Reglas de accesibilidad que este componente respeta a propósito, para que
  "cutre" no signifique "descuidado":
  - Contraste alto tinta/papel (ver [[Paleta y tipografía del Tique de Barrio]]).
  - Campos interactivos (buscador, selector) con altura mínima ≥44px.
  - El sello "MÁS BARATO" no es el único indicador de mejor precio: el texto
    también lo dice explícitamente, no depende solo del color/adorno.
  - Estado de foco visible (`outline` discontinuo en el color de acento) en
    los elementos interactivos.
Consecuencias: |
  - Sustituye a `.linear-card`, `.linear-input` y `.linear-button-*` de
    `src/styles.css` como los bloques visuales principales de `app.html`.
  - El selector de provincia deja de ser el texto plano "TIENDA: NACIONAL" del
    diseño Linear y pasa a un `<select>` real — hay que decidir al implementar
    si se estiliza con Tailwind arbitrary values o con nuevas clases de
    componente en `@layer components`.
  - La textura de papel (`radial-gradient` de puntos) y el sello dibujado a
    mano (SVG con `path` irregular) no tienen equivalente en utilities estándar
    de Tailwind; habrá que añadirlos como estilos inline, un SVG de icono, o
    una clase de componente nueva.
  - El borde perforado (dos franjas con `radial-gradient` de círculos) es
    puramente decorativo y puede implementarse como un pseudo-elemento o un
    div fijo arriba/abajo del contenedor del tique.
Fecha de creación: 2026-08-22T20:00:00+02:00
Última modificación: 2026-08-22T20:00:00+02:00
---

# Anatomía del componente tique

## Contexto

Ver [[Paleta y tipografía del Tique de Barrio]] para el porqué de la
dirección visual elegida. Esta nota documenta la estructura y anatomía del
componente en sí, independientemente del color.

## Decisión

Ver el campo `Decisión` de las propiedades de esta nota para el detalle
completo de las partes del componente.

## Consecuencias

Ver el campo `Consecuencias` de las propiedades de esta nota.
