---
Nombre: Agrupar resultados por categoría normalizada para comparar entre supermercados
Estado: Planificando
Resumen: Opción B pospuesta de la mejora del buscador. Hoy el "MÁS BARATO" se calcula sobre TODOS los resultados de una búsqueda por precio_por_unidad, así que si una búsqueda mezcla tipos de producto distintos se comparan cosas no equivalentes ("peras con pizzas"). Al limpiar la relevancia (ver tarea enlazada) el problema se mitigó mucho, pero puede reaparecer en búsquedas amplias. La solución robusta es agrupar por una categoría normalizada común entre supers y calcular el más barato DENTRO de cada grupo. No implementar hasta que el usuario lo pida.
Decisiones:
  - Disparador: implementar SOLO si el usuario vuelve a detectar comparaciones entre productos no equivalentes tras la mejora de relevancia ya aplicada.
Bloqueada: []
Fecha de creación: 2026-08-23T14:10:00+02:00
Última modificación: 2026-08-23T14:10:00+02:00
---

# Agrupar resultados por categoría normalizada para comparar entre supermercados

## Por qué existe esta tarea

Es la **opción B** que quedó fuera del alcance de
[[Mejorar la relevancia del buscador y evitar peticiones por letra]]. El usuario
pidió dejarla registrada con contexto para poder retomarla si detecta el
problema en el futuro. **No implementar hasta que lo pida explícitamente.**

## Problema que resolvería

La app estampa "MÁS BARATO" sobre el resultado con menor `precio_por_unidad` de
**todo** el conjunto devuelto por la búsqueda (`app.ts`, `searchResults`
ordena por `precio_por_unidad` ASC y `ResultRow` marca el mínimo). Si una
búsqueda devuelve productos de tipos distintos, se comparan cosas no
equivalentes (el ejemplo del usuario: comparar un tomate pera barato por kg
frente a pizzas).

Tras reescribir la RPC para limpiar la relevancia, la mayoría de búsquedas ya
devuelven un único tipo de producto y comparar €/kg entre ellos es correcto.
Esta tarea cubre el caso residual de búsquedas amplias que legítimamente
devuelven varias categorías.

## Restricción clave descubierta

Las **categorías NO son homogéneas entre supermercados**. Verificado contra los
datos reales (13.630 artículos: ~9.291 Consum, ~4.339 Mercadona):

- "Tomate pera" está en `Fruta y verdura` (Mercadona) y en `Tomates` (Consum).
- Consum usa categorías muy finas (`Tomates`, `Tomate frito`, `Tomate natural`);
  Mercadona usa categorías amplias (`Fruta y verdura`).

Por tanto NO se puede agrupar directamente por la columna `categoria` cruda: hay
que normalizarla.

## Opciones de implementación

- **B1 — Agrupar en la UI por categoría normalizada (más barato).** Mantener un
  mapa Mercadona<->Consum -> grupo lógico, agrupar los resultados y calcular el
  "MÁS BARATO" por grupo. No toca el esquema ni el scraper; el mapa vive en el
  frontend o en la RPC. Riesgo: mantener el mapa a mano al añadir categorías.
- **B2 — Guardar `categoria_norm` en `articulos` (más robusto).** Calcular una
  categoría normalizada propia al scrapear (en `scraping/`) y persistirla como
  columna nueva; comparar por ella. Es el "almacenar de otra forma" que intuyó
  el usuario. Implica migración de esquema + cambios en el scraper + repoblar.

## Consideraciones al retomar

- El buscador ya devuelve resultados relevantes; medir primero si el problema
  sigue siendo real antes de invertir en B2.
- Si se elige B1, decidir dónde vive el mapa (RPC vs frontend) y cómo se cubren
  categorías nuevas sin romper la agrupación.
- Cualquier cambio de esquema sigue el protocolo de RLS y despliegue de
  `docs/README.md`.
