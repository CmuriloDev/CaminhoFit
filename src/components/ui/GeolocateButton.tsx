'use client';

import { useState } from 'react';
import { Navigation, Loader2 } from 'lucide-react';

interface GeolocateButtonProps {
  onLocate: (lat: number, lng: number) => void;
}

export default function GeolocateButton({ onLocate }: GeolocateButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleClick = () => {
    if (!navigator.geolocation) return;

    setLoading(true);
    setError(false);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoading(false);
        onLocate(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setLoading(false);
        setError(true);
        setTimeout(() => setError(false), 3000);
      },
      { timeout: 8000, maximumAge: 60000 }
    );
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      title="Centralizar na minha localização"
      className={`
        flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold
        transition-all duration-150 active:scale-95 shrink-0
        ${error
          ? 'bg-red-50 text-red-500 border border-red-200'
          : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
        }
        disabled:opacity-60 disabled:cursor-not-allowed
      `}
    >
      {loading
        ? <Loader2 size={13} className="animate-spin" />
        : <Navigation size={13} />
      }
      {error ? 'Sem permissão' : 'Perto de mim'}
    </button>
  );
}