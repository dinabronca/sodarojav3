import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getContent } from '../data/content';

const SOCIAL_ABBR: Record<string, string> = { Instagram: 'IG', 'Twitter/X': 'X', Twitter: 'X', YouTube: 'YT', TikTok: 'TT', Spotify: 'SP' };

export const ElEquipo: React.FC = () => {
  const content = getContent();
  const { equipo } = content;
  const members = equipo?.members || [];
  const favoriteFields = equipo?.favoriteFields || [];
  const cityFields = equipo?.cityFields || [];
  const [activeTab, setActiveTab] = useState<Record<number, 'perfil' | 'ciudades'>>({});
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);

  const getTab = (i: number) => activeTab[i] || 'perfil';
  const setTab = (i: number, tab: 'perfil' | 'ciudades') =>
    setActiveTab(prev => ({ ...prev, [i]: tab }));

  return (
    <section id="equipo" className="relative py-24 sm:py-32 px-6 overflow-hidden">

      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-soda-night via-soda-deep/60 to-soda-night" />
        <motion.div className="absolute"
          style={{ left: '5%', top: '20%', width: '40%', height: '50%',
            background: 'radial-gradient(ellipse, rgba(196,85,85,0.05) 0%, transparent 65%)', filter: 'blur(80px)' }}
          animate={{ x: [0, 40, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="absolute"
          style={{ right: '5%', bottom: '15%', width: '35%', height: '45%',
            background: 'radial-gradient(ellipse, rgba(138,155,196,0.04) 0%, transparent 65%)', filter: 'blur(70px)' }}
          animate={{ x: [0, -30, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        />
        {/* Horizontal scan lines — ultra subtle */}
        <div className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(212,197,176,1) 4px)', backgroundSize: '100% 4px' }} />
      </div>

      <div className="max-w-6xl mx-auto relative" style={{ zIndex: 1 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex items-center gap-4 justify-center mb-6">
          <div className="w-8 h-px" style={{ background: 'rgba(138,155,196,0.35)' }} />
          <span style={{ fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:'10px', letterSpacing:'0.35em', textTransform:'uppercase', fontWeight:300, color:'rgba(138,155,196,0.5)' }}>Quiénes somos</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="text-center mb-16">
          <h2 className="font-display leading-[0.95] mb-0">
            <span className="text-soda-glow/85" style={{ fontSize:'clamp(2.5rem,6vw,4.5rem)', fontWeight:300 }}>El </span>
            <span className="font-serif italic" style={{ fontSize:'clamp(2.5rem,6vw,4.5rem)', color:'rgba(138,155,196,0.8)', fontWeight:400 }}>Equipo</span>
          </h2>
          <p className="font-sans text-soda-lamp/30 mt-5" style={{ fontSize:'13px', fontWeight:300 }}>{equipo?.subtitle}</p>
        </motion.div>

        {/* Members grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {members.map((member, index) => (
            <motion.div key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              onMouseEnter={() => setHoveredMember(index)}
              onMouseLeave={() => setHoveredMember(null)}
              className="group relative"
            >
              <div className="relative rounded-sm overflow-hidden transition-all duration-700"
                style={{ background: 'rgba(12,16,26,0.7)', border: '1px solid rgba(212,197,176,0.04)', boxShadow: '0 4px 40px rgba(0,0,0,0.4)' }}>

                {/* Hover glow edge */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none rounded-sm"
                  style={{ boxShadow: 'inset 0 0 40px rgba(196,85,85,0.04)' }} />

                {/* Photo */}
                <div className="relative aspect-[3/4] overflow-hidden bg-soda-deep">
                  <motion.img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-full h-full object-cover object-center"
                    animate={{ scale: hoveredMember === index ? 1.03 : 1 }}
                    transition={{ duration: 2.5, ease: 'easeOut' }}
                    loading="lazy"
                    decoding="async"
                    style={{ filter: hoveredMember === index ? 'brightness(0.9) saturate(1.05)' : 'brightness(0.85) saturate(0.95)' }}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(8,10,18,0.96) 0%, rgba(8,10,18,0.45) 45%, rgba(8,10,18,0.1) 100%)' }} />
                  {/* Lateral red accent line on hover */}
                  <motion.div className="absolute left-0 top-0 bottom-0 w-[2px]"
                    animate={{ opacity: hoveredMember === index ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ background: 'linear-gradient(to bottom, transparent, rgba(196,85,85,0.6), transparent)' }} />

                  {/* Name overlay on photo */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-serif italic text-soda-glow/85 leading-none mb-1" style={{ fontSize:'clamp(1.4rem,3vw,2rem)', fontWeight:400 }}>{member.name}</h3>
                    <p style={{ fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:'9px', letterSpacing:'0.3em', textTransform:'uppercase', fontWeight:300, color:'rgba(138,155,196,0.6)' }}>{member.role}</p>
                  </div>

                  {/* Member vitals — top right corner */}
                  <div className="absolute top-4 right-4 text-right px-3 py-2 rounded-sm" style={{ background: 'rgba(6,8,16,0.75)', backdropFilter: 'blur(10px)', border: '1px solid rgba(212,197,176,0.1)' }}>
                    <p style={{ fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:'8px', letterSpacing:'0.3em', textTransform:'uppercase', fontWeight:300, color:'rgba(212,197,176,0.55)' }}>{member.cityBorn}</p>
                    <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'8px', letterSpacing:'0.15em', fontWeight:300, color:'rgba(212,197,176,0.3)', marginTop:'3px' }}>{member.birthYear}</p>
                  </div>
                </div>

                {/* Info section */}
                <div className="p-5">
                  {/* Socials */}
                  <div className="flex items-center gap-3 mb-5 pb-4" style={{ borderBottom: '1px solid rgba(212,197,176,0.06)' }}>
                    <span className="font-sans text-[8px] tracking-[0.25em] uppercase flex-1" style={{ color: 'rgba(212,197,176,0.18)' }}>Redes</span>
                    {(member.socials || []).map((s: any) => (
                      <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer"
                        className="font-sans text-[10px] tracking-[0.12em] transition-colors duration-500"
                        style={{ color: 'rgba(212,197,176,0.28)' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'rgba(212,197,176,0.7)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(212,197,176,0.28)'}>
                        {SOCIAL_ABBR[s.platform] || s.abbr || s.platform}
                      </a>
                    ))}
                  </div>

                  {/* Tab switcher */}
                  <div className="flex gap-1 mb-4">
                    {(['perfil', 'ciudades'] as const).map(tab => (
                      <button key={tab} onClick={() => setTab(index, tab)}
                        className={`font-sans flex-1 py-1.5 text-[9px] tracking-[0.2em] uppercase rounded-sm transition-all duration-400 ${
                          getTab(index) === tab
                            ? 'bg-soda-accent/12 text-soda-accent/80 border border-soda-accent/20'
                            : 'text-soda-lamp/25 hover:text-soda-lamp/45 border border-transparent'
                        }`}>
                        {tab === 'perfil' ? 'Perfil humano' : 'Ciudades'}
                      </button>
                    ))}
                  </div>

                  {/* Tab content */}
                  <AnimatePresence mode="wait">
                    <motion.div key={`${index}-${getTab(index)}`}
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.22 }}
                      className="space-y-2">
                      {getTab(index) === 'perfil'
                        ? favoriteFields.slice(0, 10).map((field: any) => (
                            member.favorites?.[field.key] != null ? (
                              <div key={field.key} className="flex gap-2">
                                <span className="flex-shrink-0" style={{ fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:'11px', fontWeight:300, color:'rgba(138,155,196,0.4)', minWidth:'100px' }}>{field.label}</span>
                                <span style={{ fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:'12px', fontWeight:300, color:'rgba(212,197,176,0.65)' }}>{String(member.favorites[field.key])}</span>
                              </div>
                            ) : null
                          ))
                        : cityFields.slice(0, 10).map((field: any) => (
                            member.cities?.[field.key] ? (
                              <div key={field.key} className="flex gap-2">
                                <span className="flex-shrink-0" style={{ fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:'11px', fontWeight:300, color:'rgba(138,155,196,0.4)', minWidth:'130px' }}>{field.label}</span>
                                <span style={{ fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:'12px', fontWeight:300, color:'rgba(212,197,176,0.65)' }}>{member.cities[field.key]}</span>
                              </div>
                            ) : null
                          ))
                      }
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

        </motion.div>
          ))}
        </div>

        {/* Bottom editorial divider */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-6 justify-center mt-20">
          <div className="h-px flex-1 max-w-32 bg-gradient-to-r from-transparent to-soda-mist/15" />
          <div className="w-1 h-1 rounded-full bg-soda-red/20" />
          <div className="h-px flex-1 max-w-32 bg-gradient-to-l from-transparent to-soda-mist/15" />
        </motion.div>
      </div>
    </section>
  );
};
