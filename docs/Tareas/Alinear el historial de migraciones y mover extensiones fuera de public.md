---
Nombre: Alinear el historial de migraciones y mover extensiones fuera de public
Estado: Pendiente
Resumen: "Dos restos de baja prioridad tras endurecer Supabase. (1) El historial de migraciones del remoto no tiene la baseline 20261016000000 y sí entradas antiguas que no están en supabase/migrations/; hay que alinearlo con supabase migration repair antes de usar supabase db push. (2) El Security Advisor avisa de pg_trgm y unaccent instalados en public (extension_in_public); moverlas a extensions obliga a cualificar los usos en funciones e índices."
Decisiones: []
Bloqueada: []
Fecha de creación: 2026-10-17T14:40:00+02:00
Última modificación: 2026-10-17T14:40:00+02:00
---

# Alinear el historial de migraciones y mover extensiones fuera de public

## Contexto

Sale de [[Endurecer Supabase (pg_net, search_path, índice y comentarios de excepción)]].
Ambas acciones tocan el remoto `wvzrilklvpaqzvehwyya`: necesitan la aprobación
explícita del usuario.

## Alcance propuesto

1. Historial: `supabase migration repair --status applied 20261016000000` y
   marcar como `reverted` las versiones antiguas del remoto que la baseline ya
   recoge (`001_initial_schema_v3` … `rework_search_articulos_laxo_relevancia`).
   Comprobar con `supabase migration list` que local y remoto coinciden.
2. Extensiones: migración que mueva `pg_trgm` y `unaccent` a `extensions` y
   actualice `immutable_unaccent`, `search_articulos_laxo` y el índice
   `articulos_nombre_trgm_idx`. Probar en local (`supabase test db`, sobre todo
   `20_funciones_catalogo`) antes de aplicar.

## Verificación

<!-- supabase test db en local, migration list alineado y get_advisors sin avisos. -->
