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
        setError(err instanceof Error ? err.message : "Failed to fetch stores");
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
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
            PasaLey
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Find nearby stores in your area
          </p>
        </header>

        {/* Location Controls */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              {userLocation ? (
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  📍 Location enabled
                  <span className="mt-1 block text-xs text-gray-500">
                    Showing stores within {selectedRadius} km
                  </span>
                </div>
              ) : (
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Enable location to see nearby stores
                </div>
              )}
              {locationError && (
                <p className="mt-2 text-sm text-red-600">{locationError}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {userLocation && (
                <select
                  value={selectedRadius}
                  onChange={(e) => setSelectedRadius(Number(e.target.value))}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
                className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
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
          <div className="py-12 text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Loading stores...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-red-800 dark:text-red-200">Error: {error}</p>
          </div>
        )}

        {/* Stores List */}
        {!loading && !error && (
          <>
            {filteredStores.length === 0 ? (
              <div className="rounded-lg bg-white p-8 text-center shadow-md dark:bg-gray-800">
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
                      className="rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                            {store.name}
                          </h2>
                          {store.description && (
                            <p className="mb-2 text-gray-600 dark:text-gray-300">
                              {store.description}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            📍 {store.address}
                          </p>
                        </div>

                        {store.distance !== undefined && (
                          <div className="flex-shrink-0 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
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
