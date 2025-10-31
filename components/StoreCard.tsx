'use client';

import Link from 'next/link';
import { MapPin, Store as StoreIcon } from 'lucide-react';
import { Store } from '@/lib/supabase';

interface StoreCardProps {
  store: Store;
}

export default function StoreCard({ store }: StoreCardProps) {
  return (
    <Link href={`/store/${store.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer border border-gray-200">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <StoreIcon className="w-6 h-6 text-blue-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 truncate">
              {store.name}
            </h3>
            
            {store.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                {store.description}
              </p>
            )}
            
            {store.address && (
              <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{store.address}</span>
              </div>
            )}
            
            {store.distance !== undefined && (
              <div className="mt-2">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                  {store.distance.toFixed(2)} km away
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
