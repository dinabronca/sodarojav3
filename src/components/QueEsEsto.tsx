import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getContent } from '../data/content';

const colorMap: Record<string, { border: string; text: string; dotBg: string }> = {
  red:    { border: 'rgba(196,85,85,0.35)',    text: 'rgba(196,85,85,0.8)',    dotBg: 'rgba(196,85,85,0.9)' },
  accent: { border: 'rgba(138,155,196,0.28)',  text: 'rgba(138,155,196,0.75)', dotBg: 'rgba(138,155,196,0.9)' },
  lamp:   { border: 'rgba(212,197,176,0.28)',  text: 'rgba(212,197,176,0.7)',  dotBg: 'rgba(212,197,176,0.9)' },
  glow:   { border: 'rgba(254,248,237,0.18)',  text: 'rgba(254,248,237,0.65)', dotBg: 'rgba(254,248,237,0.85)' },
};

// Pulse that travels down the cable
const CablePulse: React.FC<{ delay: number }> = ({ delay }) => (
  <motion.div
    className="absolute left-1/2 -translate-x-1/2 w-2 h-8 rounded-full pointer-events-none"
    style={{ background: 'linear-gradient(to bottom, transparent, rgba(196,85,85,0.9), transparent)', filter: 'blur(1px)' }}
    animate={{ y: ['-10%', '110%'], opacity: [0, 1, 1, 0] }}
    transition={{ duration: 2.8, repeat: Infinity, delay, ease: 'linear', repeatDelay: 1.2 }}
  />
);

