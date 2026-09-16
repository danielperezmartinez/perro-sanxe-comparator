---
Nombre: Implementar la ingesta de masymas (webs legacy sin API JSON)
Estado: Planificando
Resumen: Con la marca "masymas" conviven dos cadenas distintas y ninguna expone una API JSON limpia. La de Asturias (masymas.es) es un sitio PHP legacy (ISO-8859-1, condicionales de IE8, portada_geolocalizada.php). La de Fornés/Levante (masymas.com) es SSR y solo expone /api/js; no se halló endpoint de producto JSON (el hint "osp" del recon fue un falso positivo del grep). Objetivo: recon con navegador de la que tenga tienda online real y valorar scraping HTML o su endpoint de datos.
Bloqueada: []
Fecha de creación: 2026-08-23T18:30:00+02:00
Última modificación: 2026-08-23T18:30:00+02:00
---

# Implementar la ingesta de masymas (webs legacy sin API JSON)

Parte del estudio [[Ampliar el scraping con más supermercados de API pública (estudio Dia, Lidl, Alcampo, etc)]].

## Hallazgos del recon (2026-08-23)

- **masymas Asturias** (`masymas.es`): redirige a `portada_geolocalizada.php`; HTML legacy ISO-8859-1 con condicionales IE8. Sin API.
- **masymas Fornés/Levante** (`masymas.com`): SSR; solo aparece `/api/js`. Sin endpoint de producto JSON. El "osp" que sugería Ocado fue un falso positivo del grep laxo.
- Sin anti-bot en ninguna.

## Posible workaround (para cuando se aborde)

1. Determinar cuál de las dos tiene tienda online con precios (compra a domicilio) y centrarse en esa.
2. Recon con Claude-in-Chrome del listado por categoría para ver si hay XHR/JSON al paginar; si no, scraping HTML.
3. Revisar su app móvil por si expone API.

## Decisión actual

Sin API JSON; requiere recon por navegador y probablemente scraping HTML. Prioridad baja.
