'use client';

import { useEffect, useRef } from 'react';
import type { Location } from '@/types';
import { ACTIVITY_TYPE_COLORS } from '@/lib/locationUtils';

interface MapViewProps {
  locations: Location[];
  selectedId?: string | null;
  onSelectLocation: (id: string) => void;
}

export default function MapView({ locations, selectedId, onSelectLocation }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current || instanceRef.current) return;

    import('leaflet').then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!, {
        center: [-5.0892, -42.8019],
        zoom: 13,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      instanceRef.current = { map, markers: {} as Record<string, L.Marker> };
    });

    return () => {
      instanceRef.current?.map?.remove();
      instanceRef.current = null;
    };
  }, []);

  // Atualiza marcadores quando locations mudam
  useEffect(() => {
    if (!instanceRef.current) return;

    import('leaflet').then((L) => {
      const { map, markers } = instanceRef.current;

      // Remove marcadores antigos
      Object.values(markers).forEach((m) => (m as L.Marker).remove());
      instanceRef.current.markers = {};

      locations.forEach((loc) => {
        const color = ACTIVITY_TYPE_COLORS[loc.type] ?? '#6b7280';

        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width:28px;height:28px;
            background:${color};
            border:3px solid white;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            box-shadow:2px 2px 6px rgba(0,0,0,0.25);
          "></div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 28],
          popupAnchor: [0, -32],
        });

        const marker = L.marker([loc.latitude, loc.longitude], { icon }).addTo(map);

        marker.bindPopup(`
          <div style="min-width:160px;font-family:system-ui,sans-serif;">
            <strong style="font-size:13px;">${loc.name}</strong>
            <br/>
            <button
              onclick="window.__fitmap_select('${loc.id}')"
              style="margin-top:8px;padding:5px 10px;background:#111;color:white;
                     border:none;border-radius:6px;cursor:pointer;font-size:12px;width:100%"
            >Ver detalhes →</button>
          </div>
        `);

        instanceRef.current.markers[loc.id] = marker;
      });

      window.__fitmap_select = (id: string) => onSelectLocation(id);
    });
  }, [locations]);

  // Foca no marcador selecionado
  useEffect(() => {
    if (!selectedId || !instanceRef.current) return;
    const { map, markers } = instanceRef.current;
    const marker = markers[selectedId];
    if (marker) {
      map.setView(marker.getLatLng(), 16, { animate: true });
      marker.openPopup();
    }
  }, [selectedId]);

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} className="w-full h-full rounded-xl" />
    </>
  );
}

declare global {
  interface Window {
    __fitmap_select: (id: string) => void;
  }
}