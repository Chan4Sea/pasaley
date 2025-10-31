"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { haversine, formatKm, type LatLng } from "@/lib/geo";

type Store = {
  id: string;
  name: string;
  description: string | null;
  address: string;
  lat: number;
  lng: number;
  distance?: number;
};

const RADIUS_OPTIONS = [2, 5, 10, 20] as const;

export default function Home() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedRadius, setSelectedRadius] = useState<number>(5);

  // Fetch stores from Supabase
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from("stores")
          .select("id, name, description, address, lat, lng")
          .eq("is_active", true);

        if (fetchError) throw fetchError;

        setStores(data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch stores"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  // Request user's current location
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationLoading(false);
      },
      (error) => {
        let errorMessage = "Failed to get your location";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = "Location permission denied";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = "Location information unavailable";
        } else if (error.code === error.TIMEOUT) {
          errorMessage = "Location request timed out";
        }
        setLocationError(errorMessage);
        setLocationLoading(false);
      }
    );
  };

  // Filter and sort stores by distance
  const filteredStores = (() => {
    if (!userLocation) {
      return stores;
    }

    const storesWithDistance = stores.map((store) => ({
      ...store,
      distance: haversine(userLocation, { lat: store.lat, lng: store.lng }),
    }));

    return storesWithDistance
      .filter((store) => store.distance! <= selectedRadius)
      .sort((a, b) => a.distance! - b.distance!);
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            PasaLey
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Find nearby stores in your area
          </p>
        </header>

        {/* Location Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1">
              {userLocation ? (
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  📍 Location enabled
                  <span className="block text-xs text-gray-500 mt-1">
                    Showing stores within {selectedRadius} km
                  </span>
                </div>
              ) : (
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Enable location to see nearby stores
                </div>
              )}
              {locationError && (
                <p className="text-sm text-red-600 mt-2">{locationError}</p>
              )}
            </div>

            <div className="flex gap-3 items-center flex-wrap">
              {userLocation && (
                <select
                  value={selectedRadius}
                  onChange={(e) => setSelectedRadius(Number(e.target.value))}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {RADIUS_OPTIONS.map((radius) => (
                    <option key={radius} value={radius}>
                      {radius} km
                    </option>
                  ))}
                </select>
              )}

              <button
                onClick={requestLocation}
                disabled={locationLoading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {locationLoading
                  ? "Getting location..."
                  : userLocation
                    ? "Refresh location"
                    : "Use my location"}
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Loading stores...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-200">Error: {error}</p>
          </div>
        )}

        {/* Stores List */}
        {!loading && !error && (
          <>
            {filteredStores.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  {userLocation
                    ? `No stores found within ${selectedRadius} km of your location`
                    : "No active stores available"}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  Showing {filteredStores.length}{" "}
                  {filteredStores.length === 1 ? "store" : "stores"}
                </div>

                <div className="space-y-4">
                  {filteredStores.map((store) => (
                    <div
                      key={store.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {store.name}
                          </h2>
                          {store.description && (
                            <p className="text-gray-600 dark:text-gray-300 mb-2">
                              {store.description}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            📍 {store.address}
                          </p>
                        </div>

                        {store.distance !== undefined && (
                          <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium">
                            {formatKm(store.distance)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
