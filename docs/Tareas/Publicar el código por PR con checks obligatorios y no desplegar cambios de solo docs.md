---
Nombre: Publicar el código por PR con checks obligatorios y no desplegar cambios de solo docs
Estado: Hecha
Resumen: "Aplicar el flujo de publicación acordado en nocendland: el código va por PR contra main y solo se fusiona con los tres checks del workflow Seguridad en verde (protección de rama, enforce_admins false) y con la versión subida en la PR; los cambios de solo docs/ van directos a main sin versión ni despliegue (ignoreCommand en vercel.json)."
Decisiones:
  - "Una sola regla de publicación (regla 3 del README); la sección de seguridad y el workflow solo la enlazan."
  - "Checks obligatorios con sus nombres reales: Tests RLS y catálogo (pgTAP), Accesibilidad (AXE) y secretos en el bundle, Fugas (gitleaks); strict true."
  - "enforce_admins false: usuario y agentes comparten la cuenta administradora y así el push directo de docs/ sigue funcionando."
  - "Se mantiene el criterio de Conventional Commits para elegir el incremento de versión."
Bloqueada: []
Fecha de creación: 2026-10-17T15:40:00+02:00
Última modificación: 2026-10-17T16:05:00+02:00
---

# Publicar el código por PR con checks obligatorios y no desplegar cambios de solo docs

## Alcance

1. Regla 3 de [[README]]: tabla Código / Solo bóveda, PR obligatoria para
   código, versión en la PR y verificación del despliegue en Vercel.
2. Protección de `main` en GitHub con los tres checks del workflow
   `Seguridad` obligatorios (`strict`) y `enforce_admins: false`.
3. `vercel.json`: `ignoreCommand` que omite el build si el commit no cambia
   nada fuera de `docs/`.

El workflow de scraping (`scrape.yml`) no se ve afectado: se lanza por cron o a
mano, no depende de Vercel y no hace commits en el repo.

## Verificación

- `ignoreCommand` probado en local sobre los últimos 15 commits de `main`: los
  de solo `docs/` devuelven 0 y los que tocan código devuelven 1.
- Protección de `main` aplicada (2026-10-17, con confirmación del usuario):
  `strict: true`, los tres checks de `Seguridad` (app GitHub Actions) y
  `enforce_admins: false`. La PR #6 quedó `BLOCKED` mientras los checks
  estaban pendientes y `BEHIND` cuando `main` avanzó, hasta ponerla al día.
- PR #6 (v0.5.1) fusionada con `rls`, `a11y`, `fugas` y Vercel en verde;
  despliegue de producción `dpl_ECT1U4xeoFEqXJkt9p33hFbRtVDV` (commit
  `0986274`) en `READY`.
- Push directo a `main` de solo `docs/` (commit `517b114`): GitHub lo acepta y
  Vercel lo marca «Canceled by Ignored Build Step»; producción sigue en
  `dpl_ECT1U4xeoFEqXJkt9p33hFbRtVDV`. El scraping no cambia (cron, sin Vercel).
