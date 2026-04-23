'use client';

import { useEffect, useRef } from 'react';
import type { Location } from '@/types';
import { ACTIVITY_TYPE_COLORS, ACTIVITY_TYPE_LABELS } from '@/lib/locationUtils';

interface MapViewProps {
  locations: Location[];
  selectedId?: string | null;
  onSelectLocation: (id: string) => void;
}

export default function MapView({ locations, selectedId, onSelectLocation }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    if (!mapRef.current) return;

    initializedRef.current = true;

    import('leaflet').then((L) => {
      if (mapInstanceRef.current) return;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!, {
        center: [-5.0892, -42.8019],
        zoom: 14,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    });

  }, []);

  // Renderiza marcadores quando locations ou mapa mudam
  useEffect(() => {
    if (!locations.length) return;

    const tryRender = () => {
      if (!mapInstanceRef.current) {
        setTimeout(tryRender, 200);
        return;
      }

      import('leaflet').then((L) => {
        const map = mapInstanceRef.current!;

        // Remove marcadores antigos
        Object.values(markersRef.current).forEach((m) => m.remove());
        markersRef.current = {};

        locations.forEach((loc) => {
          const color = ACTIVITY_TYPE_COLORS[loc.type] ?? '#6b7280';
          const label = ACTIVITY_TYPE_LABELS[loc.type] ?? loc.type;

          const icon = L.divIcon({
            className: '',
            html: `
              <div style="
                width:48px;
                filter:drop-shadow(0 4px 8px rgba(0,0,0,0.25));
              ">
                <div style="
                  width:48px;height:48px;
                  background:white;
                  border:3px solid ${color};
                  border-radius:50% 50% 50% 0;
                  transform:rotate(-45deg);
                  display:flex;align-items:center;justify-content:center;
                ">
                  <div style="
                    transform:rotate(45deg);
                    width:28px;height:28px;
                    background:${color}22;
                    border-radius:50%;
                    display:flex;align-items:center;justify-content:center;
                    font-size:14px;
                  ">${getTypeEmoji(loc.type)}</div>
                </div>
              </div>`,
            iconSize: [48, 48],
            iconAnchor: [24, 48],
            popupAnchor: [0, -52],
          });

          const marker = L.marker([loc.latitude, loc.longitude], { icon }).addTo(map);

          marker.bindPopup(`
            <div style="width:220px;font-family:system-ui,sans-serif;">
              <div style="
                height:90px;
                background:linear-gradient(135deg,${color}33,${color}88);
                display:flex;align-items:center;justify-content:center;
                font-size:40px;
                margin:-14px -20px 12px -20px;
                width:calc(100% + 40px);
              ">${getTypeEmoji(loc.type)}</div>

              <span style="
                font-size:10px;font-weight:600;
                color:${color};background:${color}18;
                padding:2px 8px;border-radius:20px;
                text-transform:uppercase;letter-spacing:0.5px;
              ">${label}</span>

              <strong style="display:block;font-size:14px;color:#111;margin:6px 0 4px;line-height:1.3;">
                ${loc.name}
              </strong>

              ${loc.busiest_time
                ? `<p style="font-size:11px;color:#666;margin:0 0 10px;">🕐 Pico: ${loc.busiest_time}</p>`
                : '<div style="margin-bottom:10px;"></div>'
              }

              <button
                onclick="window.__fitmap_select('${loc.id}')"
                style="
                  width:100%;padding:8px;
                  background:#111;color:white;
                  border:none;border-radius:8px;
                  cursor:pointer;font-size:12px;font-weight:600;
                "
              >Ver detalhes →</button>
            </div>
          `, { maxWidth: 240, className: 'fitmap-popup' });

          markersRef.current[loc.id] = marker;
        });

        window.__fitmap_select = (id: string) => onSelectLocation(id);
      });
    };

    tryRender();
  }, [locations]);

  // Foca marcador selecionado
  useEffect(() => {
    if (!selectedId || !mapInstanceRef.current) return;
    const marker = markersRef.current[selectedId];
    if (marker) {
      mapInstanceRef.current.setView(marker.getLatLng(), 16, { animate: true });
      marker.openPopup();
    }
  }, [selectedId]);

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>{`
        .fitmap-popup .leaflet-popup-content-wrapper {
          border-radius: 14px;
          padding: 14px 20px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
          border: 1px solid #f0f0f0;
        }
        .fitmap-popup .leaflet-popup-content { margin: 0; }
        .fitmap-popup .leaflet-popup-tip { background: white; }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 2px 12px rgba(0,0,0,0.12) !important;
          border-radius: 10px !important;
          overflow: hidden;
        }
        .leaflet-control-zoom a {
          border: none !important;
          color: #111 !important;
          font-weight: 700 !important;
        }
      `}</style>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </>
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

declare global {
  interface Window {
    __fitmap_select: (id: string) => void;
  }
}