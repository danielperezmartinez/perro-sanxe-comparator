---
Nombre: Revisar los planes de ingesta que evaden protecciones anti-bot
Estado: Hecha
Resumen: Prioridad alta (auditoría 2026-10-16). Varias tareas de ingesta en Planificando o Pendiente plantean saltarse protecciones anti-bot (Carrefour, Alimerka, Coviran, El Corte Inglés/Hipercor) y la auditoría señala lo mismo para Dia. La regla de scraping prohíbe evadir protecciones; hay que reescribir o archivar esos planes antes de implementarlos. No es asesoramiento legal.
Decisiones:
  - "(Usuario, 2026-10-17) Se archivan las tareas de ingesta que exigían evadir anti-bot o usar sesión: Carrefour, Alimerka, Coviran, El Corte Inglés/Hipercor, Alcampo y BonPreu i Esclat. Si aparece una API pública o un acuerdo, se abre una tarea nueva."
  - Carrefour queda en la lista PAUSED de scraping/src/run.ts y no se ejecuta aunque se pida por --super.
Bloqueada: []
Fecha de creación: 2026-10-16T23:55:00+02:00
Última modificación: 2026-10-17T01:45:00+02:00
---

# Revisar los planes de ingesta que evaden protecciones anti-bot

## Objetivo

Alinear los planes de ingesta pendientes con el apartado "Scraping" de
[[README#Seguridad, coste y cumplimiento]]: **no se evaden protecciones**
(CAPTCHAs, bloqueos, límites ni inicios de sesión ajenos).

> Esto no es asesoramiento legal.

## Tareas afectadas

No se han editado; cada una debe revisarse cuando se retome:

- [[Implementar la ingesta de Carrefour (API con protección anti-bot)]]
- [[Implementar la ingesta de Alimerka (anti-bot Cloudflare)]]
- [[Implementar la ingesta de Coviran (anti-bot Cloudflare)]]
- [[Implementar la ingesta de El Corte Inglés e Hipercor (anti-bot Akamai)]]
- [[Implementar la ingesta de Alcampo (Ocado Smart Platform, GraphQL con sesión)]]
  (requiere sesión).
- Dia, ya implementado: la auditoría indica que se planteó saltar su anti-bot.
  Confirmarlo en [[Ampliar el scraping con más supermercados de API pública (estudio Dia, Lidl, Alcampo, etc)]]
  y en `scraping/src/supers/`.

## Alcance propuesto

1. Para cada una, decidir: fuente permitida (API pública, acuerdo, feed),
   aplazar o archivar.
2. Añadir a cada tarea afectada una decisión que cite esta regla.

## Verificación

- Las 6 tareas pasan a `Archivada` con la decisión anotada.
- Dia no evade nada: su API responde sin protección y su robots.txt no la bloquea (2026-10-17).
