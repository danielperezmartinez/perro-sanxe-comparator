// Ingester de Carrefour — PENDIENTE DE IMPLEMENTAR.
//
// Estado del recon (2026-08-22): los endpoints JSON candidatos de carrefour.es
// responden HTTP 403 con una petición simple (User-Agent de navegador + Accept
// JSON). Carrefour tiene protección anti-bot: probablemente exige cookies de
// sesión / tokens obtenidos al navegar, cabeceras específicas, o el catálogo se
// sirve tras un handshake. Requiere una investigación propia (inspeccionar el
// tráfico real del navegador en tienda) antes de implementar.
//
// Cuando se resuelva, este módulo debe exportar un SuperIngester igual que
// mercadona.ts / consum.ts.

import type { NormalizedArticulo, ScrapeOptions, SuperIngester } from './types.ts';

export const carrefour: SuperIngester = {
  nombre: 'Carrefour',
  // eslint-disable-next-line require-yield
  async *scrape(_opts: ScrapeOptions): AsyncGenerator<NormalizedArticulo> {
    throw new Error(
      'Carrefour: ingesta no implementada todavía. Su API responde 403 ' +
        '(protección anti-bot); requiere recon propio. Ver scraping/src/supers/carrefour.ts.',
    );
  },
};
