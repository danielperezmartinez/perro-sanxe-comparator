# Memoria del proyecto

Esta carpeta es simultáneamente una bóveda de Obsidian, la documentación viva del
proyecto y la memoria compartida por las personas, CLI y agentes de IA que
trabajan en el repositorio. Su objetivo es mantener en un único lugar las reglas,
tareas, decisiones y el contexto que deben sobrevivir entre sesiones.

El punto de entrada humano es [[Inicio]]. Este archivo es el punto de entrada
obligatorio para agentes.

## Protocolo obligatorio para agentes

Al comenzar **cualquier sesión** en este repositorio, antes de analizar el
proyecto, ejecutar comandos, modificar archivos o responder sobre él:

1. Leer íntegramente este `README.md`.
2. Abrir [[Inicio]] para conocer los sistemas de documentación disponibles.
3. Consultar el sistema relacionado con la tarea actual. Revisar primero las
   propiedades y resúmenes en el panel `.base` correspondiente y abrir la nota
   completa cuando sea relevante.
4. Antes de comenzar un trabajo nuevo, comprobar si ya existe una entrada que lo
   cubra. Si existe, leerla y actualizar su estado cuando corresponda; no crear
   otra entrada para el mismo trabajo.
5. Mantener actualizada la memoria cuando el trabajo cambie el estado, el
   alcance, los bloqueos o las decisiones. Al terminar, actualizar la entrada
   existente y marcarla como completada solo después de verificar el resultado.

