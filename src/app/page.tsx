'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, List, Map, Loader2 } from 'lucide-react';
import { useLocations } from '@/hooks/useLocations';
import LocationCard from '@/components/ui/LocationCard';
import FilterBar from '@/components/ui/FilterBar';

const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-zinc-100 rounded-2xl">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="animate-spin text-green-500" size={28} />
        <span className="text-sm text-zinc-400">Carregando mapa...</span>
      </div>
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
      <header className="flex items-center justify-between px-5 py-3.5 bg-white border-b border-zinc-100 shadow-sm z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center shadow-sm">
            <MapPin size={15} className="text-white" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-zinc-900 tracking-tight text-lg">CaminhoFit</span>
            <span className="text-xs text-zinc-400 hidden sm:inline">Teresina · PI</span>
          </div>
        </div>

        {/* Toggle mobile */}
        <button
          onClick={() => setShowMap(!showMap)}
          className="sm:hidden flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-colors active:scale-95"
        >
          {showMap
            ? <><List size={13} /> Ver lista</>
            : <><Map size={13} /> Ver mapa</>
          }
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className={`
          ${showMap ? 'hidden' : 'flex'} sm:flex
          flex-col w-full sm:w-80 lg:w-96
          bg-white border-r border-zinc-100
          overflow-hidden
        `}>

          {/* Filtros */}
          <div className="px-4 py-3 border-b border-zinc-100 bg-white">
            <FilterBar
              filters={filters}
              onChange={setFilters}
              total={locations.length}
            />
          </div>

          {/* Lista */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {loading && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="animate-spin text-green-500" size={24} />
                <span className="text-sm text-zinc-400">Buscando locais...</span>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                Erro ao carregar locais. Tente novamente.
              </div>
            )}

            {!loading && !error && locations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 gap-2">
                <span className="text-3xl">🗺️</span>
                <p className="text-sm text-zinc-400 text-center">
                  Nenhum local encontrado para este filtro.
                </p>
              </div>
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
          <div className="w-full h-full min-h-0 rounded-2xl overflow-hidden shadow-sm">
            <MapView
              locations={locations}
              selectedId={selectedId}
              onSelectLocation={(id) => {
                setSelectedId(id);
                setShowMap(false);
              }}
            />
          </div>
        </main>

      </div>
    </div>
  );
}