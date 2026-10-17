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

_Versión del sistema: 1._

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

_Versión del sistema: 1._

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

_Versión del sistema: 1._

[[Catálogo técnico|Abrir el catálogo técnico]] — superficie reutilizable
(componentes, servicios, contratos) para evitar reimplementar lo que ya existe.

- `Estado` ∈ `Vigente` · `En revisión` · `Obsoleta`. Se evita depender de piezas
  `En revisión` salvo que el trabajo incluya estabilizarlas.
- Se añade o actualiza la entrada **en el mismo cambio** que crea o altera una
  superficie reutilizable.
- La nota es un puntero corto; la implementación sigue siendo la fuente de
  verdad técnica del contrato.

### Seguridad, coste y cumplimiento

_Versión del sistema: 2._

Carpeta [[Seguridad/Seguridad.base|Seguridad/]]: excepciones justificadas a estas
reglas, la [[Seguridad/Checklist de lanzamiento|checklist de lanzamiento]] y
las referencias opacas a hallazgos privados.
Estas reglas aplican a todo cambio, lo haga una persona o un agente, y también a
lo que se haga con MCP, CLI o panel.

#### Backend y datos (Supabase)

- **RLS activado no basta.** Cada política expresa quién puede hacer qué sobre
  qué filas; lo normal es `owner_id = (select auth.uid())`.
- Prohibido `USING (true)` o `WITH CHECK (true)` en políticas de `INSERT`,
  `UPDATE`, `DELETE` o `ALL`. En `SELECT` solo con una excepción escrita en
  `Seguridad/` y referenciada en la política
  (`comment on policy … is 'excepcion: <nombre de la nota>'`).
- Los datos compartidos por enlace se sirven con una función RPC que recibe el
  token y devuelve solo esa fila. La tabla nunca es listable por `anon`.
- Las funciones `SECURITY DEFINER` llevan `set search_path = ''` y nombres
  cualificados con esquema, y se revoca `EXECUTE` a `anon` (y a `public`) salvo
  excepción escrita. Si no necesitan saltarse RLS, se usa `SECURITY INVOKER`.
- Las extensiones con efectos fuera de la base de datos (`pg_net`, `http`) quedan
  fuera del alcance de `anon` y `authenticated`.
- Los esquemas expuestos por la API son los mínimos. Lo interno vive en un
  esquema `*_private` no expuesto.
- **Todo el DDL** (tablas, políticas, funciones, grants, buckets y sus límites)
  vive en migraciones versionadas del repo. Nada se hace solo en el panel ni solo
  por MCP; si se hizo, se vuelca a una migración en el mismo cambio.
- "El Security Advisor no da avisos" **no** cuenta como verificación. La
  verificación son los tests de `supabase/tests/` (ver "Comprobaciones").

#### Coste y abuso

- Todo lo que un usuario puede crear tiene **tope de tamaño y de cantidad**:
  buckets con `file_size_limit` y `allowed_mime_types`, cuota por usuario
  (comprobada en la política de Storage o en un trigger), `CHECK` de longitud en
  columnas de texto y tope de filas por usuario en tablas que crecen.
- Nada de llamadas recursivas ni bucles sin tope: triggers que llaman a funciones
  HTTP, funciones que se invocan a sí mismas, reintentos sin límite, efectos del
  cliente que se disparan en bucle. Todo reintento tiene un máximo y espera entre
  intentos.
- Los endpoints públicos (funciones serverless, Edge Functions, RPC accesibles a
  `anon`) tienen límite de peticiones.

#### Secretos

- La clave publicable (`anon` / `sb_publishable_…`) puede ir en el cliente.
- La clave secreta (`service_role` / `sb_secret_…`) y cualquier otro secreto solo
  viven en el servidor o en el CI, nunca en el código del cliente ni en el repo.
- Cada secreto está solo en los entornos que lo necesitan (p. ej. Production y no
  Preview si las previews no lo usan), marcado como sensible donde la plataforma
  lo permita.
