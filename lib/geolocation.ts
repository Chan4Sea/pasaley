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

    // Always try high accuracy first, regardless of device type
    // Modern browsers handle GPS vs IP-based positioning automatically
    const options: PositionOptions = {
      enableHighAccuracy: true, // Always request highest accuracy
      timeout: 15000, // 15 seconds timeout for better accuracy
      maximumAge: 300000, // Accept cached location up to 5 minutes old
    };

    // Try to get position with high accuracy first
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Validate coordinate ranges
        if (
          position.coords.latitude >= -90 && position.coords.latitude <= 90 &&
          position.coords.longitude >= -180 && position.coords.longitude <= 180
        ) {
          console.log('Geolocation success:', {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(position.timestamp).toISOString()
          });
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        } else {
          reject(new Error('Invalid coordinates received'));
        }
      },
      (error) => {
        console.warn('Geolocation error:', error);
        
        // If high accuracy fails, try with lower accuracy as fallback
        const fallbackOptions: PositionOptions = {
          enableHighAccuracy: false, // Fallback to lower accuracy
          timeout: 10000, // Shorter timeout for fallback
          maximumAge: 600000, // Accept any cached location (10 minutes)
        };

        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Validate coordinate ranges
            if (
              position.coords.latitude >= -90 && position.coords.latitude <= 90 &&
              position.coords.longitude >= -180 && position.coords.longitude <= 180
            ) {
              console.log('Geolocation fallback success:', {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: new Date(position.timestamp).toISOString()
              });
              resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            } else {
              reject(new Error('Invalid coordinates received from fallback'));
            }
          },
          (fallbackError) => {
            console.error('Geolocation fallback also failed:', fallbackError);
            // Provide more specific error messages
            let errorMessage = 'Location access failed';
            switch (fallbackError.code) {
              case fallbackError.PERMISSION_DENIED:
                errorMessage = 'Location access denied. Please enable location permissions in your browser settings.';
                break;
              case fallbackError.POSITION_UNAVAILABLE:
                errorMessage = 'Location information unavailable. Please check your location settings.';
                break;
              case fallbackError.TIMEOUT:
                errorMessage = 'Location request timed out. Please try again.';
                break;
              default:
                errorMessage = 'Unable to get your location. Please enable location access or try again.';
                break;
            }
            reject(new Error(errorMessage));
          },
          fallbackOptions
        );
      },
      options
    );
  });
}

// Default location (Kathmandu city center) if geolocation fails
export const DEFAULT_LOCATION: Coordinates = {
  lat: 27.7172,
  lng: 85.324,
};
