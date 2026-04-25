import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Users, Tag, MapPin } from 'lucide-react';
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

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-zinc-100 px-4 py-3.5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft size={15} />
          Voltar ao mapa
        </Link>
      </header>

      <div className="max-w-xl mx-auto px-4 py-8 space-y-4">

        {/* Hero card */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
          {/* Faixa colorida por tipo */}
          <div
            className="h-2 w-full"
            style={{ backgroundColor: typeColor }}
          />
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ color: typeColor, backgroundColor: `${typeColor}18` }}
              >
                {ACTIVITY_TYPE_LABELS[location.type]}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-zinc-900 mb-3 leading-tight">
              {location.name}
            </h1>

            {location.description && (
              <p className="text-zinc-500 leading-relaxed text-sm">
                {location.description}
              </p>
            )}
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 gap-3">
          {location.busiest_time && (
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-4">
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-2">
                <Clock size={12} />
                Melhor horário
              </div>
              <p className="font-semibold text-zinc-900 text-sm">{location.busiest_time}</p>
            </div>
          )}

          {location.crowd_level && (
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-4">
              <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-2">
                <Users size={12} />
                Movimento típico
              </div>
              <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${crowdStyle}`}>
                {CROWD_LEVEL_LABELS[location.crowd_level]}
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        {location.tags && location.tags.length > 0 && (
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-4">
            <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-3">
              <Tag size={12} />
              Características
            </div>
            <div className="flex flex-wrap gap-2">
              {location.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <a
          href={`https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}&zoom=17`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-semibold text-sm transition-colors active:scale-95 shadow-sm shadow-green-200"
        >
          <MapPin size={15} />
          Ver localização no mapa
        </a>

        <p className="text-center text-xs text-zinc-400 pb-4">
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