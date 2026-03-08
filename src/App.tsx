import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { QueEsEstoPage } from './pages/QueEsEstoPage';
import { EquipoPage } from './pages/EquipoPage';
import { EpisodiosPage } from './pages/EpisodiosPage';
import { FrecuenciaInternaPage } from './pages/FrecuenciaInternaPage';
import { ShopPage } from './pages/ShopPage';
import { ContactoPage } from './pages/ContactoPage';
import { MiCuentaPage } from './pages/MiCuentaPage';
import { UnirsePage } from './pages/UnirsePage';
import { CustomCursor } from './effects/CustomCursor';
import { PageTransition } from './effects/PageTransition';
import { getContent } from './data/content';
import { initDemoUsers } from './data/auth';
import { demoEpisodes } from './data/episodes';
import './styles/globals.css';

const AdminPage = React.lazy(() => import('./pages/AdminPage').then(m => ({ default: m.AdminPage })));
initDemoUsers();

// ===== AIRPORT COUNTER — split-flap style =====
const AirportDigit: React.FC<{ char: string; delay: number }> = ({ char, delay }) => (
  <motion.span
    className="inline-block font-mono text-soda-glow text-[12px] sm:text-[14px] tracking-[0.05em] bg-soda-slate/60 border border-soda-mist/15 px-[6px] py-[3px] rounded-[2px] min-w-[12px] text-center"
    initial={{ opacity: 0, rotateX: -90 }}
    whileInView={{ opacity: 1, rotateX: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.4, ease: 'easeOut' }}
  >
    {char}
  </motion.span>
);

const AirportCounter: React.FC = () => {
  const content = getContent();
  const episodes = content.episodios?.items?.length ? content.episodios.items : demoEpisodes;
  const eps = episodes.length;
  const cities = new Set(episodes.map((e: any) => e.city)).size;
  const countries = new Set(episodes.map((e: any) => (e as any).country).filter(Boolean)).size;
  const totalMin = episodes.reduce((sum: number, e: any) => sum + ((e as any).durationMin || 45), 0);
  const hours = Math.round(totalMin / 60);

  const renderFlap = (label: string, value: string, baseDelay: number) => (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex gap-[2px]">
        {value.split('').map((c, i) => (
          <AirportDigit key={i} char={c} delay={baseDelay + i * 0.08} />
        ))}
      </div>
      <span className="text-soda-lamp/30 text-[7px] sm:text-[8px] tracking-[0.3em] uppercase">{label}</span>
    </div>
  );

  return (
    <div className="flex items-start justify-center gap-5 sm:gap-7">
      {renderFlap('países', String(countries || '—').padStart(2, '0'), 0.2)}
      <span className="text-soda-lamp/35 text-lg mt-0.5">·</span>
      {renderFlap('ciudades', String(cities).padStart(2, '0'), 0.4)}
      <span className="text-soda-lamp/35 text-lg mt-0.5">·</span>
      {renderFlap('episodios', String(eps).padStart(2, '0'), 0.6)}
      <span className="text-soda-lamp/35 text-lg mt-0.5">·</span>
      {renderFlap('horas', String(hours).padStart(2, '0'), 0.8)}
    </div>
  );
};

