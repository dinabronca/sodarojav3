import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getContent } from '../data/content';
import { demoEpisodes } from '../data/episodes';

const cityCoords: Record<string, { lat: number; lng: number }> = {
  'NUEVA YORK': { lat: 40.7128, lng: -74.0060 },
  'PRAGA': { lat: 50.0875, lng: 14.4214 },
  'ESTAMBUL': { lat: 41.0082, lng: 28.9784 },
  'BUENOS AIRES': { lat: -34.6037, lng: -58.3816 },
  'TOKIO': { lat: 35.6762, lng: 139.6503 },
  'PARIS': { lat: 48.8566, lng: 2.3522 },
  'CIUDAD DE MEXICO': { lat: 19.4326, lng: -99.1332 },
  'RIO DE JANEIRO': { lat: -22.9068, lng: -43.1729 },
  'BERLIN': { lat: 52.5200, lng: 13.4050 },
  'MADRID': { lat: 40.4168, lng: -3.7038 },
  'ROMA': { lat: 41.9028, lng: 12.4964 },
  'LONDRES': { lat: 51.5074, lng: -0.1278 },
  'BANGKOK': { lat: 13.7563, lng: 100.5018 },
  'MARRAKECH': { lat: 31.6295, lng: -7.9811 },
  'SYDNEY': { lat: -33.8688, lng: 151.2093 },
  'LIMA': { lat: -12.0464, lng: -77.0428 },
  'BOGOTA': { lat: 4.7110, lng: -74.0721 },
  'SANTIAGO': { lat: -33.4489, lng: -70.6693 },
  'COPENHAGUE': { lat: 55.6761, lng: 12.5683 },
  'OTTAWA': { lat: 45.4215, lng: -75.6972 },
  'AMSTERDAM': { lat: 52.3676, lng: 4.9041 },
  'BARCELONA': { lat: 41.3851, lng: 2.1734 },
  'VIENA': { lat: 48.2082, lng: 16.3738 },
  'DUBAI': { lat: 25.2048, lng: 55.2708 },
  'SINGAPUR': { lat: 1.3521, lng: 103.8198 },
  'SEOUL': { lat: 37.5665, lng: 126.9780 },
  'SEUL': { lat: 37.5665, lng: 126.9780 },
  'CAIRO': { lat: 30.0444, lng: 31.2357 },
  'EL CAIRO': { lat: 30.0444, lng: 31.2357 },
  'NAIROBI': { lat: -1.2921, lng: 36.8219 },
  'MUMBAI': { lat: 19.0760, lng: 72.8777 },
  'SHANGHAI': { lat: 31.2304, lng: 121.4737 },
  'TORONTO': { lat: 43.6532, lng: -79.3832 },
  'LISBOA': { lat: 38.7223, lng: -9.1393 },
  'MOSCU': { lat: 55.7558, lng: 37.6173 },
  'MOSKOW': { lat: 55.7558, lng: 37.6173 },
  'ATHENAS': { lat: 37.9838, lng: 23.7275 },
  'ATENAS': { lat: 37.9838, lng: 23.7275 },
};

const normalize = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().trim();

const loadLeaflet = (): Promise<any> =>
  new Promise((resolve, reject) => {
    if ((window as any).L) { resolve((window as any).L); return; }
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => resolve((window as any).L);
    script.onerror = () => reject(new Error('Leaflet fail'));
    document.head.appendChild(script);
  });

interface EpCity {
  id: string; city: string; title: string; description: string;
  imageUrl: string; isPremium: boolean; publishDate?: string;
  coords: { lat: number; lng: number }; epNumber: number;
  country?: string;
}

interface HoverCard {
  ep: EpCity;
  x: number; // pixel position in map container
  y: number;
}

