// Orquestador del scraping.
//
// Uso:
//   node scraping/src/run.ts [--super=mercadona,consum] [--localidad=Valencia] [--dry-run]
//
// Env (obligatorias salvo en --dry-run):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
// Env alternativas (las usa el workflow de GitHub Actions):
//   SCRAPE_SUPERS, SCRAPE_LOCALIDAD
//
// --dry-run: recorre las APIs y normaliza, pero NO escribe en Supabase (útil
// para verificar los ingesters sin credenciales).

import { BATCH_SIZE, PROVINCIA_DEFECTO } from './config.ts';
import { mercadona } from './supers/mercadona.ts';
import { consum } from './supers/consum.ts';
import { carrefour } from './supers/carrefour.ts';
import type { NormalizedArticulo, SuperIngester } from './supers/types.ts';
import { SupabaseWriter, nuevasStats } from './sink/supabase-writer.ts';

const INGESTERS: Record<string, SuperIngester> = {
  mercadona,
  consum,
  carrefour,
};

// Supers que corren cuando no se especifica --super (los implementados).
// Carrefour queda fuera a propósito hasta implementarlo, para que el run diario
// no se marque en rojo por su stub; sigue siendo invocable con --super=carrefour.
const DEFAULT_SUPERS = ['mercadona', 'consum'];

interface Args {
  supers: string[];
  localidad: string | undefined;
  dryRun: boolean;
  maxItems: number; // 0 = sin límite
}

function parseArgs(argv: string[]): Args {
  const get = (name: string): string | undefined => {
    const pref = `--${name}=`;
    const hit = argv.find((a) => a.startsWith(pref));
    return hit ? hit.slice(pref.length) : undefined;
  };

  const supersRaw = get('super') ?? process.env['SCRAPE_SUPERS'] ?? '';
  const supers = supersRaw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const localidadRaw = get('localidad') ?? process.env['SCRAPE_LOCALIDAD'] ?? '';
  const localidad = localidadRaw.trim() || undefined;

  const dryRun = argv.includes('--dry-run') || process.env['SCRAPE_DRY_RUN'] === '1';

  const maxRaw = get('max') ?? process.env['SCRAPE_MAX_ITEMS'] ?? '0';
  const maxItems = Math.max(0, Number.parseInt(maxRaw, 10) || 0);

  return {
    supers: supers.length > 0 ? supers : DEFAULT_SUPERS,
    localidad,
    dryRun,
    maxItems,
  };
}

async function runSuper(
  ingester: SuperIngester,
  provincia: string,
  writer: SupabaseWriter | null,
  maxItems: number,
): Promise<void> {
  const stats = nuevasStats();
  const seen = new Set<string>();
  let batch: NormalizedArticulo[] = [];
  let vistos = 0;
  const t0 = Date.now();

  const flush = async () => {
    if (batch.length === 0) return;
    if (writer) await writer.writeBatch(batch, provincia, stats);
    else stats.articulosUpsert += batch.length; // dry-run: solo contamos
    batch = [];
  };

  for await (const item of ingester.scrape({ provincia })) {
    vistos++;
    const k = `${item.supermercado}|${item.externalId}`;
    if (seen.has(k)) continue; // dedup dentro de la ejecución
    seen.add(k);
    batch.push(item);
    if (batch.length >= BATCH_SIZE) await flush();
    if (maxItems > 0 && seen.size >= maxItems) break; // tope para pruebas
  }
  await flush();

  const secs = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(
    `[${ingester.nombre}] ${secs}s — vistos=${vistos} únicos=${seen.size} ` +
      `artículos=${stats.articulosUpsert} preciosNuevos=${stats.preciosNuevos} ` +
      `sinCambio=${stats.preciosSinCambio}`,
  );
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const provincia = args.localidad ?? PROVINCIA_DEFECTO;

  let writer: SupabaseWriter | null = null;
  if (!args.dryRun) {
    const url = process.env['SUPABASE_URL'];
    // Acepta la secret key nueva (sb_secret_...) o el service_role legacy.
    // `||` para que un secreto vacío (no definido en GitHub) caiga al siguiente.
    const secretKey =
      process.env['SUPABASE_SECRET_KEY'] || process.env['SUPABASE_SERVICE_ROLE_KEY'];
    if (!url || !secretKey) {
      throw new Error(
        'Faltan SUPABASE_URL y/o la clave secreta (SUPABASE_SECRET_KEY o ' +
          'SUPABASE_SERVICE_ROLE_KEY). Usa --dry-run para probar sin escribir.',
      );
    }
    writer = new SupabaseWriter(url, secretKey);
  }

  console.log(
    `Scraping — supers=[${args.supers.join(', ')}] provincia=${provincia}` +
      (args.dryRun ? ' (DRY-RUN, sin escritura)' : ''),
  );

  let hadError = false;
  for (const name of args.supers) {
    const ingester = INGESTERS[name];
    if (!ingester) {
      console.error(`Super desconocido: "${name}" (opciones: ${Object.keys(INGESTERS).join(', ')})`);
      hadError = true;
      continue;
    }
    try {
      await runSuper(ingester, provincia, writer, args.maxItems);
    } catch (error) {
      // Un super que falla no debe abortar el resto.
      console.error(`[${ingester.nombre}] ERROR:`, error instanceof Error ? error.message : error);
      hadError = true;
    }
  }

  if (hadError) process.exitCode = 1;
}

main().catch((error) => {
  console.error('Fallo no controlado:', error);
  process.exit(1);
});
