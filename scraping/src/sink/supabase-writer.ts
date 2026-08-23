// Escritura en Supabase con la clave service_role (salta RLS).
//
// Por lote:
//   1. Upsert en `articulos` con onConflict (supermercado, external_id).
//   2. Regla de oro: consultar el último precio de cada artículo en la provincia
//      (RPC ultimos_precios) e insertar en `precios_historico` SOLO si cambió el
//      precio o el precio por unidad. Ver docs/README.md, "Regla de oro".

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { NormalizedArticulo } from '../supers/types.ts';

// Tolerancia al comparar precios (numeric de Postgres); cent-safe.
const EPSILON = 0.0001;

export interface WriteStats {
  articulosUpsert: number;
  preciosNuevos: number;
  preciosSinCambio: number;
}

export function nuevasStats(): WriteStats {
  return { articulosUpsert: 0, preciosNuevos: 0, preciosSinCambio: 0 };
}

interface ArticuloRow {
  id: string;
  external_id: string;
  supermercado: string;
}
interface UltimoPrecioRow {
  articulo_id: string;
  precio: number;
  precio_por_unidad: number;
}

const key = (supermercado: string, externalId: string) => `${supermercado}|${externalId}`;

export class SupabaseWriter {
  private client: SupabaseClient;

  constructor(url: string, serviceRoleKey: string) {
    this.client = createClient(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  async writeBatch(
    items: NormalizedArticulo[],
    provincia: string,
    stats: WriteStats,
  ): Promise<void> {
    if (items.length === 0) return;
    const now = new Date().toISOString();

    // 1. Upsert de artículos.
    const rows = items.map((i) => ({
      external_id: i.externalId,
      nombre: i.nombre,
      imagen_url: i.imagenUrl,
      supermercado: i.supermercado,
      categoria: i.categoria,
      ultima_actualizacion: now,
    }));
    const { data: upserted, error } = await this.client
      .from('articulos')
      .upsert(rows, { onConflict: 'supermercado,external_id' })
      .select('id, external_id, supermercado');
    if (error) throw new Error(`upsert articulos: ${error.message}`);
    const articulos = (upserted ?? []) as ArticuloRow[];
    stats.articulosUpsert += articulos.length;

    const idByKey = new Map<string, string>();
    for (const a of articulos) idByKey.set(key(a.supermercado, a.external_id), a.id);

    // 2. Regla de oro: último precio conocido por artículo en la provincia.
    const ids = articulos.map((a) => a.id);
    const { data: ultimos, error: errUlt } = await this.client.rpc('ultimos_precios', {
      p_articulo_ids: ids,
      p_provincia: provincia,
    });
    if (errUlt) throw new Error(`rpc ultimos_precios: ${errUlt.message}`);
    const lastByArticulo = new Map<string, UltimoPrecioRow>();
    for (const r of (ultimos ?? []) as UltimoPrecioRow[]) lastByArticulo.set(r.articulo_id, r);

    const toInsert: {
      articulo_id: string;
      precio: number;
      precio_por_unidad: number;
      provincia: string;
    }[] = [];

    for (const i of items) {
      const articuloId = idByKey.get(key(i.supermercado, i.externalId));
      if (!articuloId) continue;
      const prev = lastByArticulo.get(articuloId);
      const changed =
        !prev ||
        Math.abs(Number(prev.precio) - i.precio) > EPSILON ||
        Math.abs(Number(prev.precio_por_unidad) - i.precioPorUnidad) > EPSILON;
      if (changed) {
        toInsert.push({
          articulo_id: articuloId,
          precio: i.precio,
          precio_por_unidad: i.precioPorUnidad,
          provincia,
        });
        stats.preciosNuevos++;
      } else {
        stats.preciosSinCambio++;
      }
    }

    if (toInsert.length > 0) {
      const { error: errIns } = await this.client.from('precios_historico').insert(toInsert);
      if (errIns) throw new Error(`insert precios_historico: ${errIns.message}`);
    }
  }
}
