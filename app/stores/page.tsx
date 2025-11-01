'use client';

import { useEffect, useState } from 'react';
import { supabase, Store } from '@/lib/supabase';
import { calculateDistance, getCurrentLocation, DEFAULT_LOCATION, Coordinates } from '@/lib/geolocation';
import StoreCard from '@/components/StoreCard';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [radiusFilter, setRadiusFilter] = useState<number>(10); // km

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
    } catch (err) {
      console.warn('Using default location:', err);
      setUserLocation(DEFAULT_LOCATION);
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
        .filter((store) => store.distance <= radiusFilter)
        .sort((a, b) => a.distance - b.distance);

      setStores(storesWithDistance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Nearby Stores
        </h1>
        {userLocation && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>
              {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </span>
          </div>
        )}
      </div>

      {/* Radius Filter */}
      <div className="mb-6 flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">
          Within radius:
        </label>
        <select
          value={radiusFilter}
          onChange={(e) => setRadiusFilter(Number(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={2}>2 km</option>
          <option value={5}>5 km</option>
          <option value={10}>10 km</option>
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Store Grid */}
      {!loading && !error && (
        <>
          {stores.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No stores found within {radiusFilter} km
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-4">
                Found {stores.length} store{stores.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stores.map((store) => (
                  <StoreCard key={store.id} store={store} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
