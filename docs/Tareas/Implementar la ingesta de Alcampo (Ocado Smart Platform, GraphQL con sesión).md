---
Nombre: Implementar la ingesta de Alcampo (Ocado Smart Platform, GraphQL con sesión)
Estado: Archivada
Resumen: La tienda online de Alcampo (compraonline.alcampo.es) corre sobre Ocado Smart Platform (OSP): el HTML contiene referencias a "osp" y "graphql", y los endpoints REST adivinados (/api/v5, /api/v6...) devuelven "Not Found" en texto plano. No hay anti-bot de challenge (no es Cloudflare/Akamai), pero la API es GraphQL y probablemente exige tokens/cookies de sesión (aunque sea anónima) y cabeceras específicas. Objetivo: recon del tráfico real (Claude-in-Chrome) para capturar la query GraphQL de catálogo y los headers/sesión, igual que se resolvió Dia por observación de tráfico.
Decisiones:
  - "(Usuario, 2026-10-17) Archivada: exige evadir una protección anti-bot o usar una sesión ajena, y la regla de scraping de [[README#Seguridad, coste y cumplimiento]] lo prohíbe. Ver [[Revisar los planes de ingesta que evaden protecciones anti-bot]]. Si aparece una API pública o un acuerdo, se abre una tarea nueva."
Bloqueada: []
Fecha de creación: 2026-08-23T18:30:00+02:00
Última modificación: 2026-10-17T01:45:00+02:00
---

# Implementar la ingesta de Alcampo (Ocado Smart Platform, GraphQL con sesión)

Parte del estudio [[Ampliar el scraping con más supermercados de API pública (estudio Dia, Lidl, Alcampo, etc)]].

## Hallazgos del recon (2026-08-23)

- Host tienda: `https://www.compraonline.alcampo.es/`.
- El HTML de portada contiene `osp` y `graphql` → plataforma **Ocado Smart Platform**.
- Endpoints REST candidatos (`/api/v5/products/search`, `/api/v6/categories`...) → HTTP 404 "Not Found" (texto plano): la ruta correcta no es REST, es GraphQL.
- No aparece challenge anti-bot (no es Cloudflare/Akamai): el bloqueo es de contrato de API, no de detección de bots.

## Posible workaround (para cuando se aborde)

1. Con Claude-in-Chrome, navegar una categoría en compraonline.alcampo.es y leer `read_network_requests` para capturar la request GraphQL real (endpoint, `operationName`, `variables`, `query`) y las cabeceras/cookies de sesión.
2. Determinar si basta una sesión anónima (cookie inicial + token público) para paginar el catálogo, o si exige código postal/tienda.
3. Replicar la llamada GraphQL desde el ingester (POST con headers mínimos), paginando el catálogo.
4. Reutilizable para BonPreu/Esclat, que usan la misma plataforma → ver [[Implementar la ingesta de BonPreu i Esclat (Ocado Smart Platform)]].

## Decisión actual

Requiere recon de GraphQL/sesión antes de poder implementar. Misma clase de dificultad que Carrefour ([[Implementar la ingesta de Carrefour (API con protección anti-bot)]]).
