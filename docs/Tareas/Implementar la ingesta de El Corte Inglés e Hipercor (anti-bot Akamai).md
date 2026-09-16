---
Nombre: Implementar la ingesta de El Corte Inglés e Hipercor (anti-bot Akamai)
Estado: Planificando
Resumen: El supermercado online de El Corte Inglés (y sus enseñas Hipercor/Supercor, misma plataforma) está protegido por Akamai: tanto la web (/supermercado/) como los endpoints de API devuelven HTTP 403 "Access Denied" con petición simple. Es un anti-bot de detección (huella TLS/JS/cookies sensor_data), no un problema de contrato de API. Objetivo: valorar un workaround vía navegador real (Claude-in-Chrome) que supere el challenge antes de intentar la ingesta.
Bloqueada: []
Fecha de creación: 2026-08-23T18:30:00+02:00
Última modificación: 2026-08-23T18:30:00+02:00
---

# Implementar la ingesta de El Corte Inglés e Hipercor (anti-bot Akamai)

Parte del estudio [[Ampliar el scraping con más supermercados de API pública (estudio Dia, Lidl, Alcampo, etc)]].

## Hallazgos del recon (2026-08-23)

- `https://www.elcorteingles.es/supermercado/...` y su API (`/api/firestore/scs/supermercado/...`) → HTTP 403 `<TITLE>Access Denied</TITLE>` (Akamai) con UA de navegador + Accept JSON.
- Es detección anti-bot (Akamai Bot Manager), no 404/contrato: la petición ni llega a la API.
- Cubre también Hipercor y Supercor (mismas enseñas/plataforma del grupo).

## Posible workaround (para cuando se aborde)

1. Ejecutar la extracción **dentro de un navegador real** (Claude-in-Chrome) que ya ha superado el challenge de Akamai, leyendo el catálogo desde la red (`read_network_requests`) o el DOM; costoso y frágil.
2. Investigar la **API de la app móvil** (a veces con menos protección/otra huella) capturando su tráfico.
3. Aceptar que puede no ser viable sin infra anti-anti-bot (navegador headful persistente, resolución de sensor_data), y priorizarlo en consecuencia.

## Decisión actual

Descartado con petición simple. Solo abordable con navegador real u otra huella; prioridad baja. Mismo grupo de dificultad que Carrefour/Alimerka/Coviran.
