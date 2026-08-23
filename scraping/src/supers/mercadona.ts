// Ingester de Mercadona.
//
// API pública que consume su propia web (tienda.mercadona.es):
//   GET /api/categories/         -> árbol de categorías (2 niveles).
//   GET /api/categories/{id}/    -> categoría con products[] anidados.
//
// El precio vive en product.price_instructions:
//   - unit_price       -> PVP del producto (p. ej. "17.75").
//   - reference_price  -> precio por unidad de referencia, kg/L (p. ej. "3.550").
// Los precios de Mercadona son de ámbito nacional (varían por almacén, pero la
// API sin cookie de almacén devuelve el precio de referencia): MVP -> NACIONAL.

import { fetchJson } from '../http.ts';
import type { NormalizedArticulo, ScrapeOptions, SuperIngester } from './types.ts';

const BASE = 'https://tienda.mercadona.es/api';

interface MercadonaCategoryRef {
  id: number;
  name: string;
  categories?: MercadonaCategoryRef[];
}
interface MercadonaCategoriesRoot {
  results: MercadonaCategoryRef[];
}
interface MercadonaProduct {
  id: string | number;
  display_name: string;
  thumbnail?: string | null;
  categories?: { name: string }[];
  price_instructions?: {
    unit_price?: string;
    reference_price?: string;
    bulk_price?: string;
  };
}
interface MercadonaCategoryNode {
  name: string;
  products?: MercadonaProduct[];
  categories?: MercadonaCategoryNode[];
}

function normalize(
  p: MercadonaProduct,
  categoriaFallback: string,
  provincia: string,
): NormalizedArticulo | null {
  const pi = p.price_instructions;
  if (!pi || pi.unit_price == null) return null;

  const precio = Number.parseFloat(pi.unit_price);
  const ppuRaw = pi.reference_price ?? pi.bulk_price ?? pi.unit_price;
  const precioPorUnidad = Number.parseFloat(ppuRaw);
  if (!Number.isFinite(precio) || !Number.isFinite(precioPorUnidad)) return null;

  return {
    externalId: String(p.id),
    nombre: p.display_name,
    imagenUrl: p.thumbnail ?? null,
    supermercado: 'Mercadona',
    categoria: p.categories?.[0]?.name ?? categoriaFallback,
    precio,
    precioPorUnidad,
    provincia,
  };
}

function* walk(
  node: MercadonaCategoryNode,
  provincia: string,
): Generator<NormalizedArticulo> {
  for (const p of node.products ?? []) {
    const n = normalize(p, node.name, provincia);
    if (n) yield n;
  }
  for (const child of node.categories ?? []) {
    yield* walk(child, provincia);
  }
}

export const mercadona: SuperIngester = {
  nombre: 'Mercadona',
  async *scrape({ provincia }: ScrapeOptions): AsyncGenerator<NormalizedArticulo> {
    const root = await fetchJson<MercadonaCategoriesRoot>(`${BASE}/categories/`);

    // Ids de las subcategorías hoja (segundo nivel); cada detalle trae los
    // productos anidados.
    const leafIds: number[] = [];
    for (const top of root.results) {
      for (const sub of top.categories ?? []) leafIds.push(sub.id);
    }

    for (const id of leafIds) {
      const cat = await fetchJson<MercadonaCategoryNode>(`${BASE}/categories/${id}/`);
      yield* walk(cat, provincia);
    }
  },
};
