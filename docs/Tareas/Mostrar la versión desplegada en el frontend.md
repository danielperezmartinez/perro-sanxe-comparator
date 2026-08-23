---
Nombre: Mostrar la versión desplegada en el frontend
Estado: Hecha
Resumen: El frontend muestra discretamente, fuera del tique y abajo a la derecha de su panel, la versión SemVer obtenida directamente de package.json; verificado en móvil y escritorio.
Decisiones:
  - La versión se sitúa fuera del tique, abajo a la derecha del panel que lo contiene, tanto en móvil como en escritorio.
  - El valor procede directamente de package.json para evitar duplicarlo y que quede desincronizado.
Bloqueada: []
Fecha de creación: 2026-08-23T14:00:29+02:00
Última modificación: 2026-08-23T14:03:45+02:00
---

# Mostrar la versión desplegada en el frontend

## Objetivo

Mostrar la versión actual de `package.json` de forma muy sutil en la interfaz,
para poder comprobar visualmente qué versión está desplegada en producción.

## Criterio visual acordado

La versión aparece como `v<SemVer>` fuera del papel del tique, anclada a la
esquina inferior derecha de su panel contenedor. Se mantiene visible en móvil y
escritorio, usando la tipografía de datos y el color secundario sobre marca ya
definidos por el diseño Tique de Barrio.

## Verificación

- `pnpm test -- --watch=false`: 5 ficheros y 12 pruebas superadas. La prueba
  añadida comprueba que el texto coincide con la versión de `package.json` y que
  su nodo no está dentro de `.tique-paper`.
- `pnpm build`: compilación de navegador, servidor y prerender correcta. Se
  mantiene el aviso preexistente del presupuesto inicial del bundle.
- Navegador real a 1280 × 800 y 360 × 800: se muestra `v0.1.0` abajo a la
  derecha del panel, sin desbordamiento horizontal, overlay de error ni errores
  de consola.

## Resultado

La aplicación importa la versión de `package.json` durante la compilación y la
muestra en ambos layouts sin mantener una copia manual del número de versión.
