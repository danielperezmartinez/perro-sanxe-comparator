---
Número: 6
Estado: Aceptada
Ámbito: Componente
Resumen: "Anatomía del componente \"tique\" (recibo de supermercado) con tres cambios sobre la Nº2 tras la auditoría de seguridad y cumplimiento del 2026-10-16: ningún texto por debajo de 11 px, textos veraces sobre el precio (\"€ / REF.\" y sello \"MENOR €/REF.\" en vez de \"€/UD\" y \"MÁS BARATO\") y nuevos elementos en cabecera (botón \"Usar mi ubicación\") y pie (enlaces legales). Reemplaza a la decisión Nº2 completa."
Reemplaza: "[[Anatomía del componente tique]]"
Decisión: |
  Restablece íntegramente [[Anatomía del componente tique]] (Nº2) con estos
  cambios; el resto no cambia y se repite aquí para que la nota sea
  autosuficiente.

  **Texto mínimo: 11 px.** Ningún texto del tique ni de la app baja de 11 px
  (antes había textos de 9 y 10 px: subtítulo, fecha, metadatos, sello,
  píldora de precio, versión). La legibilidad prima sobre el efecto de letra
  de tique diminuta.

  El contenido de la app (cabecera, buscador y resultados) vive dentro de un
  único componente visual con forma de tique de supermercado, apoyado sobre un
  fondo de "mostrador" a pantalla completa. Partes, de arriba a abajo:

  1. **Borde perforado superior** — franja de 9px con puntos del color del
     fondo sobre el papel, simulando el troquelado de un tique real.
  2. **Cabecera** — icono de huella + wordmark "PERRO SANXE" (Luckiest Guy) +
     sufijo "COMPARATOR" (Space Mono, mayúsculas, letter-spacing); debajo,
     una fila con el subtítulo "TIQUE DE COMPARACIÓN DE PRECIOS" a la
     izquierda y la fecha a la derecha; debajo, el selector de provincia como
     un `<select>` real con flecha superpuesta. **Nuevo:** bajo el selector,
     un botón de texto subrayado "Usar mi ubicación" con la nota "Aproximada;
     no sale de tu navegador." y una línea de estado (`aria-live`).
  3. **Titular** — "COMPARA PRECIOS. SIN LÍOS." centrado, segunda línea en el
     color de acento.
  4. **Buscador** — etiqueta visible "¿QUÉ ANDAS BUSCANDO?" encima de un campo
     con icono de lupa, borde discontinuo y una altura mínima de 48px.
  5. **Fila de metadatos de resultados** — "N ENCONTRADOS" a la izquierda
     (anunciado con `aria-live`), "ORDEN: € / REF." a la derecha (antes
     "€/UD": el precio de referencia es por kg, L o unidad según el producto).
  6. **Filas de resultado**, separadas por línea discontinua: nombre del
     artículo en mayúsculas y negrita; línea de supermercado y categoría;
     fila inferior con "ACTUALIZADO: …" a la izquierda y, a la derecha, el
     precio grande y una píldora "<precio> / ref.". El primer artículo de la
     lista lleva un sello dibujado a mano (óvalo SVG irregular, rotado) con el
     texto **"MENOR €/REF."** en dos líneas (antes "MÁS BARATO", que afirmaba
     una comparación entre productos distintos). El nombre deja hueco a la
     derecha para no quedar tapado por el sello.
  7. **Pie (nuevo)** — enlaces "Aviso legal" y "Privacidad", separados por una
     línea discontinua.
  8. **Borde perforado inferior**, igual que el superior.

  El tique entero se rota ligeramente (-0.4° en móvil, +0.6° en escritorio).

  Reglas de accesibilidad que el componente respeta:
  - Contraste alto tinta/papel (ver [[Ajuste de contraste AA de la paleta Videoclub]]).
  - Campos interactivos (buscador, selector) con altura mínima ≥44px.
  - "El sello no es el único indicador: lleva un texto equivalente para lectores"
    de pantalla ("Menor precio de referencia de esta búsqueda").
  - Estado de foco visible (`outline` discontinuo en el color de acento).
  - La lista con scroll virtual es enfocable con teclado y tiene nombre
    ("Resultados de la búsqueda"); la carga se anuncia con `role="status"`.
Consecuencias: |
  - Todos los `text-[9px]` y `text-[10px]` pasan a `text-[11px]`.
  - La píldora de precio de referencia muestra "/ ref." hasta que la ingesta
    guarde la unidad real (kg, L o ud); entonces se mostrará la unidad.
  - Las páginas legales (`/aviso-legal`, `/privacidad`) usan el mismo papel de
    tique, más ancho (máx. 680px) porque son texto corrido.
Fecha de creación: 2026-10-17T01:30:00+02:00
Última modificación: 2026-10-17T01:30:00+02:00
---

# Anatomía del tique con textos veraces y texto mínimo de 11 px

## Contexto

La auditoría de seguridad, coste y cumplimiento del 2026-10-16 señaló textos de
9-10 px difíciles de leer y dos textos que inducían a error (unidad "/ ud" y
sello "MÁS BARATO" entre productos distintos). El usuario eligió un mínimo de
11 px. Ver [[Tareas/Corregir la accesibilidad detectada por la auditoría y AXE]]
y [[Tareas/Corregir textos engañosos de la interfaz (tiempo real, unidad y sello MÁS BARATO)]].

## Decisión

Ver el campo `Decisión` de las propiedades de esta nota.

## Consecuencias

Ver el campo `Consecuencias` de las propiedades de esta nota.
