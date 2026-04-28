'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { List, Map, Loader2, SearchX, Dumbbell } from 'lucide-react';
import { useLocations } from '@/hooks/useLocations';
import LocationCard from '@/components/ui/LocationCard';
import LocationCardSkeleton from '@/components/ui/LocationCardSkeleton';
import FilterBar from '@/components/ui/FilterBar';
import Image from 'next/image';

const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-stone-50 to-fit-50/30 rounded-3xl">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-fit-100 flex items-center justify-center">
            <Dumbbell size={24} className="text-fit-600" />
          </div>
          <Loader2 className="absolute -bottom-1 -right-1 animate-spin-slow text-fit-500" size={16} />
        </div>
        <span className="text-sm text-stone-500 font-medium">Carregando mapa...</span>
      </div>
    </div>
  ),
});

export default function HomePage() {
  const { locations, loading, error, filters, setFilters } = useLocations();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-linear-to-br from-stone-50 via-fit-50/20 to-stone-100">

      {/* Header com glassmorphism */}
      <header className="sticky top-0 z-30 px-4 sm:px-5 py-3 sm:py-4">
        <div className="glass rounded-2xl sm:rounded-3xl border border-white/50 shadow-glass-sm px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo e marca */}
            <div className="flex items-center gap-3 group">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-linear-to-br from-fit-100 to-fit-200 ring-2 ring-white/60 shadow-green-sm flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/somente_logo.png"
                  alt="Logo CaminhoFit"
                  width={56}
                  height={56}
                  className="h-full w-full object-cover scale-110"
                  priority
                />
              </div>

              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold tracking-tight text-lg sm:text-xl leading-none">
                    <span className="text-stone-800">Caminho</span>
                    <span className="text-gradient">Fit</span>
                  </span>
                </div>
                <span className="text-xs text-stone-500 font-medium">
                  Teresina · PI
                </span>
              </div>
            </div>

            {/* Botão toggle mobile */}
            <button
              onClick={() => setShowMap(!showMap)}
              className="sm:hidden flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl 
                glass-light border border-stone-200/50 text-stone-700 hover:text-fit-700 
                hover:border-fit-200 hover:bg-fit-50/50 shadow-sm tap-scale transition-all duration-200"
            >
              {showMap ? (
                <>
                  <List size={16} />
                  <span>Lista</span>
                </>
              ) : (
                <>
                  <Map size={16} />
                  <span>Mapa</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden min-h-0 px-3 sm:px-4 pb-4 gap-3 sm:gap-4">

        {/* Sidebar com glassmorphism */}
        <aside className={`
          ${showMap ? 'hidden' : 'flex'} sm:flex
          flex-col w-full sm:w-80 lg:w-96 shrink-0
          glass rounded-2xl sm:rounded-3xl border border-white/50 shadow-glass-sm
          overflow-hidden
        `}>

          {/* Área de filtros */}
          <div className="px-4 pt-4 pb-3 border-b border-stone-100/50 shrink-0">
            <FilterBar
              filters={filters}
              onChange={setFilters}
              total={locations.length}
            />
          </div>

          {/* Lista de locais */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0 scrollbar-thin">

            {/* Skeleton loading */}
            {loading && (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <LocationCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Erro */}
            {error && !loading && (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center animate-fade-in">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center shadow-sm">
                  <SearchX size={24} className="text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-700">Erro ao carregar</p>
                  <p className="text-xs text-stone-500 mt-1">Verifique sua conexão e tente novamente.</p>
                </div>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-2 px-4 py-2 text-xs font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors tap-scale"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {/* Vazio */}
            {!loading && !error && locations.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center animate-fade-in">
                <div className="w-20 h-20 bg-stone-100 rounded-3xl flex items-center justify-center text-4xl">
                  🏃
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-700">Nenhum local encontrado</p>
                  <p className="text-xs text-stone-500 mt-1">Tente outro filtro de atividade.</p>
                </div>
              </div>
            )}

            {/* Cards com animação escalonada */}
            {!loading && !error && locations.map((loc, i) => (
              <div
                key={loc.id}
                className="animate-fade-slide-up"
                style={{ animationDelay: `${Math.min(i * 40, 400)}ms`, opacity: 0 }}
              >
                <LocationCard
                  location={loc}
                  isSelected={selectedId === loc.id}
                  onClick={() => {
                    setSelectedId(loc.id);
                    setShowMap(true);
                  }}
                />
              </div>
            ))}

          </div>
        </aside>

        {/* Mapa com container melhorado */}
        <main className={`${showMap ? 'flex' : 'hidden'} sm:flex flex-1 min-h-0`}>
          <div className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-glass border border-white/50">
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