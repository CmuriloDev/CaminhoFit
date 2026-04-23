import Link from 'next/link';
import { Clock, Users } from 'lucide-react';
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
      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-black bg-black text-white shadow-lg'
          : 'border-zinc-200 bg-white hover:border-zinc-400 hover:shadow-sm'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full shrink-0 mt-0.5"
            style={{ background: typeColor }}
          />
          <h3 className={`font-semibold text-sm leading-tight ${isSelected ? 'text-white' : 'text-zinc-900'}`}>
            {location.name}
          </h3>
        </div>
        <Link
          href={`/locations/${location.id}`}
          onClick={(e) => e.stopPropagation()}
          className={`text-xs px-2 py-1 rounded-md shrink-0 font-medium transition-colors ${
            isSelected
              ? 'bg-white text-black hover:bg-zinc-100'
              : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
          }`}
        >
          Detalhes
        </Link>
      </div>

      {/* Type label */}
      <p className={`text-xs mb-3 ml-4 ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
        {ACTIVITY_TYPE_LABELS[location.type]}
      </p>

      {/* Infos */}
      <div className="flex flex-wrap gap-3 text-xs ml-4">
        {location.busiest_time && (
          <span className={`flex items-center gap-1 ${isSelected ? 'text-zinc-300' : 'text-zinc-600'}`}>
            <Clock size={11} />
            {location.busiest_time}
          </span>
        )}
        {location.crowd_level && (
          <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md ${isSelected ? 'text-zinc-300' : crowdStyle}`}>
            <Users size={11} />
            {CROWD_LEVEL_LABELS[location.crowd_level]}
          </span>
        )}
      </div>

      {/* Tags */}
      {location.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3 ml-4">
          {location.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className={`text-xs px-2 py-0.5 rounded-full ${
                isSelected ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-600'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}