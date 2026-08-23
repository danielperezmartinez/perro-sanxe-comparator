---
Nombre: Mejorar la relevancia del buscador y evitar peticiones por letra
Estado: Hecha
Resumen: El buscador devolvía ruido (p. ej. "tomate pera" traía "Zumo Tomate Brik", "Tomate Frito Frasco") y mezclaba productos distintos al comparar precios ("pizza tomate y queso" comparaba tomates con pizzas). Causa raíz: la RPC search_articulos_laxo unía FTS con una cláusula trigrama `%` (umbral 0.3) por OR, que colaba cualquier nombre con unos pocos trigramas en común, con ts_rank 0, dentro de los 50 comparados. Además el frontend lanzaba una petición por cada tecla. Reescrita la RPC (trigrama solo como fallback de erratas; FTS con prefijo AND para tecleo incremental) y añadido debounce 300 ms + mín. 2 caracteres + cancelación con abortSignal en app.ts.
Decisiones:
  - search_articulos_laxo ya no usa el operador trigrama `%` como cláusula OR paralela a FTS. Construye una tsquery de prefijo AND a partir de los lexemas del término (`unnest(to_tsvector('spanish', unaccent(q)))` -> `lex1:* & lex2:* ...`), de modo que las consultas multipalabra exigen TODOS los términos y el último matchea por prefijo (tecleo incremental: "tomate pe" -> "pe:* & tomat:*"). El trigrama queda como fallback SOLO cuando FTS devuelve 0 filas (tolerancia a erratas tipo "tomate perra").
  - El "MÁS BARATO" y la comparación por precio_por_unidad se resuelven en gran parte al limpiar la relevancia: si la búsqueda solo devuelve pizzas, comparar €/kg entre pizzas es correcto. La agrupación explícita por categoría normalizada (comparar "peras con peras" entre supers) queda PENDIENTE de decidir en una segunda iteración: las categorías NO son homogéneas entre supers (p. ej. "Tomate pera" es "Fruta y verdura" en Mercadona y "Tomates" en Consum), así que requeriría un mapa de normalización.
  - Frontend: la búsqueda se dispara desde un signal derivado con debounce (`toObservable(searchQuery) |> debounceTime(300) |> toSignal`), no desde searchQuery directo. RxJS aquí es interop puntual permitido por docs/README.md. El resource pasa su abortSignal a supabase-js (`.abortSignal()`) para cancelar la petición en vuelo cuando una búsqueda más nueva la sustituye. Se mantiene el guard de mín. 2 caracteres.
Bloqueada: []
Fecha de creación: 2026-08-23T14:05:00+02:00
Última modificación: 2026-08-23T14:10:00+02:00
---

# Mejorar la relevancia del buscador y evitar peticiones por letra

## Contexto

El usuario reportó dos problemas al probar el buscador:

1. **Ruido en los resultados.** "tomate pera" devolvía "Zumo de tomate brik",
   "Tomate frito frasco", etc. "Pizza tomate y queso" devolvía "tomate pera" y
   pizzas de jamón y queso, y el comparador estampaba "MÁS BARATO" sobre el
   tomate pera en vez de comparar pizzas entre sí.
2. **Una petición por cada tecla**, que satura de peticiones innecesarias.

## Diagnóstico (verificado contra la BD real)

La RPC `search_articulos_laxo` filtraba con:

```sql
WHERE a.search_vector @@ websearch_to_tsquery('spanish', unaccent(q))
   OR immutable_unaccent(a.nombre) % immutable_unaccent(q)   -- trigrama
ORDER BY ts_rank(...) DESC LIMIT 50;
```

Ejecutando `tomate pera` contra los datos reales, los 6 resultados correctos
matcheaban FTS (ts_rank ~0.099) y **19 resultados basura** entraban SOLO por el
operador trigrama `%` (similitud 0.30-0.39, justo por encima del umbral 0.3 por
defecto) con **ts_rank 0**. Como la app compara los 50 por `precio_por_unidad`,
ese ruido contaminaba la comparación.

Segundo problema: `websearch_to_tsquery` une términos con AND, así que
"pizza tomate y queso" (AND de pizza+tomate+queso, "y" es stopword) hacía que
pizzas sin tomate y tomates sueltos entraran por el trigrama con rank 0.

`search_vector` es una columna generada solo desde `nombre`
(`to_tsvector('spanish', immutable_unaccent(nombre))`); no indexa categoría.

Frontend: `app.ts` disparaba el `resource` desde `searchQuery()` directo, sin
debounce.

## Alcance realizado

1. **RPC reescrita** (migración `rework_search_articulos_laxo_relevancia`): ver
   Decisiones. Validado contra datos reales:
   - `tomate pera` -> 6 resultados relevantes, 0 basura.
   - `pizza tomate y queso` -> solo "Pizzas tomate y queso" y "Pizza Bites ...
     tomate", nada de tomates sueltos ni pizzas de jamón.
   - `tomate pe` -> `pe:* & tomat:*` -> 11 resultados (tecleo incremental).
   - `tomate perra` (errata) -> 0 FTS -> 22 por fallback trigrama.
2. **Frontend** (`src/app/app.ts`, `src/app/core/services/supabase.ts`):
   debounce 300 ms sobre `searchQuery`, guard de mín. 2 caracteres y
   `abortSignal` propagado a `supabase-js` para cancelar peticiones en vuelo.

## Verificación

- RPC en producción: `select * from search_articulos_laxo('tomate pera')`
  devuelve los 6 relevantes (MCP Supabase).
- `pnpm test` en verde (11/11). `pnpm build` (SSR) compila correctamente (queda
  el aviso de budget de bundle previo, no relacionado).
- Verificado en navegador real por el usuario (debounce/cancelación y calidad
  de resultados). Tarea cerrada como Hecha.

## Siguiente iteración (opcional)

- **Comparación por grupos (opción B).** Movida a su propia tarea para
  implementar solo si el usuario detecta el problema en el futuro:
  [[Agrupar resultados por categoría normalizada para comparar entre supermercados]].
