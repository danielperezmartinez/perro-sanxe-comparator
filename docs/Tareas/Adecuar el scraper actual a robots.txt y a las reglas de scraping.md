---
Nombre: Adecuar el scraper actual a robots.txt y a las reglas de scraping
Estado: Pendiente
Resumen: Prioridad alta (auditoría 2026-10-16). El scraper de Mercadona y Consum consulta rutas /api que sus robots.txt prohíben (Disallow /api), rota user-agents de navegador falsos y no espera entre peticiones. Hay que decidir súper a súper si la ingesta puede seguir (permiso, fuente alternativa o retirada), dejar un user-agent veraz con contacto, añadir retrasos y caché, y revisar el derecho sui generis de bases de datos de la UE. No es asesoramiento legal.
Decisiones: []
Bloqueada: []
Fecha de creación: 2026-10-16T23:55:00+02:00
Última modificación: 2026-10-16T23:55:00+02:00
---

# Adecuar el scraper actual a robots.txt y a las reglas de scraping

## Objetivo

Cumplir el apartado "Scraping" de [[README#Seguridad, coste y cumplimiento]] en
la ingesta que ya funciona (Mercadona, Consum y Dia;
[[Catálogo técnico/Ingesta de precios (scraping)]]).

> Esto no es asesoramiento legal. Ante dudas concretas sobre robots.txt, los
> términos de uso o el derecho sui generis, consulta a un profesional.

## Hallazgos de partida (auditoría de solo lectura, 2026-10-16)

- `robots.txt` de Mercadona y Consum: `Disallow: /api`. El scraper consume
  justamente sus APIs JSON internas.
- `scraping/src/http.ts`: lista `USER_AGENTS` de navegadores que rota en cada
  reintento (suplantación). Solo hay espera en los reintentos, no entre
  peticiones normales.
- Derecho *sui generis* sobre bases de datos (Directiva 96/9/CE, arts. 133-137
  del TRLPI): extraer de forma sistemática partes sustanciales de un catálogo
  puede infringirlo aunque cada dato sea público.

## Alcance propuesto

1. Revisar `robots.txt` y los términos de uso de Mercadona, Consum y Dia; anotar
   el resultado en la [[Seguridad/Checklist de lanzamiento|checklist]].
2. Por cada súper no permitido: pedir permiso, buscar una fuente autorizada o
   retirar la ingesta. Decisión del usuario; anotarla en `Decisiones`.
3. User-agent fijo y veraz (`PerroSanxeComparator/<versión> (+contacto)`), sin
   rotación.
4. Retraso entre peticiones, caché de lo ya descargado y reintentos con tope.
5. Actualizar las reglas del README que lo contradicen: "rotación básica de
   user-agents" en "Lógica de scraping".

## Verificación

<!-- Qué se ejecutó y dónde; ver la compuerta de "Hecha" del sistema de seguridad. -->
