import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { getContent } from '../data/content';

export const Hero: React.FC = () => {
  const content = getContent();
  const { hero, brand } = content;
  const heroLogo = brand?.heroLogoUrl;
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 30, damping: 20 });
  const bgX = useTransform(springX, [0, 1], ['-2%', '2%']);
  const bgY = useTransform(springY, [0, 1], ['-2%', '2%']);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handle = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    el.addEventListener('mousemove', handle);
    return () => el.removeEventListener('mousemove', handle);
  }, []);

  const title = hero.title || 'sodaroja';
  const subtitle = hero.subtitle || 'un podcast narrativo';

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: '#080b14' }}
    >
      {/* Fondo animado con mouse */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          x: bgX, y: bgY,
          background: `
            radial-gradient(ellipse 55% 45% at 50% 55%, rgba(196,85,85,0.055) 0%, transparent 65%),
            radial-gradient(ellipse 80% 60% at 20% 80%, rgba(138,155,196,0.025) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 20%, rgba(212,197,176,0.02) 0%, transparent 55%)
          `,
        }}
      />

      {/* Partículas */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
        {[
          {x:5,y:10,s:2,c:0,d:9},{x:93,y:7,s:3,c:1,d:11},{x:22,y:44,s:2,c:2,d:8},{x:68,y:21,s:2,c:0,d:12},
          {x:44,y:79,s:3,c:1,d:7},{x:82,y:56,s:2,c:2,d:10},{x:11,y:68,s:2,c:0,d:9},{x:57,y:37,s:2,c:1,d:11},
          {x:34,y:14,s:3,c:2,d:8},{x:79,y:83,s:2,c:0,d:10},{x:8,y:89,s:2,c:1,d:12},{x:89,y:34,s:3,c:2,d:7},
          {x:51,y:61,s:2,c:0,d:9},{x:17,y:29,s:2,c:1,d:11},{x:73,y:71,s:2,c:2,d:8},{x:39,y:93,s:3,c:0,d:10},
          {x:63,y:4,s:2,c:1,d:12},{x:96,y:66,s:2,c:2,d:7},{x:29,y:56,s:2,c:0,d:9},{x:86,y:16,s:2,c:1,d:11},
        ].map((p, i) => (
          <div key={i} className="absolute rounded-full animate-float"
            style={{
              left:`${p.x}%`, top:`${p.y}%`, width:p.s, height:p.s,
              background:['rgba(196,85,85,0.65)','rgba(138,155,196,0.45)','rgba(212,197,176,0.40)'][p.c],
              animationDuration:`${p.d}s`, animationDelay:`${i*0.45}s`,
            }}
          />
        ))}
      </div>

      {/* Línea vertical superior */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 pointer-events-none z-[3]"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(196,85,85,0.22) 60%, rgba(196,85,85,0.1))' }}
      />

      {/* CONTENIDO */}
      <div className="relative z-10 w-full px-6 flex flex-col items-center text-center">

        {/* Video opcional */}
        {(hero as any).videoUrl && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:1.5 }}
            className="relative w-full max-w-4xl mb-14 overflow-hidden rounded-sm" style={{ aspectRatio:'21/9' }}>
            <video src={(hero as any).videoUrl} autoPlay loop muted playsInline
              className="absolute inset-0 w-full h-full object-cover"
              onContextMenu={e => e.preventDefault()}
            />
            <div className="absolute inset-0" style={{ boxShadow:'inset 0 0 80px rgba(8,11,20,0.7)' }} />
          </motion.div>
        )}

        {/* Eyebrow */}
        <motion.div className="flex items-center gap-3 mb-10 sm:mb-12"
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2, duration:1 }}>
          <div className="w-8 sm:w-14 h-px" style={{ background:'linear-gradient(to right, transparent, rgba(196,85,85,0.4))' }} />
          <motion.span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background:'rgba(196,85,85,0.7)', boxShadow:'0 0 6px rgba(196,85,85,0.5)' }}
            animate={{ opacity:[0.4,1,0.4], scale:[0.9,1.1,0.9] }}
            transition={{ duration:2, repeat:Infinity, ease:'easeInOut' }}
          />
          <span className="text-[9px] sm:text-[10px] uppercase font-light"
            style={{ color:'rgba(196,85,85,0.55)', letterSpacing:'0.5em' }}>
            {subtitle}
          </span>
          <motion.span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background:'rgba(196,85,85,0.7)', boxShadow:'0 0 6px rgba(196,85,85,0.5)' }}
            animate={{ opacity:[1,0.4,1], scale:[1.1,0.9,1.1] }}
            transition={{ duration:2, repeat:Infinity, ease:'easeInOut' }}
          />
          <div className="w-8 sm:w-14 h-px" style={{ background:'linear-gradient(to left, transparent, rgba(196,85,85,0.4))' }} />
        </motion.div>

        {/* TÍTULO — tratamiento itálico: da movimiento sin necesitar efectos extra */}
        <div className="relative w-full overflow-hidden mb-10">
          <motion.div
            initial={{ y:'108%', opacity:0 }}
            animate={{ y:0, opacity:1 }}
            transition={{ delay:0.35, duration:1.05, ease:[0.16,1,0.3,1] }}
          >
            <h1 className="font-serif tracking-[-0.03em] leading-[0.85] select-none"
              style={{
                fontSize:'clamp(4rem,18vw,17rem)',
                color:'rgba(254,248,237,0.93)',
                fontWeight:300,
                fontStyle:'italic',
                textShadow:'0 2px 80px rgba(196,85,85,0.08)',
              }}
            >
              {title}
            </h1>
          </motion.div>

          {/* Línea sutil bajo el título */}
          <motion.div className="absolute -bottom-2 left-1/2 -translate-x-1/2 pointer-events-none"
            initial={{ opacity:0, scaleX:0 }} animate={{ opacity:1, scaleX:1 }}
            transition={{ delay:0.7, duration:1.2, ease:'easeOut' }}
            style={{
              width:'60%', height:'1px',
              background:'linear-gradient(to right, transparent, rgba(196,85,85,0.18) 30%, rgba(212,197,176,0.12) 50%, rgba(196,85,85,0.18) 70%, transparent)',
            }}
          />
        </div>

        {/* Logo marca de agua — si existe */}
        {heroLogo && (
          <motion.div className="mb-7" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.85, duration:1.2 }}>
            <img src={heroLogo} alt="sodaroja" className="mx-auto object-contain"
              style={{ height:'26px', mixBlendMode:'screen', filter:'brightness(1.8) saturate(0.1)', opacity:0.2 }}
            />
          </motion.div>
        )}

        {/* Descripción */}
        {hero.description && (
          <motion.p
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:1, duration:1 }}
            className="text-center whitespace-pre-line"
            style={{
              color:'rgba(212,197,176,0.36)', fontSize:'clamp(0.75rem,1.5vw,0.875rem)',
              fontWeight:300, letterSpacing:'0.05em', lineHeight:1.9, maxWidth:'26rem',
            }}
          >
            {hero.description}
          </motion.p>
        )}

        {!heroLogo && !hero.description && (
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.95, duration:1 }}
            style={{ color:'rgba(212,197,176,0.18)', fontSize:'10px', letterSpacing:'0.35em', textTransform:'uppercase', marginTop:'1.5rem' }}>
            podcast narrativo
          </motion.p>
        )}

      </div>

      {/* Scroll indicator */}
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.8, duration:1 }}>
        <motion.div
          style={{ width:'1px', height:'32px', background:'linear-gradient(to bottom, rgba(196,85,85,0.3), transparent)' }}
          animate={{ scaleY:[0.5,1,0.5], opacity:[0.3,0.6,0.3] }}
          transition={{ duration:2.5, repeat:Infinity, ease:'easeInOut' }}
        />
      </motion.div>

      {/* Fade hacia la sección siguiente */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-[4]"
        style={{ background:'linear-gradient(to bottom, transparent, #0a0e1a)' }}
      />
    </section>
  );
};
