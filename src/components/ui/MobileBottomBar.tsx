'use client';

import { Map, List, Heart } from 'lucide-react';
import type { SidebarTab } from './SidebarTabs';

interface MobileBottomBarProps {
  showMap: boolean;
  onToggleMap: () => void;
  activeTab: SidebarTab;
  onChangeTab: (tab: SidebarTab) => void;
  favoritesCount: number;
}

export default function MobileBottomBar({
  showMap,
  onToggleMap,
  activeTab,
  onChangeTab,
  favoritesCount,
}: MobileBottomBarProps) {
  return (
    <nav className="sm:hidden shrink-0 bg-white/90 backdrop-blur-sm border-t border-zinc-100 px-6 py-2 safe-area-bottom">
      <div className="flex items-center justify-around">

        {/* Explorar */}
        <button
          onClick={() => {
            onChangeTab('explorar');
            if (showMap) onToggleMap();
          }}
          className={`
            flex flex-col items-center gap-1 px-4 py-2 rounded-xl
            transition-all duration-150 active:scale-95
            ${!showMap && activeTab === 'explorar'
              ? 'text-green-600'
              : 'text-zinc-400 hover:text-zinc-600'
            }
          `}
        >
          <List size={20} strokeWidth={!showMap && activeTab === 'explorar' ? 2.5 : 1.8} />
          <span className="text-[10px] font-semibold">Explorar</span>
        </button>

        {/* Mapa */}
        <button
          onClick={() => {
            if (!showMap) onToggleMap();
          }}
          className={`
            flex flex-col items-center gap-1 px-4 py-2 rounded-xl
            transition-all duration-150 active:scale-95
            ${showMap ? 'text-green-600' : 'text-zinc-400 hover:text-zinc-600'}
          `}
        >
          <Map size={20} strokeWidth={showMap ? 2.5 : 1.8} />
          <span className="text-[10px] font-semibold">Mapa</span>
        </button>

        {/* Favoritos */}
        <button
          onClick={() => {
            onChangeTab('favoritos');
            if (showMap) onToggleMap();
          }}
          className={`
            relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl
            transition-all duration-150 active:scale-95
            ${!showMap && activeTab === 'favoritos'
              ? 'text-red-400'
              : 'text-zinc-400 hover:text-zinc-600'
            }
          `}
        >
          <div className="relative">
            <Heart
              size={20}
              strokeWidth={!showMap && activeTab === 'favoritos' ? 2.5 : 1.8}
              fill={!showMap && activeTab === 'favoritos' ? 'currentColor' : 'none'}
            />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-400 text-white rounded-full text-[8px] font-bold flex items-center justify-center">
                {favoritesCount > 9 ? '9+' : favoritesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold">Favoritos</span>
        </button>

      </div>
    </nav>
  );
}