- Los ficheros de secretos locales (`.env*` salvo `.env.example`, keystores,
  claves) están en `.gitignore`.

#### Repositorio y publicación

- Todo lo que se sube queda expuesto y **no se puede retirar**: el código, esta
  bóveda `docs/`, los mensajes de commit, los nombres de rama, los títulos y
  cuerpos de PR, las issues, los workflows, los logs y artefactos de CI. Borrarlo
  después no lo quita del historial, de los forks ni de las cachés.
- **Nunca se sube:**
  - Secretos: claves, contraseñas, tokens, ficheros `.env`, keystores.
  - Datos del entorno personal: nombres de host, de máquina o de dispositivo,
    usuarios del sistema operativo, IP (de red local, VPN o públicas), dominios y
    redes propios, rutas personales (`C:Users<nombre>`, `/home/<nombre>`,
    unidades y carpetas propias) y correos personales.
  - Vulnerabilidades sin corregir (ver "Vulnerabilidades y hallazgos sensibles").
- En la documentación se usan **marcadores genéricos** (`<usuario>`,
  `<host-de-pruebas>`, `<ruta-al-proyecto>`). Los valores reales viven fuera del
  repo: variables de entorno, la memoria local del agente (que no se versiona) o
  el fichero de patrones personales.
- **Antes de cada commit y de cada push** se revisan el diff y los mensajes. Los
  hooks versionados en `.githooks/` lo comprueban con gitleaks (patrones
  genéricos de `.gitleaks.toml` y patrones personales fuera del repo), y el CI lo
  repite. Los hooks no se saltan (`--no-verify`) sin permiso explícito del
  usuario. Un falso positivo se resuelve ajustando el patrón o con
  `gitleaks:allow` en esa línea, nunca desactivando la revisión.
- Los logs de CI no imprimen secretos ni datos personales. Los secretos de CI van
  en los secretos de la plataforma (GitHub Secrets), y el CI no depende de
  máquinas, redes ni cuentas personales del usuario.
- **Si algo sensible llega a subirse:** se avisa al usuario **de inmediato**. No
  se reescribe el historial ni se fuerza un push sin su permiso explícito. Si era
  un secreto, se da por comprometido y se revoca o se rota, aunque se borre del
  repo.

#### Vulnerabilidades y hallazgos sensibles

- **Criterio.** Un hallazgo es sensible si describe cómo dañar, espiar o engañar
  a usuarios de la versión publicada y todavía no hay una versión publicada que
  lo corrija. Ante la duda, es sensible.
- **Dónde vive.** Cada hallazgo sensible es un **aviso privado de GitHub**
  (*Security Advisory* en borrador, pestaña *Security* del repo), uno por
  hallazgo. Es su única fuente de verdad mientras no se publique.
- **Qué nunca lo cuenta** mientras no se publique el arreglo: esta bóveda, los
  mensajes de commit, los nombres de rama, los títulos y cuerpos de PR, las
  issues, los comentarios de código y los nombres de test.
- **En la bóveda** solo hay una referencia opaca: una nota `SEC-AAAA-NN`
  (correlativo por año, no se reutiliza) de tipo `Hallazgo` en `Seguridad/`, con
  severidad, estado, el ID `GHSA-…` del aviso y la versión que lo corrige. Nunca
  un título ni una descripción.
- **El arreglo** se prepara en local, con mensajes de commit, nombres de rama y
  nombres de test neutros que no expliquen el fallo, y se sube junto con la
  publicación de la versión que lo corrige. Entonces se publica el aviso y la
  nota pasa a `Publicado`; desde ese momento ya se puede describir.
- **Los agentes no crean, publican ni cierran avisos por su cuenta.** Preparan el
  borrador del aviso y el usuario lo da de alta, o lo autoriza en esa sesión.
  Publicar un aviso es irreversible.
