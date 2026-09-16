---
Nombre: Implementar la ingesta de Gadis (Next.js, endpoint de datos por localizar)
Estado: Planificando
Resumen: La tienda online de Gadis (gadisline.com) es una app Next.js sin anti-bot: los endpoints /api adivinados dan 404 pero el sitio responde 200 y es alcanzable. No se localizó por curl el endpoint JSON de catálogo. Objetivo: recon con navegador para hallar la ruta de datos (probable API JSON de Next.js no adivinada); es de los candidatos prometedores por ser Next.js y sin protección.
Bloqueada: []
Fecha de creación: 2026-08-23T18:30:00+02:00
Última modificación: 2026-08-23T18:30:00+02:00
---

# Implementar la ingesta de Gadis (Next.js, endpoint de datos por localizar)

Parte del estudio [[Ampliar el scraping con más supermercados de API pública (estudio Dia, Lidl, Alcampo, etc)]].

## Hallazgos del recon (2026-08-23)

- `https://www.gadisline.com/` → app Next.js (HTML de Next). Sin anti-bot.
- `/api/products?q=...` adivinado → 404, pero el dominio responde: la ruta real no se adivinó.

## Posible workaround (para cuando se aborde)

1. Recon con Claude-in-Chrome del listado por categoría: leer `read_network_requests` para capturar la llamada de datos real (API JSON o `/_next/data/<buildId>/...json`).
2. Al ser Next.js, es muy probable que haya un endpoint JSON limpio (o los `__NEXT_DATA__`/`_next/data` con los productos) → mapear como Dia/Consum.
3. Confirmar ámbito (Gadis es gallega; posible surtido/precio por tienda o zona).

## Decisión actual

Accesible y sin anti-bot; solo falta localizar el endpoint de datos por navegador. Prioridad media (buen candidato tras Dia).
