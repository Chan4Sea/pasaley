export type LatLng = { lat: number; lng: number };

/**
 * Calculate distance between two points using Haversine formula
 * @param a First coordinate
 * @param b Second coordinate
 * @returns Distance in kilometers
 */
export function haversine(a: LatLng, b: LatLng): number {
  const R = 6371; // Earth radius in kilometers
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const a1 =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a1), Math.sqrt(1 - a1));

  return R * c;
}

/**
 * Format distance in kilometers to a readable string
 * @param km Distance in kilometers
 * @returns Formatted string (e.g., "1.2 km" or "850 m")
 */
export function formatKm(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}
