// Configuración compartida del scraping.

/** Provincia por defecto cuando no se pasa --localidad (MVP: precios nacionales). */
export const PROVINCIA_DEFECTO = 'NACIONAL';

/** Tamaño de lote para upsert de artículos e inserts de precios. */
export const BATCH_SIZE = 500;

/**
 * Provincias de España, para el futuro desglose por provincia. Hoy no se usa
 * (toda la ingesta va a PROVINCIA_DEFECTO); queda documentado para cuando se
 * mapee almacén/CP -> provincia en cada super.
 */
export const PROVINCIAS = [
  'A Coruña', 'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila',
  'Badajoz', 'Barcelona', 'Bizkaia', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria',
  'Castellón', 'Ciudad Real', 'Córdoba', 'Cuenca', 'Gipuzkoa', 'Girona',
  'Granada', 'Guadalajara', 'Huelva', 'Huesca', 'Illes Balears', 'Jaén',
  'La Rioja', 'Las Palmas', 'León', 'Lleida', 'Lugo', 'Madrid', 'Málaga',
  'Murcia', 'Navarra', 'Ourense', 'Palencia', 'Pontevedra', 'Salamanca',
  'Santa Cruz de Tenerife', 'Segovia', 'Sevilla', 'Soria', 'Tarragona',
  'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Zamora', 'Zaragoza',
] as const;
