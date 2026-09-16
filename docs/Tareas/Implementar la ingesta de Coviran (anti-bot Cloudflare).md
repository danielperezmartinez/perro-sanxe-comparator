---
Nombre: Implementar la ingesta de Coviran (anti-bot Cloudflare)
Estado: Planificando
Resumen: La tienda de Coviran (tiendas.coviran.es) está protegida por Cloudflare: la petición simple no completa (challenge "Just a moment..."). No se vio API. Objetivo: valorar workaround vía navegador real o API de app, igual que Alimerka.
Bloqueada: []
Fecha de creación: 2026-08-23T18:30:00+02:00
Última modificación: 2026-08-23T18:30:00+02:00
---

# Implementar la ingesta de Coviran (anti-bot Cloudflare)

Parte del estudio [[Ampliar el scraping con más supermercados de API pública (estudio Dia, Lidl, Alcampo, etc)]].

## Hallazgos del recon (2026-08-23)

- `https://tiendas.coviran.es/...` → conexión no completada / página `<title>Just a moment...</title>` (Cloudflare challenge).
- Sin endpoint de catálogo identificado (challenge antes).

## Posible workaround (para cuando se aborde)

Mismo enfoque que [[Implementar la ingesta de Alimerka (anti-bot Cloudflare)]]: navegador real que resuelva Cloudflare y luego leer red/DOM, o API de app. Coviran es cooperativa con surtido/tienda posiblemente variable por localidad, ojo al ámbito.

## Decisión actual

Bloqueado por Cloudflare; solo con navegador real. Prioridad baja.
