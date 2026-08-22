---
Número: 3
Estado: Aceptada
Ámbito: Layout
Resumen: El tique nunca se estira — mantiene su proporción de recibo real (máx. ~380px de ancho) en cualquier pantalla; en escritorio se despliega junto a una columna de marca, en vez de ensanchar el propio tique.
Decisión: |
  Regla central: el componente tique (ver [[Anatomía del componente tique]])
  **nunca supera ~380px de ancho**, en ninguna resolución — como un recibo de
  papel real, que no se hace más ancho en una pantalla más grande. Lo que
  cambia entre móvil y escritorio es cómo se compone el espacio alrededor del
  tique, no el tique en sí:

  - **Móvil / pantallas estrechas** — una sola columna. El tique ocupa casi
    todo el ancho disponible (con margen lateral), centrado sobre el fondo de
    "mostrador". Es la única cosa en la pantalla.
  - **Escritorio / pantallas anchas** — dos columnas. A la izquierda (~55% del
    ancho) se abre una columna de marca: wordmark, titular grande
    ("COMPARA PRECIOS. SIN LÍOS."), un eslogan corto y un motivo decorativo de
    código de barras; fondo morado algo más claro que el panel derecho. A la
    derecha (~45%), sobre un morado más oscuro, el mismo tique de siempre,
    centrado vertical y horizontalmente, sin estirar.

  El punto de quiebre exacto entre ambos layouts se decide al implementar
  (probablemente el breakpoint `lg` de Tailwind, ~1024px), pero el criterio de
  decisión es: por debajo, una columna; por encima, las dos columnas descritas.
Consecuencias: |
  - `app.html` deja de ser un único bloque `max-w-4xl` centrado para todas las
    resoluciones (como el diseño Linear original); necesita una estructura con
    la columna de marca condicionada a pantallas anchas (por ejemplo, oculta
    con `hidden lg:flex` o equivalente) y el propio tique con un `max-width`
    fijo en todas las resoluciones.
  - El motivo decorativo de código de barras y el eslogan de la columna de
    marca son contenido nuevo que no existe en la app actual; falta acordar el
    texto definitivo del eslogan de escritorio si difiere del usado en el
    lienzo de diseño.
  - No se ha diseñado explícitamente un estado intermedio de tablet; al
    implementar, decidir si tablet se comporta como móvil (una columna) o ya
    activa la columna de marca.
Fecha de creación: 2026-08-22T20:00:00+02:00
Última modificación: 2026-08-22T20:00:00+02:00
---

# Estrategia responsive del tique

## Contexto

Requisito explícito del usuario: el rediseño debe funcionar "desde cualquier
tipo de pantalla, mobile, desktop, etc." Ver [[Anatomía del componente
tique]] para la estructura del propio tique que esta estrategia envuelve.

## Decisión

Ver el campo `Decisión` de las propiedades de esta nota para el detalle
completo de la estrategia por tamaño de pantalla.

## Consecuencias

Ver el campo `Consecuencias` de las propiedades de esta nota.
