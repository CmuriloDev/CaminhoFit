'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { X, Clock, Users, Tag, MapPin, Share2, ArrowUpRight } from 'lucide-react';
import type { Location } from '@/types';
import {
  ACTIVITY_TYPE_LABELS,
  ACTIVITY_TYPE_COLORS,
  CROWD_LEVEL_LABELS,
  CROWD_LEVEL_COLORS,
} from '@/lib/locationUtils';
import FavoriteButton from './FavoriteButton';

interface LocationModalProps {
  location: Location | null;
  onClose: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export default function LocationModal({
  location,
  onClose,
  isFavorite = false,
  onToggleFavorite,
}: LocationModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = location ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [location]);

  if (!location) return null;

  const typeColor = ACTIVITY_TYPE_COLORS[location.type];
  const crowdStyle = location.crowd_level ? CROWD_LEVEL_COLORS[location.crowd_level] : '';
  const mapsUrl = `https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}&zoom=17`;

  const handleShare = async () => {
    const url = `${window.location.origin}/locations/${location.id}`;

    if (navigator.share) {
      await navigator.share({
        title: `${location.name} — CaminhoFit`,
        text: `Confira ${location.name} no CaminhoFit!`,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copiado!');
    }
  };

  const content = (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        style={{ zIndex: 9998 }}
        onClick={onClose}
      />

      <div
        className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none"
        style={{ zIndex: 9999 }}
      >
        <div
          className="
            pointer-events-auto
            w-full sm:max-w-md
            bg-white
            rounded-t-3xl sm:rounded-3xl
            shadow-2xl
            overflow-hidden
            animate-slide-up sm:animate-scale-in
            max-h-[92vh] sm:max-h-[85vh]
            flex flex-col
          "
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-10 h-1 bg-zinc-200 rounded-full" />
          </div>

          <div className="overflow-y-auto flex-1 scrollbar-none">
            {location.image_url ? (
              <div className="relative w-full h-52 shrink-0">
                <Image
                  src={location.image_url}
                  alt={location.name}
                  fill
                  className="object-cover"
                  priority
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

                <div className="absolute bottom-3 left-4">
                  <span
                    className="text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ color: typeColor, background: 'rgba(255,255,255,0.9)' }}
                  >
                    {ACTIVITY_TYPE_LABELS[location.type]}
                  </span>
                </div>

                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <div
                className="relative w-full h-32 flex items-center justify-center text-5xl shrink-0"
                style={{ background: `linear-gradient(135deg, ${typeColor}18, ${typeColor}35)` }}
              >
                {getTypeEmoji(location.type)}

                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-zinc-600 transition-colors shadow-sm"
                >
                  <X size={15} />
                </button>
              </div>
            )}

            <div className="px-5 pt-4 pb-6 space-y-4">
              <div>
                {!location.image_url && (
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full inline-block mb-2"
                    style={{ color: typeColor, background: `${typeColor}18` }}
                  >
                    {ACTIVITY_TYPE_LABELS[location.type]}
                  </span>
                )}

                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-xl font-bold text-zinc-900 leading-tight">
                    {location.name}
                  </h2>

                  <div className="flex items-center gap-2 shrink-0 mt-0.5">
                    {onToggleFavorite && (
                      <FavoriteButton
                        isFavorite={isFavorite}
                        onToggle={onToggleFavorite}
                      />
                    )}

                    <button
                      onClick={handleShare}
                      className="text-zinc-400 hover:text-zinc-700 transition-colors p-1"
                      title="Compartilhar"
                    >
                      <Share2 size={16} />
                    </button>

                    <Link
                      href={`/locations/${location.id}`}
                      className="text-zinc-400 hover:text-green-600 transition-colors p-1"
                      title="Página completa"
                    >
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </div>

                {location.description && (
                  <p className="text-zinc-500 text-sm leading-relaxed mt-2">
                    {location.description}
                  </p>
                )}
              </div>

              {(location.busiest_time || location.crowd_level) && (
                <div className="grid grid-cols-2 gap-3">
                  {location.busiest_time && (
                    <div className="bg-zinc-50 rounded-2xl p-3.5">
                      <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1.5">
                        <Clock size={11} />
                        Horário de pico
                      </div>
                      <p className="font-semibold text-zinc-900 text-sm">
                        {location.busiest_time}
                      </p>
                    </div>
                  )}

                  {location.crowd_level && (
                    <div className="bg-zinc-50 rounded-2xl p-3.5">
                      <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1.5">
                        <Users size={11} />
                        Movimento
                      </div>
                      <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${crowdStyle}`}>
                        {CROWD_LEVEL_LABELS[location.crowd_level]}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {location.tags?.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-2.5">
                    <Tag size={11} />
                    Características
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {location.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex items-center justify-center gap-2 w-full py-3.5
                  bg-green-500 hover:bg-green-600
                  text-white rounded-2xl font-semibold text-sm
                  transition-all active:scale-95 shadow-sm shadow-green-200
                "
              >
                <MapPin size={14} />
                Ver localização no mapa
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
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