import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useLocation, useParams } from 'react-router-dom';
import { EpisodeCard } from '../components/EpisodeCard';
import { EpisodeVibes } from '../effects/SectionBackgrounds';
import { EditorialHeader } from '../components/Editorial';
import { getContent } from '../data/content';
import { demoEpisodes } from '../data/episodes';
import { SEO } from '../components/SEO';

export const EpisodiosPage: React.FC = () => {
  const content = getContent();
  const location = useLocation();
  const { slug } = useParams<{ slug?: string }>();
  const autoOpenId = new URLSearchParams(location.search).get('ep') || null;
  const autoOpenedRef = useRef(false);

  // Combinar: episodios del admin store + demo fallback
  const storeEps = content.episodios?.items || [];
  const allRaw = (storeEps.length > 0 ? storeEps : demoEpisodes).filter((e: any) => !e.hidden);

  // Support slug URLs like /episodios/008-bangkok
  const slugAutoOpenId = useMemo(() => {
    if (!slug) return null;
    const numMatch = slug.match(/^(\d+)-/);
    if (!numMatch) return null;
    const num = parseInt(numMatch[1]);
    const byDate = [...allRaw].sort((a: any, b: any) => (a.publishDate || '').localeCompare(b.publishDate || ''));
    return byDate[num - 1]?.id || null;
  }, [slug, allRaw]);
  const effectiveAutoOpenId = autoOpenId || slugAutoOpenId;

  // Ordenar mas reciente primero
  const allSorted = useMemo(() =>
    [...allRaw].sort((a, b) => (b.publishDate || '').localeCompare(a.publishDate || '')),
    [allRaw]
  );

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [duration, setDuration] = useState<'all' | 'short' | 'medium' | 'long'>('all');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const citySuggestions = useMemo(() => {
    if (!search || search.length < 2) return [];
    const q = search.toLowerCase();
    return [...new Set(allSorted.map((e: any) => e.city))]
      .filter(city => city.toLowerCase().includes(q))
      .slice(0, 5);
  }, [search, allSorted]);

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
    if (duration === 'short') eps = eps.filter((e: any) => (e.durationMin || 0) < 35);
    if (duration === 'medium') eps = eps.filter((e: any) => (e.durationMin || 0) >= 35 && (e.durationMin || 0) <= 55);
    if (duration === 'long') eps = eps.filter((e: any) => (e.durationMin || 0) > 55);
    return eps;
  }, [allSorted, search, filter, duration, episodeNumberMap]); // eslint-disable-line

  const cities = useMemo(() => [...new Set(allSorted.map(e => e.city))], [allSorted]);

  const newestId = allSorted.length > 0 ? allSorted[0].id : null;

  return (
    <section className="relative pt-28 sm:pt-32 pb-24 px-6 min-h-screen">
      <SEO title="Episodios" description="Todos los episodios de sodaroja. Historias reales de ciudades del mundo." />
      <EpisodeVibes />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="pt-4">
          <EditorialHeader
            label={`${filtered.length} episodios`}
            title="Todos los"
            titleAccent="episodios"
          />
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10 sm:mb-14">
          <div className="relative flex-1" style={{ position: "relative" }}>
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-soda-fog/30" />
            <input type="text" value={search}
              onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Buscar por ciudad o #número..."
              className="w-full bg-soda-night/50 border border-soda-mist/10 rounded-sm pl-9 pr-4 py-2.5 text-soda-lamp text-sm font-light focus:border-soda-red/30 focus:outline-none focus:ring-1 focus:ring-soda-red/10 transition-colors duration-500" />
            {showSuggestions && citySuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-sm overflow-hidden"
                style={{ background: 'rgba(14,18,28,0.98)', border: '1px solid rgba(212,197,176,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                {citySuggestions.map(city => (
                  <button key={city} onMouseDown={() => { setSearch(city); setShowSuggestions(false); }}
                    className="w-full text-left px-4 py-2.5 text-soda-lamp/70 hover:text-soda-lamp hover:bg-soda-red/5 transition-colors duration-200 font-sans"
                    style={{ fontSize: '13px', borderBottom: '1px solid rgba(212,197,176,0.04)' }}>
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'free', 'premium'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`font-sans px-4 py-2.5 rounded-sm text-[10px] tracking-[0.15em] uppercase transition-all duration-500 border ${filter === f ? 'border-soda-red/30 text-soda-lamp bg-soda-red/8' : 'border-soda-mist/10 text-soda-fog/35 hover:text-soda-fog/55'}`}>
                {f === 'all' ? 'TODOS' : f === 'free' ? 'ABIERTOS' : 'FRECUENCIA INTERNA'}
              </button>
            ))}
            <div className="w-px self-stretch" style={{ background: 'rgba(212,197,176,0.08)' }} />
            {([
              { id: 'all', label: 'DURACIÓN' },
              { id: 'short', label: '< 35min' },
              { id: 'medium', label: '35–55min' },
              { id: 'long', label: '> 55min' },
            ] as const).map(d => (
              <button key={d.id} onClick={() => setDuration(d.id)} className={`font-sans px-3 py-2.5 rounded-sm text-[10px] tracking-[0.12em] uppercase transition-all duration-500 border ${duration === d.id ? 'border-soda-accent/30 text-soda-lamp bg-soda-accent/8' : 'border-soda-mist/10 text-soda-fog/30 hover:text-soda-fog/55'}`}>
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((episode: any, index: number) => (
            <motion.div key={episode.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: Math.min(index * 0.1, 0.8), ease: 'easeOut' }}>
              <EpisodeCard
                episode={episode}
                isNewest={episode.id === newestId}
                episodeNumber={episodeNumberMap[episode.id]}
                autoOpen={!autoOpenedRef.current && episode.id === effectiveAutoOpenId ? (autoOpenedRef.current = true, true) : false}
              />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-soda-red/20 to-transparent mx-auto mb-6" />
            <p className="font-sans text-soda-lamp/30 mb-2" style={{ fontSize: '13px', fontWeight: 300 }}>Sin resultados</p>
            <p className="font-sans text-soda-lamp/20" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>Probá con otra ciudad o ajustá los filtros</p>
          </div>
        )}

        <div className="text-center mt-12 sm:mt-16"><p className="font-sans text-soda-lamp/20" style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase" }}>Más episodios próximamente</p></div>
      </div>
    </section>
  );
};
