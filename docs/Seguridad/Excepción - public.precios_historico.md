---
Nombre: Excepción - public.precios_historico
Tipo: Excepción
Estado: Vigente
Regla: SELECT (true) solo con excepción escrita.
Objeto: public.precios_historico · select_precios_historico_public
Resumen: Lectura pública (anon y authenticated) del histórico de precios por artículo y provincia. Son precios publicados por los supermercados, sin datos personales ni por usuario; la escritura queda reservada a la clave secreta del scraper.
Revisar antes de: 2027-04-16
Última modificación: 2026-10-17T14:40:00+02:00
---

# Excepción - public.precios_historico

## Justificación

El comparador muestra a cualquier visitante el último precio de cada artículo
(la RPC `search_articulos_laxo` es `SECURITY INVOKER` y necesita esta lectura).
La tabla solo guarda precio, precio por unidad, provincia y fecha: información
pública de los supermercados, sin relación con usuarios.

## Mitigaciones

- `anon` y `authenticated` solo tienen `SELECT`; lo comprueba
  `supabase/tests/10_lectura_publica_catalogo.test.sql`.
- `statement_timeout` de 3 s para `anon`.
- El comentario `excepcion: Excepción - public.precios_historico` en la política
  y el índice `(articulo_id, provincia, fecha_registro desc)` que evita lecturas
  costosas están en la migración `20261017123548_endurecer_seguridad`, aplicada
  en remoto el 2026-10-17 (ver
  [[Tareas/Endurecer Supabase (pg_net, search_path, índice y comentarios de excepción)]]).
