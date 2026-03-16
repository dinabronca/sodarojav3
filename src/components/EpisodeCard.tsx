import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../data/auth';

interface Episode {
  id: string; city: string; title: string; description: string; imageUrl: string;
  isPremium: boolean; lat?: number; lng?: number; publishDate?: string;
  links?: Record<string, string>; embeds?: Record<string, string>;
}

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '';
  const months = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];
  const d = new Date(dateStr + 'T00:00:00');
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
};

const epNum = (n?: number) => n !== undefined ? `EP. ${String(n).padStart(3, '0')}` : '';

export const EpisodeCard: React.FC<{ episode: Episode; isNewest?: boolean; episodeNumber?: number; featured?: boolean; autoOpen?: boolean }> = ({ episode, isNewest = false, episodeNumber, featured = false, autoOpen = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [listened, setListened] = useState(false);
  const [showListenPrompt, setShowListenPrompt] = useState(false);
  const [zoomedImg, setZoomedImg] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const formattedDate = formatDate(episode.publishDate);
  const user = getCurrentUser();
  const isPremiumUser = user?.isPremium === true;
  const isLocked = episode.isPremium && !isPremiumUser;
  const isUnlockedPremium = episode.isPremium && isPremiumUser;
  const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window);

  // Auto-open from map navigation
  useEffect(() => {
    if (autoOpen && !isLocked) {
      setTimeout(() => {
        setIsExpanded(true);
        if (!listened) setShowListenPrompt(true);
        cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 600);
    }
  }, [autoOpen]);

  useEffect(() => {
    try { const d = JSON.parse(localStorage.getItem('sodaroja-listened') || '[]'); setListened(d.includes(episode.id)); } catch {}
  }, [episode.id]);

  const markListened = (val: boolean) => {
    try {
      const d: string[] = JSON.parse(localStorage.getItem('sodaroja-listened') || '[]');
      const next = val ? (d.includes(episode.id) ? d : [...d, episode.id]) : d.filter(id => id !== episode.id);
      localStorage.setItem('sodaroja-listened', JSON.stringify(next));
      setListened(val); setShowListenPrompt(false);
    } catch {}
  };

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    // Cleanup garantizado aunque se desmonte con el modal abierto
    return () => { document.body.style.overflow = ''; };
  }, [isExpanded]);

  // RAF cleanup on unmount
  useEffect(() => {
    return () => { cancelAnimationFrame(rafRef.current); isHovering.current = false; };
  }, []);

  const handleCardClick = () => {
    if (!isLocked) { setIsExpanded(true); if (!listened) setShowListenPrompt(true); }
  };

  const targetParallax = useRef({ x: 0, y: 0 });
  const currentParallax = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isLocked || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    // Max 0.8px movement (was 2.5px) — much slower/subtler
    targetParallax.current = {
      x: Math.max(-0.4, Math.min(0.4, dx * 0.4)),
      y: Math.max(-0.3, Math.min(0.3, dy * 0.3)),
    };
  };

  const handleMouseLeave = () => {
    isHovering.current = false;
    targetParallax.current = { x: 0, y: 0 };
    cancelAnimationFrame(rafRef.current);
    if (parallaxRef.current) {
      parallaxRef.current.style.transition = 'transform 1200ms cubic-bezier(0.22,1,0.36,1)';
      parallaxRef.current.style.transform = 'translate(0px, 0px)';
      setTimeout(() => {
        if (parallaxRef.current) parallaxRef.current.style.transition = 'none';
      }, 1250);
    }
  };

  const handleMouseEnterParallax = () => {
    isHovering.current = true;
    const animate = () => {
      if (!isHovering.current || !parallaxRef.current) return;
      // Lerp — smooth approach, no jitter
      currentParallax.current.x += (targetParallax.current.x - currentParallax.current.x) * 0.06;
      currentParallax.current.y += (targetParallax.current.y - currentParallax.current.y) * 0.06;
      parallaxRef.current.style.transform = `translate(${currentParallax.current.x.toFixed(3)}px, ${currentParallax.current.y.toFixed(3)}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
  };

  // Auto-mark as listened after 60 seconds with modal open (implies user is engaging with embed)
  useEffect(() => {
    if (isExpanded && !listened) {
      const timer = setTimeout(() => {
        markListened(true);
      }, 60000); // 60 seconds
      return () => clearTimeout(timer);
    }
  }, [isExpanded, listened]);

  const links = episode.links || {};
  const embeds = episode.embeds || {};
  const gallery: string[] = (episode as any).gallery?.filter(Boolean) || [];

  return (
    <>
      {/* === CARD: Classic style — image top, info below === */}
      <motion.div
        ref={cardRef}
        data-ep-id={episode.id}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative group h-full"
        onClick={handleCardClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnterParallax}
        style={{ cursor: isLocked ? 'default' : 'pointer' }}
      >
        {/* Card wrapper — sin lift para evitar jitter de texto */}
        <div className="h-full">
        <div className={`relative overflow-hidden rounded-sm h-full transition-all duration-700 episode-card-inner ${
          featured ? 'flex flex-col md:flex-row' : ''
        } ${
          isLocked
            ? 'bg-soda-slate/30'
            : isUnlockedPremium
            ? 'bg-soda-slate/40'
            : 'bg-soda-slate/30'
        }`}
          style={isLocked ? { animation: 'premiumBreathe 6s ease-in-out infinite' } : undefined}
        >
          {/* Hover glow */}
          <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0 rounded-sm ${
            isUnlockedPremium ? 'from-soda-red/10' : 'from-soda-red/5'
          }`} />

          {/* Premium red line at bottom */}
          {isUnlockedPremium && (
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-soda-red/40 to-transparent z-10" />
          )}

          {/* Image — translateZ(0) en el contenedor fuerza GPU layer y elimina el subpixel bleed */}
          <div
            className={`relative overflow-hidden ${featured ? 'md:w-3/5 aspect-[16/10] md:aspect-auto' : 'aspect-[16/10]'}`}
            style={{ transform: 'translateZ(0)', isolation: 'isolate' }}
          >
            {/* Wrapper parallax — manipulado directamente por RAF sin pasar por React state */}
            <div
              ref={parallaxRef}
              className="absolute"
              style={{
                top: '-10px', bottom: '-10px', left: '-10px', right: '-10px',
                transform: 'translate(0px, 0px)',
                transition: 'transform 60ms linear',
                willChange: 'transform',
              }}
            >
              <img src={episode.imageUrl} alt={episode.city}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                style={isLocked ? { filter: 'saturate(0.2) brightness(0.4) blur(2px)' } : isUnlockedPremium ? { filter: 'contrast(1.1) saturate(1.15) brightness(1.05)' } : {}}
              />
              {/* Gradiente que cubre siempre — incluye zona extra debajo */}
              <div
                className="absolute pointer-events-none"
                style={{
                  left: 0, right: 0,
                  bottom: '-4px',   // 4px extra por debajo del borde del wrapper
                  height: '75%',
                  background: 'linear-gradient(to top, rgba(10,14,26,0.72) 0%, rgba(10,14,26,0.35) 45%, transparent 100%)',
                }}
              />
            </div>

            {/* Top badges row — same height on both sides */}
            <div className="absolute top-3 left-3 right-3 z-20 flex justify-between items-start">
              {/* Left: status badges */}
              <div className="flex flex-col gap-1.5">
                {isNewest && (
                  <span className="bg-soda-accent text-soda-night text-[10px] tracking-[0.12em] uppercase px-2.5 py-[5px] rounded-sm font-semibold shadow-lg shadow-soda-accent/30 leading-none">NUEVO</span>
                )}
                {isUnlockedPremium && (
                  <span className="bg-soda-red text-soda-glow text-[10px] tracking-[0.12em] uppercase px-2.5 py-[5px] rounded-sm font-medium shadow-lg shadow-soda-red/30 leading-none">FRECUENCIA INTERNA</span>
                )}
              </div>

              {/* Right: EP number */}
              {episodeNumber !== undefined && (
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'9px', letterSpacing:'0.15em', color:'rgba(254,248,237,0.6)', background:'rgba(10,14,26,0.7)', backdropFilter:'blur(4px)', padding:'4px 8px', borderRadius:'2px', lineHeight:1 }}>{epNum(episodeNumber)}</span>
              )}
            </div>

            {/* Listened dot */}
            {listened && (
              <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-soda-night/60 backdrop-blur-sm px-2 py-1 rounded-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-emerald-400/80 text-[9px] tracking-wider">Escuchado</span>
              </div>
            )}

            {/* Locked center overlay — dramatic */}
            {isLocked && (
              <div className="absolute inset-0 z-15 flex items-center justify-center">
                {/* Red tint overlay */}
                <div className="absolute inset-0 bg-soda-red/8" />
                {/* Animated rings */}
                {[0, 1, 2].map(i => (
                  <motion.div key={`ring-${i}`} className="absolute rounded-full border border-soda-red/20"
                    style={{ width: 60 + i * 30, height: 60 + i * 30 }}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
                  />
                ))}
                <div className="text-center relative z-10">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-14 h-14 mx-auto mb-3 rounded-full border-2 border-soda-red/50 flex items-center justify-center bg-soda-red/15 backdrop-blur-sm"
                  >
                    <div className="w-4 h-4 rounded-full bg-soda-red" style={{ boxShadow: '0 0 20px rgba(196,85,85,0.7), 0 0 40px rgba(196,85,85,0.3)' }} />
                  </motion.div>
                  <span className="text-soda-glow text-[10px] tracking-[0.2em] uppercase font-medium bg-soda-night/50 backdrop-blur-sm px-3 py-1 rounded-sm">Frecuencia Interna</span>
                </div>
              </div>
            )}
          </div>

          {/* Info below image */}
          <div className={`relative z-10 ${featured ? 'md:w-2/5 p-6 sm:p-8 md:p-10 flex flex-col justify-center' : 'p-5 sm:p-6'}`}>
            {/* City + Date row */}
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:'9px', letterSpacing:'0.3em', textTransform:'uppercase', fontWeight:300, color: isUnlockedPremium ? 'rgba(196,85,85,0.7)' : 'rgba(138,155,196,0.65)' }}>
                {episode.city}
              </span>
              {formattedDate && !isLocked && (
                <span className="font-sans text-soda-lamp/30 text-[9px] tracking-[0.2em] uppercase">{formattedDate}</span>
              )}
            </div>

            {/* Title */}
            <h3 style={{ fontFamily:"'DM Sans',system-ui,sans-serif", fontWeight:500, color:'rgba(254,248,237,0.88)', marginBottom:'12px', lineHeight:1.3, fontSize: featured ? 'clamp(1.1rem,2vw,1.4rem)' : '15px' }}>
              &ldquo;{episode.title}&rdquo;
            </h3>

            {/* Description */}
            <p style={{ fontFamily:"'DM Sans',system-ui,sans-serif", color:'rgba(212,197,176,0.45)', fontWeight:300, lineHeight:1.7, marginBottom:'20px', fontSize:'12px' }} className={featured ? 'line-clamp-4' : 'line-clamp-2'}>
              {episode.description}
            </p>

            {/* CTA */}
            {isLocked ? (
              <Link to="/frecuencia-interna" onClick={e => e.stopPropagation()} className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity duration-500 group/cta" style={{ fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:'9px', letterSpacing:'0.25em', textTransform:'uppercase', fontWeight:300, color:'rgba(196,85,85,0.55)' }}>
                Desbloquear <ChevronRight size={10} className="group-hover/cta:translate-x-1 transition-transform duration-500" />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-2 group-hover:opacity-80 transition-opacity duration-500" style={{ fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:'9px', letterSpacing:'0.25em', textTransform:'uppercase', fontWeight:300, color:'rgba(212,197,176,0.4)' }}>
                Escuchar <ChevronRight size={10} className="group-hover:translate-x-1 transition-transform duration-500" />
              </span>
            )}
          </div>
        </div>
        </div>{/* end hover wrapper */}
      </motion.div>

      {/* === MODAL === */}
      {isExpanded && !isLocked && (
        <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center" onClick={() => { setIsExpanded(false); setZoomedImg(null); }}>
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ background: 'rgba(6,8,14,0.88)', backdropFilter: 'blur(16px)' }}
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl max-h-[85vh] sm:max-h-[82vh] sm:mt-20 overflow-y-auto rounded-t-sm sm:rounded-sm"
            style={{
              background: 'linear-gradient(165deg, rgba(16,20,32,0.98) 0%, rgba(10,13,22,0.99) 100%)',
              border: '1px solid rgba(212,197,176,0.08)',
              boxShadow: '0 -20px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(196,85,85,0.05)',
              WebkitOverflowScrolling: 'touch',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
              style={{ background: 'rgba(10,13,22,0.7)', border: '1px solid rgba(212,197,176,0.1)', color: 'rgba(212,197,176,0.4)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'rgba(212,197,176,0.9)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(212,197,176,0.4)'}
            >
              <X size={14} />
            </button>

            {/* Hero image — full bleed, cinematic */}
            <div className="relative overflow-hidden" style={{ height: '240px' }}>
              <img src={episode.imageUrl} alt={episode.city} className="w-full h-full object-cover" style={{ filter: 'brightness(0.75) saturate(1.1)' }} />
              {/* Cinematic vignette */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 35%, transparent 50%, rgba(10,13,22,0.85) 80%, rgba(10,13,22,1) 100%)' }} />
              {/* Left fade */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,13,22,0.4) 0%, transparent 40%)' }} />
              {isUnlockedPremium && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', left: 0, width: '100%', height: '30%', background: 'linear-gradient(transparent, rgba(196,85,85,0.06) 40%, rgba(196,85,85,0.1) 50%, rgba(196,85,85,0.06) 60%, transparent)', animation: 'vhsScan 5s linear infinite' }} />
                </div>
              )}
              {/* Badges over image */}
              <div className="absolute top-4 left-5 flex items-center gap-2">
                {episodeNumber !== undefined && (
                  <span className="text-[10px] font-mono tracking-[0.2em] px-2 py-1 rounded-sm" style={{ background: 'rgba(10,13,22,0.7)', border: '1px solid rgba(212,197,176,0.12)', color: 'rgba(212,197,176,0.6)' }}>{epNum(episodeNumber)}</span>
                )}
                {isNewest && (
                  <span className="text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 rounded-sm font-medium" style={{ background: 'rgba(196,85,85,0.85)', color: 'rgba(254,248,237,0.95)' }}>NUEVO</span>
                )}
                {isUnlockedPremium && (
                  <span className="text-[9px] tracking-[0.15em] uppercase px-2 py-1 rounded-sm" style={{ background: 'rgba(196,85,85,0.15)', border: '1px solid rgba(196,85,85,0.35)', color: 'rgba(196,85,85,0.85)' }}>FRECUENCIA INTERNA</span>
                )}
              </div>
              {/* City + meta overlaid on bottom of image */}
              <div className="absolute bottom-0 left-0 right-0 px-6 pb-5">
                <div className="flex items-center gap-3 mb-2">
                  <span style={{ fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:'9px', letterSpacing:'0.3em', textTransform:'uppercase', fontWeight:300, color: isUnlockedPremium ? 'rgba(196,85,85,0.8)' : 'rgba(138,155,196,0.8)' }}>{episode.city}{(episode as any).country ? `, ${(episode as any).country}` : ''}</span>
                  <div className="w-px h-3" style={{ background: 'rgba(212,197,176,0.2)' }} />
                  {formattedDate && <span className="font-sans text-soda-lamp/45 text-[10px] tracking-[0.2em] uppercase">{formattedDate}</span>}
                  {(episode as any).durationMin && <span className="text-soda-lamp/35 text-[10px]">{(episode as any).durationMin} min</span>}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pt-2 pb-8">
              {/* Title */}
              <h2 style={{ fontFamily:"'DM Sans',system-ui,sans-serif", fontWeight:500, fontSize:'clamp(1.2rem,3vw,1.6rem)', color:'rgba(254,248,237,0.92)', lineHeight:1.3, marginBottom:'12px' }}>
                &ldquo;{episode.title}&rdquo;
              </h2>

              {/* Description */}
              <p className="text-[13px] leading-[1.8] mb-7" style={{ color: 'rgba(212,197,176,0.55)', fontFamily: "'DM Sans', system-ui, sans-serif" }}>{episode.description}</p>

              {/* Thin rule */}
              <div className="mb-6" style={{ height: '1px', background: 'linear-gradient(to right, rgba(196,85,85,0.2), rgba(212,197,176,0.08), transparent)' }} />

              {/* Embeds */}
              <div className="space-y-5 mb-6">
                {(embeds as any).youtube && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-px" style={{ background: 'rgba(196,85,85,0.5)' }} />
                      <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: 'rgba(212,197,176,0.35)' }}>YouTube</span>
                    </div>
                    <div className="relative w-full rounded-sm overflow-hidden" style={{ paddingBottom: '56.25%', border: '1px solid rgba(212,197,176,0.06)' }}>
                      <iframe src={(embeds as any).youtube} className="absolute inset-0 w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" />
                    </div>
                  </div>
                )}
                {embeds.spotify && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-px" style={{ background: 'rgba(29,185,84,0.5)' }} />
                      <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: 'rgba(212,197,176,0.35)' }}>Spotify</span>
                    </div>
                    <iframe src={embeds.spotify} width="100%" height={isMobile ? "152" : "232"} frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" style={{ borderRadius: '6px' }} />
                  </div>
                )}
                {embeds.applePodcasts && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-px" style={{ background: 'rgba(212,197,176,0.3)' }} />
                      <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: 'rgba(212,197,176,0.35)' }}>Apple Podcasts</span>
                    </div>
                    <iframe src={embeds.applePodcasts} width="100%" height={isMobile ? "150" : "175"} frameBorder="0" allow="autoplay *;" loading="lazy" style={{ borderRadius: '10px' }} />
                  </div>
                )}
                {embeds.ivoox && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-px" style={{ background: 'rgba(212,197,176,0.3)' }} />
                      <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: 'rgba(212,197,176,0.35)' }}>iVoox</span>
                    </div>
                    <iframe src={embeds.ivoox} width="100%" height={isMobile ? "150" : "200"} frameBorder="0" loading="lazy" />
                  </div>
                )}
                {embeds.soundcloud && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-px" style={{ background: 'rgba(255,85,0,0.5)' }} />
                      <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: 'rgba(212,197,176,0.35)' }}>SoundCloud</span>
                    </div>
                    <iframe src={embeds.soundcloud} width="100%" height={isMobile ? "120" : "166"} frameBorder="0" allow="autoplay" loading="lazy" />
                  </div>
                )}
              </div>

              {/* External links — refined pill style */}
              {Object.values(links).some(v => v) && (
                <div className="mb-7">
                  <p className="text-[9px] tracking-[0.3em] uppercase mb-3" style={{ color: 'rgba(212,197,176,0.28)' }}>Escuchar en</p>
                  <div className="flex flex-wrap gap-2">
                    {links.spotify && <a href={links.spotify} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] tracking-wider transition-all duration-400" style={{ border: '1px solid rgba(29,185,84,0.2)', color: 'rgba(212,197,176,0.5)', background: 'rgba(29,185,84,0.04)' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(29,185,84,0.4)'; (e.currentTarget as HTMLElement).style.color='rgba(212,197,176,0.85)'; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(29,185,84,0.2)'; (e.currentTarget as HTMLElement).style.color='rgba(212,197,176,0.5)'; }}>Spotify</a>}
                    {links.applePodcasts && <a href={links.applePodcasts} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] tracking-wider transition-all duration-400" style={{ border: '1px solid rgba(212,197,176,0.12)', color: 'rgba(212,197,176,0.5)' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(212,197,176,0.3)'; (e.currentTarget as HTMLElement).style.color='rgba(212,197,176,0.85)'; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(212,197,176,0.12)'; (e.currentTarget as HTMLElement).style.color='rgba(212,197,176,0.5)'; }}>Apple Podcasts</a>}
                    {links.youtube && <a href={links.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] tracking-wider transition-all duration-400" style={{ border: '1px solid rgba(255,50,50,0.2)', color: 'rgba(212,197,176,0.5)', background: 'rgba(255,50,50,0.03)' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(255,50,50,0.4)'; (e.currentTarget as HTMLElement).style.color='rgba(212,197,176,0.85)'; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(255,50,50,0.2)'; (e.currentTarget as HTMLElement).style.color='rgba(212,197,176,0.5)'; }}>YouTube</a>}
                    {links.ivoox && <a href={links.ivoox} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] tracking-wider transition-all duration-400" style={{ border: '1px solid rgba(212,197,176,0.12)', color: 'rgba(212,197,176,0.5)' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(212,197,176,0.3)'; (e.currentTarget as HTMLElement).style.color='rgba(212,197,176,0.85)'; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(212,197,176,0.12)'; (e.currentTarget as HTMLElement).style.color='rgba(212,197,176,0.5)'; }}>iVoox</a>}
                    {links.soundcloud && <a href={links.soundcloud} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] tracking-wider transition-all duration-400" style={{ border: '1px solid rgba(255,85,0,0.2)', color: 'rgba(212,197,176,0.5)' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(255,85,0,0.4)'; (e.currentTarget as HTMLElement).style.color='rgba(212,197,176,0.85)'; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(255,85,0,0.2)'; (e.currentTarget as HTMLElement).style.color='rgba(212,197,176,0.5)'; }}>SoundCloud</a>}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {gallery.length > 0 && (
                <div className="mb-7">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-4 h-px bg-soda-red/35" />
                    <span className="text-soda-lamp/35 text-[9px] tracking-[0.3em] uppercase font-light">
                      Galería · {gallery.length} {gallery.length === 1 ? 'foto' : 'fotos'}
                    </span>
                  </div>

                  {gallery.length === 1 && (
                    <div className="relative aspect-[16/9] overflow-hidden rounded-sm cursor-pointer group/gal hover:border-soda-red/15 border border-transparent transition-colors duration-500"
                      onClick={e => { e.stopPropagation(); setZoomedImg(gallery[0]); }}>
                      <img src={gallery[0]} alt="Foto 1" className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover/gal:scale-[1.03]" loading="lazy" />
                      <div className="absolute inset-0 bg-soda-night/0 group-hover/gal:bg-soda-night/20 transition-all duration-500" />
                    </div>
                  )}

                  {gallery.length === 2 && (
                    <div className="grid grid-cols-3 gap-1.5">
                      {gallery.map((img, gi) => (
                        <div key={gi} className={`${gi === 0 ? 'col-span-2' : 'col-span-1'} aspect-[4/3] overflow-hidden rounded-sm cursor-pointer group/gal hover:border-soda-red/15 border border-transparent transition-colors duration-500`}
                          onClick={e => { e.stopPropagation(); setZoomedImg(img); }}>
                          <img src={img} alt={`Foto ${gi+1}`} className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover/gal:scale-[1.03]" loading="lazy" />
                        </div>
                      ))}
                    </div>
                  )}

                  {gallery.length === 3 && (
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="row-span-2 aspect-[3/4] overflow-hidden rounded-sm cursor-pointer group/gal hover:border-soda-red/15 border border-transparent transition-colors duration-500"
                        onClick={e => { e.stopPropagation(); setZoomedImg(gallery[0]); }}>
                        <img src={gallery[0]} alt="Foto 1" className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover/gal:scale-[1.03]" loading="lazy" />
                      </div>
                      {gallery.slice(1).map((img, gi) => (
                        <div key={gi} className="aspect-[4/3] overflow-hidden rounded-sm cursor-pointer group/gal hover:border-soda-red/15 border border-transparent transition-colors duration-500"
                          onClick={e => { e.stopPropagation(); setZoomedImg(img); }}>
                          <img src={img} alt={`Foto ${gi+2}`} className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover/gal:scale-[1.03]" loading="lazy" />
                        </div>
                      ))}
                    </div>
                  )}

                  {gallery.length >= 4 && (
                    <div className="space-y-1.5">
                      <div className="relative aspect-[16/7] overflow-hidden rounded-sm cursor-pointer group/gal hover:border-soda-red/15 border border-transparent transition-colors duration-500"
                        onClick={e => { e.stopPropagation(); setZoomedImg(gallery[0]); }}>
                        <img src={gallery[0]} alt="Foto 1" className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover/gal:scale-[1.03]" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-soda-night/40 via-transparent to-transparent pointer-events-none" />
                        <span className="absolute top-2.5 left-3 text-soda-glow/25 text-[8px] font-mono tracking-widest">01</span>
                      </div>
                      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide" style={{ scrollSnapType:'x mandatory' }}>
                        {gallery.slice(1).map((img, gi) => (
                          <div key={gi} className="flex-shrink-0 relative overflow-hidden rounded-sm cursor-pointer group/gal hover:border-soda-red/15 border border-transparent transition-colors duration-500"
                            style={{ width:'118px', height:'80px', scrollSnapAlign:'start' }}
                            onClick={e => { e.stopPropagation(); setZoomedImg(img); }}>
                            <img src={img} alt={`Foto ${gi+2}`} className="w-full h-full object-cover transition-transform duration-[2s] group-hover/gal:scale-[1.08]" loading="lazy" />
                            <div className="absolute inset-0 bg-soda-night/0 group-hover/gal:bg-soda-night/25 transition-all duration-500" />
                            <span className="absolute bottom-1 right-1.5 text-soda-glow/22 text-[7px] font-mono">{String(gi+2).padStart(2,'0')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Listen prompt */}
              {showListenPrompt && !listened && (
                <div className="pt-5 mt-4" style={{ borderTop: '1px solid rgba(212,197,176,0.07)' }}>
                  <p className="text-[13px] text-center mb-4" style={{ color: 'rgba(212,197,176,0.5)', fontFamily: "'DM Sans', system-ui, sans-serif" }}>¿Ya escuchaste este episodio?</p>
                  <div className="flex justify-center gap-3">
                    <button onClick={() => markListened(true)} className="px-5 py-2 text-[11px] tracking-[0.1em] uppercase transition-all duration-400 rounded-sm" style={{ background: 'rgba(196,85,85,0.08)', border: '1px solid rgba(196,85,85,0.25)', color: 'rgba(212,197,176,0.75)' }}>Sí, ya lo escuché</button>
                    <button onClick={() => setShowListenPrompt(false)} className="px-5 py-2 text-[11px] tracking-[0.1em] uppercase transition-all duration-400 rounded-sm" style={{ border: '1px solid rgba(212,197,176,0.1)', color: 'rgba(212,197,176,0.35)' }}>Todavía no</button>
                  </div>
                </div>
              )}
              {listened && !showListenPrompt && (
                <div className="pt-4 mt-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(212,197,176,0.07)' }}>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400/70" /><span className="text-emerald-400/55 text-[10px] tracking-wider">Escuchado</span></div>
                  <button onClick={() => markListened(false)} className="text-soda-fog/25 text-[10px] hover:text-soda-fog/50 transition-colors">desmarcar</button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Zoom overlay */}
          {zoomedImg && (
            <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-soda-night/90" onClick={(e) => { e.stopPropagation(); setZoomedImg(null); }}>
              <motion.img src={zoomedImg} alt="Zoom" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-full max-h-[85vh] object-contain rounded-sm" />
              <button onClick={() => setZoomedImg(null)} className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-soda-fog/60 hover:text-soda-lamp bg-soda-night/60"><X size={18} /></button>
            </div>
          )}
        </div>
      )}
    </>
  );
};