- Lo no sensible (endurecimiento, CVE públicos de dependencias) se gestiona con
  tareas normales.
- `Estado` de una nota `Hallazgo` ∈ `Abierto` · `Corregido` · `Publicado` ·
  `Descartado`. `Corregido` significa que el arreglo está listo pero aún no
  publicado: sigue siendo sensible. Al pasar a `Publicado` (arreglo publicado y
  aviso publicado por el usuario), la nota ya puede enlazar el aviso y describir
  el fallo.

#### Legal y privacidad (UE / España)

> Estas reglas resumen obligaciones habituales y no son asesoramiento legal. Ante
> dudas concretas, consulta a un profesional.

- Antes de publicar: **aviso legal** (LSSI-CE, art. 10) y **política de
  privacidad** (RGPD, art. 13), enlazados desde todas las páginas.
- No se envían datos personales ni la ubicación a terceros (APIs de mapas, de
  analítica, de IA…) sin avisar antes en la interfaz y sin una acción explícita
  del usuario que lo dispare. Cada tercero que reciba datos aparece en la
  política de privacidad.
- Las comunicaciones comerciales (emails, notificaciones push) requieren
  consentimiento expreso, separado de aceptar los términos, y una forma sencilla
  de darse de baja.
- El banner de cookies solo es necesario si hay cookies o almacenamiento no
  técnicos (analítica, publicidad, terceros). Si existe, rechazar es tan fácil
  como aceptar y nada no técnico se carga antes del consentimiento.

#### Scraping

- Se respetan `robots.txt` y los términos de uso del sitio.
- User-agent identificable y veraz, con forma de contacto. Prohibido suplantar
  navegadores u otros bots.
- No se evaden protecciones (CAPTCHAs, bloqueos, límites, inicios de sesión
  ajenos).
- Retrasos razonables entre peticiones, caché de lo ya descargado y reintentos
  con tope.

#### Accesibilidad

- Objetivo: **WCAG 2.2 nivel AA**. AXE en el CI sin infracciones; además,
  revisión manual de teclado y foco en los flujos nuevos (AXE no detecta todo).

#### Comprobaciones y compuerta de "Hecha"

