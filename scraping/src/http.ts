// Cliente HTTP para las APIs de los supermercados. Cumple el apartado
// "Scraping" de docs/README.md (sistema "Seguridad, coste y cumplimiento"):
//   - user-agent veraz e identificable, con forma de contacto (sin rotación ni
//     suplantación de navegadores);
//   - un mínimo de MIN_INTERVAL_MS entre peticiones al mismo host;
//   - caché en memoria de lo ya descargado durante la ejecución;
//   - reintentos con tope y espera creciente, respetando Retry-After.
// No evade protecciones: un 401/403 se trata como "no permitido" y no se
// reintenta con otras cabeceras.

import pkg from '../../package.json' with { type: 'json' };

export const USER_AGENT = `PerroSanxeComparator/${pkg.version} (+https://github.com/danielperezmartinez/perro-sanxe-comparator)`;

/** Espera mínima entre dos peticiones al mismo host. */
export const MIN_INTERVAL_MS = 1000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const nextSlotByHost = new Map<string, number>();
const cache = new Map<string, unknown>();

/** Reserva el siguiente hueco libre para el host y espera hasta él. */
async function throttle(url: string): Promise<void> {
  const host = new URL(url).host;
  const now = Date.now();
  const slot = Math.max(now, nextSlotByHost.get(host) ?? 0);
  nextSlotByHost.set(host, slot + MIN_INTERVAL_MS);
  if (slot > now) await sleep(slot - now);
}

export interface FetchJsonOptions {
  retries?: number;
  headers?: Record<string, string>;
}

export async function fetchJson<T = unknown>(
  url: string,
  { retries = 3, headers = {} }: FetchJsonOptions = {},
): Promise<T> {
  if (cache.has(url)) return cache.get(url) as T;

  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    await throttle(url);
    let retryAfterMs = 0;
    try {
      const res = await fetch(url, {
        headers: {
          ...headers,
          'User-Agent': USER_AGENT,
          Accept: 'application/json',
          'Accept-Language': 'es-ES,es;q=0.9',
        },
      });
      if (res.status === 401 || res.status === 403) {
        // Acceso no permitido: no se insiste ni se cambia de identidad.
        throw Object.assign(new Error(`HTTP ${res.status} (no permitido) — ${url}`), {
          noRetry: true,
        });
      }
      if (!res.ok) {
        retryAfterMs = Number(res.headers.get('retry-after') ?? 0) * 1000 || 0;
        throw new Error(`HTTP ${res.status} ${res.statusText} — ${url}`);
      }
      const data = (await res.json()) as T;
      cache.set(url, data);
      return data;
    } catch (error) {
      lastError = error;
      if ((error as { noRetry?: boolean }).noRetry) break;
      if (attempt < retries) {
        // Espera creciente con tope: 2s, 4s, 8s (o lo que pida Retry-After, máx. 60s).
        await sleep(Math.min(60_000, Math.max(retryAfterMs, 2000 * 2 ** attempt)));
      }
    }
  }
  throw new Error(`fetchJson falló para ${url}: ${String(lastError)}`);
}
