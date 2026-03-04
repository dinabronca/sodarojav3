import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../data/auth';
import { miniPlayerShow, miniPlayerHide } from './MiniPlayer';

interface Episode {
  id: string; city: string; title: string; description: string; imageUrl: string;
  isPremium: boolean; lat?: number; lng?: number; publishDate?: string;
  links?: Record<string, string>; embeds?: Record<string, string>;
}

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '';
  const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const d = new Date(dateStr + 'T00:00:00');
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
};

const epNum = (n?: number) => n !== undefined ? `EP. ${String(n).padStart(3, '0')}` : '';

export const EpisodeCard: React.FC<{ episode: Episode; isNewest?: boolean; episodeNumber?: number; featured?: boolean }> = ({ episode, isNewest = false, episodeNumber, featured = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [listened, setListened] = useState(false);
  const [showListenPrompt, setShowListenPrompt] = useState(false);
  const [zoomedImg, setZoomedImg] = useState<string | null>(null);
  const formattedDate = formatDate(episode.publishDate);
  const user = getCurrentUser();
  const isPremiumUser = user?.isPremium === true;
  const isLocked = episode.isPremium && !isPremiumUser;
  const isUnlockedPremium = episode.isPremium && isPremiumUser;
  const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window);

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
    if (isExpanded) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isExpanded]);

  const handleCardClick = () => {
    if (!isLocked) { setIsExpanded(true); miniPlayerShow({ episodeTitle: episode.title, city: episode.city, imageUrl: episode.imageUrl, episodeId: episode.id }); if (!listened) setShowListenPrompt(true); }
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
        data-ep-id={episode.id}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        whileHover={!isLocked ? { y: -2, transition: { duration: 1.2, ease: 'easeOut' } } : undefined}
        className="relative group h-full"
        onClick={handleCardClick}
        style={{ cursor: isLocked ? 'default' : 'pointer' }}
      >
        <div className={`relative overflow-hidden rounded-sm h-full transition-all duration-700 ${
          featured ? 'flex flex-col md:flex-row' : ''
        } ${
          isLocked
            ? 'bg-soda-slate/30 border border-soda-mist/10'
            : isUnlockedPremium
            ? 'bg-soda-slate/40 border border-soda-red/25 hover:border-soda-red/40'
            : 'bg-soda-slate/30 border border-soda-mist/10 hover:border-soda-mist/20'
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

          {/* Image */}
          <div className={`relative overflow-hidden bg-soda-deep ${featured ? 'md:w-3/5 aspect-[16/10] md:aspect-auto' : 'aspect-[16/10]'}`}>
            <img src={episode.imageUrl} alt={episode.city}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[5s] ease-out group-hover:scale-[1.004]"
              loading="lazy"
              style={isLocked ? { filter: 'saturate(0.2) brightness(0.4) blur(2px)' } : isUnlockedPremium ? { filter: 'contrast(1.1) saturate(1.15) brightness(1.05)' } : {}} />

            {/* VHS scanline for premium */}
            {(isUnlockedPremium || isLocked) && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10, overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: 0, width: '100%', height: '30%', background: 'linear-gradient(transparent, rgba(196,85,85,0.06) 40%, rgba(196,85,85,0.12) 50%, rgba(196,85,85,0.06) 60%, transparent)', animation: 'vhsScan 5s linear infinite' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)' }} />
              </div>
            )}

            {/* Bottom gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-soda-night/60 via-transparent to-transparent" />

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
                <span className="text-soda-glow/70 text-[10px] font-mono tracking-[0.12em] bg-soda-night/70 backdrop-blur-sm px-2.5 py-[5px] rounded-sm leading-none">{epNum(episodeNumber)}</span>
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
              <span className={`text-[10px] tracking-[0.2em] uppercase font-medium ${isUnlockedPremium ? 'text-soda-red/80' : 'text-soda-accent/70'}`}>
                {episode.city}
              </span>
              {formattedDate && !isLocked && (
                <span className="text-soda-lamp/40 text-[10px] tracking-wider">{formattedDate}</span>
              )}
            </div>

            {/* Title */}
            <h3 className={`font-serif text-soda-glow mb-3 leading-snug group-hover:text-soda-glow/85 transition-colors duration-700 ${featured ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'}`}>
              &ldquo;{episode.title}&rdquo;
            </h3>

            {/* Description */}
            <p className={`text-soda-lamp/55 font-light leading-relaxed mb-5 ${featured ? 'text-sm line-clamp-4' : 'text-[13px] line-clamp-2'}`}>
              {episode.description}
            </p>

            {/* CTA */}
            {isLocked ? (
              <Link to="/frecuencia-interna" onClick={e => e.stopPropagation()} className="inline-flex items-center gap-2 text-soda-red/60 text-[10px] tracking-[0.15em] uppercase hover:text-soda-red transition-colors duration-700 group/cta">
                Desbloquear <ChevronRight size={11} className="group-hover/cta:translate-x-1 transition-transform duration-500" />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-2 text-soda-lamp/45 text-[10px] tracking-[0.15em] uppercase group-hover:text-soda-lamp/80 transition-colors duration-700">
                Escuchar <ChevronRight size={11} className="group-hover:translate-x-1 transition-transform duration-500" />
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* === MODAL === */}
      {isExpanded && !isLocked && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-4 md:p-8" onClick={() => { setIsExpanded(false); setZoomedImg(null); }}>
          <div className="absolute inset-0 bg-soda-night/95 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-soda-deep border border-soda-mist/15 rounded-sm"
            style={{ WebkitOverflowScrolling: 'touch' }}
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setIsExpanded(false)} className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full flex items-center justify-center text-soda-fog/50 hover:text-soda-lamp transition-colors duration-500 bg-soda-night/60"><X size={18} /></button>

            <div className="relative h-56 sm:h-72 overflow-hidden">
              <img src={episode.imageUrl} alt={episode.city} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-soda-deep via-soda-deep/50 to-transparent" />
              {isUnlockedPremium && (
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', left: 0, width: '100%', height: '30%', background: 'linear-gradient(transparent, rgba(196,85,85,0.06) 40%, rgba(196,85,85,0.1) 50%, rgba(196,85,85,0.06) 60%, transparent)', animation: 'vhsScan 5s linear infinite' }} />
                </div>
              )}
            </div>

            <div className="p-5 sm:p-8 -mt-16 relative z-10">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                {episodeNumber !== undefined && <span className="text-soda-red/80 text-[10px] font-mono tracking-wider bg-soda-red/10 px-2.5 py-1 rounded-sm">{epNum(episodeNumber)}</span>}
                <span className={`text-[11px] tracking-wider ${isUnlockedPremium ? 'text-soda-red' : 'text-soda-accent'}`}>{episode.city}{(episode as any).country ? `, ${(episode as any).country}` : ''}</span>
                {formattedDate && <span className="text-soda-lamp/45 text-[11px]">{formattedDate}</span>}
                {(episode as any).durationMin && <span className="text-soda-lamp/35 text-[11px]">{(episode as any).durationMin} min</span>}
                {isUnlockedPremium && <span className="text-soda-red text-[9px] tracking-wider bg-soda-red/10 px-2 py-0.5 rounded-sm">FRECUENCIA INTERNA</span>}
                {isNewest && <span className="text-soda-glow text-[9px] tracking-wider bg-soda-red/80 px-2 py-0.5 rounded-sm">NUEVO</span>}
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif text-soda-glow mb-2">&ldquo;{episode.title}&rdquo;</h2>
              <p className="text-soda-lamp/75 text-sm font-light leading-relaxed mb-6">{episode.description}</p>

              {/* Embeds */}
              <div className="space-y-5 mb-6">
                {(embeds as any).youtube && (<div><span className="text-soda-lamp/45 text-[10px] tracking-[0.2em] block mb-2">YOUTUBE</span><div className="relative w-full rounded-sm overflow-hidden" style={{ paddingBottom: '56.25%' }}><iframe src={(embeds as any).youtube} className="absolute inset-0 w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" /></div></div>)}
                {embeds.spotify && (<div><span className="text-soda-lamp/45 text-[10px] tracking-[0.2em] block mb-2">SPOTIFY</span><iframe src={embeds.spotify} width="100%" height={isMobile ? "152" : "232"} frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" style={{ borderRadius: '8px' }} /></div>)}
                {embeds.applePodcasts && (<div><span className="text-soda-lamp/45 text-[10px] tracking-[0.2em] block mb-2">APPLE PODCASTS</span><iframe src={embeds.applePodcasts} width="100%" height={isMobile ? "150" : "175"} frameBorder="0" allow="autoplay *;" loading="lazy" style={{ borderRadius: '10px' }} /></div>)}
                {embeds.ivoox && (<div><span className="text-soda-lamp/45 text-[10px] tracking-[0.2em] block mb-2">IVOOX</span><iframe src={embeds.ivoox} width="100%" height={isMobile ? "150" : "200"} frameBorder="0" loading="lazy" /></div>)}
                {embeds.soundcloud && (<div><span className="text-soda-lamp/45 text-[10px] tracking-[0.2em] block mb-2">SOUNDCLOUD</span><iframe src={embeds.soundcloud} width="100%" height={isMobile ? "120" : "166"} frameBorder="0" allow="autoplay" loading="lazy" /></div>)}
              </div>

              {/* External links */}
              {Object.values(links).some(v => v) && (
                <div className="mb-6">
                  <span className="text-soda-lamp/50 text-[10px] tracking-[0.2em] block mb-3">ESCUCHAR EN</span>
                  <div className="flex flex-wrap gap-2">
                    {links.spotify && <a href={links.spotify} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 border border-soda-mist/15 rounded-sm text-soda-lamp/65 text-[11px] tracking-wider hover:border-soda-lamp/30 hover:text-soda-lamp transition-all duration-500"><ExternalLink size={11} />Spotify</a>}
                    {links.applePodcasts && <a href={links.applePodcasts} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 border border-soda-mist/15 rounded-sm text-soda-lamp/65 text-[11px] tracking-wider hover:border-soda-lamp/30 hover:text-soda-lamp transition-all duration-500"><ExternalLink size={11} />Apple Podcasts</a>}
                    {links.youtube && <a href={links.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 border border-soda-mist/15 rounded-sm text-soda-lamp/65 text-[11px] tracking-wider hover:border-soda-lamp/30 hover:text-soda-lamp transition-all duration-500"><ExternalLink size={11} />YouTube</a>}
                    {links.ivoox && <a href={links.ivoox} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 border border-soda-mist/15 rounded-sm text-soda-lamp/65 text-[11px] tracking-wider hover:border-soda-lamp/30 hover:text-soda-lamp transition-all duration-500"><ExternalLink size={11} />iVoox</a>}
                    {links.soundcloud && <a href={links.soundcloud} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 border border-soda-mist/15 rounded-sm text-soda-lamp/65 text-[11px] tracking-wider hover:border-soda-lamp/30 hover:text-soda-lamp transition-all duration-500"><ExternalLink size={11} />SoundCloud</a>}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {gallery.length > 0 && (
                <div className="mb-6">
                  <span className="text-soda-lamp/50 text-[10px] tracking-[0.2em] block mb-3">GALERIA</span>
                  <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollSnapType: 'x mandatory' }}>
                    {gallery.map((img: string, gi: number) => (
                      <div key={gi} className="flex-shrink-0 cursor-pointer group/gal" style={{ scrollSnapAlign: 'start' }}
                        onClick={(e) => { e.stopPropagation(); setZoomedImg(img); }}>
                        <div className="w-20 h-[106px] sm:w-24 sm:h-32 rounded-sm overflow-hidden border border-soda-mist/10 group-hover/gal:border-soda-mist/25 transition-all duration-500">
                          <img src={img} alt={`Foto ${gi + 1}`} className="w-full h-full object-cover transition-transform duration-[2s] group-hover/gal:scale-[1.015]" loading="lazy" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Listen prompt */}
              {showListenPrompt && !listened && (
                <div className="border-t border-soda-mist/10 pt-5 mt-4">
                  <p className="text-soda-lamp/65 text-sm text-center mb-3">Ya escuchaste este episodio?</p>
                  <div className="flex justify-center gap-3">
                    <button onClick={() => markListened(true)} className="px-5 py-2.5 bg-soda-red/10 border border-soda-red/30 rounded-sm text-soda-lamp text-sm hover:bg-soda-red/20 transition-all duration-500">Si, ya lo escuche</button>
                    <button onClick={() => setShowListenPrompt(false)} className="px-5 py-2.5 border border-soda-mist/15 rounded-sm text-soda-fog text-sm hover:text-soda-lamp transition-all duration-500">Todavia no</button>
                  </div>
                </div>
              )}
              {listened && !showListenPrompt && (
                <div className="border-t border-soda-mist/10 pt-4 mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400/70" /><span className="text-emerald-400/60 text-xs">Escuchado</span></div>
                  <button onClick={() => markListened(false)} className="text-soda-fog/30 text-[10px] hover:text-soda-fog/50 transition-colors">desmarcar</button>
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
