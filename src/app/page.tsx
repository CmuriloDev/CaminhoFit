'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, List, Map, Loader2, SearchX } from 'lucide-react';
import { useLocations } from '@/hooks/useLocations';
import { useFavorites } from '@/hooks/useFavorites';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import type { Location } from '@/types';

import LocationCard from '@/components/ui/LocationCard';
import LocationCardSkeleton from '@/components/ui/LocationCardSkeleton';
import FilterBar from '@/components/ui/FilterBar';
import SearchBar from '@/components/ui/SearchBar';
import GeolocateButton from '@/components/ui/GeolocateButton';
import LocationModal from '@/components/ui/LocationModal';

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
  const { locations, loading, error, filters, setFilters, search, setSearch } = useLocations();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [modalLocation, setModalLocation] = useState<Location | null>(null);

  const mapFlyToRef = useRef<((lat: number, lng: number) => void) | null>(null);

  const { isFavorite, toggleFavorite } = useFavorites();
  const { addRecent } = useRecentlyViewed();

  const handleSelectLocation = (id: string) => {
    const loc = locations.find((l) => l.id === id) ?? null;

    setSelectedId(id);
    setModalLocation(loc);
    addRecent(id);
  };

  const handleGeolocate = (lat: number, lng: number) => {
    setShowMap(true);

    setTimeout(() => {
      mapFlyToRef.current?.(lat, lng);
    }, 100);
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-50">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3.5 bg-white/80 backdrop-blur-sm border-b border-zinc-100 shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center shadow-sm">
            <MapPin size={15} className="text-white" strokeWidth={2.5} />
          </div>

          <span className="font-bold text-lg tracking-tight leading-none">
            <span className="text-zinc-900">Caminho</span>
            <span className="text-green-500">Fit</span>
          </span>

          <span className="text-xs text-zinc-400 hidden sm:inline">Teresina · PI</span>
        </div>

        <button
          onClick={() => setShowMap(!showMap)}
          className="sm:hidden flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-all active:scale-95"
        >
          {showMap ? (
            <>
              <List size={13} /> Ver lista
            </>
          ) : (
            <>
              <Map size={13} /> Ver mapa
            </>
          )}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Sidebar */}
        <aside
          className={`
            ${showMap ? 'hidden' : 'flex'} sm:flex
            flex-col w-full sm:w-80 lg:w-96 shrink-0
            bg-white border-r border-zinc-100 overflow-hidden
          `}
        >
          {/* Busca + Geolocalização */}
          <div className="px-4 pt-4 pb-3 border-b border-zinc-100 space-y-3 shrink-0">
            <div className="flex gap-2">
              <div className="flex-1">
                <SearchBar value={search} onChange={setSearch} />
              </div>

              <GeolocateButton onLocate={handleGeolocate} />
            </div>

            <FilterBar
              filters={filters}
              onChange={setFilters}
              total={locations.length}
            />
          </div>

          {/* Lista */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
            {loading && (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <LocationCardSkeleton key={i} />
                ))}
              </div>
            )}

            {error && !loading && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
                  <SearchX size={20} className="text-red-400" />
                </div>

                <p className="text-sm font-medium text-zinc-700">Erro ao carregar</p>
                <p className="text-xs text-zinc-400">Verifique sua conexão.</p>
              </div>
            )}

            {!loading && !error && locations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <span className="text-4xl">🔍</span>

                <p className="text-sm font-medium text-zinc-700">Nenhum local encontrado</p>

                <p className="text-xs text-zinc-400">
                  {search ? `Sem resultados para "${search}"` : 'Tente outro filtro.'}
                </p>
              </div>
            )}

            {!loading && !error && locations.map((loc, i) => (
              <div
                key={loc.id}
                className="animate-fade-slide-up"
                style={{ animationDelay: `${i * 40}ms`, opacity: 0 }}
              >
                <LocationCard
                  location={loc}
                  isSelected={selectedId === loc.id}
                  isFavorite={isFavorite(loc.id)}
                  onToggleFavorite={() => toggleFavorite(loc.id)}
                  onClick={() => handleSelectLocation(loc.id)}
                />
              </div>
            ))}
          </div>
        </aside>

        {/* Mapa */}
        <main className={`${showMap ? 'flex' : 'hidden'} sm:flex flex-1 p-3 min-h-0`}>
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm border border-zinc-100">
            <MapView
              locations={locations}
              selectedId={selectedId}
              onSelectLocation={(id) => {
                handleSelectLocation(id);
                setShowMap(false);
              }}
              onMapReady={(flyTo) => {
                mapFlyToRef.current = flyTo;
              }}
            />
          </div>
        </main>
      </div>

      <LocationModal
        location={modalLocation}
        onClose={() => {
          setModalLocation(null);
          setSelectedId(null);
        }}
        isFavorite={modalLocation ? isFavorite(modalLocation.id) : false}
        onToggleFavorite={
          modalLocation ? () => toggleFavorite(modalLocation.id) : undefined
        }
      />
    </div>
  );
}