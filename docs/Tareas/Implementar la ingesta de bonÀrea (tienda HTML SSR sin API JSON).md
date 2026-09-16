---
Nombre: Implementar la ingesta de bonÀrea (tienda HTML SSR sin API JSON)
Estado: Planificando
Resumen: La tienda online de bonÀrea vive en un dominio aparte (bonarea-online.com) y es HTML renderizado en servidor (stack ASP.NET): las rutas /api adivinadas dan 404 "No se encuentra el recurso" y el catálogo va embebido en HTML. No hay anti-bot (responde 200), así que es de los más factibles por scraping HTML. Objetivo: recon del listado por categoría y decidir entre parsear HTML o hallar un endpoint de datos.
Bloqueada: []
Fecha de creación: 2026-08-23T18:30:00+02:00
Última modificación: 2026-08-23T18:30:00+02:00
---

# Implementar la ingesta de bonÀrea (tienda HTML SSR sin API JSON)

Parte del estudio [[Ampliar el scraping con más supermercados de API pública (estudio Dia, Lidl, Alcampo, etc)]].

## Hallazgos del recon (2026-08-23)

- Corporativa `bonarea.com` (redirige a `/es`) enlaza a la tienda `https://www.bonarea-online.com/`.
- `bonarea-online.com` → HTTP 200 HTML SSR (stack ASP.NET). `/es/api/products?...` → 404 "No se encuentra el recurso" (página de error, no JSON).
- Sin anti-bot.

## Posible workaround (para cuando se aborde)

1. Recon con Claude-in-Chrome del listado por categoría en bonarea-online.com: ver si hay XHR/JSON al navegar (paginación, filtros). Si lo hay, replicarlo.
2. Si no hay API, scraping del HTML del listado (parser acotado): nombre, precio, precio/unidad, imagen, id.
3. Al ser sin anti-bot, es de los candidatos más abordables aunque sea por HTML.

## Decisión actual

Accesible pero sin API JSON; pendiente recon para elegir entre endpoint de datos o scraping HTML. Prioridad media.
