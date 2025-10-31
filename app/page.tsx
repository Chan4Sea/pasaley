"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Store = {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
};

export default function Home() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from("stores")
          .select("id, name, description, address")
          .eq("is_active", true)
          .limit(20);

        if (error) throw error;
        setStores(data || []);
      } catch (e: any) {
        setError(e.message || "Failed to load stores");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 p-6 text-gray-100">
      <h1 className="mb-4 text-3xl font-semibold">Nearby Stores</h1>

      {loading && <p>Loading…</p>}
      {error && <p className="text-red-400">Error: {error}</p>}

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stores.map((s) => (
          <li key={s.id} className="rounded-xl border border-gray-800 p-4">
            <h2 className="text-xl font-medium">{s.name}</h2>
            {s.description && (
              <p className="mt-1 text-sm text-gray-400">{s.description}</p>
            )}
            {s.address && (
              <p className="mt-1 text-sm text-gray-500">{s.address}</p>
            )}
          </li>
        ))}
      </ul>

      {!loading && stores.length === 0 && (
        <p className="mt-4 text-gray-400">No stores yet.</p>
      )}
    </main>
  );
}
