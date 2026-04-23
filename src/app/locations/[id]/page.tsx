import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Users, Tag } from 'lucide-react';
import { getLocationById } from '@/services/locations';
import {
  ACTIVITY_TYPE_LABELS,
  ACTIVITY_TYPE_COLORS,
  CROWD_LEVEL_LABELS,
  CROWD_LEVEL_COLORS,
} from '@/lib/locationUtils';

export default async function LocationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const location = await getLocationById(id);
  if (!location) return notFound();

  const typeColor = ACTIVITY_TYPE_COLORS[location.type];
  const crowdStyle = location.crowd_level ? CROWD_LEVEL_COLORS[location.crowd_level] : '';

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="sticky top-0 z-10 bg-white border-b border-zinc-200 px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-900 transition-colors w-fit"
        >
          <ArrowLeft size={16} />
          Voltar ao mapa
        </Link>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        {/* Hero */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-3 h-3 rounded-full" style={{ background: typeColor }} />
            <span className="text-sm text-zinc-500">{ACTIVITY_TYPE_LABELS[location.type]}</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-3">{location.name}</h1>
          {location.description && (
            <p className="text-zinc-600 leading-relaxed">{location.description}</p>
          )}
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 gap-3">
          {location.busiest_time && (
            <div className="bg-white rounded-xl border border-zinc-200 p-4">
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
                <Clock size={12} /> Horário de pico
              </div>
              <p className="font-semibold text-zinc-900 text-sm">{location.busiest_time}</p>
            </div>
          )}

          {location.crowd_level && (
            <div className="bg-white rounded-xl border border-zinc-200 p-4">
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
                <Users size={12} /> Movimento
              </div>
              <span className={`text-sm font-semibold px-2 py-0.5 rounded-md ${crowdStyle}`}>
                {CROWD_LEVEL_LABELS[location.crowd_level]}
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        {location.tags?.length > 0 && (
          <div className="bg-white rounded-xl border border-zinc-200 p-4">
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-3">
              <Tag size={12} /> Tags
            </div>
            <div className="flex flex-wrap gap-2">
              {location.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-zinc-100 text-zinc-700 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* OSM link */}
        <a
          href={`https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}&zoom=16`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-black text-white rounded-xl font-medium text-sm hover:bg-zinc-800 transition-colors"
        >
          Ver no OpenStreetMap
        </a>

        <p className="text-center text-xs text-zinc-400">
          Atualizado em{' '}
          {new Date(location.last_updated_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>
    </div>
  );
}