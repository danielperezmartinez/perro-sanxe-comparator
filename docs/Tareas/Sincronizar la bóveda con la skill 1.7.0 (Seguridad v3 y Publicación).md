---
Nombre: Sincronizar la bóveda con la skill 1.7.0 (Seguridad v3 y Publicación)
Estado: Hecha
Resumen: "Sincronizar Seguridad, coste y cumplimiento de v2 a v3 y montar el sistema Publicación v1 con la política común de publicación de las webs: la regla 3 del README pasa a la sección Publicación, guarda en pre-push, job Cambios y comprobación de versión en el CI, .gitattributes con eol=lf y los ajustes de GitHub (solo squash, PR obligatoria, historial lineal)."
Decisiones:
  - "La sección Publicación del README es el único sitio de la regla; la regla 3, la sección de Seguridad y el comentario de seguridad.yml solo la enlazan."
  - "La versión la propone el agente según los commits (Conventional Commits) y la aprueba el usuario; ya no se decide automáticamente."
  - "La comprobación de versión va como paso del job a11y (ya obligatorio), sin añadir checks a la protección de main."
  - "Dependabot es código: sus PR llevan su subida patch."
Bloqueada: []
Fecha de creación: 2026-10-17T18:00:00+02:00
Última modificación: 2026-10-17T18:40:00+02:00
---

# Sincronizar la bóveda con la skill 1.7.0 (Seguridad v3 y Publicación)

## Alcance

1. Seguridad v2 → v3: línea de versión, viñeta de enlace a [[README#Publicación]]
   y `.githooks/* text eol=lf` en `.gitattributes`.
2. Publicación v1 por ampliación, adoptando lo que ya montó
   [[Tareas/Publicar el código por PR con checks obligatorios y no desplegar cambios de solo docs|la tarea anterior]]:
   sección en el README, enlace en [[Inicio]], guarda `.githooks/_rama_principal.sh`
   encadenada en `pre-push`, job `Cambios` y paso de versión en `seguridad.yml`,
   `scripts/comprobar-version.sh`.
3. Ajustes de GitHub con confirmación del usuario: solo squash,
   `delete_branch_on_merge`, PR obligatoria con 0 aprobaciones y
   `required_linear_history`.
4. Proponer la subida `patch` de la PR de Dependabot abierta.

El workflow de scraping (`scrape.yml`) no se toca.

## Verificación

- Guarda probada en local: un push de código a `main` sale con 1; a otra rama o
  de solo `docs/` a `main`, con 0.
- `scripts/comprobar-version.sh origin/main` falla con la misma versión que
  `main` (0.5.1).
- Ajustes de GitHub aplicados con confirmación del usuario y releídos
  (2026-10-17): solo squash, `delete_branch_on_merge`, sin auto-merge; protección
  de `main` con PR obligatoria (0 aprobaciones), los tres checks en `strict`,
  `required_linear_history`, sin resolver conversaciones, `enforce_admins=false`,
  sin force push ni borrado.
- PR #7 (v0.5.2) integrada con squash (commit `b1970bf`) con `Cambios`, `rls`,
  `a11y` (incluido el paso de versión), `fugas` y Vercel en verde; despliegue de
  producción `dpl_f9aZ1JZFuFuKE6zQ9HPS1fJurNH4` en `READY`.
- Este cierre se publicó por push directo de solo `docs/` a `main` (la guarda lo
  deja pasar).
