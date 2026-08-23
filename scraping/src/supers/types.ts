// Contratos compartidos por todos los ingesters de supermercado.

/**
 * Un artículo ya normalizado al esquema de la aplicación, listo para escribir.
 * `precio` es el PVP del producto; `precioPorUnidad` es el precio de referencia
 * por kg/L. `provincia` es 'NACIONAL' en el MVP.
 */
export interface NormalizedArticulo {
  externalId: string;
  nombre: string;
  imagenUrl: string | null;
  supermercado: string;
  categoria: string;
  precio: number;
  precioPorUnidad: number;
  provincia: string;
}

export interface ScrapeOptions {
  /** Provincia objetivo; si no se indica, se usa 'NACIONAL'. */
  provincia: string;
}

/**
 * Un ingester emite artículos normalizados en streaming. Async generator para
 * no cargar en memoria el catálogo entero (Mercadona/Consum rondan los ~10-20k
 * productos).
 */
export interface SuperIngester {
  readonly nombre: string;
  scrape(opts: ScrapeOptions): AsyncGenerator<NormalizedArticulo>;
}
