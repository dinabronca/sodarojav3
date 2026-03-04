import React from 'react';
import { motion } from 'framer-motion';
import { getContent } from '../data/content';
import { EditorialHeader } from './Editorial';

const colorMap: Record<string, { border: string; text: string }> = {
  red: { border: 'border-soda-red', text: 'text-soda-red' },
  accent: { border: 'border-soda-accent', text: 'text-soda-accent' },
  lamp: { border: 'border-soda-lamp', text: 'text-soda-lamp' },
  glow: { border: 'border-soda-glow', text: 'text-soda-glow' },
};

// Posiciones de lucecitas mapeadas a donde estan las antenas en la imagen
const antennaLights = [
  { x: 6, y: 28 }, { x: 12, y: 18 }, { x: 16, y: 24 }, { x: 20, y: 14 },
  { x: 26, y: 20 }, { x: 31, y: 26 }, { x: 36, y: 16 }, { x: 40, y: 22 },
  { x: 46, y: 12 }, { x: 50, y: 20 }, { x: 55, y: 18 }, { x: 60, y: 14 },
  { x: 65, y: 22 }, { x: 70, y: 16 }, { x: 75, y: 20 }, { x: 80, y: 24 },
  { x: 85, y: 18 }, { x: 90, y: 22 }, { x: 94, y: 16 },
];

export const QueEsEsto: React.FC = () => {
  const content = getContent();
  const { queEsEsto } = content;
  const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window);

  const lightsToShow = isMobile ? antennaLights.filter((_, i) => i % 3 === 0) : antennaLights;

  return (
    <section id="que-es-esto" className="relative py-28 sm:py-36 px-6 overflow-hidden">
      

      {/* ===== CAPA 0: FONDO ANTENAS — treated ===== */}
      <div className="absolute inset-0">
        {/* La imagen con tratamiento para suavizar pixelación */}
        <img
          src="/antenas-bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: 'saturate(0.1) brightness(0.2) contrast(1.5) blur(1.5px)',
            opacity: 1,
            imageRendering: 'auto',
          }}
        />
        {/* Color overlay oscuro */}
        <div className="absolute inset-0 bg-soda-night/75" />
        {/* Fade arriba y abajo */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, #0a0e1a 0%, transparent 12%, transparent 88%, #0a0e1a 100%)',
        }} />
        {/* Tinte rojizo sutil */}
        <div className="absolute inset-0 bg-soda-red/[0.02]" />
      </div>

      {/* ===== CAPA 1: LUCECITAS DE ANTENA ===== */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        {lightsToShow.map((pos, i) => (
          <motion.div
            key={`alight-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y + 20}%`,
              width: '5px',
              height: '5px',
              background: '#c45555',
              boxShadow: '0 0 8px rgba(196,85,85,0.7), 0 0 20px rgba(196,85,85,0.3)',
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              boxShadow: [
                '0 0 6px rgba(196,85,85,0.4), 0 0 15px rgba(196,85,85,0.15)',
                '0 0 12px rgba(196,85,85,0.8), 0 0 30px rgba(196,85,85,0.4)',
                '0 0 6px rgba(196,85,85,0.4), 0 0 15px rgba(196,85,85,0.15)',
              ],
            }}
            transition={{
              duration: 1.5 + (i % 5) * 0.4,
              repeat: Infinity,
              delay: (i % 7) * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* ===== CAPA 2: HUMO SUTIL ===== */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }}>
          {[0, 1, 2].map(i => (
            <motion.div
              key={`smoke-${i}`}
              className="absolute"
              style={{
                left: `${-10 + i * 35}%`,
                bottom: '5%',
                width: '45%',
                height: '150px',
                background: `radial-gradient(ellipse, rgba(${i % 2 === 0 ? '10, 14, 26' : '20, 25, 40'}, 0.4) 0%, transparent 70%)`,
                filter: 'blur(40px)',
              }}
              animate={{ x: [0, 40 + i * 15, 0], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 14 + i * 4, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
      )}

      {/* ===== CAPA 10: CONTENIDO ===== */}
      <div className="max-w-5xl mx-auto relative" style={{ zIndex: 10 }}>
        <EditorialHeader
          label="Sobre el proyecto"
          title="¿Qué es"
          titleAccent="sodaroja?"
          center
        />

        {/* Giant editorial quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative max-w-3xl mx-auto text-center mb-20 sm:mb-28 px-4"
        >
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-soda-red/25 text-[120px] sm:text-[180px] font-serif leading-none select-none pointer-events-none" style={{ fontFamily: 'Georgia, serif' }}>&ldquo;</span>
          <p className="relative z-10 text-2xl sm:text-3xl md:text-4xl font-serif text-soda-glow/80 leading-[1.3] italic">
            Cada ciudad tiene una historia que nadie cuenta. Nosotros la encontramos.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="w-8 h-px bg-soda-red/30" />
            <span className="text-soda-red/40 text-[10px] tracking-[0.3em] uppercase">sodaroja</span>
            <div className="w-8 h-px bg-soda-red/30" />
          </div>
        </motion.div>

        {/* Description */}
        {queEsEsto.description && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-soda-fog/50 text-base font-light leading-relaxed max-w-2xl mx-auto text-center mb-16"
          >
            {queEsEsto.description}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 justify-center mb-4">
            <div className="w-6 h-px bg-soda-accent/40" />
            <span className="text-soda-accent/60 text-[11px] tracking-[0.2em] uppercase">{queEsEsto.structureTitle}</span>
            <div className="w-6 h-px bg-soda-accent/40" />
          </div>
          <p className="text-soda-fog/50 text-[11px] tracking-wider text-center">{queEsEsto.structureSubtitle}</p>
        </motion.div>

        <div className="space-y-6">
          {queEsEsto.estructura.map((item, index) => {
            const colors = colorMap[item.color] || colorMap.accent;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className={`relative rounded-sm p-8 border transition-all duration-500 group ${
                  item.destacado
                    ? 'bg-soda-night/80 border-soda-red/30 hover:border-soda-red/45'
                    : 'bg-soda-night/70 border-soda-mist/15 hover:border-soda-accent/30'
                }`}
              >
                <div className="flex items-start gap-6">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-sm border-2 flex items-center justify-center font-serif text-2xl ${colors.border} ${colors.text}`}>
                    {item.numero}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{item.emoji}</span>
                      <div>
                        <h4 className="text-2xl font-serif text-soda-glow">{item.titulo}</h4>
                        {item.subtitulo && (
                          <p className={`text-sm ${colors.text}`}>{item.subtitulo}</p>
                        )}
                      </div>
                    </div>
                    <p className="text-soda-lamp text-base leading-relaxed font-light mb-3">{item.descripcion}</p>
                    <p className="text-soda-fog text-sm leading-relaxed font-light italic">{item.detalles}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20"
        >
          <h3 className="font-serif text-2xl text-soda-glow mb-2 text-center">Temas que <em className="text-soda-red/80">exploramos</em></h3>
          <div className="w-8 h-px bg-soda-red/30 mx-auto mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {queEsEsto.temas.map((tema, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="px-4 py-3 bg-soda-night/80 border border-soda-accent/30 rounded-sm text-soda-accent text-sm text-center cursor-default"
              >
                {tema}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
