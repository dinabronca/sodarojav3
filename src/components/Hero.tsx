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
          /* Logotipo brand — the main brand display */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="relative inline-block mb-12"
          >
            <motion.div
              className="absolute -inset-12"
              style={{ background: 'radial-gradient(ellipse, rgba(196,85,85,0.05) 0%, transparent 65%)' }}
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <img src={heroLogo} alt="sodaroja" className="relative z-10 h-20 sm:h-28 md:h-36 mx-auto object-contain"  />
          </motion.div>
        ) : (
          /* Fallback: SVG carita */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="relative inline-block mb-10"
          >
            <motion.div
              className="absolute -inset-8"
              style={{ background: 'radial-gradient(circle, rgba(196,85,85,0.07) 0%, transparent 60%)' }}
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.97, 1.05, 0.97] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="w-40 h-40 md:w-48 md:h-48 mx-auto relative">
              <svg viewBox="0 0 120 120" className="w-full h-full">
                <circle cx="60" cy="60" r="55" fill="none" stroke="rgba(196, 85, 85, 0.08)" strokeWidth="0.5" />
                <circle cx="60" cy="60" r="20" fill="rgba(196, 85, 85, 0.12)" />
                <circle cx="54" cy="57" r="2" fill="rgba(212, 197, 176, 0.6)" />
                <circle cx="66" cy="57" r="2" fill="rgba(212, 197, 176, 0.6)" />
                <path d="M 53 65 Q 60 70 67 65" stroke="rgba(212, 197, 176, 0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            </div>
          </motion.div>
        )}

        {hero.title && (
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-6xl md:text-8xl font-serif font-light tracking-wider text-soda-glow mb-6"
          >
            {hero.title}
          </motion.h1>
        )}

        {hero.subtitle && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-soda-fog/65 text-base md:text-lg font-light tracking-wide mb-4"
          >
            {hero.subtitle}
          </motion.div>
        )}

        {(hero.title || hero.subtitle) && hero.description && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="w-[120px] h-px bg-soda-red/40 mx-auto mb-8"
          />
        )}

        {hero.description && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="text-soda-fog/55 text-sm md:text-base font-light max-w-xl mx-auto leading-relaxed whitespace-pre-line"
          >
            {hero.description}
          </motion.p>
        )}
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
