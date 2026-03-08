import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Hero } from '../components/Hero';
import { EpisodeCard } from '../components/EpisodeCard';
import { DestinationsMap } from '../components/DestinationsMap';
import { CityMarquee } from '../components/CityMarquee';
import { getContent } from '../data/content';
import { demoEpisodes } from '../data/episodes';

export const HomePage: React.FC = () => {
  const content = getContent();
  const storeEps = content.episodios?.items || [];
  const allRaw = (storeEps.length > 0 ? storeEps : demoEpisodes).filter((e: any) => !e.hidden);
  const sorted = useMemo(() =>
    [...allRaw].sort((a, b) => (b.publishDate || '').localeCompare(a.publishDate || '')),
    [allRaw]
  );
  const featured = sorted.slice(0, 6);

  const episodeNumberMap = React.useMemo(() => {
    const byDate = [...allRaw].sort((a, b) => (a.publishDate || '').localeCompare(b.publishDate || ''));
    const map: Record<string, number> = {};
    byDate.forEach((ep: any, i: number) => { map[ep.id] = i + 1; });
    return map;
  }, [allRaw]);

  return (
    <>
      <Hero />

      {/* City marquee ticker — delicate */}
      <CityMarquee />

      {/* ===== ÚLTIMOS DESTINOS ===== */}
      <section id="episodios" className="relative py-24 sm:py-32 px-4 sm:px-6">
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div className="absolute" style={{ left: '-5%', bottom: '10%', width: '50%', height: '50%', background: 'radial-gradient(ellipse, rgba(196,85,85,0.03) 0%, transparent 60%)', filter: 'blur(50px)' }} />
          <div className="absolute" style={{ right: '-5%', top: '20%', width: '40%', height: '40%', background: 'radial-gradient(ellipse, rgba(138,155,196,0.03) 0%, transparent 60%)', filter: 'blur(50px)' }} />
        </div>
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
          {[
            { x: 7, y: 15 }, { x: 88, y: 8 }, { x: 32, y: 42 }, { x: 65, y: 28 },
            { x: 15, y: 72 }, { x: 78, y: 58 }, { x: 48, y: 85 }, { x: 92, y: 40 },
            { x: 25, y: 55 }, { x: 55, y: 18 }, { x: 72, y: 75 }, { x: 40, y: 65 },
            { x: 85, y: 90 }, { x: 10, y: 35 }, { x: 60, y: 48 }, { x: 35, y: 90 },
          ].map((pos, i) => (
            <div key={`ep-${i}`} className="absolute rounded-full animate-float"
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, width: 2 + (i % 3), height: 2 + (i % 3), background: i % 2 === 0 ? 'rgba(196,85,85,0.45)' : 'rgba(138,155,196,0.3)', animationDuration: `${7 + (i % 5) * 1.5}s`, animationDelay: `${i * 0.6}s` }}
            />
          ))}
        </div>
        <div className="max-w-7xl mx-auto relative z-10">

          <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-14 sm:mb-20">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-px bg-soda-red" />
              <span className="text-soda-red text-[10px] tracking-[0.3em] uppercase font-light">Viajes recientes</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-soda-glow leading-[1.1]">
              Los últimos <em className="text-soda-red">destinos</em>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featured.map((episode: any, index: number) => (
              <EpisodeCard key={episode.id} episode={episode} isNewest={index === 0} episodeNumber={episodeNumberMap[episode.id]} />
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.6 }} className="text-center mt-14 sm:mt-20">
            <Link to="/episodios" className="group inline-flex items-center gap-3 px-10 py-4 border border-soda-mist/20 text-soda-lamp/60 rounded-sm hover:border-soda-mist/35 hover:text-soda-lamp transition-all duration-700 tracking-[0.25em] text-[10px] uppercase">
              Ver todos los episodios
              <ArrowRight size={13} className="text-soda-fog/40 group-hover:text-soda-lamp/60 group-hover:translate-x-1 transition-all duration-700" />
            </Link>
          </motion.div>
        </div>
      </section>


      {/* ===== MAPA DE DESTINOS ===== */}
      <DestinationsMap />


      {/* ===== ESCUCHA EN ===== */}
      <section className="relative py-20 sm:py-28 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-soda-lamp/50 text-[9px] tracking-[0.4em] uppercase mb-10">Escucha en tu plataforma favorita</p>
            <div className="flex items-center justify-center gap-8 sm:gap-12 flex-wrap">
              {((content as any).platforms || []).filter((p: any) => p.visible).map((p: any) => (
                <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-3 opacity-35 hover:opacity-75 transition-opacity duration-700" title={p.name}>
                  <span className="text-soda-lamp/55 text-sm sm:text-base group-hover:text-soda-glow transition-colors duration-500 font-light tracking-wide">{p.name}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

            {/* ===== TESTIMONIOS ===== */}
      <section className="relative py-20 sm:py-28 px-6 overflow-hidden">
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-soda-lamp/30 text-[9px] tracking-[0.4em] uppercase text-center mb-14">Lo que dicen los oyentes</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { quote: 'Cada episodio es como viajar sin mover los pies. La producción es increíble.', author: 'Lucía M.', from: 'Buenos Aires' },
              { quote: 'No sabía que un podcast podía hacerme sentir tanto. Las historias son reales, crudas, humanas.', author: 'Tomás R.', from: 'Córdoba' },
              { quote: 'Lo descubrí por casualidad y ahora no puedo parar. Cada ciudad es un mundo nuevo.', author: 'Valentina S.', from: 'Montevideo' },
            ].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="relative p-8 border border-soda-mist/10 rounded-sm group hover:border-soda-mist/20 transition-all duration-700"
              >
                <span className="absolute -top-3 left-6 text-soda-red/45 text-6xl font-serif leading-none select-none">&ldquo;</span>
                <p className="text-soda-lamp/60 text-sm font-light leading-relaxed mb-6 relative z-10">{t.quote}</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-px bg-soda-red/40" />
                  <span className="text-soda-lamp/60 text-[10px] tracking-wider">{t.author}</span>
                  <span className="text-soda-lamp/30 text-[10px]">·</span>
                  <span className="text-soda-lamp/35 text-[10px]">{t.from}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
