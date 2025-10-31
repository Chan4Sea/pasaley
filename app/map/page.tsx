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
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
      setMapCenter(location);
    } catch (err) {
      console.warn('Using default location:', err);
      setUserLocation(DEFAULT_LOCATION);
      setMapCenter(DEFAULT_LOCATION);
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

      {/* Controls Overlay - Improved positioning to handle browser overlays */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-col gap-3">
        {/* Header - Compact design to avoid overlaps */}
        <div className="bg-white rounded-lg shadow-lg p-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900">Store Locator</h1>
            {userLocation && (
              <div className="text-xs text-gray-500">
                {userLocation.lat.toFixed(3)}, {userLocation.lng.toFixed(3)}
              </div>
            )}
          </div>
        </div>

        {/* Radius Filter - Compact layout to avoid overlaps */}
        <div className="bg-white rounded-lg shadow-lg p-3 flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Radius:
          </label>
          <select
            value={radiusFilter}
            onChange={(e) => setRadiusFilter(Number(e.target.value))}
            className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={2}>2 km</option>
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
          </select>
          <div className="ml-auto">
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
              {stores.length} stores
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
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
