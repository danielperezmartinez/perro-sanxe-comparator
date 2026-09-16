---
Nombre: Implementar la ingesta de Alimerka (anti-bot Cloudflare)
Estado: Planificando
Resumen: Alimerka (alimerka.es) está protegido por Cloudflare: la petición simple devuelve el interstitial "Just a moment..." (challenge JS de Cloudflare) en vez del contenido. No se llegó a ver ninguna API. Objetivo: valorar un workaround vía navegador real que resuelva el challenge, o la API de su app, antes de intentar la ingesta.
Bloqueada: []
Fecha de creación: 2026-08-23T18:30:00+02:00
Última modificación: 2026-08-23T18:30:00+02:00
---

# Implementar la ingesta de Alimerka (anti-bot Cloudflare)

Parte del estudio [[Ampliar el scraping con más supermercados de API pública (estudio Dia, Lidl, Alcampo, etc)]].

## Hallazgos del recon (2026-08-23)

- `https://www.alimerka.es/...` → HTTP 403 con página `<title>Just a moment...</title>` (Cloudflare challenge JS).
- No se identificó endpoint de catálogo: el challenge bloquea antes.

## Posible workaround (para cuando se aborde)

1. Navegador real (Claude-in-Chrome) que pase el challenge de Cloudflare y luego leer la red/DOM del listado por categoría.
2. Buscar la API de la app móvil (otra huella, a veces sin el mismo challenge).
3. Revisar si tras pasar el challenge hay una API JSON limpia detrás (muchos Cloudflare protegen un backend normal).

## Decisión actual

Bloqueado por Cloudflare con petición simple; solo abordable con navegador real. Prioridad baja. Mismo grupo que Coviran/ECI/Carrefour.
