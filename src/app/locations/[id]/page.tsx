import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Users, Tag, MapPin } from 'lucide-react';
import { getLocationById } from '@/services/locations';
import {
  ACTIVITY_TYPE_LABELS,
  ACTIVITY_TYPE_COLORS,
  CROWD_LEVEL_LABELS,
  CROWD_LEVEL_COLORS,
} from '@/lib/locationUtils';
import ShareButton from '@/components/ui/ShareButton';

interface PageProps {
  params: Promise<{ id: string }>;
}

// SEO dinâmico por local
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const location = await getLocationById(id);

  if (!location) {
    return { title: 'Local não encontrado — CaminhoFit' };
  }

  return {
    title: `${location.name} — CaminhoFit`,
    description:
      location.description ??
      `Conheça ${location.name}, um ótimo local para treinar em Teresina-PI.`,
    openGraph: {
      title: location.name,
      description: location.description ?? '',
      images: location.image_url ? [location.image_url] : [],
      locale: 'pt_BR',
      type: 'website',
    },
  };
}

export default async function LocationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const location = await getLocationById(id);
  if (!location) return notFound();

  const typeColor = ACTIVITY_TYPE_COLORS[location.type];
  const crowdStyle = location.crowd_level
    ? CROWD_LEVEL_COLORS[location.crowd_level]
    : '';

  const mapsUrl = `https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}&zoom=17`;

  return (
    <div className="min-h-screen bg-zinc-50">

      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-zinc-100 px-4 py-3.5">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft size={15} />
            Voltar ao mapa
          </Link>

          <ShareButton name={location.name} />
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-xl mx-auto px-4 py-5 space-y-4">

        {/* Imagem hero */}
        {location.image_url ? (
          <div className="relative w-full h-56 rounded-2xl overflow-hidden shadow-sm">
            <Image
              src={location.image_url}
              alt={location.name}
              fill
              className="object-cover"
              priority
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />

            <div className="absolute bottom-3 left-3">
              <span
                className="text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm"
                style={{
                  color: typeColor,
                  background: 'rgba(255,255,255,0.85)',
                }}
              >
                {ACTIVITY_TYPE_LABELS[location.type]}
              </span>
            </div>
          </div>
        ) : (
          <div
            className="w-full h-40 rounded-2xl flex items-center justify-center text-5xl"
            style={{
              background: `linear-gradient(135deg, ${typeColor}18, ${typeColor}35)`,
            }}
          >
            {getTypeEmoji(location.type)}
          </div>
        )}

        {/* Card principal */}
        <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5">
          {!location.image_url && (
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full inline-block mb-3"
              style={{
                color: typeColor,
                background: `${typeColor}18`,
              }}
            >
              {ACTIVITY_TYPE_LABELS[location.type]}
            </span>
          )}

          <h1 className="text-2xl font-bold text-zinc-900 leading-tight mb-3">
            {location.name}
          </h1>

          {location.description && (
            <p className="text-zinc-500 leading-relaxed text-sm">
              {location.description}
            </p>
          )}
        </div>

        {/* Métricas */}
        {(location.busiest_time || location.crowd_level) && (
          <div className="grid grid-cols-2 gap-3">
            {location.busiest_time && (
              <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-4">
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-2">
                  <Clock size={12} />
                  Horário de pico
                </div>
                <p className="font-semibold text-zinc-900 text-sm">
                  {location.busiest_time}
                </p>
              </div>
            )}

            {location.crowd_level && (
              <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-4">
                <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-2">
                  <Users size={12} />
                  Movimento típico
                </div>
                <span
                  className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${crowdStyle}`}
                >
                  {CROWD_LEVEL_LABELS[location.crowd_level]}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {location.tags?.length > 0 && (
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

        {/* CTA */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex items-center justify-center gap-2 w-full py-4
            bg-green-500 hover:bg-green-600
            text-white rounded-2xl font-semibold text-sm
            transition-all active:scale-95
            shadow-sm shadow-green-200
          "
        >
          <MapPin size={15} />
          Ver localização no mapa
        </a>

        <p className="text-center text-xs text-zinc-400 pb-2">
          Atualizado em{' '}
          {new Date(location.last_updated_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </main>
    </div>
  );
}

function getTypeEmoji(type: string): string {
  const map: Record<string, string> = {
    corrida: '🏃',
    academia: '🏋️',
    luta: '🥊',
    calistenia: '💪',
    crossfit: '⚡',
    funcional: '🎯',
    esportes_coletivos: '⚽',
  };
  return map[type] ?? '📍';
}