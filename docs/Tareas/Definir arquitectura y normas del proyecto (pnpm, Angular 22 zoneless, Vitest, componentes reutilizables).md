---
Nombre: Definir arquitectura y normas del proyecto (pnpm, Angular 22 zoneless, Vitest, componentes reutilizables)
Estado: Hecha
Resumen: Migrado el gestor de paquetes a pnpm estricto (bloqueo de lifecycle scripts), actualizado Angular a la v22 con zoneless explícito, cerrada la migración a Vitest y creada la carpeta shared/components/ para UI reutilizable, con las normas documentadas en docs/README.md.
Decisiones:
  - pnpm exclusivamente, con preinstall (only-allow) y pnpm-workspace.yaml#allowBuilds como allowlist explícita de scripts de build, para mitigar el vector de ataque de los gusanos de cadena de suministro de npm (Shai-Hulud/Mini Shai-Hulud).
  - provideZonelessChangeDetection() explícito en app.config.ts; full reactive siempre (signals/computed/effect/resource/linkedSignal), RxJS solo para interoperabilidad puntual.
  - Vitest como único test runner (ya lo era a nivel de tooling); norma de crear tests siempre que el código lo justifique.
  - Nueva carpeta src/app/shared/components/ para componentes presentacionales reutilizables (input()/output(), sin inject() de servicios); el estado y las llamadas a servicios quedan en los componentes que orquestan.
Bloqueada: []
Fecha de creación: 2026-08-22T20:00:00+02:00
Última modificación: 2026-08-22T22:00:00+02:00
---

# Definir arquitectura y normas del proyecto (pnpm, Angular 22 zoneless, Vitest, componentes reutilizables)

## Objetivo

El usuario quería fijar la arquitectura y las normas de programación del
proyecto antes de seguir añadiendo funcionalidad:

1. Gestor de paquetes: pnpm exclusivamente, con la configuración necesaria
   para bloquear la ejecución no autorizada de scripts de instalación de
   dependencias.
2. Comprobar la versión de Angular y actualizar si no era la más reciente.
3. Proyecto totalmente zoneless y full reactive (siempre signals).
4. Sustituir Karma+Jasmine por Vitest, con la norma de crear tests siempre
   que proceda.
5. Estructura de carpetas que favorezca componentes comunes reutilizables
   frente al copy-paste.

## Estado de partida (verificado antes de tocar nada)

- Gestor de paquetes: npm (`package-lock.json`, sin bloqueo de scripts de
  instalación).
- Angular real: 21.2.0 (última estable en npm: 22.1.3).
- La migración de Karma/Jasmine a Vitest ya estaba hecha a nivel de
  tooling (`@angular/build:unit-test`), pero sin verificar en verde: había
  un spec roto (`supabase.spec.ts` importaba una clase inexistente).
- No había `zone.js` ni `provideZonelessChangeDetection()` explícito.
- Toda la UI vivía en un único componente (`App`), sin ningún componente
  reutilizable.
- El repo no tenía control de versiones.

## Alcance realizado

1. `git init` + commit inicial de snapshot (con consentimiento explícito
   del usuario), con `src/environments/environment.ts` añadido a
   `.gitignore` (contenía credenciales de Supabase y el README ya decía
   que no debía commitearse, pero no estaba excluido).
2. Migración a pnpm 11.22.0: `packageManager` fijado vía Corepack,
   `preinstall` con `only-allow`, `pnpm-workspace.yaml` con `allowBuilds`
   explícito (`esbuild`, `@parcel/watcher`, `lmdb`, `msgpackr-extract` —
   los cuatro verificados con `pnpm why` como dependencias directas/
   transitivas legítimas de `@angular/build`/vite/sass), `package-lock.json`
   eliminado.
3. Angular actualizado a la v22 (`ng update @angular/cli@22 @angular/core@22`
   y `ng update @angular/cdk@22`, con `--allow-dirty` por la interacción
   entre el mecanismo de CLI temporal de `ng update` y el lockfile de
   pnpm). Migraciones automáticas aplicadas: `withNoIncrementalHydration()`
   en `provideClientHydration()` y desactivación de dos
   `extendedDiagnostics` en `tsconfig.app.json`. TypeScript actualizado a
   la v6.
4. `provideZonelessChangeDetection()` añadido explícitamente a
   `app.config.ts`.
5. `SupabaseService` corregido para cumplir la norma SSR/Supabase ya
   documentada que incumplía (`inject()` en vez de constructor, cliente
   creado solo con `isPlatformBrowser`). `supabase.spec.ts` corregido
   (import roto) y `app.spec.ts` corregido (aserción obsoleta del scaffold).
6. Creada `src/app/shared/components/` con `province-select`,
   `search-input` y `result-row` (extraídos de `App`), cada uno
   presentacional con test propio. Se descubrió y corrigió un NG0701
   (locale `es-ES` no registrado) al escribir el test de `result-row`;
   se registró el locale en `app.config.ts` y se añadió
   `src/test-setup.ts` (vía `setupFiles` en `angular.json`) para que los
   tests de componentes aislados también lo tengan.
7. `docs/README.md` actualizado: gestor de paquetes (sección 1), versión
   de Angular, zoneless/full reactive, nueva subsección de Tests, y el
   árbol de "Estructura de carpetas" con `shared/components/` y la regla
   presentacional-vs-orquestador.
8. Catálogo técnico: entradas nuevas para `ProvinceSelect`, `SearchInput` y
   `ResultRow` (`Vigente`); `SupabaseService` pasa de `En revisión` a
   `Vigente`.

## Verificación

- `pnpm install`: solo se ejecutan los scripts de build explícitamente
  permitidos en `pnpm-workspace.yaml`.
- `pnpm test`: 5 ficheros, 10 tests, todos en verde.
- `pnpm exec ng build` (SSR): genera `dist/perro-sanxe-comparator/{browser,server}`
  sin errores (queda un aviso preexistente de presupuesto de bundle, no
  introducido por este cambio y fuera de alcance).
- Verificación manual en navegador (`ng serve` + Claude in Chrome):
  hidratación correcta bajo zoneless, sin errores de consola; selector de
  provincia, buscador y persistencia en `localStorage` funcionan igual que
  antes del refactor de componentes.

## Resultado

Arquitectura y normas fijadas y aplicadas; ver `docs/README.md` (secciones
1 y 2) para el detalle vigente de cada norma.
