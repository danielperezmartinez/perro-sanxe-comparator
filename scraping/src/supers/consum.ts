// Ingester de Consum.
//
// API pública que consume su propia web (tienda.consum.es):
//   GET /api/rest/V1.0/catalog/product?limit=&offset=
//     -> { totalCount, hasMore, products[] }
//
// El precio vive en product.priceData.prices[0].value:
//   - centAmount      -> PVP en euros (el nombre engaña; 1.15 == 1,15 €).
//   - centUnitAmount  -> precio por unidad de referencia (kg/L).
// external_id = product.code (SKU). MVP -> NACIONAL.

import { fetchJson } from '../http.ts';
import type { NormalizedArticulo, ScrapeOptions, SuperIngester } from './types.ts';

const BASE = 'https://tienda.consum.es/api/rest/V1.0/catalog/product';
const PAGE = 100;

interface ConsumProduct {
  code?: string | number;
  productData?: { name?: string; imageURL?: string | null };
  priceData?: {
    prices?: { value?: { centAmount?: number; centUnitAmount?: number } }[];
  };
  categories?: { name?: string }[];
}
interface ConsumPage {
  totalCount: number;
  hasMore: boolean;
  products: ConsumProduct[];
}

function normalize(p: ConsumProduct, provincia: string): NormalizedArticulo | null {
  const value = p.priceData?.prices?.[0]?.value;
  if (!value || value.centAmount == null || p.code == null) return null;

  const precio = Number(value.centAmount);
  const precioPorUnidad = Number(value.centUnitAmount ?? value.centAmount);
  if (!Number.isFinite(precio) || !Number.isFinite(precioPorUnidad)) return null;

  const nombre = p.productData?.name;
  if (!nombre) return null;

  return {
    externalId: String(p.code),
    nombre,
    imagenUrl: p.productData?.imageURL ?? null,
    supermercado: 'Consum',
    categoria: p.categories?.[0]?.name ?? '',
    precio,
    precioPorUnidad,
    provincia,
  };
}

export const consum: SuperIngester = {
  nombre: 'Consum',
  async *scrape({ provincia }: ScrapeOptions): AsyncGenerator<NormalizedArticulo> {
    let offset = 0;
    let hasMore = true;
    while (hasMore) {
      const page = await fetchJson<ConsumPage>(`${BASE}?limit=${PAGE}&offset=${offset}`);
      for (const p of page.products ?? []) {
        const n = normalize(p, provincia);
        if (n) yield n;
      }
      hasMore = Boolean(page.hasMore) && (page.products?.length ?? 0) > 0;
      offset += PAGE;
    }
  },
};
