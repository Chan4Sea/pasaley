'use client';

import Link from 'next/link';
import { Package, MapPin } from 'lucide-react';
import { Product } from '@/lib/supabase';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const priceInCurrency = (product.price_cents / 100).toFixed(2);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden">
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
            NPR {priceInCurrency}
          </span>
          {product.unit && (
            <span className="text-sm text-gray-500">/ {product.unit}</span>
          )}
        </div>
        
        {product.store && (
          <Link
            href={`/store/${product.store.id}`}
            className="block mt-3 text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{product.store.name}</span>
            </div>
            {product.distance !== undefined && (
              <span className="text-xs text-gray-500 ml-4">
                {product.distance.toFixed(2)} km away
              </span>
            )}
          </Link>
        )}
        
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
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
