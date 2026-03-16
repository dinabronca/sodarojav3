import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getContent } from '../data/content';

const colorMap: Record<string, { border: string; text: string; dot: string; glow: string }> = {
  red:    { border: 'rgba(196,85,85,0.3)',    text: 'rgba(196,85,85,0.75)',    dot: 'rgba(196,85,85,1)',    glow: 'rgba(196,85,85,0.4)' },
  accent: { border: 'rgba(138,155,196,0.25)', text: 'rgba(138,155,196,0.7)',   dot: 'rgba(138,155,196,1)',  glow: 'rgba(138,155,196,0.35)' },
  lamp:   { border: 'rgba(212,197,176,0.22)', text: 'rgba(212,197,176,0.65)',  dot: 'rgba(212,197,176,1)',  glow: 'rgba(212,197,176,0.3)' },
  glow:   { border: 'rgba(254,248,237,0.15)', text: 'rgba(254,248,237,0.6)',   dot: 'rgba(254,248,237,1)',  glow: 'rgba(254,248,237,0.25)' },
};

const CablePulse: React.FC<{ delay: number }> = ({ delay }) => (
  <motion.div
    className="absolute left-1/2 -translate-x-1/2 w-[3px] rounded-full pointer-events-none"
    style={{ height: 32, background: 'linear-gradient(to bottom, transparent, rgba(196,85,85,0.9), transparent)', filter: 'blur(1px)' }}
    animate={{ y: ['-5%', '110%'], opacity: [0, 0.9, 0.9, 0] }}
    transition={{ duration: 3.2, repeat: Infinity, delay, ease: 'linear', repeatDelay: 1.5 }}
  />
);

