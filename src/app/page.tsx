'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Loader2 } from 'lucide-react';
import { useLocations } from '@/hooks/useLocations';
import LocationCard from '@/components/ui/LocationCard';
import FilterBar from '@/components/ui/FilterBar';

const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-zinc-100 rounded-xl">
      <Loader2 className="animate-spin text-zinc-400" size={32} />
    </div>
  ),
});

export default function HomePage() {
  const { locations, loading, error, filters, setFilters } = useLocations();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-zinc-50">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-zinc-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
            <MapPin size={14} className="text-white" />
          </div>
          <span className="font-bold text-zinc-900 tracking-tight">CaminhoFit</span>
          <span className="text-xs text-zinc-400 hidden sm:inline">Teresina · PI</span>
        </div>

        {/* Toggle mobile */}
        <button
          onClick={() => setShowMap(!showMap)}
          className="text-xs px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-colors sm:hidden"
        >
          {showMap ? 'Ver lista' : 'Ver mapa'}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — sempre visível em sm+ */}
        <aside className={`${showMap ? 'hidden' : 'flex'} sm:flex flex-col w-full sm:w-80 lg:w-96 bg-white border-r border-zinc-200 overflow-hidden`}>
          <div className="p-4 border-b border-zinc-100">
            <FilterBar filters={filters} onChange={setFilters} total={locations.length} />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-zinc-400" size={24} />
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}

            {!loading && !error && locations.length === 0 && (
              <p className="text-center py-12 text-zinc-400 text-sm">
                Nenhum local encontrado.
              </p>
            )}

            {locations.map((loc) => (
              <LocationCard
                key={loc.id}
                location={loc}
                isSelected={selectedId === loc.id}
                onClick={() => {
                  setSelectedId(loc.id);
                  setShowMap(true);
                }}
              />
            ))}
          </div>
        </aside>

        {/* Mapa */}
        <main className={`${showMap ? 'flex' : 'hidden'} sm:flex flex-1 p-3`}>
          <MapView
            locations={locations}
            selectedId={selectedId}
            onSelectLocation={(id) => {
              setSelectedId(id);
              setShowMap(false);
            }}
          />
        </main>
      </div>
    </div>
  );
}