export const DestinationsMap: React.FC = () => {
  const content = getContent();
  const storeEps = content.episodios?.items || [];
  const episodes = storeEps.length > 0 ? storeEps : demoEpisodes;
  const navigate = useNavigate();

  const mapRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const isZoomingRef = useRef(false);

  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [hoverCard, setHoverCard] = useState<HoverCard | null>(null);
  const [scrollLocked, setScrollLocked] = useState(false);
  const hoverTimeout = useRef<any>(null);

  // Deduplicate: one entry per city (most recent episode per city)
  const cities: EpCity[] = React.useMemo(() => {
    const byDate = [...episodes].sort((a: any, b: any) =>
      (b.publishDate || '').localeCompare(a.publishDate || '')
    );
    const seen = new Set<string>();
    const result: EpCity[] = [];
    byDate.forEach((e: any, idx: number) => {
      const coords = (e.lat && e.lng)
        ? { lat: e.lat, lng: e.lng }
        : cityCoords[normalize(e.city)] || null;
      if (!coords) return;
      const key = normalize(e.city);
      if (seen.has(key)) return;
      seen.add(key);
      result.push({ ...e, coords, epNumber: episodes.length - idx });
    });
    return result;
  }, [episodes]);

  // Scroll lock: clicking inside map locks scroll wheel to zoom
  const handleMapClick = useCallback(() => {
    if (!scrollLocked) {
      setScrollLocked(true);
      if (mapInstance.current) {
        mapInstance.current.scrollWheelZoom.enable();
      }
    }
  }, [scrollLocked]);

  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setScrollLocked(false);
      if (mapInstance.current) {
        mapInstance.current.scrollWheelZoom.disable();
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [handleOutsideClick]);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    let cancelled = false;

    loadLeaflet().then((L) => {
      if (cancelled || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [20, 10],
        zoom: 2,
        minZoom: 2,
        maxZoom: 10,
        zoomControl: false,
        attributionControl: false,
        // Scroll wheel DISABLED by default — only enabled after clicking inside map
        scrollWheelZoom: false,
        worldCopyJump: true,
        // Prevent dragging to blank world edges
        maxBounds: [[-90, -220], [90, 220]],
        maxBoundsViscosity: 0.85,
      });

      // Tile layer — dark nolabels
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd', maxZoom: 19, minZoom: 2,
      }).addTo(map);

      // Zoom control — bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Attribution — minimal
      L.control.attribution({ prefix: false, position: 'bottomleft' }).addTo(map);

      // Create custom markers
      cities.forEach((ep) => {
        const icon = L.divIcon({
          className: 'sr-marker',
          html: `<div class="sr-dot"></div><div class="sr-pulse"></div>`,
          iconSize: [18, 18], iconAnchor: [9, 9],
        });

        const marker = L.marker([ep.coords.lat, ep.coords.lng], { icon }).addTo(map);

        // Store ep data on marker for hover
        (marker as any)._epData = ep;

        // Hover → show custom card preview
        marker.on('mouseover', (e: any) => {
          clearTimeout(hoverTimeout.current);
          if (!containerRef.current) return;
          const containerRect = containerRef.current.getBoundingClientRect();
          const markerPt = map.latLngToContainerPoint([ep.coords.lat, ep.coords.lng]);
          // Position card above/to the right of marker
          let x = markerPt.x + 16;
          let y = markerPt.y - 120;
          // Keep within bounds
          if (x + 240 > containerRect.width) x = markerPt.x - 256;
          if (y < 0) y = markerPt.y + 24;
          setHoverCard({ ep, x, y });
          // Pulse the dot
          marker.getElement()?.querySelector('.sr-dot')?.classList.add('sr-dot-hover');
        });

        marker.on('mouseout', () => {
          hoverTimeout.current = setTimeout(() => setHoverCard(null), 180);
          marker.getElement()?.querySelector('.sr-dot')?.classList.remove('sr-dot-hover');
        });

        // Click → cinematic zoom + navigate to specific episode
        marker.on('click', () => {
          if (isZoomingRef.current) return;
          isZoomingRef.current = true;
          setHoverCard(null);

          map.flyTo([ep.coords.lat, ep.coords.lng], 6, {
            animate: true,
            duration: 1.4,
            easeLinearity: 0.25,
          });

          setTimeout(() => {
            isZoomingRef.current = false;
            navigate(`/episodios?ep=${ep.id}`);
          }, 1500);
        });
      });

      // Fit to all markers on load
      if (cities.length > 1) {
        const bounds = L.latLngBounds(cities.map((c) => [c.coords.lat, c.coords.lng]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 4 });
      } else if (cities.length === 1) {
        map.setView([cities[0].coords.lat, cities[0].coords.lng], 4);
      }

      mapInstance.current = map;
      setLoaded(true);

      // Fix: invalidate size after mount (prevents gray tiles bug)
      setTimeout(() => map.invalidateSize(), 100);
    }).catch(() => setError(true));

    return () => {
      cancelled = true;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const formatDate = (d?: string) => {
    if (!d) return '';
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const dt = new Date(d + 'T00:00:00');
    return `${months[dt.getMonth()]} ${dt.getFullYear()}`;
  };

  return (
    <section className="relative py-20 sm:py-28 px-6 overflow-hidden">
      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[{x:10,y:15},{x:85,y:25},{x:30,y:70},{x:65,y:45},{x:50,y:85},{x:90,y:65},{x:20,y:40},{x:75,y:80}].map((p, i) => (
          <div key={'mp-'+i} className="absolute rounded-full animate-float"
            style={{ left:p.x+'%', top:p.y+'%', width:2, height:2, background:'rgba(196,85,85,0.4)', animationDuration:(8+i*2)+'s', animationDelay:(i*0.8)+'s' }}
          />
        ))}
      </div>

      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <div className="flex items-center gap-3 mb-5 justify-center">
            <div className="w-10 h-px bg-soda-red" />
            <span className="text-soda-red text-[10px] tracking-[0.3em] uppercase font-light">Mapa de viajes</span>
            <div className="w-10 h-px bg-soda-red" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-soda-glow leading-[1.1] text-center mb-10">
            Donde <em className="text-soda-red">estuvimos</em>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ duration:0.8 }}
          className="relative w-full rounded-sm overflow-hidden border border-soda-mist/10"
          style={{ height: '420px' }}
          ref={containerRef}
          onClick={handleMapClick}
        >
          <div ref={mapRef} className="w-full h-full" style={{ background:'#0d1117' }} />

          {/* Loading state */}
          {!loaded && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-soda-deep/80 z-[500]">
              <div className="text-soda-lamp/40 text-xs tracking-wider animate-pulse">Cargando mapa...</div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-soda-deep z-[500]">
              <p className="text-soda-lamp/50 text-sm">No se pudo cargar el mapa</p>
            </div>
          )}

          {/* Scroll hint */}
          {loaded && !scrollLocked && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[400]">
              <div className="bg-soda-night/0 rounded-sm" />
            </div>
          )}

          {/* Click-to-enable hint */}
          {loaded && !scrollLocked && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-soda-night/80 backdrop-blur-sm px-3 py-1.5 rounded-sm border border-soda-mist/10 pointer-events-none">
              <span className="text-soda-lamp/45 text-[9px] tracking-[0.15em]">Click para activar scroll en el mapa</span>
            </div>
          )}

          {/* Counter badge */}
          <div className="absolute bottom-3 left-3 z-[1000] flex items-center gap-2 bg-soda-night/80 px-3 py-1.5 rounded-sm backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-soda-red/70" />
            <span className="text-soda-lamp/50 text-[9px] tracking-wider">{cities.length} ciudades visitadas</span>
          </div>

          {/* Reset view button */}
          {loaded && (
            <button
              className="absolute bottom-3 right-16 z-[1000] flex items-center gap-1.5 bg-soda-night/80 border border-soda-mist/10 px-3 py-1.5 rounded-sm backdrop-blur-sm hover:border-soda-mist/25 transition-colors duration-300"
              onClick={(e) => {
                e.stopPropagation();
                if (mapInstance.current && cities.length > 0) {
                  const L = (window as any).L;
                  if (cities.length > 1) {
                    const bounds = L.latLngBounds(cities.map((c: EpCity) => [c.coords.lat, c.coords.lng]));
                    mapInstance.current.flyToBounds(bounds, { padding: [40, 40], maxZoom: 4, duration: 1.2 });
                  } else {
                    mapInstance.current.flyTo([cities[0].coords.lat, cities[0].coords.lng], 4, { duration: 1.2 });
                  }
                }
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 1v3M5 1L3 3M5 1l2 2M9 5H6M9 5l-2-2M9 5l-2 2M5 9V6M5 9L3 7M5 9l2-2M1 5h3M1 5l2-2M1 5l2 2" stroke="rgba(212,197,176,0.5)" strokeWidth="1" strokeLinecap="round"/>
              </svg>
              <span className="text-soda-lamp/45 text-[9px] tracking-wider">Reset</span>
            </button>
          )}

          {/* Custom hover card — React-rendered, not Leaflet popup */}
          <AnimatePresence>
            {hoverCard && (
              <motion.div
                key={hoverCard.ep.id}
                initial={{ opacity: 0, scale: 0.92, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 4 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="absolute z-[2000] pointer-events-none"
                style={{ left: hoverCard.x, top: hoverCard.y, width: 240 }}
                onMouseEnter={() => clearTimeout(hoverTimeout.current)}
              >
                <div className="bg-soda-night/97 border border-soda-mist/15 rounded-sm overflow-hidden shadow-2xl"
                  style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(196,85,85,0.08)' }}>
                  {/* Image */}
                  {hoverCard.ep.imageUrl && (
                    <div className="relative w-full overflow-hidden" style={{ height: 110 }}>
                      <img
                        src={hoverCard.ep.imageUrl}
                        alt={hoverCard.ep.city}
                        className="w-full h-full object-cover"
                        style={{ filter: 'brightness(0.85) saturate(0.9)' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-soda-night/80 via-transparent to-transparent" />
                      {/* EP number overlay */}
                      <span className="absolute top-2 right-2 text-soda-glow/70 text-[9px] font-mono tracking-wider bg-soda-night/70 px-2 py-1 rounded-sm">
                        EP. {String(hoverCard.ep.epNumber).padStart(3, '0')}
                      </span>
                    </div>
                  )}
                  {/* Info */}
                  <div className="p-3">
                    <p className="text-soda-accent/80 text-[9px] tracking-[0.2em] uppercase mb-1">
                      {hoverCard.ep.city}{hoverCard.ep.country ? `, ${hoverCard.ep.country}` : ''}
                      {hoverCard.ep.publishDate && (
                        <span className="text-soda-lamp/30 ml-2">· {formatDate(hoverCard.ep.publishDate)}</span>
                      )}
                    </p>
                    <p className="text-soda-lamp/90 text-[11px] font-sans leading-snug mb-2 line-clamp-2">
                      &ldquo;{hoverCard.ep.title}&rdquo;
                    </p>
                    <p className="text-soda-red/60 text-[9px] tracking-[0.15em] uppercase">
                      Click para ver episodio →
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Cities without coords warning — shown only in dev/when there are misses */}
        {(() => {
          const missing = episodes
            .filter((e: any) => !e.lat && !e.lng && !cityCoords[normalize(e.city)])
            .map((e: any) => e.city);
          if (missing.length === 0) return null;
          return (
            <p className="text-soda-lamp/20 text-[9px] text-center mt-3 tracking-wide">
              {missing.length} ciudad{missing.length > 1 ? 'es' : ''} sin coordenadas: {missing.slice(0, 3).join(', ')}{missing.length > 3 ? '...' : ''}
            </p>
          );
        })()}
      </div>
    </section>
  );
};