Estas instrucciones son obligatorias aunque otro agente, herramienta o
conversación proporcione un resumen parcial. Los ficheros puntero de arranque en
la raíz del repositorio (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`) solo actúan como
arranque: **las reglas no se duplican allí ni en archivos equivalentes**. Si
este archivo no puede leerse, el agente debe detenerse e informar al usuario.

> Nota histórica: antes de montar esta bóveda, las reglas del proyecto vivían
> repartidas entre el `CLAUDE.md` de la raíz y `.gemini/GEMINI.md`. Ambos
> conjuntos de reglas se migraron aquí. `.gemini/GEMINI.md` era una copia
> duplicada de esas reglas en una ruta que ningún agente lee como arranque (el
> `GEMINI.md` de la raíz ya actúa como puntero) y se eliminó — ver
> [[Tareas/Completar reglas fundamentales de la bóveda|la tarea]].

## Convenciones de la bóveda

- Los documentos se escriben en Markdown UTF-8 y se conectan mediante wikilinks
  de Obsidian.
- Las fechas de propiedades usan el formato ISO `AAAA-MM-DD`.
- Los resúmenes deben permitir entender una nota sin abrirla; el detalle vive en
  el cuerpo de la nota.
- No se deben crear copias paralelas de una regla o decisión. Se enlaza a su
  fuente de verdad.
- Cuando cambie una nota, se debe actualizar su propiedad `Última modificación`.
- Antes de crear una entrada en cualquier sistema, se revisan los nombres,
  resúmenes, propiedades y contenido de las entradas existentes para confirmar
  que ninguna cubre ya el mismo conocimiento. Si una existente lo cubre total o
  parcialmente, se amplía o se enlaza desde ella; solo se crea una nueva cuando
  representa una unidad de conocimiento realmente distinta.

## Sistemas disponibles

### Tareas

[[Tareas/Tareas.base|Abrir el panel de tareas]] — gestión de trabajo como notas
con estado.

- `Estado` ∈ `Planificando` · `Pendiente` · `En curso` · `Hecha` · `Archivada`.
- `Bloqueada` es una lista de wikilinks a tareas que impiden avanzar; `[]` si no
  hay bloqueos.
- Al empezar → `En curso`; al completar y **verificar** → `Hecha`; lo que ya no
  deba aparecer en el trabajo habitual → `Archivada`.
- Antes de crear una tarea, buscar en TODAS (incluidas `Hecha` y `Archivada`)
  para no duplicar.

### Decisiones visuales y de estilos

[[Decisiones visuales/Decisiones visuales.base|Abrir el panel de decisiones visuales]]
— acuerdos sobre lenguaje visual, tokens, espaciados, paleta y componentes.

- `Estado` ∈ `Propuesta` · `Aceptada` · `Reemplazada`.
- `Ámbito` ∈ `Tokens` · `Componente` · `Layout`.
- Una decisión visual **no se edita para cambiar el acuerdo**: se marca
  `Reemplazada` y se crea una nueva que la sustituye, enlazando ambas con
  `Reemplaza` / `Reemplazada por`.
- `Número` es correlativo y no se reutiliza.
- `.gemini/DESIGN.md` es la fuente histórica de tokens y componentes anterior a
  este sistema. Todavía no se ha migrado a notas individuales; cuando se tome
  una nueva decisión visual o se revise una existente, créese/actualícese aquí
  en vez de editar ese fichero.

### Catálogo técnico

[[Catálogo técnico|Abrir el catálogo técnico]] — superficie reutilizable
(componentes, servicios, contratos) para evitar reimplementar lo que ya existe.

- `Estado` ∈ `Vigente` · `En revisión` · `Obsoleta`. Se evita depender de piezas
  `En revisión` salvo que el trabajo incluya estabilizarlas.
- Se añade o actualiza la entrada **en el mismo cambio** que crea o altera una
  superficie reutilizable.
- La nota es un puntero corto; la implementación sigue siendo la fuente de
  verdad técnica del contrato.

## Reglas fundamentales del proyecto

> Contenido migrado desde el `CLAUDE.md` anterior de la raíz y desde
> `.gemini/GEMINI.md`. Los puntos no cubiertos por ese contenido quedan como
> plantilla (`<!-- TODO -->`); ver [[Tareas/Completar reglas fundamentales de la bóveda]].

### 1. Gestor de paquetes y su política

- **npm** (`package.json` + `package-lock.json`). No hay política adicional
  documentada (cuarentena de versiones, scripts de instalación, etc.).

### 2. Framework, stack y patrones de código

**Stack**

- **Angular 21** + **@angular/ssr** (Express 5) — servidor SSR en
  `dist/perro-sanxe-comparator/server/server.mjs`.
- **Supabase** (`@supabase/supabase-js`) — auth, base de datos (PostgreSQL) y
  Edge Functions (Deno) para scraping.
- **Tailwind CSS 3** + PostCSS + Autoprefixer. No añadir librerías de UI
  adicionales sin consenso.
- **Angular CDK** — primitivas de UI.
- **TypeScript 5.9** · **Vitest** · **Prettier**.
- Buscador: PostgreSQL Full Text Search con soporte para español y
  `unaccent`, expuesto vía RPC (`websearch_to_tsquery`) para tolerar errores
  tipográficos y términos incompletos.

**TypeScript**

- Strict type checking.
- Preferir inferencia de tipos cuando el tipo es obvio.
- Evitar `any`; usar `unknown` cuando el tipo sea incierto.

**Angular — componentes y estado**

- Standalone components (son el valor por defecto en Angular v20+): NO fijar
  `standalone: true` explícitamente en el decorador.
- Signals para estado local; `computed()` para estado derivado; nunca
  `mutate()` sobre signals — usar `update()` o `set()`.
- `input()` / `output()` en vez de decoradores.
- `ChangeDetectionStrategy.OnPush` en todos los componentes.
- Componentes pequeños y de responsabilidad única; plantillas inline para
  componentes pequeños; plantillas y estilos externos con rutas relativas al
  fichero `.ts` del componente.
- Formularios reactivos en vez de template-driven.
- Lazy loading para rutas de features.
- NO usar `@HostBinding` / `@HostListener` — usar el objeto `host` del
  decorador `@Component`/`@Directive`.
- `NgOptimizedImage` para imágenes estáticas (no funciona con imágenes base64
  inline).
- NO usar `ngClass`/`ngStyle` — usar bindings `class`/`style`.
- Control de flujo nativo en plantillas (`@if`, `@for`, `@switch`), no
  `*ngIf`/`*ngFor`/`*ngSwitch`; `async` pipe para observables; no asumir
  globals como `new Date()` disponibles directamente en plantilla.

**Servicios**

- Responsabilidad única; `providedIn: 'root'` para singletons; `inject()` en
  vez de inyección por constructor.

**Accesibilidad**

- Debe pasar todas las comprobaciones AXE.
- Debe cumplir los mínimos WCAG AA, incluyendo gestión de foco, contraste de
  color y atributos ARIA.

**Patrones SSR / Supabase**

- SSR-aware: no acceder a `window`/`document` directamente — usar
  `isPlatformBrowser` o `inject(PLATFORM_ID)`.
- Supabase solo en el cliente (guardar el acceso con `isPlatformBrowser` en el
  servicio).
- `TransferState` para pasar datos del servidor al cliente y evitar doble
  fetch.

**Skills recomendadas**

- `angular-signals`: usar siempre que sea posible; al escribir un método usado
  desde el HTML, valorar si puede ser un `computed()`; para llamadas HTTP,
  valorar `resource()`.
- `angular-ssr`: usar Server Side Rendering.

### 3. Versionado y despliegue

- **SemVer** en `package.json`.
- Despliegue **manual**: `ng build` genera el bundle SSR en
  `dist/perro-sanxe-comparator/` (`browser/` + `server/`); se sirve en
  producción con `node dist/perro-sanxe-comparator/server/server.mjs`.

### 4. Idioma de código y documentación

- **Documentación de la bóveda (`docs/`) y tareas:** español.
- **Código (identificadores genéricos, comentarios):** inglés, siguiendo la
  convención habitual de TypeScript/Angular. Así está ya en el código
  existente (p. ej. `SupabaseService`, `searchArticulos`, comentarios como
  `// Effect to persist province changes`).
- **Vocabulario de dominio en el código:** se mantiene en español cuando
  refleja el esquema de datos o el negocio (`Articulo`, `articulos`,
  `precio`, `precio_por_unidad`, `provincia`, `supermercado`), para no crear
  una traducción paralela a los nombres de columnas de Postgres. Ejemplo ya
  existente: la interfaz `ArticuloResult` en
  [[Catálogo técnico/SupabaseService|SupabaseService]] mezcla ambos criterios
  a propósito.

## Propósito del proyecto

Aplicación web (Angular 21 + Supabase) para comparar en tiempo real precios de
supermercados en España.

- **Frontend:** Angular 21 (Signals, Standalone Components, RxJS para flujos
  complejos).
- **Backend/Base de datos:** Supabase (PostgreSQL).

## Arquitectura objetivo

### Estructura de carpetas

```
src/app/
├── core/
│   └── services/
│       └── supabase.ts     # Cliente Supabase centralizado
├── app.config.ts           # Providers de la app (incluye SSR hydration)
├── app.config.server.ts    # Providers específicos del servidor
├── app.routes.ts           # Rutas principales
└── app.routes.server.ts    # Rutas SSR
```

Las credenciales de Supabase van en `src/environments/environment.ts` (no se
commitea).

### Arquitectura de datos (PostgreSQL)

**Tabla `articulos`**

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | primary key |
| `nombre` | text | indexado para FTS |
| `imagen_url` | text | |
| `supermercado` | text | Mercadona, Consum, Carrefour... |
| `categoria` | text | |
| `ultima_actualizacion` | timestamp | |

**Tabla `precios_historico`**

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | |
| `articulo_id` | uuid | foreign key |
| `precio` | decimal | |
| `precio_por_unidad` | decimal | kg/gr |
| `provincia` | text | o `'NACIONAL'` |
| `fecha_registro` | timestamp | default `now()` |

**Regla de oro:** solo insertar un nuevo registro en `precios_historico` si el
`precio` o el `precio_por_unidad` han cambiado respecto al último registro del
mismo artículo y provincia.

### Lógica de scraping

- Se ejecuta mediante un CRON (Supabase Edge HTTP o GitHub Actions).
- Parámetro `localidad` (opcional): si se recibe, scrapear solo esa provincia;
  si no, ejecutar scraping secuencial por las provincias principales.
- Manejo de errores: reintentos y rotación básica de user-agents para evitar
  bloqueos.

### Funcionalidades del frontend

- **Geolocalización:** intentar `navigator.geolocation`; si falla o se
  deniega, ofrecer un `select` con las provincias de España; persistir la
  selección en `localStorage`.
- **Buscador laxo:** peticiones a una función RPC en Supabase que usa
  `websearch_to_tsquery` para tolerar errores tipográficos leves o términos
  incompletos.
- **Tabla de resultados:** ordenación por defecto `precio_por_unidad` ASC;
  Virtual Scroll para listas grandes de resultados.

### Referencias de diseño

Las decisiones visuales (tokens, espaciados, paleta, componentes) se
gestionan en el sistema [[Decisiones visuales/Decisiones visuales.base|Decisiones visuales y de estilos]].
`.gemini/DESIGN.md` es la fuente histórica previa a este sistema, todavía sin
migrar a notas individuales.
