---
Nombre: Pedir la geolocalización con aviso y acción explícita
Estado: Hecha
Resumen: Prioridad alta (auditoría 2026-10-16). La app pide la geolocalización al cargar y envía las coordenadas exactas a OpenStreetMap Nominatim sin aviso previo. Debe pedirse solo tras pulsar un botón que explique que la ubicación se envía a Nominatim para deducir la provincia, y Nominatim debe figurar en la política de privacidad. No es asesoramiento legal.
Decisiones:
  - "La ubicación solo se pide al pulsar \"Usar mi ubicación\" y la provincia se calcula en el navegador (capital más cercana, src/app/core/geo/nearest-province.ts). Ya no se usa Nominatim: las coordenadas no salen del dispositivo."
  - "Posición de baja precisión (enableHighAccuracy: false) y aviso visible junto al botón: \"Aproximada; no sale de tu navegador.\""
Bloqueada: []
Fecha de creación: 2026-10-16T23:55:00+02:00
Última modificación: 2026-10-17T01:45:00+02:00
---

# Pedir la geolocalización con aviso y acción explícita

## Objetivo

Cumplir la regla de "Legal y privacidad" de
[[README#Seguridad, coste y cumplimiento]]: no se envía la ubicación a terceros
sin avisar antes y sin una acción explícita del usuario.

> Esto no es asesoramiento legal.

## Hallazgo

`src/app/app.ts` llama a `initGeolocation()` al iniciar y, si el navegador da
permiso, hace `fetch` a `https://nominatim.openstreetmap.org/reverse?lat=…&lon=…`
con las coordenadas exactas.

## Alcance propuesto

1. Quitar la petición automática al cargar; el selector de provincia es el
   valor por defecto.
2. Botón "Usar mi ubicación" con un texto que diga a quién se envía y para qué.
3. Valorar redondear las coordenadas o resolver la provincia en local para no
   enviarlas a un tercero.
4. Declarar Nominatim en la política de privacidad
   ([[Publicar aviso legal (LSSI) y política de privacidad]]).
5. Respetar la política de uso de Nominatim (user-agent o referer
   identificable, 1 petición/s).

## Verificación

- `pnpm test --watch=false`: 21/21, incluidos los tests de que no se pide la ubicación al cargar, de que el botón resuelve la provincia sin `fetch` y de `nearestProvince`.
- `pnpm build && pnpm test:a11y`: AXE 3 rutas + resultados y CSP sin infracciones (5/5).
- Comprobado en navegador real (SSR local).
