import React from 'react';
import { motion } from 'framer-motion';
import { Package, Mail } from 'lucide-react';
import { getContent } from '../data/content';
import { EditorialHeader } from './Editorial';
import { BlueprintEffects } from '../effects/SectionBackgrounds';

export const Shop: React.FC = () => {
  const shop = getContent().shop;
  const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window);

  return (
    <section id="shop" className="relative py-28 sm:py-36 px-6 overflow-hidden bg-gradient-to-b from-soda-night via-soda-deep to-soda-night">
      <BlueprintEffects />

      {/* Atmospheric gradients */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute" style={{ left: '-10%', top: '20%', width: '50%', height: '50%', background: 'radial-gradient(ellipse, rgba(138,155,196,0.05) 0%, transparent 60%)', filter: 'blur(50px)' }} />
        <div className="absolute" style={{ right: '-10%', bottom: '20%', width: '45%', height: '45%', background: 'radial-gradient(ellipse, rgba(196,85,85,0.04) 0%, transparent 60%)', filter: 'blur(50px)' }} />
      </div>

      {/* Floating dots */}
      {!isMobile && [...Array(12)].map((_, i) => (
        <motion.div key={`sp-${i}`} className="absolute rounded-full pointer-events-none"
          style={{
            left: `${5 + (i * 8) % 90}%`, top: `${10 + (i * 11) % 80}%`,
            width: 2 + (i % 3), height: 2 + (i % 3),
            background: i % 2 === 0 ? 'rgba(138,155,196,0.3)' : 'rgba(212,197,176,0.2)',
          }}
          animate={{ y: [0, -30, 0], opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: 7 + (i % 4) * 2, repeat: Infinity, delay: i * 0.7 }}
        />
      ))}

      <div className="max-w-5xl mx-auto relative z-10">
        <EditorialHeader
          label="Merch"
          title={shop.title || 'La'}
          titleAccent="tienda"
          subtitle={shop.subtitle}
          center
        />

        {/* Coming soon item */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-soda-slate/40 backdrop-blur-sm border border-soda-mist/20 rounded-sm p-10 text-center max-w-md mx-auto mb-12 group hover:border-soda-accent/30 transition-all duration-700">
          <div className="absolute inset-0 bg-gradient-to-t from-soda-accent/3 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-sm" />
          <Package size={36} className="text-soda-accent/40 mb-4 mx-auto" />
          <h3 className="text-xl font-serif text-soda-glow mb-2">Pack de Stickers</h3>
          <p className="text-soda-fog text-sm mb-4">Colección de stickers del culto</p>
          <span className="text-soda-accent/40 text-[10px] tracking-[0.2em] uppercase">Próximamente</span>
        </motion.div>

        {/* Notify */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="max-w-md mx-auto text-center">
          <p className="text-soda-fog text-sm mb-6">Dejanos tu email y te avisamos cuando esté disponible</p>
          <div className="flex gap-3">
            <input type="email" placeholder="tu@email.com" className="flex-1 bg-soda-slate/40 backdrop-blur-sm border border-soda-mist/20 rounded-sm px-4 py-3 text-soda-lamp text-sm focus:border-soda-accent/40 focus:outline-none transition-colors duration-500" />
            <button className="px-6 py-3 bg-soda-accent/8 border border-soda-accent/30 text-soda-lamp rounded-sm hover:bg-soda-accent/15 hover:border-soda-accent/45 transition-all duration-500 text-xs tracking-wider flex items-center gap-2">
              <Mail size={14} />Avisame
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
