import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Hero } from '../components/Hero';
import { EpisodeCard } from '../components/EpisodeCard';
import { DestinationsMap } from '../components/DestinationsMap';
import { CityMarquee } from '../components/CityMarquee';
import { getContent } from '../data/content';
import { demoEpisodes } from '../data/episodes';

const ALL_TESTIMONIOS = [
  { quote: 'Cada episodio es como viajar sin mover los pies. La producción es increíble.', author: 'Lucía M.', from: 'Buenos Aires' },
  { quote: 'No sabía que un podcast podía hacerme sentir tanto. Las historias son reales, crudas, humanas.', author: 'Tomás R.', from: 'Córdoba' },
  { quote: 'Lo descubrí por casualidad y ahora no puedo parar. Cada ciudad es un mundo nuevo.', author: 'Valentina S.', from: 'Montevideo' },
  { quote: 'La forma en que narran las ciudades te hace sentir que estás ahí. Impresionante trabajo de edición.', author: 'Martín C.', from: 'Rosario' },
  { quote: 'Escucho podcasts hace años y este es diferente. Tiene una textura propia, una identidad muy fuerte.', author: 'Camila V.', from: 'Madrid' },
  { quote: 'El capítulo de Estambul me dejó sin palabras. Lo escuché tres veces.', author: 'Federico A.', from: 'Mendoza' },
  { quote: 'Me lo recomendó una amiga y ahora se lo recomiendo a todo el mundo. Adictivo.', author: 'Sofía L.', from: 'Santiago de Chile' },
  { quote: 'Cada episodio tiene su propio universo sonoro. Es cine para los oídos.', author: 'Diego P.', from: 'Ciudad de México' },
  { quote: 'No importa donde estés, sodaroja te transporta. Es como tener una ventana al mundo.', author: 'Ana B.', from: 'Barcelona' },
];

