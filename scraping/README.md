# Scraping de precios

Recolección de datos de la app: obtiene el catálogo y los precios de los
supermercados desde sus **APIs JSON internas** y los escribe en Supabase.

> La fuente de verdad de las reglas del proyecto es `docs/README.md`. Esta
> carpeta es una herramienta Node independiente del build de Angular.

## Runtime

- **Node >= 24** ejecuta los `.ts` nativamente (type stripping) y trae `fetch`
  global. **No hay dependencias nuevas ni build**: solo usa
  `@supabase/supabase-js` (ya en el `package.json` raíz).

## Uso

```bash
# Prueba sin escribir en BD (recomendado para validar los ingesters):
node scraping/src/run.ts --dry-run --max=50

# Un solo super:
node scraping/src/run.ts --super=dia --dry-run --max=50

# Ejecución real (requiere las env de abajo):
node scraping/src/run.ts                 # supers activos, NACIONAL
node scraping/src/run.ts --super=dia --localidad=Valencia
```

O vía pnpm: `pnpm scrape -- --dry-run --max=50`.

### Flags / env

| Flag | Env | Efecto |
|---|---|---|
| `--super=a,b` | `SCRAPE_SUPERS` | Supers a ejecutar (por defecto: `dia`). Los pausados (`mercadona`, `consum`, `carrefour`) se omiten aunque se pidan. |
| `--localidad=X` | `SCRAPE_LOCALIDAD` | Provincia (por defecto `NACIONAL`). |
| `--dry-run` | `SCRAPE_DRY_RUN=1` | No escribe en Supabase; solo cuenta. |
| `--max=N` | `SCRAPE_MAX_ITEMS` | Tope de artículos por super (0 = sin tope). |
| — | `SUPABASE_URL` | URL del proyecto (obligatoria salvo dry-run). |
| — | `SUPABASE_SECRET_KEY` | Secret key nueva (`sb_secret_...`) que salta RLS (obligatoria salvo dry-run). |
| — | `SUPABASE_SERVICE_ROLE_KEY` | Alternativa legacy a la anterior (se usa si `SUPABASE_SECRET_KEY` no está). |

## Puesta en marcha (una vez)

1. Aplicar `sql/001_ingesta_external_id_y_ultimos_precios.sql` en Supabase
   (SQL editor o MCP): añade `articulos.external_id` + índice único y la RPC
   `ultimos_precios`.
2. Aplicar `sql/002_limpiar_datos_demo.sql` para borrar el catálogo de demo
   (DESTRUCTIVO; solo la primera vez).
3. En GitHub → Settings → Secrets and variables → Actions, crear:
   - `SUPABASE_URL`
   - `SUPABASE_SECRET_KEY` — secret key nueva `sb_secret_...` del panel
     *Project Settings → API Keys → Secret keys* (clave que salta RLS;
     **nunca** en el repo). Alternativa: `SUPABASE_SERVICE_ROLE_KEY` (legacy).
   - No desactivar las claves legacy: el cliente Angular aún usa la `anon`
     legacy de `environment.ts`.
4. El workflow `.github/workflows/scrape.yml` corre a diario y puede lanzarse a
   mano (workflow_dispatch) con inputs `super`/`localidad`.

## Supermercados

| Super | Estado | Fuente |
|---|---|---|
| Mercadona | ⏸ pausado | `tienda.mercadona.es/api/categories/` — su robots.txt prohíbe `/api` |
| Consum | ⏸ pausado | `tienda.consum.es/api/rest/V1.0/catalog/product` — su robots.txt prohíbe `/api/` |
| Dia | ✅ | `dia.es/api/v1/plp-back/l1/all/{L1}/reduced?category_id={L1}&page=` |
| Carrefour | ⛔ descartado | endpoints dan 403 (anti-bot); no se evaden protecciones |

## Reglas de scraping

Las fija el apartado "Scraping" de `docs/README.md`. En el código
(`src/http.ts`): user-agent `PerroSanxeComparator/<versión>` con la URL del
repo como contacto, 1 s mínimo entre peticiones al mismo host, caché en memoria
durante la ejecución, reintentos con tope (y `Retry-After`), y un 401/403 no se
reintenta. Los supers pausados están en `PAUSED` de `src/run.ts`.

## Regla de oro

Solo se inserta en `precios_historico` si el `precio` o el `precio_por_unidad`
han cambiado respecto al último registro del mismo artículo y provincia. La
comparación usa la RPC `ultimos_precios` (una llamada por lote).
