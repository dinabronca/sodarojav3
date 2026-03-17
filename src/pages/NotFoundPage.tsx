import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const NotFoundPage: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
      style={{ background: '#080b14' }}>

      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(196,85,85,0.04) 0%, transparent 70%)',
      }} />

      {/* Floating particles */}
      {[{x:10,y:20},{x:80,y:15},{x:30,y:75},{x:70,y:60},{x:50,y:40},{x:20,y:55},{x:85,y:80}].map((p,i) => (
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{ left:`${p.x}%`, top:`${p.y}%`, width:2, height:2, background:'rgba(196,85,85,0.4)' }}
          animate={{ y:[0,-30,0], opacity:[0,0.5,0] }}
          transition={{ duration:6+i, repeat:Infinity, delay:i*0.8, ease:'easeInOut' }}
        />
      ))}

      {/* Vertical line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(196,85,85,0.2))' }} />

      <div className="relative z-10 text-center max-w-2xl">

        {/* 404 number — huge, ghosted */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16,1,0.3,1] }}
          className="font-display select-none mb-0 leading-none"
          style={{ fontSize: 'clamp(8rem, 25vw, 20rem)', color: 'rgba(196,85,85,0.06)', fontWeight: 300, lineHeight: 0.85 }}>
          404
        </motion.div>

        {/* Label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex items-center gap-3 justify-center mb-8 -mt-4">
          <div className="w-8 h-px" style={{ background: 'rgba(196,85,85,0.4)' }} />
          <span className="font-sans" style={{ fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(196,85,85,0.5)', fontWeight: 300 }}>
            señal perdida
          </span>
          <div className="w-8 h-px" style={{ background: 'rgba(196,85,85,0.4)' }} />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease: [0.16,1,0.3,1] }}
          className="font-display text-soda-glow/85 mb-5"
          style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 300, lineHeight: 1.1 }}>
          Esta ciudad no <span className="font-serif italic text-soda-red/80" style={{ fontWeight: 400 }}>existe</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="font-sans text-soda-lamp/45 mb-12"
          style={{ fontSize: '14px', fontWeight: 300, lineHeight: 1.75 }}>
          La página que buscás no está en nuestro mapa de viajes.<br />
          Quizás la historia que buscás todavía no fue contada.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/"
            className="font-sans px-8 py-3 rounded-sm transition-all duration-500"
            style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', background: 'rgba(196,85,85,0.08)', border: '1px solid rgba(196,85,85,0.25)', color: 'rgba(196,85,85,0.8)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(196,85,85,0.14)'; (e.currentTarget as HTMLElement).style.color = 'rgba(196,85,85,1)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(196,85,85,0.08)'; (e.currentTarget as HTMLElement).style.color = 'rgba(196,85,85,0.8)'; }}>
            Volver al inicio
          </Link>
          <Link to="/episodios"
            className="font-sans px-8 py-3 rounded-sm transition-all duration-500"
            style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', border: '1px solid rgba(212,197,176,0.1)', color: 'rgba(212,197,176,0.45)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(212,197,176,0.75)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,197,176,0.25)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(212,197,176,0.45)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,197,176,0.1)'; }}>
            Ver episodios
          </Link>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #0a0e1a)' }} />
    </section>
  );
};
