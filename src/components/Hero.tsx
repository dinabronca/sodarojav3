import React, { useEffect, useRef, useMemo } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { getContent } from '../data/content';
import { demoEpisodes } from '../data/episodes';

export const Hero: React.FC = () => {
  const content = getContent();
  const { hero, brand } = content;
  const heroLogo = brand?.heroLogoUrl;
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic counts from actual episodes
  const storeEps = content.episodios?.items || [];
  const allEps = storeEps.length > 0 ? storeEps : demoEpisodes;
  const cityCount = useMemo(() => new Set(allEps.map((e: any) => e.city)).size, [allEps]);
  const epCount = allEps.length;

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

        {/* Description — ABOVE the title, same style as eyebrow */}
        <motion.div className="flex items-center gap-4 mb-8 sm:mb-10"
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2, duration:1.2 }}>
          <div className="w-8 sm:w-16 h-px" style={{ background:'linear-gradient(to right, transparent, rgba(196,85,85,0.35))' }} />
          <motion.span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background:'rgba(196,85,85,0.75)', boxShadow:'0 0 8px rgba(196,85,85,0.6)' }}
            animate={{ opacity:[0.4,1,0.4], scale:[0.85,1.15,0.85] }}
            transition={{ duration:2.2, repeat:Infinity, ease:'easeInOut' }}
          />
          <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', fontWeight: 300, color: 'rgba(212,197,176,0.45)', maxWidth: '40rem', textAlign: 'center' }}>
            {hero.description || subtitle}
          </span>
          <motion.span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background:'rgba(196,85,85,0.75)', boxShadow:'0 0 8px rgba(196,85,85,0.6)' }}
            animate={{ opacity:[1,0.4,1], scale:[1.15,0.85,1.15] }}
            transition={{ duration:2.2, repeat:Infinity, ease:'easeInOut' }}
          />
          <div className="w-8 sm:w-16 h-px" style={{ background:'linear-gradient(to left, transparent, rgba(196,85,85,0.35))' }} />
        </motion.div>

        {/* TÍTULO PRINCIPAL */}
        <div className="relative w-full overflow-hidden mb-4">
          <motion.div
            initial={{ y:'110%', opacity:0 }}
            animate={{ y:0, opacity:1 }}
            transition={{ delay:0.35, duration:1.1, ease:[0.16,1,0.3,1] }}
          >
            <h1 className="font-display tracking-[-0.01em] leading-[0.9] select-none"
              style={{
                fontSize:'clamp(4.5rem,19vw,18rem)',
                color:'rgba(254,248,237,0.94)',
                fontWeight:300,
                paddingBottom:'0.08em',
              }}
            >
              {title}
            </h1>
          </motion.div>
        </div>

        {/* Línea + data strip */}
        <motion.div className="w-full flex flex-col items-center gap-6 mt-2"
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.75, duration:1.2 }}>
          <div style={{ width:'55%', height:'1px',
            background:'linear-gradient(to right, transparent, rgba(196,85,85,0.2) 30%, rgba(212,197,176,0.1) 50%, rgba(196,85,85,0.2) 70%, transparent)' }} />

          {/* Editorial data strip */}
          <div className="flex items-center gap-6 sm:gap-10">
            {[
              { label: 'temporada', value: '01' },
              { label: 'ciudades', value: String(cityCount) },
            ].map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div className="w-px h-6" style={{ background:'rgba(212,197,176,0.08)' }} />}
                <div className="text-center">
                  <div className="font-mono text-lg sm:text-xl" style={{ color:'rgba(254,248,237,0.5)' }}>{item.value}</div>
                  <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: '9px', letterSpacing: '0.35em', textTransform: 'uppercase', fontWeight: 300, color: 'rgba(212,197,176,0.25)', marginTop: '4px' }}>{item.label}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </motion.div>

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
