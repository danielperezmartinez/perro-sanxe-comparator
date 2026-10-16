---
Nombre: Pedir la geolocalización con aviso y acción explícita
Estado: Pendiente
Resumen: Prioridad alta (auditoría 2026-10-16). La app pide la geolocalización al cargar y envía las coordenadas exactas a OpenStreetMap Nominatim sin aviso previo. Debe pedirse solo tras pulsar un botón que explique que la ubicación se envía a Nominatim para deducir la provincia, y Nominatim debe figurar en la política de privacidad. No es asesoramiento legal.
Decisiones: []
Bloqueada: []
Fecha de creación: 2026-10-16T23:55:00+02:00
Última modificación: 2026-10-16T23:55:00+02:00
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

<!-- Tests de App y AXE en verde (compuerta de "Hecha"). -->
