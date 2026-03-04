import React from 'react';
import { motion } from 'framer-motion';

// ============================================================
// Backgrounds — atmospheric, subtle but present
// ============================================================

export const TeamAmbience: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
    <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(196, 85, 85, 0.04) 0%, transparent 60%)' }} />
    <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 80% 30%, rgba(138, 155, 196, 0.03) 0%, transparent 50%)' }} />
  </div>
);

export const EpisodeVibes: React.FC = () => {
  const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 80%, rgba(196, 85, 85, 0.04) 0%, transparent 60%)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 20% 20%, rgba(138, 155, 196, 0.03) 0%, transparent 50%)' }} />
      {/* Subtle animated glow */}
      {!isMobile && (
        <motion.div className="absolute"
          style={{ left: '30%', top: '30%', width: '40%', height: '40%', background: 'radial-gradient(ellipse, rgba(196,85,85,0.03) 0%, transparent 70%)', filter: 'blur(40px)' }}
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  );
};

export const BlueprintEffects: React.FC = () => {
  const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Blueprint grid */}
      {!isMobile && (
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(138, 155, 196, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(138, 155, 196, 0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      )}
      {/* Animated glow */}
      <motion.div className="absolute"
        style={{ left: '50%', top: '50%', width: '60%', height: '60%', marginLeft: '-30%', marginTop: '-30%', background: 'radial-gradient(ellipse, rgba(138,155,196,0.04) 0%, transparent 70%)', filter: 'blur(50px)' }}
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};

export const MailEffects: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
    <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 60%, rgba(138, 155, 196, 0.04) 0%, transparent 50%)' }} />
    <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 70% 30%, rgba(196, 85, 85, 0.03) 0%, transparent 50%)' }} />
    {/* Falling envelopes */}
    {[
      { x: 8, d: 14, del: 0 }, { x: 22, d: 18, del: 3 }, { x: 38, d: 16, del: 7 },
      { x: 52, d: 20, del: 2 }, { x: 68, d: 15, del: 5 }, { x: 82, d: 17, del: 9 },
      { x: 95, d: 19, del: 1 }, { x: 15, d: 21, del: 6 }, { x: 45, d: 13, del: 4 },
      { x: 75, d: 16, del: 8 }, { x: 30, d: 22, del: 10 }, { x: 60, d: 14, del: 11 },
    ].map((e, i) => (
      <div key={`env-${i}`} className="absolute envelope-fall"
        style={{ left: `${e.x}%`, top: '-5%', fontSize: `${12 + (i % 3) * 3}px`, opacity: 0.12 + (i % 4) * 0.03, animationDuration: `${e.d}s`, animationDelay: `${e.del}s` }}>
        ✉
      </div>
    ))}
  </div>
);
