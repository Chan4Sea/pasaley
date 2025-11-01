'use client';

import { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { supabase, Store } from '@/lib/supabase';
import { calculateDistance, getCurrentLocation, DEFAULT_LOCATION, Coordinates } from '@/lib/geolocation';
import { Loader2, AlertCircle, MapPin } from 'lucide-react';
import Link from 'next/link';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
};

export default function MapPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [radiusFilter, setRadiusFilter] = useState<number>(10);
  const [mapCenter, setMapCenter] = useState<Coordinates>(DEFAULT_LOCATION);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [isLocating, setIsLocating] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  useEffect(() => {
    initLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchStores();
    }
  }, [userLocation, radiusFilter]);

  const initLocation = async () => {
    setIsLocating(true);
    setError(null);
    
    try {
      console.log('Attempting to get user location...');
      const location = await getCurrentLocation();
      console.log('User location obtained:', location);
      
      setUserLocation(location);
      setMapCenter(location);
      setLocationPermission('granted');
      
      // Show success message briefly
      setTimeout(() => {
        setError(null);
      }, 3000);
      
    } catch (err) {
      console.warn('Using default location:', err);
      setUserLocation(DEFAULT_LOCATION);
      setMapCenter(DEFAULT_LOCATION);
      
      // Determine permission status
      if (err instanceof Error) {
        if (err.message.includes('denied')) {
          setLocationPermission('denied');
          setError('Location access denied. Please enable location permissions in your browser and try again.');
        } else if (err.message.includes('unavailable')) {
          setLocationPermission('denied');
          setError('Location information unavailable. Using default location.');
        } else {
          setLocationPermission('prompt');
          setError(err.message);
        }
      } else {
        setLocationPermission('denied');
        setError('Unable to get your location. Using default location.');
      }
    } finally {
      setIsLocating(false);
    }
  };

  const fetchStores = async () => {
    if (!userLocation) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('stores')
        .select('*')
        .eq('is_active', true);

      if (fetchError) throw fetchError;

      // Calculate distances and filter by radius
      const storesWithDistance = (data || [])
        .map((store) => ({
          ...store,
          distance: calculateDistance(userLocation, {
            lat: store.lat,
            lng: store.lng,
          }),
        }))
        .filter((store) => store.distance <= radiusFilter);

      setStores(storesWithDistance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-800">Error loading maps</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="relative h-screen">
      {/* Map Container */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={13}
        options={mapOptions}
      >
        {/* User Location Marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
              scale: 8,
              fillColor: '#4F46E5',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }}
          />
        )}

        {/* Store Markers */}
        {stores.map((store) => (
          <Marker
            key={store.id}
            position={{ lat: store.lat, lng: store.lng }}
            onClick={() => setSelectedStore(store)}
          />
        ))}

        {/* Info Window */}
        {selectedStore && (
          <InfoWindow
            position={{ lat: selectedStore.lat, lng: selectedStore.lng }}
            onCloseClick={() => setSelectedStore(null)}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-semibold text-gray-900 mb-1">
                {selectedStore.name}
              </h3>
              {selectedStore.description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {selectedStore.description}
                </p>
              )}
              {selectedStore.address && (
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {selectedStore.address}
                </p>
              )}
              {selectedStore.distance !== undefined && (
                <p className="text-xs text-green-700 font-medium mb-3">
                  {selectedStore.distance.toFixed(2)} km away
                </p>
              )}
              <Link
                href={`/store/${selectedStore.id}`}
                className="inline-block w-full text-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
              >
                View Store
              </Link>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Floating Controls Overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
        <div className="w-[min(900px,92vw)] mx-auto mt-4 pointer-events-auto">
          <div className="bg-white rounded-lg shadow-lg p-4">
            {/* Compact Header Row */}
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-lg font-bold text-gray-900">Store Locator</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                {stores.length} stores
              </span>
            </div>

            {/* Radius Selector Row */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Search Radius:
              </label>
              <select
                value={radiusFilter}
                onChange={(e) => setRadiusFilter(Number(e.target.value))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={2}>2 km</option>
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={20}>20 km</option>
              </select>
            </div>

            {/* Location Status & Error Message */}
            {(error || locationPermission === 'denied') && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-800">
                    {error || 'Location access required for nearby stores'}
                  </p>
                </div>
                {locationPermission === 'denied' && (
                  <button
                    onClick={initLocation}
                    className="w-full px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
                    disabled={isLocating}
                  >
                    {isLocating ? 'Retrying...' : 'Try Again'}
                  </button>
                )}
              </div>
            )}
            
            {/* Location Permission Granted */}
            {locationPermission === 'granted' && userLocation && !isLocating && (
              <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-800">
                  Location set ✓ 
                  <span className="text-xs text-green-600 ml-1">
                    ({userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)})
                  </span>
                </p>
              </div>
            )}
            
            {/* Loading Location */}
            {isLocating && (
              <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  Getting your location...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20 pointer-events-none">
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm text-gray-600">Loading stores...</p>
          </div>
        </div>
      )}
    </div>
  );
}
