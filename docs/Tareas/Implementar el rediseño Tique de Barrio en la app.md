---
Nombre: Implementar el rediseño Tique de Barrio en la app
Estado: Hecha
Resumen: Llevado a código el rediseño visual "Tique de Barrio" (paleta Videoclub, corregida en [[Ajuste de contraste AA de la paleta Videoclub]]) en tailwind.config.js, src/styles.css, src/app/app.html y los tres componentes compartidos (ProvinceSelect, SearchInput, ResultRow). Revisada la altura mínima de la página para cubrir toda la ventana, verificada en navegador en móvil y escritorio.
Decisiones:
  - Se elimina la imagen del artículo en ResultRow, siguiendo al pie de la letra la anatomía ya acordada en [[Anatomía del componente tique]] (nunca la incluyó).
  - ResultRow gana el input 'isBest' (booleano) para el sello "MÁS BARATO" y la píldora en verde azulado, manteniendo 'last' para el borde separador — cambio de contrato documentado en el Catálogo técnico en el mismo commit.
  - Verificado el contraste WCAG AA de toda la paleta durante la implementación (pendiente que dejaba la decisión Nº1): dos colores no llegaban al mínimo y se corrigieron — ver [[Ajuste de contraste AA de la paleta Videoclub]].
  - Breakpoint de escritorio fijado en `lg` (Tailwind, 1024px); por debajo se usa el layout de una columna también en tablet, sin estado intermedio propio.
Bloqueada: []
Fecha de creación: 2026-08-22T21:00:00+02:00
Última modificación: 2026-09-16T12:50:00+02:00
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

- `pnpm test` (Vitest vía `@angular/build:unit-test`): 5 ficheros, 11 tests,
  todos en verde, incluida una prueba nueva para `isBest` en `ResultRow`.
- `pnpm build`: compila sin errores. Aviso preexistente (no relacionado con
  este cambio) de presupuesto de bundle inicial superado por 71kB — no se ha
  tocado ningún JS de dependencias en esta tarea.
- `grep -r "linear-" src/`: sin resultados — no queda ningún resto del theme
  anterior.
- Inspección del HTML renderizado en servidor (`curl http://localhost:4200/`
  con `pnpm start`): confirma que la cabecera, el sufijo "COMPARATOR", el
  buscador con su etiqueta, el selector de provincia y las perforaciones del
  tique se generan con el marcado y las clases esperadas.
- Contraste WCAG AA calculado a mano (fórmula de luminancia relativa) para
  toda la paleta — resultado y correcciones en [[Ajuste de contraste AA de
  la paleta Videoclub]].
- **No verificado**: renderizado visual real en navegador (píxeles, carga de
  fuentes, comprobación AXE) — esta sesión no tenía una herramienta de
  navegador disponible. Queda para que el usuario lo revise abriendo
  `pnpm start` en `http://localhost:4200`.

## Resultado

Rediseño implementado en `tailwind.config.js`, `src/styles.css`,
`src/index.html` (fuentes + `lang="es"`), `src/app/app.ts`, `src/app/app.html`
y los tres componentes de `shared/components/`. Los cambios no están
comiteados (a la espera de que el usuario los revise/apruebe).

## Revisión de altura de la página (2026-08-28)

El contenedor principal no tenía altura mínima y terminaba al acabar el contenido:
en una ventana de 1440 × 900 medía 601,56 px. Se añadió `min-h-dvh`
(`min-height: 100dvh`) al contenedor de `src/app/app.html`, completando la
implementación de [[Estrategia responsive del tique]] sin cambiar el acuerdo
visual. El tique conserva su ancho y altura natural; el documento puede crecer
y desplazarse si el contenido supera el alto visible.

Verificación del ajuste:

- Navegador a 1440 × 900: contenedor y ambos paneles de 900 px, tique de
  380 px de ancho, sin desbordamiento horizontal ni vertical inicial.
- Navegador a 390 × 844: panel de 844 px, tique centrado, versión a 8 px del
  borde inferior y sin desbordamientos.
- Navegador a 390 × 500 con resultados de «leche»: documento de 756 px,
  desplazamiento vertical disponible y sin desbordamiento horizontal.
- Sin errores de consola durante estas comprobaciones.
- `pnpm test -- --watch=false`: 5 ficheros, 12 pruebas superadas.
- `pnpm build`: correcto, incluido prerender; permanece el aviso de presupuesto
  inicial (579,17 kB frente al límite de 500 kB).
- `pnpm exec prettier --check src/app/app.html` y `git diff --check`: correctos.

### Despliegue de la corrección

Solicitado el 2026-08-28. Versión `0.4.1` (patch: solo corrección de altura).
Publicado mediante push a `main`, commit `3b9cc9d`. Vercel confirmó `READY`
en producción para el despliegue `dpl_AqPtVe4kRdYdgKmUyvs6Xrotwasu`.
Comprobado HTTP 200 en https://perro-sanxe-comparator.vercel.app, con
`v0.4.1` y `min-h-dvh` presentes en el HTML servido. La consulta de errores
de ejecución de este despliegue no devolvió registros; no se ha configurado
ni evaluado monitorización continua en esta revisión.

## Corrección del recorte del sello «MÁS BARATO» (2026-09-16)

El usuario reportó (con captura de v0.4.1) que el sello dibujado a mano
"MÁS BARATO" del primer artículo se veía cortado por arriba. Causa: en
`ResultRow` (`src/app/shared/components/result-row/result-row.ts`) el sello
es un hijo `absolute -top-[18px]` de la fila; para filas 2+ ese hueco lo cubre
visualmente la fila anterior, pero para la primera fila ese espacio cae fuera
del `cdk-virtual-scroll-viewport` (`src/app/app.html`), que recorta su propio
contenido por overflow — así que el óvalo se cortaba justo en su parte
superior.

**Primer intento (descartado):** añadir `pt-[20px]` al viewport y subir su
altura de `h-[320px]` a `h-[340px]`, asumiendo que el padding del contenedor
con scroll dejaría hueco visible por encima de la primera fila. Medido con
Playwright (`getBoundingClientRect()` de la fila y del viewport): el
`padding-top` no desplaza el wrapper interno de `cdk-virtual-scroll-viewport`
— CDK lo posiciona con `position: absolute; top: 0`, y ese `top: 0` referencia
el borde de la *padding box* del contenedor, que coincide con el borde exterior
(el mismo punto donde recorta el `overflow`). El padding del contenedor de
scroll no crea hueco utilizable para un hijo `absolute` posicionado así; el
sello seguía cortándose exactamente igual. Revertido.

**Corrección real:** en vez de reservar espacio fuera de la fila (imposible
de garantizar de forma fiable dentro de un contenedor con scroll recortado),
se evita que el sello sobresalga por encima del borde de su propia fila, que
nunca se recorta. En `result-row.ts` se cambió el contenedor del sello de
`-top-[18px]` a `top-2` (8px hacia abajo en vez de 18px hacia arriba). La
rotación (`rotate-[-6deg]`) por sí sola ya desplaza el óvalo unos ~4,7px por
encima del `top` sin rotar (extensión de la caja al rotar un rectángulo de
92×39 px); `top-2` deja margen de sobra para que ni con la rotación se salga
del borde superior de la fila.

Verificación en navegador real (Playwright + Chromium, `pnpm start` en
`http://localhost:4200`, búsqueda "Ajos"): medida la caja del sello contra la
del viewport (antes: sello 23px por encima del borde de recorte; después: 3px
por dentro) y confirmado visualmente que el óvalo y el texto se renderizan
completos en el primer resultado.
