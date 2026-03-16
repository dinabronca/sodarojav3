import React from 'react';
import { motion } from 'framer-motion';

/*
 * EditorialHeader — componente master de identidad sodaroja
 * Todas las secciones usan esto. Cambiarlo aquí cambia todo el sitio.
 *
 * SISTEMA:
 *   label    → DM Sans, 10px, tracking 0.35em, uppercase, rojo/55
 *   title    → Cormorant Garamond, weight 300, 5xl-6xl
 *   accent   → Crimson Pro italic, rojo/80 — la palabra clave
 *   subtitle → DM Sans, 14px, lamp/55
 */
export const EditorialHeader: React.FC<{
  label: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  center?: boolean;
}> = ({ label, title, titleAccent, subtitle, center = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7 }}
    className={`mb-16 sm:mb-20 ${center ? 'text-center' : ''}`}
  >
    {/* Label */}
    <div className={`flex items-center gap-3 mb-6 ${center ? 'justify-center' : ''}`}>
      <div className="w-8 h-px" style={{ background: 'rgba(196,85,85,0.5)' }} />
      <span className="font-sans text-soda-red/55" style={{ fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', fontWeight: 300 }}>
        {label}
      </span>
    </div>

    {/* H2 */}
    <h2 className="font-display text-soda-glow/85 mb-5"
      style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 300, lineHeight: 1.05 }}>
      {title}{titleAccent ? <> <span className="font-serif italic text-soda-red/80" style={{ fontWeight: 400 }}>{titleAccent}</span></> : ''}
    </h2>

    {/* Subtitle */}
    {subtitle && (
      <p className={`font-sans text-soda-lamp/55 ${center ? 'max-w-2xl mx-auto' : 'max-w-3xl'}`}
        style={{ fontSize: '14px', lineHeight: 1.75, fontWeight: 300 }}>
        {subtitle}
      </p>
    )}
  </motion.div>
);

export const WarmDivider: React.FC = () => (
  <div className="py-4 px-6">
    <div className="max-w-6xl mx-auto h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(196,85,85,0.08) 30%, rgba(212,197,176,0.06) 50%, rgba(196,85,85,0.08) 70%, transparent)' }} />
  </div>
);
