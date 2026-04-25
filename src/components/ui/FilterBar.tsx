'use client';

import type { ActivityType, LocationFilters } from '@/types';
import { ACTIVITY_TYPE_LABELS } from '@/lib/locationUtils';

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
    <div className="flex flex-col gap-2.5">
      <p className="text-xs text-zinc-400 font-medium">
        {total} {total !== 1 ? 'locais encontrados' : 'local encontrado'}
      </p>

      <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
        {ALL_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => onChange({ ...filters, type })}
            className={`
              shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium
              transition-all duration-150 active:scale-95 cursor-pointer
              ${active === type
                ? 'bg-green-500 text-white shadow-sm shadow-green-200'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }
            `}
          >
            {type === 'todos' ? 'Todos' : ACTIVITY_TYPE_LABELS[type as ActivityType]}
          </button>
        ))}
      </div>
    </div>
  );
}