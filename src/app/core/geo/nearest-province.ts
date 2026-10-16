// Approximate province lookup computed entirely in the browser: the user's
// coordinates never leave the device (see docs/README.md, "Legal y privacidad").
// It picks the province whose capital is closest, which can be wrong near a
// border; the province select stays editable for that case.

/** Capital coordinates [lat, lon] for each province name used by the app. */
const CAPITALES: Record<string, readonly [number, number]> = {
  'A Coruña': [43.3623, -8.4115],
  Álava: [42.8467, -2.6716],
  Albacete: [38.9943, -1.8585],
  Alicante: [38.3452, -0.481],
  Almería: [36.834, -2.4637],
  Asturias: [43.3614, -5.8494],
  Ávila: [40.6566, -4.6818],
  Badajoz: [38.8794, -6.9707],
  Baleares: [39.5696, 2.6502],
  Barcelona: [41.3874, 2.1686],
  Burgos: [42.3439, -3.6969],
  Cáceres: [39.4753, -6.3724],
  Cádiz: [36.5271, -6.2886],
  Cantabria: [43.4623, -3.81],
  Castellón: [39.9864, -0.0513],
  Ceuta: [35.8894, -5.3213],
  'Ciudad Real': [38.9848, -3.9274],
  Córdoba: [37.8882, -4.7794],
  Cuenca: [40.0704, -2.1374],
  Girona: [41.9794, 2.8214],
  Granada: [37.1773, -3.5986],
  Guadalajara: [40.6329, -3.1669],
  Guipúzcoa: [43.3183, -1.9812],
  Huelva: [37.2614, -6.9447],
  Huesca: [42.1401, -0.4089],
  Jaén: [37.7796, -3.7849],
  'La Rioja': [42.4627, -2.445],
  'Las Palmas': [28.1235, -15.4363],
  León: [42.5987, -5.5671],
  Lleida: [41.6176, 0.62],
  Lugo: [43.0097, -7.5568],
  Madrid: [40.4168, -3.7038],
  Málaga: [36.7213, -4.4214],
  Murcia: [37.9922, -1.1307],
  Navarra: [42.8125, -1.6458],
  Ourense: [42.3358, -7.8639],
  Palencia: [42.0095, -4.5241],
  Pontevedra: [42.431, -8.6444],
  Salamanca: [40.9701, -5.6635],
  'Santa Cruz de Tenerife': [28.4636, -16.2518],
  Segovia: [40.9429, -4.1088],
  Sevilla: [37.3891, -5.9845],
  Soria: [41.7666, -2.479],
  Tarragona: [41.1189, 1.2445],
  Teruel: [40.3456, -1.1065],
  Toledo: [39.8628, -4.0273],
  Valencia: [39.4699, -0.3763],
  Valladolid: [41.6523, -4.7245],
  Vizcaya: [43.263, -2.935],
  Zamora: [41.5034, -5.7467],
  Zaragoza: [41.6488, -0.8891],
};

/** Beyond this distance from every capital we assume the user is not in Spain. */
const MAX_DISTANCE_KM = 250;

function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

/** Province with the nearest capital, or null when the point is too far from Spain. */
export function nearestProvince(lat: number, lon: number): string | null {
  let best: string | null = null;
  let bestKm = Infinity;
  for (const [provincia, [cLat, cLon]] of Object.entries(CAPITALES)) {
    const km = distanceKm(lat, lon, cLat, cLon);
    if (km < bestKm) {
      bestKm = km;
      best = provincia;
    }
  }
  return bestKm <= MAX_DISTANCE_KM ? best : null;
}