export const QueEsEsto: React.FC = () => {
  const content = getContent();
  const { queEsEsto } = content;
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const cableProgress = useTransform(scrollYProgress, [0.1, 0.85], ['0%', '100%']);

  return (
    <section ref={sectionRef} id="que-es-esto" className="relative py-28 sm:py-40 px-6 overflow-hidden">
      <div className="absolute inset-0">
        <img src="/antenas-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'saturate(0.08) brightness(0.15) contrast(1.6) blur(2px)' }} />
        <div className="absolute inset-0 bg-soda-night/80" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #0a0e1a 0%, transparent 10%, transparent 90%, #0a0e1a 100%)' }} />
      </div>

      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        {[{ x:8,y:25 },{ x:18,y:16 },{ x:29,y:22 },{ x:40,y:13 },{ x:52,y:19 },{ x:63,y:15 },{ x:74,y:21 },{ x:85,y:17 },{ x:93,y:23 }].map((pos, i) => (
          <motion.div key={i} className="absolute rounded-full hidden sm:block"
            style={{ left:`${pos.x}%`, top:`${pos.y+15}%`, width:4, height:4, background:'#c45555', boxShadow:'0 0 8px rgba(196,85,85,0.7)' }}
            animate={{ opacity:[0.3,1,0.3] }} transition={{ duration:1.5+(i%4)*0.5, repeat:Infinity, delay:i*0.4 }} />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative" style={{ zIndex: 10 }}>

        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          className="flex items-center gap-4 justify-center mb-6">
          <div className="w-12 h-px bg-soda-red/40" />
          <span className="font-sans text-soda-red/55 text-[10px] tracking-[0.4em] uppercase">Sobre el proyecto</span>
          <div className="w-12 h-px bg-soda-red/40" />
        </motion.div>

        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          transition={{ duration:0.9 }} className="text-center mb-20">
          <h2 className="font-display leading-[0.95]">
            <span className="text-soda-glow/90 text-5xl sm:text-7xl md:text-8xl">&#191;Qu&#233; es </span>
            <em className="text-5xl sm:text-7xl md:text-8xl italic" style={{ color:'rgba(196,85,85,0.8)' }}>sodaroja?</em>
          </h2>
        </motion.div>

        <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
          transition={{ duration:1, delay:0.2 }}
          className="relative max-w-2xl mx-auto text-center mb-28 px-4">
          <p className="relative z-10 text-base sm:text-lg font-sans text-soda-lamp/65 leading-[1.8]">
            {queEsEsto.description}
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <div className="w-6 h-px bg-soda-red/30" />
            <span className="font-mono text-soda-red/35 text-[9px] tracking-[0.35em] uppercase">sodaroja</span>
            <div className="w-6 h-px bg-soda-red/30" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
          className="text-center mb-16">
          <p className="font-sans text-soda-accent/50 text-[10px] tracking-[0.35em] uppercase mb-2">{queEsEsto.structureTitle}</p>
          <p className="text-soda-lamp/30 text-sm tracking-wide font-sans">{queEsEsto.structureSubtitle}</p>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-soda-accent/25 to-transparent mx-auto mt-4" />
        </motion.div>

        {/* Timeline — overflow-visible so dot glow is never clipped */}
        <div className="relative" style={{ overflow: 'visible' }}>

          <div className="absolute left-[19px] top-0 bottom-0 w-px" style={{ background: 'rgba(196,85,85,0.07)' }}>
            <motion.div className="absolute top-0 left-0 w-full origin-top"
              style={{ height: cableProgress, background: 'linear-gradient(to bottom, rgba(196,85,85,0.55), rgba(196,85,85,0.18))' }} />
            <CablePulse delay={0} />
            <CablePulse delay={2} />
            <CablePulse delay={4} />
          </div>

          <div className="space-y-0">
            {queEsEsto.estructura.map((item: any, index: number) => {
              const colors = colorMap[item.color] || colorMap.accent;
              const isLast = index === queEsEsto.estructura.length - 1;
              return (
                <motion.div key={index}
                  initial={{ opacity:0, x:-12 }} whileInView={{ opacity:1, x:0 }}
                  viewport={{ once:true, margin:'-60px' }} transition={{ duration:0.5, delay:0.05 }}
                  className={`relative flex items-start gap-6 pl-12 ${isLast ? '' : 'pb-6'}`}
                  style={{ overflow: 'visible' }}
                >
                  {/* Dot node — lives outside any overflow-hidden, glow is free */}
                  <div className="absolute z-20" style={{ left: 10, top: 18, width: 18, height: 18 }}>
                    <motion.div initial={{ scale:0 }} whileInView={{ scale:1 }} viewport={{ once:true }}
                      transition={{ duration:0.35, delay:0.1, type:'spring', stiffness:280 }}
                      style={{ width:18, height:18, position:'relative' }}>
                      {item.destacado && (
                        <motion.div
                          animate={{ scale:[1,3.2,1], opacity:[0.55,0,0.55] }}
                          transition={{ duration:3, repeat:Infinity, ease:'easeInOut' }}
                          style={{
                            position:'absolute', borderRadius:'50%',
                            inset: -3,
                            background: colors.glow,
                            filter: 'blur(6px)',
                          }} />
                      )}
                      <div style={{
                        position:'absolute', inset:0, borderRadius:'50%',
                        border:`1px solid ${colors.dot}`,
                        background:'rgba(8,10,18,0.97)',
                        boxShadow: item.destacado ? `0 0 12px ${colors.glow}, 0 0 3px ${colors.dot}` : 'none',
                        display:'flex', alignItems:'center', justifyContent:'center',
                      }}>
                        <div style={{ width:6, height:6, borderRadius:'50%', background:colors.dot }} />
                      </div>
                    </motion.div>
                  </div>

                  {/* Card — no overflow-hidden */}
                  <motion.div className="flex-1 rounded-sm transition-all duration-500"
                    whileHover={{ y:-2 }}
                    style={{
                      border:`1px solid ${item.destacado ? colors.border : 'rgba(212,197,176,0.05)'}`,
                      background: item.destacado
                        ? 'linear-gradient(135deg, rgba(20,26,40,0.88) 0%, rgba(12,16,26,0.72) 100%)'
                        : 'linear-gradient(135deg, rgba(14,18,28,0.45) 0%, rgba(8,12,20,0.25) 100%)',
                    }}>
                    {item.destacado && (
                      <div className="w-full h-px rounded-t-sm"
                        style={{ background:`linear-gradient(to right, ${colors.dot}, transparent)`, opacity:0.35 }} />
                    )}
                    <div className="p-4 sm:p-5">
                      <div className="flex items-baseline gap-3 mb-2.5">
                        <span className="font-mono text-[9px] tracking-[0.3em] flex-shrink-0"
                          style={{ color:colors.text }}>{String(item.numero).padStart(2,'0')}</span>
                        <div className="w-4 h-px flex-shrink-0" style={{ background:colors.border }} />
                        <h4 className="font-serif text-[16px] sm:text-[17px] leading-tight"
                          style={{ color:'rgba(254,248,237,0.9)', letterSpacing: '0.01em' }}>{item.titulo}</h4>
                      </div>
                      {item.subtitulo && (
                        <p className="text-[10px] tracking-[0.12em] mb-3 uppercase font-sans"
                          style={{ color:colors.text, opacity:0.6 }}>{item.subtitulo}</p>
                      )}
                      <p className="font-sans text-[13px] leading-[1.75]" style={{ color:'rgba(212,197,176,0.52)' }}>{item.descripcion}</p>
                      {item.detalles && (
                        <p className="font-sans text-[11px] leading-relaxed mt-2 opacity-60" style={{ color:'rgba(212,197,176,0.25)' }}>{item.detalles}</p>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          <div className="absolute left-[19px] bottom-0 -translate-x-1/2 w-2 h-2 rounded-full"
            style={{ background:'rgba(196,85,85,0.25)', boxShadow:'0 0 4px rgba(196,85,85,0.15)' }} />
        </div>

        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          transition={{ duration:0.8 }} className="mt-24">
          <div className="text-center mb-10">
            <h3 className="font-serif text-2xl sm:text-3xl text-soda-glow mb-2">
              Temas que <em className="text-soda-red/80">exploramos</em>
            </h3>
            <div className="w-8 h-px bg-soda-red/30 mx-auto mt-3" />
          </div>
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {queEsEsto.temas.map((tema: string, i: number) => (
              <motion.span key={i} initial={{ opacity:0, scale:0.85 }} whileInView={{ opacity:1, scale:1 }}
                viewport={{ once:true }} transition={{ duration:0.35, delay:i*0.04 }}
                className="px-4 py-2 rounded-sm text-[11px] tracking-wide cursor-default font-sans transition-all duration-500"
                style={{ background:'rgba(10,14,26,0.7)', border:'1px solid rgba(138,155,196,0.15)', color:'rgba(138,155,196,0.6)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(138,155,196,0.32)'; (e.currentTarget as HTMLElement).style.color='rgba(138,155,196,0.88)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(138,155,196,0.15)'; (e.currentTarget as HTMLElement).style.color='rgba(138,155,196,0.6)'; }}
              >{tema}</motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
