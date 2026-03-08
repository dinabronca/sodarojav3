import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
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
};

const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();

const loadLeaflet = (): Promise<any> => {
  return new Promise((resolve, reject) => {
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
};

export const DestinationsMap: React.FC = () => {
  const content = getContent();
  const storeEps = content.episodios?.items || [];
  const episodes = storeEps.length > 0 ? storeEps : demoEpisodes;
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const cities = episodes.map((e: any, idx: number) => {
    const coords = e.lat && e.lng ? { lat: e.lat, lng: e.lng } : cityCoords[normalize(e.city)] || null;
    return coords ? { ...e, coords, epNumber: episodes.length - idx } : null;
  }).filter(Boolean);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    let cancelled = false;
    loadLeaflet().then((L) => {
      if (cancelled || !mapRef.current) return;
      const map = L.map(mapRef.current, {
        center: [20, 10], zoom: 2, minZoom: 2, maxZoom: 12,
        zoomControl: false, attributionControl: false, scrollWheelZoom: true, worldCopyJump: true, maxBoundsViscosity: 1.0,
      });
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd', maxZoom: 19,
      }).addTo(map);
      L.control.zoom({ position: 'bottomright' }).addTo(map);
      const redIcon = L.divIcon({
        className: 'sr-marker',
        html: '<div class="sr-dot"></div><div class="sr-pulse"></div>',
        iconSize: [18, 18], iconAnchor: [9, 9],
      });
      cities.forEach((ep: any) => {
        const marker = L.marker([ep.coords.lat, ep.coords.lng], { icon: redIcon }).addTo(map);
        const num = String(ep.epNumber).padStart(3, '0');
        const popup = '<div style="font-family:Inter,sans-serif;padding:4px 0;">'
          + '<div style="color:#d4c5b0;font-size:10px;letter-spacing:0.15em;margin-bottom:4px;">' + ep.city + (ep.country ? ', ' + ep.country : '') + '</div>'
          + '<div style="color:#e8e0d4;font-size:14px;margin-bottom:6px;">\u201C' + ep.title + '\u201D</div>'
          + '<div style="display:flex;align-items:center;justify-content:space-between;">'
          + '<span style="color:rgba(196,85,85,0.8);font-size:10px;font-family:monospace;">EP. ' + num + '</span>'
          + '<span class="sr-goto" data-epid="' + ep.id + '" style="color:rgba(196,85,85,0.9);font-size:10px;cursor:pointer;letter-spacing:0.1em;">VER EPISODIO \u2192</span>'
          + '</div></div>';
        marker.bindPopup(popup, { className: 'sr-popup-wrap', closeButton: false, offset: [0, -6] });
      });
      map.on('popupopen', () => {
        setTimeout(() => {
          document.querySelectorAll('.sr-goto').forEach((el: any) => { el.onclick = () => navigate('/episodios'); });
        }, 30);
      });
      if (cities.length > 1) {
        const bounds = L.latLngBounds(cities.map((c: any) => [c.coords.lat, c.coords.lng]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 4 });
      }
      mapInstance.current = map;
      setLoaded(true);
    }).catch(() => setError(true));
    return () => { cancelled = true; if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; } };
  }, []);

  return (
    <section className="relative py-20 sm:py-28 px-6 overflow-hidden">
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[{x:10,y:15},{x:85,y:25},{x:30,y:70},{x:65,y:45},{x:50,y:85},{x:90,y:65},{x:20,y:40},{x:75,y:80}].map((p: any, i: number) => (
          <div key={'mp-'+i} className="absolute rounded-full animate-float" style={{ left:p.x+'%', top:p.y+'%', width:2, height:2, background:'rgba(196,85,85,0.4)', animationDuration:(8+i*2)+'s', animationDelay:(i*0.8)+'s' }} />
        ))}
      </div>
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <div className="flex items-center gap-3 mb-5 justify-center">
            <div className="w-10 h-px bg-soda-red" />
            <span className="text-soda-red text-[10px] tracking-[0.3em] uppercase font-light">Mapa de viajes</span>
            <div className="w-10 h-px bg-soda-red" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-soda-glow leading-[1.1] text-center mb-10">
            Donde <em className="text-soda-red">estuvimos</em>
          </h2>
        </motion.div>
        <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ duration:0.8 }}
          className="relative w-full rounded-sm overflow-hidden border border-soda-mist/10" style={{ height:'420px' }}>
          <div ref={mapRef} className="w-full h-full" style={{ background:'#0d1117' }} />
          {!loaded && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-soda-deep/80 z-[500]">
              <div className="text-soda-lamp/40 text-xs tracking-wider animate-pulse">Cargando mapa...</div>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-soda-deep z-[500]">
              <p className="text-soda-lamp/50 text-sm">No se pudo cargar el mapa</p>
            </div>
          )}
          <div className="absolute bottom-3 left-3 z-[1000] flex items-center gap-2 bg-soda-night/80 px-3 py-1.5 rounded-sm backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-soda-red/70" />
            <span className="text-soda-lamp/50 text-[9px] tracking-wider">{cities.length} ciudades visitadas</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
