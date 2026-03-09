import React from 'react';
import { motion } from 'framer-motion';
import { getContent } from '../data/content';

export const Hero: React.FC = () => {
  const content = getContent();
  const { hero, brand } = content;
  const heroLogo = brand?.heroLogoUrl;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-soda-deep via-soda-night to-soda-night" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-soda-night to-transparent pointer-events-none z-[5]" />

      {/* Subtle ambient glow */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ width: '60%', height: '60%', left: '20%', top: '20%', background: 'radial-gradient(ellipse, rgba(196,85,85,0.04) 0%, transparent 70%)', filter: 'blur(60px)' }}
        animate={{ opacity: [0.3, 0.5, 0.3], scale: [0.97, 1.03, 0.97] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating particles — organic distribution */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
        {[
          { x: 4, y: 12 }, { x: 92, y: 8 }, { x: 23, y: 45 }, { x: 67, y: 22 },
          { x: 45, y: 78 }, { x: 81, y: 55 }, { x: 12, y: 67 }, { x: 56, y: 38 },
          { x: 35, y: 15 }, { x: 78, y: 82 }, { x: 8, y: 88 }, { x: 88, y: 35 },
          { x: 50, y: 60 }, { x: 18, y: 30 }, { x: 72, y: 70 }, { x: 38, y: 92 },
          { x: 62, y: 5 }, { x: 95, y: 65 }, { x: 28, y: 55 }, { x: 85, y: 15 },
          { x: 15, y: 48 }, { x: 55, y: 85 }, { x: 42, y: 25 }, { x: 75, y: 48 },
        ].map((pos, i) => {
          const size = [3, 3, 4, 3, 4, 3, 5, 3, 4, 3, 3, 4, 3, 4, 3, 5, 3, 4, 3, 3, 4, 3, 4, 3][i];
          const colors = ['rgba(196,85,85,0.7)', 'rgba(138,155,196,0.5)', 'rgba(212,197,176,0.45)'];
          const durations = [7, 9, 8, 11, 10, 7, 12, 8, 9, 10, 11, 7, 8, 12, 9, 10, 7, 11, 8, 9, 10, 12, 7, 8];
          return (
            <div key={`hp-${i}`} className="absolute rounded-full animate-float"
              style={{
                left: `${pos.x}%`, top: `${pos.y}%`,
                width: size, height: size,
                background: colors[i % 3],
                animationDuration: `${durations[i]}s`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          );
        })}
      </div>

      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto flex flex-col items-center justify-center">

        {/* Hero video (if set in admin) — replaces image/logo */}
        {(hero as any).videoUrl ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="relative w-full max-w-4xl mx-auto mb-10 overflow-hidden rounded-sm"
            style={{ aspectRatio: '21/9' }}
          >
            <video
              src={(hero as any).videoUrl}
              autoPlay loop muted playsInline
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
              style={{ userSelect: 'none' }}
              onContextMenu={(e) => e.preventDefault()}
            />
            {/* Subtle vignette overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 80px rgba(10,14,26,0.6)' }} />
          </motion.div>
        ) : hero.imageUrl ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="relative inline-block mb-10 max-w-sm mx-auto"
          >
            <motion.div
              className="absolute -inset-10 rounded-full"
              style={{ background: 'radial-gradient(ellipse, rgba(196,85,85,0.06) 0%, transparent 65%)' }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <img src={hero.imageUrl} alt={hero.title || 'sodaroja'} className="relative z-10 w-full"  />
          </motion.div>
        ) : heroLogo ? (
          /* Logotipo brand — sin fondo, mezcla con el fondo oscuro */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="relative inline-block mb-10"
          >
            <motion.div
              className="absolute -inset-16"
              style={{ background: 'radial-gradient(ellipse, rgba(196,85,85,0.06) 0%, transparent 65%)' }}
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <img
              src={heroLogo}
              alt="sodaroja"
              className="relative z-10 h-20 sm:h-24 md:h-28 mx-auto object-contain"
              style={{ mixBlendMode: 'screen', filter: 'brightness(1.1)' }}
            />
          </motion.div>
        ) : (
          /* Fallback: punto de frecuencia animado */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="relative inline-flex items-center justify-center mb-10"
          >
            {[0,1,2].map(i => (
              <motion.div key={i} className="absolute rounded-full border border-soda-red/20"
                style={{ width: 40 + i*28, height: 40 + i*28 }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.7, ease: 'easeInOut' }}
              />
            ))}
            <div className="w-3 h-3 rounded-full bg-soda-red" style={{ boxShadow: '0 0 16px rgba(196,85,85,0.8), 0 0 32px rgba(196,85,85,0.3)' }} />
          </motion.div>
        )}

        {/* ===== BLOQUE CENTRAL DE IDENTIDAD ===== */}
        <div className="relative flex flex-col items-center">

          {/* Eyebrow label */}
          {hero.subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.9 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-6 h-px bg-soda-red/50" />
              <span className="text-soda-red/70 text-[10px] tracking-[0.35em] uppercase font-light">{hero.subtitle}</span>
              <div className="w-6 h-px bg-soda-red/50" />
            </motion.div>
          )}

          {/* Título principal — extra large, elegante */}
          {hero.title && (
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif font-light text-soda-glow leading-[0.88] tracking-[0.04em] mb-8"
              style={{ fontSize: 'clamp(5rem, 14vw, 13rem)' }}
            >
              {hero.title}
            </motion.h1>
          )}

          {/* Línea decorativa con punto central */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
            className="flex items-center gap-3 mb-8 w-full max-w-xs"
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-soda-red/30" />
            <motion.div
              className="w-1 h-1 rounded-full bg-soda-red/60"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-soda-red/30" />
          </motion.div>

          {/* Descripción — solo si existe */}
          {hero.description && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.9 }}
              className="text-soda-lamp/45 text-sm font-light max-w-md mx-auto leading-loose tracking-wide text-center whitespace-pre-line"
            >
              {hero.description}
            </motion.p>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-soda-red/25 to-transparent"
          animate={{ scaleY: [0.5, 1, 0.5], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
};
