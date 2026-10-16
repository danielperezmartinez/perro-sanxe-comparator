---
Nombre: Endurecer el workflow de Actions y añadir cabeceras de seguridad en Vercel
Estado: Pendiente
Resumen: Prioridad baja (auditoría 2026-10-16). scrape.yml no declara permissions (el GITHUB_TOKEN hereda los permisos por defecto) y, como seguridad.yml, fija las acciones por tag en vez de por SHA. La web no envía cabeceras de seguridad (CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy).
Decisiones: []
Bloqueada: []
Fecha de creación: 2026-10-16T23:55:00+02:00
Última modificación: 2026-10-16T23:55:00+02:00
---

# Endurecer el workflow de Actions y añadir cabeceras de seguridad en Vercel

## Alcance propuesto

1. `scrape.yml`: `permissions: contents: read` a nivel de workflow.
2. `scrape.yml` y `seguridad.yml`: fijar `actions/checkout`, `actions/setup-node`
   y `supabase/setup-cli` por SHA, con la versión en un comentario (y Dependabot
   para actualizarlas).
3. Cabeceras de seguridad: en `vercel.json` o en el servidor Express de
   `src/server.ts` (las páginas prerenderizadas se sirven desde la CDN, así que
   tienen que ir en Vercel). CSP compatible con Supabase y Nominatim.
4. Marcar el punto de cabeceras de la
   [[Seguridad/Checklist de lanzamiento|checklist]].

## Verificación

<!-- curl -I de producción con las cabeceras; workflows en verde. -->
