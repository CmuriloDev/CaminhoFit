'use client';

import { Map, Heart } from 'lucide-react';

export type SidebarTab = 'explorar' | 'favoritos';

interface SidebarTabsProps {
  active: SidebarTab;
  onChange: (tab: SidebarTab) => void;
  favoritesCount: number;
}

export default function SidebarTabs({ active, onChange, favoritesCount }: SidebarTabsProps) {
  return (
    <div className="flex gap-1 p-1 bg-zinc-100 rounded-xl">
      <button
        onClick={() => onChange('explorar')}
        className={`
          flex-1 flex items-center justify-center gap-1.5
          py-2 px-3 rounded-lg text-xs font-semibold
          transition-all duration-150 active:scale-95
          ${active === 'explorar'
            ? 'bg-white text-zinc-900 shadow-sm'
            : 'text-zinc-500 hover:text-zinc-700'
          }
        `}
      >
        <Map size={13} />
        Explorar
      </button>

      <button
        onClick={() => onChange('favoritos')}
        className={`
          flex-1 flex items-center justify-center gap-1.5
          py-2 px-3 rounded-lg text-xs font-semibold
          transition-all duration-150 active:scale-95 relative
          ${active === 'favoritos'
            ? 'bg-white text-zinc-900 shadow-sm'
            : 'text-zinc-500 hover:text-zinc-700'
          }
        `}
      >
        <Heart
          size={13}
          fill={active === 'favoritos' ? 'currentColor' : 'none'}
          className={active === 'favoritos' ? 'text-red-400' : ''}
        />
        Favoritos
        {favoritesCount > 0 && (
          <span className={`
            absolute -top-0.5 -right-0.5
            w-4 h-4 rounded-full text-white
            flex items-center justify-center
            text-[10px] font-bold
            bg-red-400
          `}>
            {favoritesCount > 9 ? '9+' : favoritesCount}
          </span>
        )}
      </button>
    </div>
  );
}