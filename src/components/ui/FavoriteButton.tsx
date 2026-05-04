'use client';

import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md';
}

export default function FavoriteButton({
  isFavorite,
  onToggle,
  size = 'md',
}: FavoriteButtonProps) {
  const iconSize = size === 'sm' ? 13 : 16;
  const padding = size === 'sm' ? 'p-1.5' : 'p-2';

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      className={`
        ${padding} rounded-full transition-all duration-200 active:scale-90
        ${isFavorite
          ? 'text-red-500 bg-red-50 hover:bg-red-100'
          : 'text-zinc-400 bg-zinc-100 hover:bg-zinc-200 hover:text-zinc-600'
        }
      `}
    >
      <Heart
        size={iconSize}
        className="transition-all duration-200"
        fill={isFavorite ? 'currentColor' : 'none'}
        strokeWidth={2}
      />
    </button>
  );
}