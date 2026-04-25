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
        transition-all duration-200 ease-out
        ${isSelected
          ? 'border-green-500 bg-green-50 shadow-md shadow-green-100'
          : 'border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-md hover:shadow-zinc-100 hover:-translate-y-0.5'
        }
      `}
    >
      {/* Indicador de seleção */}
      {isSelected && (
        <div className="absolute left-0 top-4 bottom-4 w-1 bg-green-500 rounded-full" />
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* Dot colorido por tipo */}
          <span
            className="shrink-0 w-2.5 h-2.5 rounded-full mt-0.5"
            style={{ background: typeColor }}
          />
          <h3 className={`font-semibold text-sm leading-tight truncate ${isSelected ? 'text-green-900' : 'text-zinc-900'}`}>
            {location.name}
          </h3>
        </div>

        {/* Link detalhes */}
        <Link
          href={`/locations/${location.id}`}
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 flex items-center gap-0.5 text-xs font-medium text-zinc-400 hover:text-green-600 transition-colors"
        >
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Tipo */}
      <p className="text-xs text-zinc-400 mt-1 ml-4.5">
        {ACTIVITY_TYPE_LABELS[location.type]}
      </p>

      {/* Métricas */}
      <div className="flex items-center gap-3 mt-3 ml-4.5">
        {location.busiest_time && (
          <span className="flex items-center gap-1 text-xs text-zinc-500">
            <Clock size={11} className="text-zinc-400" />
            {location.busiest_time}
          </span>
        )}

        {location.crowd_level && (
          <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${crowdStyle}`}>
            <Users size={10} />
            {CROWD_LEVEL_LABELS[location.crowd_level]}
          </span>
        )}
      </div>

      {/* Tags */}
      {location.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3 ml-4.5">
          {location.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}