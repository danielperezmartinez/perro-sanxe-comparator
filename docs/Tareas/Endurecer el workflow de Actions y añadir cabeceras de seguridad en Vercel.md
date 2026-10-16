---
Nombre: Endurecer el workflow de Actions y añadir cabeceras de seguridad en Vercel
Estado: En curso
Resumen: Prioridad baja (auditoría 2026-10-16). scrape.yml no declara permissions (el GITHUB_TOKEN hereda los permisos por defecto) y, como seguridad.yml, fija las acciones por tag en vez de por SHA. La web no envía cabeceras de seguridad (CSP, X-Content-Type-Options, Referrer-Policy, Permissions-Policy).
Decisiones:
  - Acciones fijadas por SHA manteniendo la versión mayor actual (checkout v5.1.0, setup-node v5.0.0, setup-cli v1.7.3); Dependabot mensual para github-actions.
  - Cabeceras en vercel.json (sirve también a las páginas prerenderizadas de la CDN). La CSP mantiene 'unsafe-inline' en script-src porque Angular inserta scripts inline (event replay y carga de CSS crítica) en páginas estáticas, donde no hay nonce por petición.
Bloqueada: []
Fecha de creación: 2026-10-16T23:55:00+02:00
Última modificación: 2026-10-17T01:45:00+02:00
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

- `permissions: contents: read` en `scrape.yml` y `seguridad.yml`.
- `e2e/headers.spec.ts` aplica las cabeceras de `vercel.json` al SSR local: la app carga y busca sin violaciones de CSP.
- **Pendiente:** tras desplegar, `curl -I` de producción para confirmar que Vercel sirve las cabeceras. Después, pasar a `Hecha`.
