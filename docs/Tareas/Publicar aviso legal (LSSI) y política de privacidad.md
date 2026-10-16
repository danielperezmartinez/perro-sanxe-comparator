---
Nombre: Publicar aviso legal (LSSI) y política de privacidad
Estado: Hecha
Resumen: Prioridad alta (auditoría 2026-10-16). La web pública no tiene aviso legal (LSSI-CE, art. 10) ni política de privacidad (RGPD, art. 13). Hay que crear ambas páginas, enlazarlas desde todas las vistas y listar los terceros que reciben datos (Supabase, Vercel, Nominatim), con su región. No es asesoramiento legal.
Decisiones:
  - (Usuario, 2026-10-17) Titular Daniel Pérez Martínez, contacto dlperezmartinez@gmail.com; proyecto sin ingresos ni publicidad, por lo que no se publican NIF ni domicilio.
  - (Usuario) Se mantiene Google Fonts; se declara Google como tercero en la política de privacidad.
  - "Terceros declarados: Vercel (EE. UU.), Supabase (UE, Irlanda, eu-west-1) y Google Fonts (EE. UU.). Los textos no son asesoramiento legal; conviene revisarlos con un profesional."
Bloqueada: []
Fecha de creación: 2026-10-16T23:55:00+02:00
Última modificación: 2026-10-17T01:45:00+02:00
---

# Publicar aviso legal (LSSI) y política de privacidad

## Objetivo

Cumplir la primera regla de "Legal y privacidad" de
[[README#Seguridad, coste y cumplimiento]].

> Esto no es asesoramiento legal. Los textos finales conviene revisarlos con un
> profesional.

## Alcance propuesto

1. Rutas `/aviso-legal` y `/privacidad` (lazy, prerenderizadas), enlazadas desde
   el pie.
2. Aviso legal: titular, contacto y finalidad del sitio.
3. Privacidad: datos tratados (ubicación si el usuario la comparte, provincia en
   `localStorage`, logs técnicos de Vercel y Supabase), terceros y región,
   derechos y contacto.
4. Añadir las dos rutas a `RUTAS` de `e2e/a11y.spec.ts`.
5. Marcar los puntos legales de la [[Seguridad/Checklist de lanzamiento|checklist]].

## Verificación

- Rutas `/aviso-legal` y `/privacidad` lazy y prerenderizadas, enlazadas desde el pie del tique y entre sí.
- `pnpm test --watch=false`: 21/21 (renderizado de las tres rutas).
- `pnpm test:a11y`: AXE sin infracciones en las tres rutas.
- Commit `634167a`.
