---
Nombre: Implementar la ingesta de BonPreu i Esclat (Ocado Smart Platform)
Estado: Planificando
Resumen: La tienda online de BonPreu/Esclat (compraonline.bonpreuesclat.cat) corre sobre Ocado Smart Platform, igual que Alcampo: los endpoints REST adivinados devuelven "Not Found" en texto plano y la API real es GraphQL con sesión. Sin challenge anti-bot. Objetivo: reutilizar el workaround de recon GraphQL de Alcampo (misma plataforma) para capturar la query de catálogo y la sesión.
Bloqueada: []
Fecha de creación: 2026-08-23T18:30:00+02:00
Última modificación: 2026-08-23T18:30:00+02:00
---

# Implementar la ingesta de BonPreu i Esclat (Ocado Smart Platform)

Parte del estudio [[Ampliar el scraping con más supermercados de API pública (estudio Dia, Lidl, Alcampo, etc)]].

## Hallazgos del recon (2026-08-23)

- Host tienda: `https://www.compraonline.bonpreuesclat.cat/`.
- Endpoints REST candidatos (`/api/v5/products/search`...) → HTTP 404 "Not Found" (texto plano), firma idéntica a Alcampo → **Ocado Smart Platform (GraphQL)**.
- Sin anti-bot de challenge.
- Catálogo en catalán (búsquedas tipo `llet` para leche).

## Posible workaround (para cuando se aborde)

Idéntico al de Alcampo: recon con Claude-in-Chrome para capturar la request GraphQL de catálogo y la sesión, y replicarla. Ver [[Implementar la ingesta de Alcampo (Ocado Smart Platform, GraphQL con sesión)]] — si se resuelve una, la otra debería salir casi gratis.

## Decisión actual

Depende de resolver primero el patrón OSP (idealmente en Alcampo). Prioridad ligada a esa.
