'use client';

import type { ActivityType, LocationFilters } from '@/types';
import { ACTIVITY_TYPE_LABELS, ACTIVITY_TYPE_COLORS } from '@/lib/locationUtils';
import { Activity } from 'lucide-react';

const ALL_TYPES: Array<ActivityType | 'todos'> = [
  'todos',
  'corrida',
  'academia',
  'calistenia',
  'crossfit',
  'funcional',
  'luta',
  'esportes_coletivos',
];

interface FilterBarProps {
  filters: LocationFilters;
  onChange: (filters: LocationFilters) => void;
  total: number;
}

export default function FilterBar({ filters, onChange, total }: FilterBarProps) {
  const active = filters.type ?? 'todos';

  return (
    <div className="flex flex-col gap-3">
      {/* Header com contador */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
          {total} {total !== 1 ? 'locais encontrados' : 'local encontrado'}
        </p>
      </div>

      {/* Scroll horizontal com pills de filtro */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin -mx-1 px-1">
        {ALL_TYPES.map((type, index) => {
          const isActive = active === type;
          const color = type === 'todos' ? '#22c55e' : (ACTIVITY_TYPE_COLORS[type as ActivityType] ?? '#6b7280');
          
          return (
            <button
              key={type}
              onClick={() => onChange({ ...filters, type })}
              className={`
                shrink-0 px-4 py-2 rounded-xl text-xs font-semibold
                transition-all duration-200 ease-out tap-scale
                flex items-center gap-1.5
                ${isActive
                  ? 'shadow-md shadow-green-200/50'
                  : 'hover:bg-stone-100'
                }
              `}
              style={{
                background: isActive ? color : 'rgba(255, 255, 255, 0.8)',
                color: isActive ? 'white' : '#57534e',
                border: isActive ? 'none' : '1px solid rgba(0, 0, 0, 0.06)',
                animationDelay: `${index * 30}ms`,
              }}
            >
              {type === 'todos' ? (
                <Activity size={13} className={isActive ? 'text-white/90' : 'text-stone-400'} />
              ) : null}
              {type === 'todos' ? 'Todos' : ACTIVITY_TYPE_LABELS[type as ActivityType].split(' / ')[0]}
            </button>
          );
        })}
      </div>
    </div>
  );
}