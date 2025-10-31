export interface Coordinates {
  lat: number;
  lng: number;
}

// Haversine formula to calculate distance between two coordinates in kilometers
export function calculateDistance(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(coord2.lat - coord1.lat);
  const dLng = toRadians(coord2.lng - coord1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.lat)) *
      Math.cos(toRadians(coord2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Get user's current location with improved accuracy
export function getCurrentLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    // Detect if user is on mobile for better accuracy settings
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    const options: PositionOptions = {
      enableHighAccuracy: isMobile, // High accuracy only on mobile (GPS)
      timeout: isMobile ? 15000 : 10000, // Longer timeout on mobile
      maximumAge: isMobile ? 60000 : 300000, // Cache location longer on mobile
    };

    // Try to get high accuracy position first, fallback to basic if it fails
    const tryGetPosition = (enableHighAccuracy: boolean) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Validate coordinate ranges
          if (
            position.coords.latitude >= -90 && position.coords.latitude <= 90 &&
            position.coords.longitude >= -180 && position.coords.longitude <= 180
          ) {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          } else {
            reject(new Error('Invalid coordinates received'));
          }
        },
        (error) => {
          if (enableHighAccuracy) {
            // Try again with lower accuracy
            tryGetPosition(false);
          } else {
            reject(error);
          }
        },
        { ...options, enableHighAccuracy }
      );
    };

    tryGetPosition(true);
  });
}

// Default location (Kathmandu city center) if geolocation fails
export const DEFAULT_LOCATION: Coordinates = {
  lat: 27.7172,
  lng: 85.324,
};
