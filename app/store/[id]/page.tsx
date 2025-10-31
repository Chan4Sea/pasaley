'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase, Store, Product } from '@/lib/supabase';
import { calculateDistance, getCurrentLocation, DEFAULT_LOCATION, Coordinates } from '@/lib/geolocation';
import { MapPin, Store as StoreIcon, Loader2, AlertCircle, ArrowLeft, Package } from 'lucide-react';
import Link from 'next/link';

export default function StorePage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.id as string;

  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

  useEffect(() => {
    initLocation();
  }, []);

  useEffect(() => {
    if (userLocation && storeId) {
      fetchStoreData();
    }
  }, [userLocation, storeId]);

  const initLocation = async () => {
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
    } catch (err) {
      console.warn('Using default location:', err);
      setUserLocation(DEFAULT_LOCATION);
    }
  };

  const fetchStoreData = async () => {
    if (!userLocation) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch store details
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select('*')
        .eq('id', storeId)
        .single();

      if (storeError) throw storeError;

      const distance = calculateDistance(userLocation, {
        lat: storeData.lat,
        lng: storeData.lng,
      });

      setStore({ ...storeData, distance });

      // Fetch store products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeId);

      if (productsError) throw productsError;

      setProducts(productsData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch store data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800">{error || 'Store not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Store Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
            <StoreIcon className="w-8 h-8 text-blue-600" />
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {store.name}
            </h1>

            {store.description && (
              <p className="text-gray-600 mb-3">{store.description}</p>
            )}

            <div className="flex flex-wrap gap-4">
              {store.address && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{store.address}</span>
                </div>
              )}

              {store.distance !== undefined && (
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded">
                    {store.distance.toFixed(2)} km away
                  </span>
                </div>
              )}
            </div>

            {/* View on Map */}
            <Link
              href={`/map?store=${store.id}`}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              View on Map
            </Link>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Products ({products.length})
        </h2>

        {products.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No products available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
              >
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="w-16 h-16 text-gray-400" />
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {product.name}
                  </h3>

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-xl font-bold text-blue-600">
                      NPR {(product.price_cents / 100).toFixed(2)}
                    </span>
                    {product.unit && (
                      <span className="text-sm text-gray-500">/ {product.unit}</span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        product.in_stock
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>

                    <button
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!product.in_stock}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