const TestimoniosSection: React.FC = () => {
  const [page, setPage] = useState(0);
  const totalPages = 3;
  const current = ALL_TESTIMONIOS.slice(page * 3, page * 3 + 3);

  return (
    <section className="relative py-24 sm:py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(196,85,85,0.025) 0%, transparent 70%)' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px" style={{ background: 'rgba(196,85,85,0.5)' }} />
              <span style={{ fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:'10px', letterSpacing:'0.35em', textTransform:'uppercase', fontWeight:300, color:'rgba(196,85,85,0.55)' }}>Oyentes</span>
            </div>
            <h2 className="font-display text-soda-glow/85 leading-[1.05]" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 300 }}>
              Lo que <span className="font-serif italic text-soda-red/70" style={{ fontWeight: 400 }}>dicen</span>
            </h2>
          </div>
          <span className="text-soda-lamp/20 text-[10px] tracking-[0.3em] font-mono">
            {String(page + 1).padStart(2,'0')} / {String(totalPages).padStart(2,'0')}
          </span>
        </motion.div>

        {/* Uniform 3-col grid — all same height */}
        <AnimatePresence mode="wait">
          <motion.div key={page}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {current.map((t, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="relative flex flex-col p-7 rounded-sm overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, rgba(20,24,36,0.65) 0%, rgba(12,15,24,0.45) 100%)',
                  border: '1px solid rgba(212,197,176,0.08)',
                  minHeight: '200px',
                }}>
                {/* Big red opening quote */}
                <span className="block font-display leading-none select-none mb-3 flex-shrink-0"
                  style={{ fontSize: '4rem', color: 'rgba(196,85,85,0.55)', lineHeight: 1, marginTop: '-0.5rem' }}>
                  &ldquo;
                </span>

                {/* Quote text — grows to fill */}
                <p className="font-sans flex-1" style={{ fontSize:'13px', fontWeight:300, color:'rgba(212,197,176,0.6)', lineHeight:1.75 }}>
                  {t.quote}
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 mt-6 pt-5"
                  style={{ borderTop: '1px solid rgba(212,197,176,0.07)' }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono flex-shrink-0"
                    style={{ background: 'rgba(196,85,85,0.07)', border: '1px solid rgba(196,85,85,0.15)', color: 'rgba(196,85,85,0.6)', fontFamily: "'JetBrains Mono', monospace" }}>
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:'11px', fontWeight:300, color:'rgba(212,197,176,0.6)' }}>{t.author}</p>
                    <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', fontWeight:300, color:'rgba(212,197,176,0.25)', marginTop:'3px' }}>{t.from}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-end gap-4">
          <div className="flex gap-1.5 mr-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => setPage(i)} className="transition-all duration-400"
                style={{ width: i === page ? '20px' : '6px', height: '2px', borderRadius: '1px',
                  background: i === page ? 'rgba(196,85,85,0.6)' : 'rgba(212,197,176,0.18)' }} />
            ))}
          </div>
          <button onClick={() => setPage(p => (p - 1 + totalPages) % totalPages)}
            className="w-8 h-8 rounded-full border border-soda-mist/12 flex items-center justify-center text-soda-lamp/35 hover:border-soda-red/25 hover:text-soda-lamp/70 transition-all duration-500">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 2L3.5 6L7.5 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button onClick={() => setPage(p => (p + 1) % totalPages)}
            className="w-8 h-8 rounded-full border border-soda-mist/12 flex items-center justify-center text-soda-lamp/35 hover:border-soda-red/25 hover:text-soda-lamp/70 transition-all duration-500">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 2L8.5 6L4.5 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
};

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
      <section id="episodios" className="relative py-24 sm:py-32 px-6">
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div className="absolute" style={{ left: '-5%', bottom: '10%', width: '55%', height: '55%', background: 'radial-gradient(ellipse, rgba(196,85,85,0.04) 0%, transparent 60%)', filter: 'blur(60px)' }} />
          <div className="absolute" style={{ right: '-5%', top: '20%', width: '45%', height: '45%', background: 'radial-gradient(ellipse, rgba(138,155,196,0.04) 0%, transparent 60%)', filter: 'blur(60px)' }} />
          <div className="absolute" style={{ left: '30%', top: '50%', width: '40%', height: '40%', background: 'radial-gradient(ellipse, rgba(196,85,85,0.02) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        </div>
        {/* Floating particles — más densas */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
          {[
            { x: 7, y: 15 }, { x: 88, y: 8 }, { x: 32, y: 42 }, { x: 65, y: 28 },
            { x: 15, y: 72 }, { x: 78, y: 58 }, { x: 48, y: 85 }, { x: 92, y: 40 },
            { x: 25, y: 55 }, { x: 55, y: 18 }, { x: 72, y: 75 }, { x: 40, y: 65 },
            { x: 85, y: 90 }, { x: 10, y: 35 }, { x: 60, y: 48 }, { x: 35, y: 90 },
            { x: 3, y: 60 }, { x: 50, y: 5 }, { x: 95, y: 70 }, { x: 20, y: 25 },
            { x: 70, y: 10 }, { x: 45, y: 50 }, { x: 82, y: 82 }, { x: 13, y: 88 },
            { x: 58, y: 33 }, { x: 28, y: 77 }, { x: 75, y: 45 }, { x: 42, y: 12 },
          ].map((pos, i) => (
            <div key={`ep-${i}`} className="absolute rounded-full animate-float"
              style={{
                left: `${pos.x}%`, top: `${pos.y}%`,
                width: 1 + (i % 3), height: 1 + (i % 3),
                background: i % 3 === 0 ? 'rgba(196,85,85,0.5)' : i % 3 === 1 ? 'rgba(138,155,196,0.35)' : 'rgba(212,197,176,0.25)',
                animationDuration: `${6 + (i % 6) * 1.2}s`,
                animationDelay: `${i * 0.45}s`,
              }}
            />
          ))}
        </div>
        <div className="max-w-6xl mx-auto relative z-10">

          <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-14 sm:mb-20">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-px bg-soda-red" />
              <span style={{ fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:'10px', letterSpacing:'0.35em', textTransform:'uppercase', fontWeight:300, color:'rgba(196,85,85,0.55)' }}>Viajes recientes</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-soda-glow leading-[1.05]">
              Los últimos <span className="font-serif italic text-soda-red" style={{ fontWeight: 400 }}>destinos</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((episode: any, index: number) => (
              <EpisodeCard key={episode.id} episode={episode} isNewest={index === 0} episodeNumber={episodeNumberMap[episode.id]} />
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.6 }} className="text-center mt-14 sm:mt-20">
            <Link to="/episodios" className="group relative inline-flex items-center gap-3 px-10 py-4 border border-soda-mist/15 text-soda-lamp/50 rounded-sm hover:border-soda-red/25 hover:text-soda-lamp transition-all duration-700 tracking-[0.25em] text-[10px] uppercase overflow-hidden">
              {/* Fondo que aparece en hover */}
              <span className="absolute inset-0 bg-gradient-to-r from-soda-red/0 via-soda-red/3 to-soda-red/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <span className="relative font-sans">Ver todos los episodios</span>
              <ArrowRight size={13} className="relative text-soda-fog/30 group-hover:text-soda-lamp/50 group-hover:translate-x-1.5 transition-all duration-500" />
            </Link>
          </motion.div>
        </div>
      </section>


      {/* ===== MAPA DE DESTINOS ===== */}
      <DestinationsMap />


      {/* ===== ESCUCHA EN ===== */}
      <section className="relative py-12 sm:py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-center mb-8" style={{ fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:'9px', letterSpacing:'0.35em', textTransform:'uppercase', fontWeight:300, color:'rgba(212,197,176,0.25)' }}>Escuchá en tu plataforma favorita</p>
            <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
              {((content as any).platforms || []).filter((p: any) => p.visible).map((p: any) => (
                <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer"
                  className="group relative font-sans text-soda-lamp/40 text-xs sm:text-sm tracking-[0.08em] hover:text-soda-lamp transition-all duration-500"
                  title={p.name}
                >
                  {p.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-soda-red/40 group-hover:w-full transition-all duration-500" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== TESTIMONIOS ===== */}
      <TestimoniosSection />
    </>
  );
};
