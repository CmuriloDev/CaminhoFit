'use client';

import Link from 'next/link';
import { Clock, Users, ArrowUpRight } from 'lucide-react';
import type { Location } from '@/types';
import {
  ACTIVITY_TYPE_LABELS,
  ACTIVITY_TYPE_COLORS,
  CROWD_LEVEL_LABELS,
  CROWD_LEVEL_COLORS,
} from '@/lib/locationUtils';

interface LocationCardProps {
  location: Location;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function LocationCard({ location, isSelected, onClick }: LocationCardProps) {
  const typeColor = ACTIVITY_TYPE_COLORS[location.type];
  const crowdStyle = location.crowd_level ? CROWD_LEVEL_COLORS[location.crowd_level] : '';

  return (
    <div
      onClick={onClick}
      className={`
        group relative p-4 rounded-2xl border cursor-pointer
        transition-all duration-300 ease-out
        hover-lift tap-scale
        ${isSelected
          ? 'border-fit-500 bg-linear-to-br from-fit-50 to-fit-100/50 shadow-green-md'
          : 'border-stone-200/60 bg-linear-to-br from-white to-stone-50/50 hover:border-fit-300 hover:shadow-card-hover'
        }
      `}
    >
      {/* Indicador de seleção - barra lateral verde */}
      {isSelected && (
        <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-fit-500 rounded-full shadow-sm" />
      )}

      {/* Badge do tipo de atividade - movido para dentro do fluxo */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span 
          className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
          style={{ 
            backgroundColor: `${typeColor}20`, 
            color: typeColor,
            border: `1px solid ${typeColor}30`
          }}
        >
          {ACTIVITY_TYPE_LABELS[location.type].split(' / ')[0]}
        </span>
        
        {/* Link detalhes */}
        <Link
          href={`/locations/${location.id}`}
          onClick={(e) => e.stopPropagation()}
          className={`
            shrink-0 flex items-center gap-0.5 text-xs font-medium 
            transition-all duration-200 tap-scale
            ${isSelected 
              ? 'text-fit-600' 
              : 'text-stone-400 hover:text-fit-600'
            }
          `}
        >
          <ArrowUpRight size={14} />
        </Link>
      </div>

      <div className="flex items-start gap-2.5">
        {/* Dot colorido por tipo */}
        <span 
          className="shrink-0 w-3.5 h-3.5 rounded-full mt-1 ring-2 ring-white shadow-sm"
          style={{ 
            background: typeColor,
            boxShadow: `0 0 0 2px ${typeColor}30, 0 2px 4px ${typeColor}40`
          }} 
        />
        <div className="min-w-0 flex-1">
          <h3 className={`font-bold text-sm leading-tight truncate ${isSelected ? 'text-fit-900' : 'text-stone-800'}`}>
            {location.name}
          </h3>
          
          {/* Descrição */}
          {location.description && (
            <p className="text-xs text-stone-500 mt-1 line-clamp-2">
              {location.description}
            </p>
          )}
        </div>
      </div>

      {/* Métricas com ícones */}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {location.busiest_time && (
          <span className="flex items-center gap-1.5 text-xs text-stone-600 bg-stone-100 px-2.5 py-1.5 rounded-lg font-medium">
            <Clock size={12} className="text-stone-400" />
            <span>{location.busiest_time}</span>
          </span>
        )}

        {location.crowd_level && (
          <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg font-semibold ${crowdStyle}`}>
            <Users size={11} />
            {CROWD_LEVEL_LABELS[location.crowd_level]}
          </span>
        )}
      </div>

      {/* Hover effect - borda verde sutil */}
      <div 
        className={`
          absolute inset-0 rounded-2xl pointer-events-none
          transition-opacity duration-300
          ${isSelected ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}
        `}
        style={{
          border: `2px solid ${typeColor}30`,
        }}
      />
    </div>
  );
}