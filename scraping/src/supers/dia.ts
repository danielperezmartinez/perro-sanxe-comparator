// Ingester de Dia.
//
// API pública que consume su propia web (www.dia.es). El listado por categoría
// vive en el servicio `plp-back`:
//   GET /api/v1/plp-back/l1/all/{L1}/reduced?category_id={L1}&page={n}
//     -> { items[], pagination{page_number,page_size,total_pages,next_url}, total_items, ... }
//
// Truco de enumeración: usando el MISMO id de categoría de primer nivel (L1)
// tanto en la ruta como en `category_id`, el endpoint devuelve el nodo "Todo X"
// (todos los productos de esa categoría de primer nivel), sin tener que iterar
// subcategorías. Recorriendo las ~31 categorías L1 se cubre el catálogo entero.
//
// El precio vive en item.prices:
//   - price          -> PVP del producto (p. ej. 0.96 == 0,96 €).
//   - price_per_unit -> precio por unidad de referencia (kg/L).
//   - measure_unit   -> LITRO / KILO / UNIDAD...
// external_id = item.sku_id (== object_id, la SKU). La imagen es relativa
// (/product_images/...), se le antepone el host. Los precios de Dia se
// geolocalizan por código postal (por defecto Madrid, CP 28041); para el MVP se
// registran como NACIONAL igual que Mercadona.

import { fetchJson } from '../http.ts';
import type { NormalizedArticulo, ScrapeOptions, SuperIngester } from './types.ts';

const BASE = 'https://www.dia.es';
const PAGE_SIZE = 20;
// Tope de seguridad por categoría para no colgarse si la paginación no termina.
const MAX_PAGES = 1000;

/**
 * Categorías de primer nivel (L1) de Dia, tomadas del árbol de navegación de
 * tienda (menú "Productos") el 2026-08-23. Son departamentos estables; si Dia
 * añade o quita una categoría de primer nivel habría que refrescar esta lista
 * (el `run` avisa por consola de cuántas categorías recorre). Las categorías
 * transversales (Novedades, Ofertas, Sin gluten...) solapan con las reales; el
 * dedup por (supermercado, external_id) del orquestador las resuelve.
 */
const CATEGORIAS_L1: { id: string; nombre: string }[] = [
  { id: 'L105', nombre: 'Frutas' },
  { id: 'L104', nombre: 'Verduras' },
  { id: 'L102', nombre: 'Carnes' },
  { id: 'L103', nombre: 'Pescados y mariscos' },
  { id: 'L134', nombre: 'Charcutería' },
  { id: 'L101', nombre: 'Quesos' },
  { id: 'L108', nombre: 'Huevos, leche y mantequilla' },
  { id: 'L112', nombre: 'Panadería' },
  { id: 'L113', nombre: 'Yogures y postres' },
  { id: 'L119', nombre: 'Congelados y helados' },
  { id: 'L106', nombre: 'Arroz, pastas y legumbres' },
  { id: 'L107', nombre: 'Aceites, salsas y especias' },
  { id: 'L114', nombre: 'Conservas, caldos y cremas' },
  { id: 'L109', nombre: 'Café, cacao e infusiones' },
  { id: 'L132', nombre: 'Bollería, repostería y azúcar' },
  { id: 'L111', nombre: 'Galletas, cereales y mermeladas' },
  { id: 'L110', nombre: 'Chocolates y golosinas' },
  { id: 'L116', nombre: 'Platos preparados y pizzas' },
  { id: 'L115', nombre: 'Aperitivos y frutos secos' },
  { id: 'L117', nombre: 'Agua y refrescos' },
  { id: 'L127', nombre: 'Zumos y smoothies' },
  { id: 'L118', nombre: 'Cervezas, vinos y licores' },
  { id: 'L122', nombre: 'Limpieza y hogar' },
  { id: 'L129', nombre: 'Higiene y cuidado del cuerpo' },
  { id: 'L130', nombre: 'Cabello y perfumería' },
  { id: 'L131', nombre: 'Salud y parafarmacia' },
  { id: 'L120', nombre: 'Infantil' },
  { id: 'L123', nombre: 'Mascotas' },
];

interface DiaItem {
  sku_id?: string | number;
  object_id?: string | number;
  display_name?: string;
  image?: string | null;
  prices?: {
    price?: number;
    price_per_unit?: number;
    measure_unit?: string;
  };
}
interface DiaPlpPage {
  items?: DiaItem[];
  pagination?: { page_size?: number; next_url?: string | null };
  total_items?: number;
}

function normalize(item: DiaItem, categoria: string, provincia: string): NormalizedArticulo | null {
  const p = item.prices;
  const id = item.sku_id ?? item.object_id;
  if (!p || p.price == null || id == null) return null;

  const precio = Number(p.price);
  const precioPorUnidad = Number(p.price_per_unit ?? p.price);
  if (!Number.isFinite(precio) || !Number.isFinite(precioPorUnidad)) return null;

  const nombre = item.display_name;
  if (!nombre) return null;

  // La imagen llega relativa (/product_images/...); se sirve desde el host web.
  const imagenUrl = item.image ? (item.image.startsWith('http') ? item.image : `${BASE}${item.image}`) : null;

  return {
    externalId: String(id),
    nombre,
    imagenUrl,
    supermercado: 'Dia',
    categoria,
    precio,
    precioPorUnidad,
    provincia,
  };
}

export const dia: SuperIngester = {
  nombre: 'Dia',
  async *scrape({ provincia }: ScrapeOptions): AsyncGenerator<NormalizedArticulo> {
    for (const cat of CATEGORIAS_L1) {
      for (let page = 1; page <= MAX_PAGES; page++) {
        const url =
          `${BASE}/api/v1/plp-back/l1/all/${cat.id}/reduced` +
          `?category_id=${cat.id}&page=${page}`;
        const data = await fetchJson<DiaPlpPage>(url);
        const items = data.items ?? [];
        if (items.length === 0) break;

        for (const item of items) {
          const n = normalize(item, cat.nombre, provincia);
          if (n) yield n;
        }

        // Fin de la categoría: página incompleta o sin siguiente enlace.
        if (items.length < PAGE_SIZE || !data.pagination?.next_url) break;
      }
    }
  },
};
