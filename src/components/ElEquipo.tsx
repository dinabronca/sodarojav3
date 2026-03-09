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
    <section id="equipo" className="relative py-28 sm:py-40 px-6 overflow-hidden">

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
          <div className="w-12 h-px bg-soda-accent/35" />
          <span className="text-soda-accent/50 text-[10px] tracking-[0.4em] uppercase">Quiénes somos</span>
          <div className="w-12 h-px bg-soda-accent/35" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="text-center mb-20">
          <h2 className="font-serif leading-[0.95] mb-0">
            <span className="text-soda-glow/90 text-5xl sm:text-7xl">El </span>
            <em className="text-5xl sm:text-7xl italic" style={{ color: 'rgba(138,155,196,0.8)' }}>Equipo</em>
          </h2>
          <p className="text-soda-lamp/30 text-sm mt-5 tracking-wide">{equipo?.subtitle}</p>
        </motion.div>

        {/* Members grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
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
              <div className="relative rounded-sm overflow-hidden border border-soda-mist/12 transition-all duration-700 group-hover:border-soda-mist/25"
                style={{ background: 'rgba(20,24,36,0.6)' }}>

                {/* Hover glow edge */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none rounded-sm"
                  style={{ boxShadow: 'inset 0 0 40px rgba(196,85,85,0.04)' }} />

                {/* Photo */}
                <div className="relative aspect-[3/4] overflow-hidden bg-soda-deep">
                  <motion.img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-full h-full object-cover object-center"
                    animate={{ scale: hoveredMember === index ? 1.04 : 1 }}
                    transition={{ duration: 2.5, ease: 'easeOut' }}
                    loading="lazy"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(10,14,26,0.92) 0%, rgba(10,14,26,0.3) 50%, transparent 100%)' }} />

                  {/* Name overlay on photo */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-serif text-2xl sm:text-3xl text-soda-glow leading-none mb-1">{member.name}</h3>
                    <p className="text-soda-accent/70 text-xs tracking-[0.12em] uppercase">{member.role}</p>
                  </div>

                  {/* Member vitals — top right corner */}
                  <div className="absolute top-4 right-4 text-right px-2.5 py-1.5 rounded-sm" style={{ background: 'rgba(8,10,18,0.65)', backdropFilter: 'blur(8px)', border: '1px solid rgba(212,197,176,0.08)' }}>
                    <p className="text-soda-lamp/70 text-[9px] tracking-[0.12em]">{member.cityBorn} · {member.birthYear}</p>
                    <p className="text-soda-accent/55 text-[9px] italic mt-0.5">{member.zodiac}</p>
                  </div>
                </div>

                {/* Info section */}
                <div className="p-5">
                  {/* Socials */}
                  <div className="flex items-center gap-4 mb-5 pb-4 border-b border-soda-mist/10">
                    <p className="text-soda-lamp/20 text-[8px] tracking-[0.2em] uppercase flex-1">Redes</p>
                    {(member.socials || []).map((s: any) => (
                      <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer"
                        className="text-soda-lamp/30 hover:text-soda-lamp/65 text-[10px] tracking-[0.1em] transition-colors duration-500">
                        {SOCIAL_ABBR[s.platform] || s.abbr || s.platform}
                      </a>
                    ))}
                  </div>

                  {/* Tab switcher */}
                  <div className="flex gap-1 mb-4">
                    {(['perfil', 'ciudades'] as const).map(tab => (
                      <button key={tab} onClick={() => setTab(index, tab)}
                        className={`flex-1 py-1.5 text-[9px] tracking-[0.2em] uppercase rounded-sm transition-all duration-400 ${
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
                      className="space-y-2 max-h-52 overflow-y-auto pr-1"
                      style={{ scrollbarWidth: 'none' }}>
                      {getTab(index) === 'perfil'
                        ? favoriteFields.map((field: any) => (
                            member.favorites?.[field.key] != null ? (
                              <div key={field.key} className="flex gap-2 text-[11px]">
                                <span className="text-soda-accent/45 flex-shrink-0" style={{ minWidth: '100px' }}>{field.label}</span>
                                <span className="text-soda-lamp/60">{String(member.favorites[field.key])}</span>
                              </div>
                            ) : null
                          ))
                        : cityFields.map((field: any) => (
                            member.cities?.[field.key] ? (
                              <div key={field.key} className="flex gap-2 text-[11px]">
                                <span className="text-soda-accent/45 flex-shrink-0" style={{ minWidth: '130px' }}>{field.label}</span>
                                <span className="text-soda-lamp/60">{member.cities[field.key]}</span>
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