// ===== EASTER EGG =====
const EasterEgg: React.FC = () => {
  const [clicks, setClicks] = React.useState(0);
  const [show, setShow] = React.useState(false);
  const timerRef = React.useRef<any>(null);

  const handleClick = () => {
    setClicks(c => {
      const next = c + 1;
      if (next >= 7) {
        setShow(true);
        setTimeout(() => setShow(false), 4000);
        return 0;
      }
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setClicks(0), 10000);
      return next;
    });
  };

  return (
    <>
      <div onClick={handleClick} className="cursor-default select-none" title="">
        <span className="text-soda-red/25 text-[9px] tracking-[0.12em]">&copy; 2026 sodaroja</span>
      </div>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[10000] bg-soda-deep border border-soda-red/30 px-6 py-3 rounded-sm shadow-2xl"
            style={{ boxShadow: '0 0 30px rgba(196,85,85,0.15)' }}
          >
            <p className="text-soda-glow text-xs sm:text-sm font-serif italic text-center whitespace-nowrap">
              PARÁ DE TOCARME, FLAQUITX. ME ESTÁS MOLESTANDO, ¿NO SABÉS LO QUE ES BASTA?
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ===== EFFECTS TOGGLE =====
const useEffectsToggle = () => {
  const [reduced, setReduced] = React.useState(() => {
    try { return localStorage.getItem('sodaroja-reduced-effects') === '1'; } catch { return false; }
  });

  React.useEffect(() => {
    const grain = document.querySelector('.grain-overlay') as HTMLElement;
    const vhs = document.querySelector('.vhs-global-band') as HTMLElement;
    if (grain) grain.style.opacity = reduced ? '0' : '';
    if (vhs) vhs.style.opacity = reduced ? '0' : '';
    document.body.style.setProperty('--scanlines-opacity', reduced ? '0' : '');
    if (reduced) {
      document.body.classList.add('effects-reduced');
    } else {
      document.body.classList.remove('effects-reduced');
    }
    try { localStorage.setItem('sodaroja-reduced-effects', reduced ? '1' : '0'); } catch {}
  }, [reduced]);

  return { reduced, toggle: () => setReduced(r => !r) };
};
// ===== FOOTER =====
const Footer: React.FC = () => {
  const content = getContent();
  const visibleLinks = content.socialLinks.filter(l => l.visible);
  const sponsors = (content as any).sponsors?.filter((s: any) => s.visible) || [];
  const footerLogo = (content as any).footerLogoUrl;
  const { reduced, toggle } = useEffectsToggle();
  return (
    <footer className="relative px-6 pt-20 pb-12 overflow-hidden">
      {/* Faint city silhouette backdrop */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 110%, rgba(196,85,85,0.04) 0%, transparent 70%)',
      }} />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Top divider — fine line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-soda-red/20 to-transparent mb-16" />

        {/* Sponsors */}
        {sponsors.length > 0 && (
          <div className="mb-16 text-center">
            <p className="text-soda-lamp/20 text-[8px] tracking-[0.35em] uppercase mb-6">Con el apoyo de</p>
            <div className="flex items-center justify-center gap-8 sm:gap-12 flex-wrap">
              {sponsors.map((s: any) => (
                <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" title={s.name}
                  className="opacity-15 hover:opacity-40 transition-opacity duration-700">
                  <img src={s.logoUrl} alt={s.name} className="h-4 sm:h-[18px] object-contain" style={{ filter: 'brightness(3) grayscale(1)' }} loading="lazy" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Airport counter — central, prominent */}
        <div className="text-center mb-14">
          <p className="text-soda-lamp/20 text-[8px] tracking-[0.4em] uppercase mb-6">el mapa de sodaroja</p>
          <AirportCounter />
        </div>

        {/* Bottom row: brand | social */}
        <div className="flex items-center justify-between flex-wrap gap-6 mb-10">
          {/* Brand */}
          <div className="flex items-center gap-3">
            {footerLogo ? (
              <img src={footerLogo} alt="sodaroja" className="h-7 object-contain opacity-45" />
            ) : content.brand?.isotipoUrl ? (
              <img src={content.brand.isotipoUrl} alt="" className="h-5 w-5 object-contain opacity-25" />
            ) : null}
            <div>
              <span className="font-serif text-soda-glow/65 text-sm block leading-tight tracking-wide">sodaroja</span>
              <span className="text-soda-lamp/30 text-[8px] tracking-[0.15em] block mt-0.5 italic">un podcast que viaja</span>
            </div>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-6 flex-wrap">
            {visibleLinks.map((link: any) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                className="text-soda-lamp/25 text-[10px] tracking-[0.12em] uppercase hover:text-soda-lamp/55 transition-colors duration-700">
                {link.iconUrl ? (
                  <img src={link.iconUrl} alt={link.platform} className="w-4 h-4 object-contain opacity-35 hover:opacity-65 transition-opacity duration-500" />
                ) : (link.abbr || link.platform)}
              </a>
            ))}
          </div>
        </div>

        {/* Fine bottom divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-soda-mist/8 to-transparent mb-6" />

        {/* Copyright with Easter Egg + Effects toggle */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <EasterEgg />
          <button
            onClick={toggle}
            title={reduced ? 'Activar efectos visuales' : 'Reducir efectos visuales'}
            className="flex items-center gap-1.5 text-soda-lamp/18 hover:text-soda-lamp/40 transition-colors duration-500 text-[9px] tracking-[0.12em] group"
          >
            <span className={`w-2.5 h-2.5 rounded-full border transition-all duration-500 ${reduced ? 'border-soda-lamp/15 bg-transparent' : 'border-soda-red/35 bg-soda-red/15'}`} />
            {reduced ? 'efectos apagados' : 'modo tranquilo'}
          </button>
        </div>
      </div>
    </footer>
  );
};

// ===== SCROLL PROGRESS BAR =====
const ScrollProgress: React.FC = () => {
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const h = document.documentElement.scrollHeight - window.innerHeight;
          setProgress(h > 0 ? window.scrollY / h : 0);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2px] bg-soda-red/60 origin-left z-[10000]"
      style={{ transform: 'scaleX(' + progress + ')', willChange: 'transform' }}
    />
  );
};


// ===== APP =====
function AppContent() {
  return (
    <div className="relative min-h-screen bg-soda-night overflow-x-hidden">
      <CustomCursor />
      <ScrollProgress />
      <div className="vhs-global-band" />
      <div className="grain-overlay" />
      <Navbar />
      <PageTransition>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/que-es-esto" element={<QueEsEstoPage />} />
          <Route path="/equipo" element={<EquipoPage />} />
          <Route path="/episodios" element={<EpisodiosPage />} />
          <Route path="/frecuencia-interna" element={<FrecuenciaInternaPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/mi-cuenta" element={<MiCuentaPage />} />
          <Route path="/admin" element={<React.Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="loader" /></div>}><AdminPage /></React.Suspense>} />
          <Route path="/unirse" element={<UnirsePage />} />
        </Routes>
      </PageTransition>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;
