---
Nombre: Guardar la unidad real del precio de referencia en la ingesta
Estado: Pendiente
Resumen: "La base de datos no guarda si precio_por_unidad es por kg, por litro o por unidad, así que la interfaz muestra un genérico \"/ ref.\". Hay que añadir la unidad (kg, L, ud) en la ingesta y en el esquema, devolverla en search_articulos_laxo y mostrarla en ResultRow; con ella, el sello podrá comparar solo productos con la misma unidad."
Decisiones: []
Bloqueada: []
Fecha de creación: 2026-10-17T01:45:00+02:00
Última modificación: 2026-10-17T01:45:00+02:00
---

# Guardar la unidad real del precio de referencia en la ingesta

## Contexto

Sale de [[Corregir textos engañosos de la interfaz (tiempo real, unidad y sello MÁS BARATO)]].
Hoy solo Dia está activo y su API trae `measure_unit` (LITRO, KILO,
UNIDAD…); Mercadona y Consum están pausados
([[Pedir permiso a Mercadona y Consum o buscar una fuente autorizada]]).

## Alcance propuesto

1. Migración: columna `unidad_referencia text check (unidad_referencia in ('kg', 'L', 'ud'))`
   en `articulos`, con su test en `supabase/tests/`.
2. `NormalizedArticulo.unidadReferencia` en la ingesta (Dia: `measure_unit`).
3. `search_articulos_laxo` la devuelve; `ArticuloResult` y `ResultRow` la
   muestran ("€/kg", "€/L", "€/ud").
4. El sello "MENOR €/REF." solo se compara entre resultados con la misma
   unidad, y se actualiza la decisión visual
   [[Decisiones visuales/Anatomía del tique con textos veraces y texto mínimo de 11 px|Nº6]].

## Verificación

<!-- supabase test db, pnpm test y pnpm test:a11y en verde. -->
