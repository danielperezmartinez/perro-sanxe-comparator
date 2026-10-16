---
Nombre: Publicar aviso legal (LSSI) y política de privacidad
Estado: Pendiente
Resumen: Prioridad alta (auditoría 2026-10-16). La web pública no tiene aviso legal (LSSI-CE, art. 10) ni política de privacidad (RGPD, art. 13). Hay que crear ambas páginas, enlazarlas desde todas las vistas y listar los terceros que reciben datos (Supabase, Vercel, Nominatim), con su región. No es asesoramiento legal.
Decisiones: []
Bloqueada: []
Fecha de creación: 2026-10-16T23:55:00+02:00
Última modificación: 2026-10-16T23:55:00+02:00
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

<!-- AXE en verde también en las rutas nuevas. -->
