'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMap, Marker } from 'leaflet';
import type { Location } from '@/types';
import { ACTIVITY_TYPE_COLORS, ACTIVITY_TYPE_LABELS } from '@/lib/locationUtils';

interface MapViewProps {
  locations: Location[];
  selectedId?: string | null;
  onSelectLocation: (id: string) => void;
}

export default function MapView({ locations, selectedId, onSelectLocation }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Record<string, Marker>>({});

  // Inicializa o mapa uma única vez
  useEffect(() => {
    if (mapRef.current) return;
    if (!containerRef.current) return;

    let cancelled = false;

    import('leaflet').then((L) => {
      if (cancelled) return;
      if (mapRef.current) return;
      if (!containerRef.current) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(containerRef.current, {
        center: [-5.0892, -42.8019],
        zoom: 14,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Renderiza marcadores
  useEffect(() => {
    if (!locations.length) return;

    const interval = setInterval(() => {
      if (!mapRef.current) return;
      clearInterval(interval);

      import('leaflet').then((L) => {
        if (!mapRef.current) return;

        // Remove marcadores anteriores
        Object.values(markersRef.current).forEach((m) => m.remove());
        markersRef.current = {};

        locations.forEach((loc) => {
          const color = ACTIVITY_TYPE_COLORS[loc.type] ?? '#6b7280';
          const label = ACTIVITY_TYPE_LABELS[loc.type] ?? loc.type;

          const icon = L.divIcon({
            className: '',
            html: `
              <div style="
                width:44px;
                filter:drop-shadow(0 3px 6px rgba(0,0,0,0.2));
                cursor:pointer;
              ">
                <div style="
                  width:44px;height:44px;
                  background:white;
                  border:3px solid ${color};
                  border-radius:50% 50% 50% 0;
                  transform:rotate(-45deg);
                  display:flex;align-items:center;justify-content:center;
                ">
                  <span style="
                    transform:rotate(45deg);
                    font-size:18px;
                    line-height:1;
                  ">${getTypeEmoji(loc.type)}</span>
                </div>
              </div>
            `,
            iconSize: [44, 44],
            iconAnchor: [22, 44],
            popupAnchor: [0, -48],
          });

          const marker = L.marker([loc.latitude, loc.longitude], { icon }).addTo(mapRef.current!);

          marker.bindPopup(buildPopupHTML(loc, color, label), {
            maxWidth: 240,
            className: 'fitmap-popup',
          });

          markersRef.current[loc.id] = marker;
        });

        window.__fitmap_select = (id: string) => onSelectLocation(id);
      });
    }, 100);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations]);

  // Foca no marcador selecionado
  useEffect(() => {
    if (!selectedId || !mapRef.current) return;
    const marker = markersRef.current[selectedId];
    if (marker) {
      mapRef.current.setView(marker.getLatLng(), 16, { animate: true });
      marker.openPopup();
    }
  }, [selectedId]);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />
      <style>{`
        .fitmap-popup .leaflet-popup-content-wrapper {
          border-radius: 16px;
          padding: 0;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          border: 1px solid #f0f0f0;
          overflow: hidden;
        }
        .fitmap-popup .leaflet-popup-content {
          margin: 0;
          width: 220px !important;
        }
        .fitmap-popup .leaflet-popup-tip-container {
          margin-top: -1px;
        }
        .fitmap-popup .leaflet-popup-tip {
          background: white;
          box-shadow: none;
        }
        .leaflet-control-zoom {
          border: none !important;
          border-radius: 12px !important;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.1) !important;
        }
        .leaflet-control-zoom a {
          border: none !important;
          color: #111 !important;
          font-weight: 600 !important;
          font-size: 16px !important;
        }
        .leaflet-control-zoom a:hover {
          background: #f4f4f5 !important;
          color: #22c55e !important;
        }
      `}</style>
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%' }}
      />
    </>
  );
}

function buildPopupHTML(loc: Location, color: string, label: string): string {
  return `
    <div style="width:220px;font-family:system-ui,-apple-system,sans-serif;border-radius:16px;overflow:hidden;">

      <!-- Header colorido -->
      <div style="
        height:80px;
        background:linear-gradient(135deg, ${color}22, ${color}55);
        display:flex;align-items:center;justify-content:center;
        font-size:38px;
      ">${getTypeEmoji(loc.type)}</div>

      <!-- Conteúdo -->
      <div style="padding:14px 16px 16px;">

        <span style="
          font-size:10px;font-weight:600;letter-spacing:0.5px;
          text-transform:uppercase;
          color:${color};
          background:${color}18;
          padding:2px 8px;border-radius:20px;
          display:inline-block;margin-bottom:8px;
        ">${label}</span>

        <div style="font-size:14px;font-weight:700;color:#111;line-height:1.3;margin-bottom:6px;">
          ${loc.name}
        </div>

        ${loc.busiest_time ? `
          <div style="font-size:11px;color:#888;margin-bottom:12px;display:flex;align-items:center;gap:4px;">
            🕐 Pico: ${loc.busiest_time}
          </div>
        ` : '<div style="margin-bottom:12px;"></div>'}

        <button
          onclick="window.__fitmap_select('${loc.id}')"
          style="
            width:100%;padding:9px 12px;
            background:#111;color:white;
            border:none;border-radius:10px;
            cursor:pointer;font-size:12px;font-weight:600;
            letter-spacing:0.3px;
            transition:background 0.15s;
          "
          onmouseover="this.style.background='#22c55e'"
          onmouseout="this.style.background='#111'"
        >Ver detalhes →</button>

      </div>
    </div>
  `;
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

declare global {
  interface Window {
    __fitmap_select: (id: string) => void;
  }
}