import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Store {
  id: string;
  name: string;
  description: string | null;
  lat: number;
  lng: number;
  address: string | null;
  is_active: boolean;
  created_at: string;
  distance?: number;
}

export interface Product {
  id: string;
  store_id: string;
  name: string;
  price_cents: number;
  unit: string | null;
  image_url: string | null;
  in_stock: boolean;
  updated_at: string;
  store?: Store;
  distance?: number;
}
