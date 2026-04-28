'use client';

import { useEffect, useRef } from 'react';
import type { Map as LeafletMap, Marker } from 'leaflet';
import type { Location } from '@/types';
import { ACTIVITY_TYPE_COLORS, ACTIVITY_TYPE_LABELS, CROWD_LEVEL_LABELS } from '@/lib/locationUtils';

interface MapViewProps {
  locations: Location[];
  selectedId?: string | null;
  onSelectLocation: (id: string) => void;
  onMapReady?: (flyTo: (lat: number, lng: number) => void) => void;
}

function getTypeEmoji(type: string): string {
  const emojis: Record<string, string> = {
    corrida: '🏃',
    academia: '🏋️',
    calistenia: '💪',
    crossfit: '🔥',
    funcional: '⚡',
    luta: '🥋',
    esportes_coletivos: '⚽',
  };
  return emojis[type] || '📍';
}

export default function MapView({ locations, selectedId, onSelectLocation, onMapReady }: MapViewProps) {
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
      onMapReady?.((lat, lng) => {
        map.flyTo([lat, lng], 16, { animate: true, duration: 1.2 });
      });
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
                width:48px;
                filter:drop-shadow(0 4px 8px rgba(0,0,0,0.2));
                cursor:pointer;
                transition:transform 0.2s ease;
              " class="marker-container">
                <div style="
                  width:48px;height:48px;
                  background:linear-gradient(135deg, white 0%, #fafaf9 100%);
                  border:3px solid ${color};
                  border-radius:50% 50% 50% 0;
                  transform:rotate(-45deg);
                  display:flex;align-items:center;justify-content:center;
                  box-shadow:0 2px 8px rgba(0,0,0,0.1);
                ">
                  <span style="
                    transform:rotate(45deg);
                    font-size:20px;
                    line-height:1;
                  ">${getTypeEmoji(loc.type)}</span>
                </div>
              </div>
            `,
            iconSize: [48, 48],
            iconAnchor: [24, 48],
            popupAnchor: [0, -52],
          });

          const marker = L.marker([loc.latitude, loc.longitude], { icon }).addTo(mapRef.current!);

          // Popup moderno com estilo iOS
          marker.bindPopup(`
            <div style="
              width: 260px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              border-radius: 16px;
              overflow: hidden;
              background: white;
            ">
              ${loc.image_url ? `
                <div style="
                  position: relative;
                  width: 100%;
                  height: 120px;
                  overflow: hidden;
                ">
                  <img 
                    src="${loc.image_url}" 
                    alt="${loc.name}" 
                    style="
                      width: 100%;
                      height: 100%;
                      object-fit: cover;
                    "
                  />
                  <div style="
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: white;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 10px;
                    font-weight: 600;
                    color: ${color};
                    background: rgba(255,255,255,0.95);
                    backdrop-filter: blur(4px);
                  ">${label}</div>
                </div>
              ` : `
                <div style="
                  height: 60px;
                  background: linear-gradient(135deg, ${color}15 0%, ${color}30 100%);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 32px;
                ">${getTypeEmoji(loc.type)}</div>
              `}

              <div style="padding: 16px;">
                <h3 style="
                  font-size: 16px;
                  font-weight: 700;
                  color: #1c1917;
                  margin: 0 0 8px 0;
                  line-height: 1.3;
                ">${loc.name}</h3>

                ${loc.description ? `
                  <p style="
                    font-size: 12px;
                    color: #78716c;
                    margin: 0 0 12px 0;
                    line-height: 1.4;
                  ">${loc.description}</p>
                ` : ''}

                <div style="
                  display: flex;
                  gap: 8px;
                  flex-wrap: wrap;
                  margin-bottom: 16px;
                ">
                  ${loc.busiest_time ? `
                    <div style="
                      display: flex;
                      align-items: center;
                      gap: 4px;
                      background: #f5f5f4;
                      padding: 6px 10px;
                      border-radius: 8px;
                      font-size: 11px;
                      color: #57534e;
                    ">
                      <span>🕐</span>
                      <span style="font-weight: 500;">Pico: ${loc.busiest_time}</span>
                    </div>
                  ` : ''}
                  
                  ${loc.crowd_level ? `
                    <div style="
                      display: flex;
                      align-items: center;
                      gap: 4px;
                      background: ${loc.crowd_level === 'baixo' ? '#dcfce7' : loc.crowd_level === 'medio' ? '#fef9c3' : '#fee2e2'};
                      padding: 6px 10px;
                      border-radius: 8px;
                      font-size: 11px;
                      color: ${loc.crowd_level === 'baixo' ? '#16a34a' : loc.crowd_level === 'medio' ? '#ca8a04' : '#dc2626'};
                    ">
                      <span>👥</span>
                      <span style="font-weight: 500;">${CROWD_LEVEL_LABELS[loc.crowd_level]}</span>
                    </div>
                  ` : ''}
                </div>

                <button
                  onclick="window.__fitmap_select('${loc.id}')"
                  style="
                    width: 100%;
                    padding: 12px 16px;
                    background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    transition: transform 0.15s ease, box-shadow 0.15s ease;
                    box-shadow: 0 2px 8px ${color}40;
                  "
                  onmouseover="this.style.transform='translateY(-1px)';this.style.boxShadow='0 4px 12px ${color}50';"
                  onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 2px 8px ${color}40';"
                >
                  Ver detalhes →
                </button>
              </div>
            </div>
          `, {
            maxWidth: 280,
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
          border-radius: 20px !important;
          padding: 0 !important;
          box-shadow: 0 12px 48px rgba(0,0,0,0.15) !important;
          border: 1px solid rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        .fitmap-popup .leaflet-popup-content {
          margin: 0 !important;
          width: 260px !important;
        }
        .fitmap-popup .leaflet-popup-tip-container {
          display: none;
        }
        .leaflet-control-zoom {
          border: none !important;
          border-radius: 14px !important;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important;
        }
        .leaflet-control-zoom a {
          border: none !important;
          color: #44403c !important;
          font-weight: 600 !important;
          font-size: 18px !important;
          width: 38px !important;
          height: 38px !important;
          line-height: 38px !important;
        }
        .leaflet-control-zoom a:hover {
          background: #f5f5f4 !important;
          color: #16a34a !important;
        }
        .leaflet-control-zoom-in {
          border-radius: 14px 14px 0 0 !important;
        }
        .leaflet-control-zoom-out {
          border-radius: 0 0 14px 14px !important;
        }
      `}</style>
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%' }}
      />
    </>
  );
}

// Declare global window type
declare global {
  interface Window {
    __fitmap_select: (id: string) => void;
  }
}