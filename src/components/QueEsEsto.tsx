import React from 'react';
import { motion } from 'framer-motion';
import { getContent } from '../data/content';

const colorMap: Record<string, { border: string; text: string; bg: string }> = {
  red:    { border: 'border-soda-red/40',    text: 'text-soda-red',    bg: 'bg-soda-red/5' },
  accent: { border: 'border-soda-accent/30', text: 'text-soda-accent', bg: 'bg-soda-accent/5' },
  lamp:   { border: 'border-soda-lamp/30',   text: 'text-soda-lamp',   bg: 'bg-soda-lamp/5' },
  glow:   { border: 'border-soda-glow/20',   text: 'text-soda-glow',   bg: 'bg-soda-glow/3' },
};

export const QueEsEsto: React.FC = () => {
  const content = getContent();
  const { queEsEsto } = content;

  return (
    <section id="que-es-esto" className="relative py-28 sm:py-40 px-6 overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0">
        <img src="/antenas-bg.jpg" alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'saturate(0.08) brightness(0.15) contrast(1.6) blur(2px)', opacity: 1 }}
        />
        <div className="absolute inset-0 bg-soda-night/80" />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, #0a0e1a 0%, transparent 10%, transparent 90%, #0a0e1a 100%)',
        }} />
        {/* Vertical red glow */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(196,85,85,0.12) 30%, rgba(196,85,85,0.08) 70%, transparent)' }} />
      </div>

      {/* Antenna lights */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        {[
          { x: 8, y: 25 }, { x: 18, y: 16 }, { x: 29, y: 22 }, { x: 40, y: 13 },
          { x: 52, y: 19 }, { x: 63, y: 15 }, { x: 74, y: 21 }, { x: 85, y: 17 }, { x: 93, y: 23 },
        ].map((pos, i) => (
          <motion.div key={i}
            className="absolute rounded-full hidden sm:block"
            style={{ left: `${pos.x}%`, top: `${pos.y + 15}%`, width: 4, height: 4,
              background: '#c45555', boxShadow: '0 0 8px rgba(196,85,85,0.7)' }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5 + (i % 4) * 0.5, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative" style={{ zIndex: 10 }}>

        {/* Editorial label */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex items-center gap-4 justify-center mb-6">
          <div className="w-12 h-px bg-soda-red/40" />
          <span className="text-soda-red/55 text-[10px] tracking-[0.4em] uppercase">Sobre el proyecto</span>
          <div className="w-12 h-px bg-soda-red/40" />
        </motion.div>

        {/* Giant serif title */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="text-center mb-20">
          <h2 className="font-serif leading-[0.95] mb-0">
            <span className="text-soda-glow/90 text-5xl sm:text-7xl md:text-8xl">¿Qué es </span>
            <em className="text-5xl sm:text-7xl md:text-8xl italic" style={{ color: 'rgba(196,85,85,0.8)' }}>sodaroja?</em>
          </h2>
        </motion.div>

        {/* Pull quote */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative max-w-2xl mx-auto text-center mb-24 px-4">
          <span className="absolute -top-10 left-4 text-soda-red/15 text-[100px] font-serif leading-none select-none" style={{ fontFamily: 'Georgia, serif' }}>&ldquo;</span>
          <p className="relative z-10 text-xl sm:text-2xl font-serif text-soda-lamp/75 leading-[1.5] italic">
            {queEsEsto.description}
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="w-6 h-px bg-soda-red/30" />
            <span className="text-soda-red/35 text-[9px] tracking-[0.35em] uppercase">sodaroja</span>
            <div className="w-6 h-px bg-soda-red/30" />
          </div>
        </motion.div>

        {/* Structure section label */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center mb-14">
          <p className="text-soda-accent/50 text-[10px] tracking-[0.35em] uppercase mb-2">{queEsEsto.structureTitle}</p>
          <p className="text-soda-lamp/30 text-xs tracking-wide italic">{queEsEsto.structureSubtitle}</p>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-soda-accent/25 to-transparent mx-auto mt-4" />
        </motion.div>

        {/* Episodes structure — editorial timeline */}
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px sm:-translate-x-1/2"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(107,122,158,0.15) 10%, rgba(107,122,158,0.15) 90%, transparent)' }} />

          <div className="space-y-4 sm:space-y-0">
            {queEsEsto.estructura.map((item, index) => {
              const colors = colorMap[item.color] || colorMap.accent;
              const isEven = index % 2 === 0;
              return (
                <motion.div key={index}
                  initial={{ opacity: 0, x: isEven ? -24 : 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: index * 0.05 }}
                  className={`relative flex sm:items-center gap-0 sm:gap-8 ${isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'} pl-16 sm:pl-0 mb-4 sm:mb-0 sm:py-5`}
                >
                  {/* Content card */}
                  <div className={`flex-1 ${isEven ? 'sm:text-right' : 'sm:text-left'}`}>
                    <div className={`inline-block rounded-sm border p-5 sm:p-6 transition-all duration-500 hover:border-opacity-60 group cursor-default ${
                      item.destacado ? `bg-soda-night/90 ${colors.border} ${colors.bg}` : 'bg-soda-night/70 border-soda-mist/10 hover:border-soda-accent/20'
                    }`} style={{ maxWidth: '440px' }}>
                      <div className={`flex items-start gap-3 mb-3 ${isEven ? 'sm:flex-row-reverse' : ''}`}>
                        <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                        <div className={isEven ? 'sm:text-right' : ''}>
                          <h4 className="text-base font-serif text-soda-glow leading-tight">{item.titulo}</h4>
                          {item.subtitulo && <p className={`text-xs mt-0.5 ${colors.text}`}>{item.subtitulo}</p>}
                        </div>
                      </div>
                      <p className="text-soda-lamp/65 text-sm leading-relaxed">{item.descripcion}</p>
                      {item.detalles && (
                        <p className="text-soda-fog/45 text-xs leading-relaxed mt-2 italic">{item.detalles}</p>
                      )}
                    </div>
                  </div>

                  {/* Center node */}
                  <div className="absolute left-4 sm:static sm:flex-shrink-0 flex items-center justify-center sm:w-14">
                    <div className={`w-8 h-8 rounded-sm border-2 flex items-center justify-center font-serif text-xs font-bold ${colors.border} ${colors.text} bg-soda-night`}>
                      {item.numero}
                    </div>
                  </div>

                  {/* Spacer for alternate side */}
                  <div className="hidden sm:block flex-1" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Temas grid */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24">
          <div className="text-center mb-10">
            <h3 className="font-serif text-2xl sm:text-3xl text-soda-glow mb-2">
              Temas que <em className="text-soda-red/80">exploramos</em>
            </h3>
            <div className="w-8 h-px bg-soda-red/30 mx-auto mt-3" />
          </div>
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {queEsEsto.temas.map((tema, i) => (
              <motion.span key={i}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className="px-4 py-2 bg-soda-night/80 border border-soda-accent/20 hover:border-soda-accent/40 rounded-sm text-soda-accent/75 text-xs tracking-wide cursor-default transition-all duration-500 hover:text-soda-accent"
              >
                {tema}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