export const QueEsEsto: React.FC = () => {
  const content = getContent();
  const { queEsEsto } = content;
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const cableProgress = useTransform(scrollYProgress, [0.1, 0.85], ['0%', '100%']);

  return (
    <section ref={sectionRef} id="que-es-esto" className="relative py-28 sm:py-40 px-6 overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0">
        <img src="/antenas-bg.jpg" alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'saturate(0.08) brightness(0.15) contrast(1.6) blur(2px)' }}
        />
        <div className="absolute inset-0 bg-soda-night/80" />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, #0a0e1a 0%, transparent 10%, transparent 90%, #0a0e1a 100%)',
        }} />
      </div>

      {/* Antenna lights */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        {[{ x:8,y:25 },{ x:18,y:16 },{ x:29,y:22 },{ x:40,y:13 },
          { x:52,y:19 },{ x:63,y:15 },{ x:74,y:21 },{ x:85,y:17 },{ x:93,y:23 }].map((pos, i) => (
          <motion.div key={i} className="absolute rounded-full hidden sm:block"
            style={{ left:`${pos.x}%`, top:`${pos.y+15}%`, width:4, height:4,
              background:'#c45555', boxShadow:'0 0 8px rgba(196,85,85,0.7)' }}
            animate={{ opacity:[0.3,1,0.3] }}
            transition={{ duration:1.5+(i%4)*0.5, repeat:Infinity, delay:i*0.4 }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative" style={{ zIndex: 10 }}>

        {/* Label */}
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          className="flex items-center gap-4 justify-center mb-6">
          <div className="w-12 h-px bg-soda-red/40" />
          <span className="text-soda-red/55 text-[10px] tracking-[0.4em] uppercase">Sobre el proyecto</span>
          <div className="w-12 h-px bg-soda-red/40" />
        </motion.div>

        {/* Title */}
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          transition={{ duration:0.9 }} className="text-center mb-20">
          <h2 className="font-serif leading-[0.95]">
            <span className="text-soda-glow/90 text-5xl sm:text-7xl md:text-8xl">¿Qué es </span>
            <em className="text-5xl sm:text-7xl md:text-8xl italic" style={{ color:'rgba(196,85,85,0.8)' }}>sodaroja?</em>
          </h2>
        </motion.div>

        {/* Pull quote */}
        <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
          transition={{ duration:1, delay:0.2 }}
          className="relative max-w-2xl mx-auto text-center mb-28 px-4">
          <span className="absolute -top-10 left-4 text-soda-red/15 text-[100px] font-serif leading-none select-none">&ldquo;</span>
          <p className="relative z-10 text-xl sm:text-2xl font-serif text-soda-lamp/75 leading-[1.5] italic">
            {queEsEsto.description}
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="w-6 h-px bg-soda-red/30" />
            <span className="text-soda-red/35 text-[9px] tracking-[0.35em] uppercase">sodaroja</span>
            <div className="w-6 h-px bg-soda-red/30" />
          </div>
        </motion.div>

        {/* Structure label */}
        <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
          className="text-center mb-16">
          <p className="text-soda-accent/50 text-[10px] tracking-[0.35em] uppercase mb-2">{queEsEsto.structureTitle}</p>
          <p className="text-soda-lamp/30 text-xs tracking-wide italic">{queEsEsto.structureSubtitle}</p>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-soda-accent/25 to-transparent mx-auto mt-4" />
        </motion.div>

        {/* ── CABLE TIMELINE ── */}
        <div className="relative">

          {/* The cable — vertical line, left-aligned on mobile, centered on desktop */}
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px"
            style={{ background: 'rgba(196,85,85,0.08)' }}>

            {/* Progress fill — grows as you scroll */}
            <motion.div className="absolute top-0 left-0 w-full origin-top"
              style={{ height: cableProgress, background: 'linear-gradient(to bottom, rgba(196,85,85,0.6), rgba(196,85,85,0.25))',
                boxShadow: '0 0 6px rgba(196,85,85,0.3)' }} />

            {/* Animated pulses */}
            <CablePulse delay={0} />
            <CablePulse delay={1.8} />
            <CablePulse delay={3.6} />
          </div>

          {/* Items */}
          <div className="space-y-0">
            {queEsEsto.estructura.map((item, index) => {
              const colors = colorMap[item.color] || colorMap.accent;
              const isLast = index === queEsEsto.estructura.length - 1;
              return (
                <motion.div key={index}
                  initial={{ opacity:0, x:-16 }}
                  whileInView={{ opacity:1, x:0 }}
                  viewport={{ once:true, margin:'-60px' }}
                  transition={{ duration:0.5, delay:0.05 }}
                  className={`relative flex items-start gap-6 sm:gap-8 pl-16 sm:pl-20 ${isLast ? '' : 'pb-8'}`}
                >
                  {/* Node on cable */}
                  <div className="absolute left-[18px] sm:left-[25px] top-5 -translate-x-1/2 z-10">
                    <motion.div
                      initial={{ scale:0 }}
                      whileInView={{ scale:1 }}
                      viewport={{ once:true }}
                      transition={{ duration:0.35, delay:0.1, type:'spring', stiffness:300 }}
                      className="relative"
                    >
                      {/* Outer ring */}
                      <div className="w-4 h-4 rounded-full border flex items-center justify-center"
                        style={{ borderColor: colors.dotBg, background: 'rgba(10,14,26,0.95)',
                          boxShadow: item.destacado ? `0 0 10px ${colors.dotBg}` : 'none' }}>
                        {/* Inner dot */}
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: colors.dotBg }} />
                      </div>
                      {/* Glow pulse on destacado */}
                      {item.destacado && (
                        <motion.div className="absolute inset-0 rounded-full"
                          animate={{ scale:[1,2.2,1], opacity:[0.5,0,0.5] }}
                          transition={{ duration:2.5, repeat:Infinity }}
                          style={{ background: colors.dotBg, filter:'blur(3px)' }} />
                      )}
                    </motion.div>
                  </div>

                  {/* Card */}
                  <div className={`flex-1 group rounded-sm overflow-hidden transition-all duration-500 hover:-translate-y-0.5 ${
                    item.destacado ? 'border' : 'border border-transparent hover:border-opacity-20'
                  }`}
                    style={{
                      borderColor: item.destacado ? colors.border : 'rgba(212,197,176,0.07)',
                      background: item.destacado
                        ? 'linear-gradient(135deg, rgba(22,28,42,0.8) 0%, rgba(14,18,28,0.6) 100%)'
                        : 'linear-gradient(135deg, rgba(16,20,30,0.55) 0%, rgba(10,14,22,0.35) 100%)',
                    }}>

                    {/* Corner glow on destacado */}
                    {item.destacado && (
                      <div className="absolute top-0 left-0 w-20 h-20 pointer-events-none"
                        style={{ background:`radial-gradient(circle at 0% 0%, ${colors.border} 0%, transparent 70%)`, opacity:0.4 }} />
                    )}

                    <div className="p-5 sm:p-6">
                      {/* Number + title row */}
                      <div className="flex items-baseline gap-3 mb-3">
                        <span className="font-mono text-[9px] tracking-[0.3em] flex-shrink-0"
                          style={{ color: colors.text }}>
                          {String(item.numero).padStart(2,'0')}
                        </span>
                        <div className="w-4 h-px flex-shrink-0" style={{ background: colors.border }} />
                        <h4 className="font-serif text-base sm:text-lg text-soda-glow/85 leading-snug">{item.titulo}</h4>
                      </div>

                      {item.subtitulo && (
                        <p className="text-[10px] tracking-[0.08em] mb-3 ml-[3.5rem]"
                          style={{ color: colors.text, opacity:0.65 }}>
                          {item.subtitulo}
                        </p>
                      )}

                      <p className="text-soda-lamp/52 text-[12px] leading-[1.75] ml-[3.5rem]">{item.descripcion}</p>
                      {item.detalles && (
                        <p className="text-soda-fog/30 text-[11px] leading-relaxed mt-2 italic ml-[3.5rem]">{item.detalles}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* End cap of cable */}
          <div className="absolute left-6 sm:left-8 bottom-0 -translate-x-1/2 w-2 h-2 rounded-full"
            style={{ background:'rgba(196,85,85,0.3)', boxShadow:'0 0 4px rgba(196,85,85,0.2)' }} />
        </div>

        {/* Temas */}
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          transition={{ duration:0.8 }} className="mt-24">
          <div className="text-center mb-10">
            <h3 className="font-serif text-2xl sm:text-3xl text-soda-glow mb-2">
              Temas que <em className="text-soda-red/80">exploramos</em>
            </h3>
            <div className="w-8 h-px bg-soda-red/30 mx-auto mt-3" />
          </div>
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {queEsEsto.temas.map((tema, i) => (
              <motion.span key={i}
                initial={{ opacity:0, scale:0.85 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
                transition={{ duration:0.35, delay:i*0.04 }}
                className="px-4 py-2 rounded-sm text-[11px] tracking-wide cursor-default transition-all duration-500"
                style={{ background:'rgba(10,14,26,0.7)', border:'1px solid rgba(138,155,196,0.18)',
                  color:'rgba(138,155,196,0.65)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(138,155,196,0.35)'; (e.currentTarget as HTMLElement).style.color='rgba(138,155,196,0.9)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(138,155,196,0.18)'; (e.currentTarget as HTMLElement).style.color='rgba(138,155,196,0.65)'; }}
              >{tema}</motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
