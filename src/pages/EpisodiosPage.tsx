import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { EpisodeCard } from '../components/EpisodeCard';
import { EpisodeVibes } from '../effects/SectionBackgrounds';
import { EditorialHeader } from '../components/Editorial';
import { getContent } from '../data/content';
import { demoEpisodes } from '../data/episodes';
import { SEO } from '../components/SEO';

export const EpisodiosPage: React.FC = () => {
  const content = getContent();
  const location = useLocation();
  const autoOpenId = new URLSearchParams(location.search).get('ep');
  const autoOpenedRef = useRef(false);

  // Combinar: episodios del admin store + demo fallback
  const storeEps = content.episodios?.items || [];
  const allRaw = (storeEps.length > 0 ? storeEps : demoEpisodes).filter((e: any) => !e.hidden);

  // Ordenar mas reciente primero
  const allSorted = useMemo(() =>
    [...allRaw].sort((a, b) => (b.publishDate || '').localeCompare(a.publishDate || '')),
    [allRaw]
  );

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'free' | 'premium'>('all');

  // Mapa de id -> numero (mas antiguo = #1, mas reciente = mayor numero)
  const episodeNumberMap = useMemo(() => {
    const byDate = [...allRaw].sort((a, b) => (a.publishDate || '').localeCompare(b.publishDate || ''));
    const map: Record<string, number> = {};
    byDate.forEach((ep, i) => { map[ep.id] = i + 1; });
    return map;
  }, [allRaw]);

  const filtered = useMemo(() => {
    let eps = allSorted;
    if (search) {
      const q = search.toLowerCase().trim();
      const numMatch = q.match(/^#?(\d+)$/);
      if (numMatch) {
        const num = parseInt(numMatch[1]);
        eps = eps.filter(e => episodeNumberMap[e.id] === num);
      } else {
        eps = eps.filter(e => e.city.toLowerCase().includes(q) || e.title.toLowerCase().includes(q));
      }
    }
    if (filter === 'free') eps = eps.filter(e => !e.isPremium);
    if (filter === 'premium') eps = eps.filter(e => e.isPremium);
    return eps;
  }, [allSorted, search, filter, episodeNumberMap]);

  const cities = useMemo(() => [...new Set(allSorted.map(e => e.city))], [allSorted]);

  const newestId = allSorted.length > 0 ? allSorted[0].id : null;

  return (
    <section className="relative pt-28 sm:pt-32 pb-24 px-4 sm:px-6 min-h-screen">
      <SEO title="Episodios" description="Todos los episodios de sodaroja. Historias reales de ciudades del mundo." />
      <EpisodeVibes />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="pt-4">
          <EditorialHeader
            label={`${filtered.length} episodios`}
            title="Todos los"
            titleAccent="episodios"
          />
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10 sm:mb-14">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-soda-fog/30" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por ciudad o #número..." className="w-full bg-soda-night/50 border border-soda-mist/10 rounded-sm pl-9 pr-4 py-2.5 text-soda-lamp text-sm font-light focus:border-soda-red/30 focus:outline-none focus:ring-1 focus:ring-soda-red/10 transition-colors duration-500" />
          </div>
          <div className="flex gap-2">
            {(['all', 'free', 'premium'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`font-sans px-4 py-2.5 rounded-sm text-[10px] tracking-[0.15em] uppercase transition-all duration-500 border ${filter === f ? 'border-soda-red/30 text-soda-lamp bg-soda-red/8' : 'border-soda-mist/10 text-soda-fog/35 hover:text-soda-fog/55'}`}>
                {f === 'all' ? 'TODOS' : f === 'free' ? 'ABIERTOS' : 'FRECUENCIA INTERNA'}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((episode: any, index: number) => (
            <motion.div key={episode.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: Math.min(index * 0.1, 0.8), ease: 'easeOut' }}>
              <EpisodeCard
                episode={episode}
                isNewest={episode.id === newestId}
                episodeNumber={episodeNumberMap[episode.id]}
                autoOpen={!autoOpenedRef.current && episode.id === autoOpenId ? (autoOpenedRef.current = true, true) : false}
              />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16"><p className="text-soda-fog text-lg">No se encontraron episodios</p></div>
        )}

        <div className="text-center mt-12 sm:mt-16"><p className="text-soda-fog/40 text-[11px] tracking-wider">Más episodios próximamente</p></div>
      </div>
    </section>
  );
};
