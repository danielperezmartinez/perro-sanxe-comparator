// Cliente HTTP para las APIs de los supermercados: reintentos con backoff
// exponencial y rotación básica de user-agents para reducir bloqueos, como pide
// docs/README.md ("Lógica de scraping").

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface FetchJsonOptions {
  retries?: number;
  headers?: Record<string, string>;
}

export async function fetchJson<T = unknown>(
  url: string,
  { retries = 3, headers = {} }: FetchJsonOptions = {},
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': USER_AGENTS[attempt % USER_AGENTS.length],
          Accept: 'application/json',
          'Accept-Language': 'es-ES,es;q=0.9',
          ...headers,
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText} — ${url}`);
      }
      return (await res.json()) as T;
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        // Backoff exponencial con jitter: 0.5s, 1s, 2s (+/- ruido).
        const base = 500 * 2 ** attempt;
        await sleep(base + Math.floor(Math.random() * 250));
      }
    }
  }
  throw new Error(
    `fetchJson agotó ${retries + 1} intentos para ${url}: ${String(lastError)}`,
  );
}
