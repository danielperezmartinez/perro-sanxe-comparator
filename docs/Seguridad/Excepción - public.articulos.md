---
Nombre: Excepción - public.articulos
Tipo: Excepción
Estado: Vigente
Regla: SELECT (true) solo con excepción escrita.
Objeto: public.articulos · select_articulos_public
Resumen: Lectura pública (anon y authenticated) del catálogo de artículos de supermercado. Son datos públicos de producto (nombre, imagen, súper, categoría, SKU), sin datos personales ni por usuario; la escritura queda reservada a la clave secreta del scraper.
Revisar antes de: 2027-04-16
Última modificación: 2026-10-16T23:55:00+02:00
---

# Excepción - public.articulos

## Justificación

La app es un comparador público sin cuentas: cualquier visitante debe poder
buscar artículos. La tabla solo contiene información de producto que los propios
supermercados publican en su web (nombre, imagen, supermercado, categoría,
`external_id`). No hay columnas de usuario ni datos personales, así que no existe
una condición de fila más estrecha que `true`.

## Mitigaciones

- `anon` y `authenticated` solo tienen `SELECT` (sin `INSERT`/`UPDATE`/`DELETE`/
  `TRUNCATE`); lo comprueba `supabase/tests/10_lectura_publica_catalogo.test.sql`.
- `statement_timeout` de 3 s para `anon` y búsqueda por la RPC
  `search_articulos_laxo`, limitada a 50 filas.
- Pendiente: añadir a la política el comentario
  `excepcion: Excepción - public.articulos` en una migración (ver
  [[Tareas/Endurecer Supabase (pg_net, search_path, índice y comentarios de excepción)]]).
  Hasta entonces el test 3 de `00_seguridad_catalogo.test.sql` falla.
- El derecho sui generis sobre bases de datos de los supermercados no es una
  cuestión de RLS; se trata en
  [[Tareas/Adecuar el scraper actual a robots.txt y a las reglas de scraping]].
