'use client';

import { Heart, MapPin } from 'lucide-react';
import type { Location } from '@/types';
import LocationCard from './LocationCard';

interface FavoritesPanelProps {
  locations: Location[];
  favoriteIds: string[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export default function FavoritesPanel({
  locations,
  favoriteIds,
  selectedId,
  onSelect,
  onToggleFavorite,
}: FavoritesPanelProps) {
  const favoriteLocations = favoriteIds
    .map((id) => locations.find((l) => l.id === id))
    .filter(Boolean) as Location[];

  if (favoriteLocations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-6">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
          <Heart size={22} className="text-red-300" />
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-700">Nenhum favorito ainda</p>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            Toque no coração de qualquer local para salvá-lo aqui.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 border-b border-zinc-100 shrink-0">
        <div className="flex items-center gap-2">
          <Heart size={14} className="text-red-400" fill="currentColor" />
          <span className="text-sm font-semibold text-zinc-700">
            {favoriteLocations.length}{' '}
            {favoriteLocations.length === 1 ? 'favorito' : 'favoritos'}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
        {favoriteLocations.map((loc, i) => (
          <div
            key={loc.id}
            className="animate-fade-slide-up"
            style={{ animationDelay: `${i * 40}ms`, opacity: 0 }}
          >
            <LocationCard
              location={loc}
              isSelected={selectedId === loc.id}
              isFavorite
              onToggleFavorite={() => onToggleFavorite(loc.id)}
              onClick={() => onSelect(loc.id)}
            />
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-zinc-100 shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <MapPin size={11} />
          Salvos apenas neste dispositivo
        </div>
      </div>
    </div>
  );
}