- Comprobaciones del proyecto, todas en `.github/workflows/seguridad.yml`:
  - `supabase test db`: tests pgTAP de `supabase/tests/` (catálogo de seguridad
    y lectura pública del catálogo de precios) contra la base local construida
    solo con `supabase/migrations/`.
  - `pnpm build` + `pnpm test:a11y`: AXE (WCAG 2.2 AA) sobre el SSR con
    Playwright (`e2e/a11y.spec.ts`).
  - Grep de claves secretas en `dist/` tras el build.
  - Job `fugas`: gitleaks sobre el historial, los mensajes, la rama y el texto
    del PR (patrones de `.gitleaks.toml`). En local, los hooks de `.githooks/`
    (activados con `pnpm install`, script `prepare`) lo revisan antes de cada
    commit y push, también con los patrones personales.
  - Los tres jobs son obligatorios para fusionar en `main` (flujo en
    [[#3. Versionado, publicación y despliegue]]).
- **Una tarea que toque backend o UI no pasa a `Hecha`** hasta que esas
  comprobaciones estén en verde, y su sección "Verificación" lo deja escrito (qué
  se ejecutó y dónde). Si el cambio añade tablas, políticas, funciones o rutas,
  añade también su test en el mismo cambio.
- **Ninguna tarea pasa a `Hecha` con commits sin revisar:** los hooks de gitleaks
  han pasado en cada commit y push, y el job de fugas del CI está en verde.
- Una excepción a estas reglas es una nota `Excepción` en `Seguridad/` con su
  justificación. Sin nota, no hay excepción.
- `Estado` de una excepción ∈ `Vigente` · `Retirada`. Al retirar una excepción
  se quita también el comentario `excepcion:` del objeto. Una excepción vencida
  (`Revisar antes de` en el pasado) se revisa antes de cualquier otro cambio
  sobre ese objeto.

## Reglas fundamentales del proyecto

> Contenido migrado desde el `CLAUDE.md` anterior de la raíz y desde
> `.gemini/GEMINI.md`. Los puntos no cubiertos por ese contenido quedan como
> plantilla (`<!-- TODO -->`); ver [[Tareas/Completar reglas fundamentales de la bóveda]].

### 1. Gestor de paquetes y su política

- **pnpm** exclusivamente (`package.json` + `pnpm-lock.yaml`). **Prohibido
  usar npm o yarn** para instalar o gestionar las dependencias del proyecto.
- **Motivo:** pnpm bloquea por defecto los "lifecycle scripts"
  (`preinstall`/`install`/`postinstall`) de las dependencias, que es el
  vector que han venido explotando los gusanos de cadena de suministro de
  npm (Shai-Hulud / Mini Shai-Hulud, 2025-2026): un paquete comprometido
  publica una versión maliciosa cuyo script de instalación roba
  credenciales y se propaga a otros paquetes. npm no bloquea esto por
  defecto en las versiones usadas actualmente.
- **Enforcement:**
  - `package.json` fija `"packageManager": "pnpm@<versión>"` (vía
    Corepack) y un script `"preinstall": "npx --yes only-allow pnpm"` que
    aborta si se ejecuta `npm install`/`yarn install`. Ese `npx` es solo un
    ejecutor de binario, no gestión de dependencias del proyecto — no
    contradice la política.
  - `package-lock.json`/`yarn.lock` no deben existir en el repo;
    `pnpm-lock.yaml` es el único lockfile válido.
- **`pnpm-workspace.yaml` y `allowBuilds`:** por defecto pnpm bloquea el
  script de build de toda dependencia. Solo se permite explícitamente, bajo
  la clave `allowBuilds` de `pnpm-workspace.yaml`, lo que el toolchain
  realmente necesita para funcionar (revisado caso a caso con `pnpm why
  <paquete>` antes de aprobarlo, nunca "a ciegas"). Añadir una dependencia
  nueva cuya instalación quede bloqueada por un script de build es una
  señal para revisar si de verdad hace falta antes de aprobarla.

### 2. Framework, stack y patrones de código

**Stack**

- **Angular 22** + **@angular/ssr** (Express 5) — servidor SSR en
  `dist/perro-sanxe-comparator/server/server.mjs`.
- **Supabase** (`@supabase/supabase-js`) — auth, base de datos (PostgreSQL) y
  Edge Functions (Deno) para scraping.
- **Tailwind CSS 3** + PostCSS + Autoprefixer. No añadir librerías de UI
  adicionales sin consenso.
- **Angular CDK** — primitivas de UI.
- **TypeScript 6** · **Vitest** · **Prettier**.
- Buscador: PostgreSQL Full Text Search con soporte para español y
  `unaccent`, expuesto vía RPC (`websearch_to_tsquery`) para tolerar errores
  tipográficos y términos incompletos.

**Zoneless y full reactive**

- Proyecto **totalmente zoneless**: `provideZonelessChangeDetection()` en
  `src/app/app.config.ts`. Prohibido añadir `zone.js` como polyfill
  (`angular.json`) o como dependencia.
- **Full reactive siempre**: todo el estado, local y derivado, se modela con
  `signal()` / `computed()` / `effect()` / `resource()` / `linkedSignal()`.
  RxJS se reserva para interoperabilidad puntual con APIs que lo exijan
  (p. ej. el `async` pipe sobre un `Observable` de una librería externa), no
  para modelar estado de la app.

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
- **Reutilización antes que copy-paste:** siempre que una pieza de UI pueda
  reaparecer o sea una unidad de interacción distinta, se extrae a
  `src/app/shared/components/` como componente presentacional (recibe datos
  por `input()`, notifica por `output()`, sin `inject()` de servicios de
  datos). El estado y las llamadas a servicios viven en los componentes que
  orquestan (los componentes de feature, hoy `Comparador`). Ver
  "Arquitectura objetivo" más abajo.
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

**Tests**

- **Vitest** (vía el builder `@angular/build:unit-test`) es el único test
  runner del proyecto; no se usan Karma ni Jasmine.
- Crear tests unitarios siempre que el código introducido lo justifique:
  lógica no trivial, estado derivado (`computed()`), efectos secundarios
  (`effect()`, `resource()`) o contratos de servicio. Los componentes
  puramente presentacionales sin lógica se cubren con un test mínimo de
  creación/render.
- Los componentes de `shared/components/` (presentacionales) prueban al
  menos: que se crean y que su comportamiento de entrada/salida
  (`input()`/`output()`) es correcto.
- Ficheros de configuración/setup del test runner globales (registro de
  locale, etc.) van en `src/test-setup.ts`, referenciado desde
  `setupFiles` en `angular.json` (target `test`).

**Accesibilidad**

- Ver "Accesibilidad" en [[#Seguridad, coste y cumplimiento]] (WCAG 2.2 AA,
  AXE en CI y revisión manual de teclado y foco).

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

### 3. Versionado, publicación y despliegue

Esta regla es la única fuente del flujo de publicación; las demás secciones
la enlazan.

| Cambio | Cómo se publica | Versión | Despliegue |
| --- | --- | --- | --- |
| **Código**: cualquier archivo fuera de `docs/` | Rama propia y pull request contra `main`; se fusiona solo con los checks del workflow `Seguridad` en verde | Se incrementa en la propia PR | Al fusionar en `main`; se verifica en Vercel |
| **Solo bóveda**: todos los archivos dentro de `docs/` | Push directo a `main` | No se incrementa | No hay: `vercel.json` omite el build cuando el commit no cambia nada fuera de `docs/` |

- **Nunca se hace push directo a `main` de un cambio que toque código**,
  aunque GitHub lo permita a los administradores. Un commit que mezcle bóveda
  y código cuenta como código.
- `main` exige en verde, y con la rama al día con `main`, los tres checks del
  workflow `Seguridad`: «Tests RLS y catálogo (pgTAP)», «Accesibilidad (AXE)
  y secretos en el bundle» y «Fugas (gitleaks)». El workflow también se
  ejecuta en cada push a `main`, pero un push directo se despliega sin
  esperar a su resultado; por eso el código va siempre por PR. La protección
  no se aplica a administradores (`enforce_admins: false`) para que los
  cambios de solo `docs/` puedan ir directos: que el código vaya por PR es
  esta norma, no un bloqueo técnico.
- **SemVer** en `package.json`. **Cada PR de código incrementa la versión**
  en la propia PR, y no se fusiona si su versión no supera la de `main`. Si
  la PR recibe más commits antes de fusionarse, no hace falta volver a
  incrementarla. El tipo de incremento sale de los commits de la PR según
  Conventional Commits: algún `BREAKING CHANGE` o `!` tras el tipo → major;
  algún `feat` → minor; si solo hay `fix` u otros tipos → patch. Se usa
  `pnpm version patch|minor|major --no-git-tag-version` (nunca npm).
- **Despliegue automático vía Vercel**: el repo de GitHub
  (`danielperezmartinez/perro-sanxe-comparator`) está importado en Vercel
  (proyecto `perro-sanxe-comparator`), que despliega cada commit de `main` en
  producción y cada rama en una preview. Vercel detecta el proyecto Angular en
  modo zero-config y aprovecha el bundle SSR que genera `ng build`
  (`dist/perro-sanxe-comparator/` con `browser/` + `server/`): sirve los
  estáticos de `browser/` desde su CDN y ejecuta `server/server.mjs` como
  función serverless. `vercel.json` solo añade las cabeceras de seguridad y un
  `ignoreCommand` que omite el build cuando el commit no cambia nada fuera de
  `docs/`; si la comprobación falla (por ejemplo, sin commit anterior), se
  construye igualmente. El script `serve:ssr:perro-sanxe-comparator` solo se
  usa para probar el bundle SSR en local.
- **Cuando el usuario pida desplegar** (o «hacer deploy») un cambio de código,
  pide el flujo completo: incremento de versión, commits en una rama propia,
  push de esa rama, PR con GitHub CLI (`gh`), esperar los checks en verde,
  fusionar y verificar el despliegue. Si el usuario no ha autorizado fusionar,
  el agente se detiene con la PR abierta e informa. Si el cambio solo toca
  `docs/`, «publicar» es commit y push directo a `main`.
- Fusionar no completa por sí solo el despliegue: hay que localizar en Vercel
  el deployment de producción del commit de `main` (`vercel ls` /
  `vercel inspect`, con la CLI autenticada como `devappsdpm`, o el dashboard)
  y esperar a que llegue a `READY`.
- Si el despliegue falla, se informa al usuario de lo ocurrido. **No se toma
  ninguna acción correctiva ni se reintenta nada sin su autorización
  explícita.** Cada corrección es una PR nueva con su propio incremento de
  versión.
- Los cambios en el proyecto Supabase de este repo (migraciones, funciones) se
  aplican aparte y solo con autorización expresa del usuario, antes de
  fusionar el frontend que los necesita. La migración del repo lleva la misma
  versión que registra el historial remoto.

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

Aplicación web (Angular 22 + Supabase) para comparar precios de supermercados
en España, con datos que se actualizan una vez al día.

- **Frontend:** Angular 22, zoneless, full reactive (Signals, Standalone
  Components). RxJS queda solo para interoperabilidad puntual, no para
  modelar estado — ver "2. Framework, stack y patrones de código".
- **Backend/Base de datos:** Supabase (PostgreSQL).

## Arquitectura objetivo

### Estructura de carpetas

```
src/app/
├── core/
│   ├── geo/
│   │   └── nearest-province.ts  # Provincia aproximada calculada en el navegador
│   └── services/
│       └── supabase.ts       # Cliente Supabase centralizado
├── features/                 # Componentes de ruta (lazy) que orquestan estado
│   ├── comparador/           # Ruta "" : buscador y resultados
│   └── legal/                # /aviso-legal y /privacidad (+ LegalLayout)
├── shared/
│   └── components/            # UI reutilizable y presentacional
│       ├── province-select/   # input()/output(), sin inject() de servicios
│       ├── search-input/
│       └── result-row/
├── app.config.ts             # Providers de la app (incluye SSR hydration)
├── app.config.server.ts      # Providers específicos del servidor
├── app.ts                    # Raíz: solo <router-outlet />
├── app.routes.ts             # Rutas principales (lazy)
└── app.routes.server.ts      # Rutas SSR
```

Los componentes de `shared/components/` son presentacionales: reciben datos
por `input()` y notifican por `output()`, sin inyectar servicios de datos ni
conocer Supabase. El estado (signals, `resource()`) y las llamadas a
servicios viven en los componentes de feature que orquestan (hoy
`features/comparador/Comparador`).

`src/environments/environment.ts` contiene la URL del proyecto y la clave
**anon/publishable** de Supabase — **sí se commitea**: esa clave está
diseñada para ir en código de cliente (la seguridad real la da Row Level
Security en Postgres, no el secreto de la clave). Lo que **nunca** debe
aparecer en este fichero, en el repo, ni en código de cliente en general es
la clave `service_role`/secreta, que sí es privada porque salta RLS por
completo.

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
| `precio_por_unidad` | decimal | precio de referencia (kg, L o ud; la unidad aún no se guarda) |
| `provincia` | text | o `'NACIONAL'` |
| `fecha_registro` | timestamp | default `now()` |

**Regla de oro:** solo insertar un nuevo registro en `precios_historico` si el
`precio` o el `precio_por_unidad` han cambiado respecto al último registro del
mismo artículo y provincia. Esta regla está **garantizada a nivel de base de
datos** por el trigger `BEFORE INSERT` `trg_check_price_change` (función
`public.check_price_change`), que descarta el insert (`RETURN NULL`) si ni
`precio` ni `precio_por_unidad` cambian respecto al último registro. El scraper
además la comprueba antes de insertar (RPC `ultimos_precios`) como optimización
para no enviar escrituras inútiles; ambos criterios son consistentes.

**Esquema versionado:** todo el DDL vive en `supabase/migrations/` (baseline
del remoto del 2026-10-16 y migraciones posteriores); `scraping/sql/` es
histórico. Ver [[#Seguridad, coste y cumplimiento]].

**Seguridad (RLS):** RLS está activo en `articulos` y `precios_historico`.
Los roles `anon`/`authenticated` (el cliente, con la clave anon/publishable)
solo tienen `SELECT`; la escritura (scraping) se hace con la clave
`service_role`, que salta RLS. Cualquier tabla nueva expuesta a PostgREST
debe seguir el mismo patrón: RLS activo desde el primer momento, con una
política de lectura explícita en vez de dejarla sin RLS.

### Lógica de scraping

- **Decidido: se ejecuta mediante GitHub Actions** (no Supabase Edge). El código
  vive en `scraping/` (Node ≥24, TS nativo) y el workflow en
  `.github/workflows/scrape.yml`. Ver `scraping/README.md` y
  [[Tareas/Implementar la ingesta real de precios (Mercadona, Consum, Carrefour)]].
- Fuente de datos: APIs JSON internas de cada super, solo si su `robots.txt` y
  sus términos lo permiten (apartado "Scraping" de
  [[#Seguridad, coste y cumplimiento]]). Activo: Dia. Pausados: Mercadona y
  Consum (su `robots.txt` prohíbe `/api`; ver
  [[Tareas/Pedir permiso a Mercadona y Consum o buscar una fuente autorizada]]).
  Descartados por anti-bot: Carrefour y los archivados. Otros supermercados
  estudiados en [[Tareas/Ampliar el scraping con más supermercados de API pública (estudio Dia, Lidl, Alcampo, etc)]].
  Escritura con la secret key nueva (`sb_secret_...`) o el `service_role`
  legacy — la que salta RLS.
- Parámetro `localidad` (opcional): si se recibe, scrapear solo esa provincia;
  si no, `'NACIONAL'` (MVP).
- Peticiones: user-agent fijo y veraz (`PerroSanxeComparator/<versión>` con la
  URL del repo), 1 s mínimo entre peticiones al mismo host, caché por ejecución
  y reintentos con tope; un 401/403 no se reintenta (`scraping/src/http.ts`).
- **Sistema demo retirado:** existía una Edge Function `scraper` (simulador que
  insertaba 4 productos falsos con precios `Math.random()`) invocada cada hora
  por un `pg_cron` (`invoke-scraper-every-hour`). Ese `pg_cron` se ha
  desprogramado (`cron.unschedule`) porque generaba datos falsos que chocaban
  con la ingesta real. La Edge Function ya no está desplegada (comprobado el
  2026-10-16) y `pg_net`, que solo usaba ese sistema, se elimina en la
  migración `20261017123548_endurecer_seguridad`.

### Funcionalidades del frontend

- **Provincia:** `select` con las provincias de España, persistido en
  `localStorage`. La geolocalización solo se pide al pulsar "Usar mi
  ubicación" y la provincia se calcula en el navegador (capital más cercana);
  las coordenadas no se envían a terceros.
- **Páginas legales:** `/aviso-legal` y `/privacidad`, enlazadas desde el pie
  del tique.
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
