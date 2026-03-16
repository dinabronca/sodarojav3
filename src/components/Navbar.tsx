import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getContent } from '../data/content';
import { getCurrentUser } from '../data/auth';
import { Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const content = getContent();
  const names = content.sectionNames;
  const isLoggedIn = getCurrentUser() !== null;

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      const max = document.body.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? y / max : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const menuItems = [
    { label: names.inicio, href: '/' },
    { label: names.queEsEsto, href: '/que-es-esto' },
    { label: names.equipo, href: '/equipo' },
    { label: names.episodios, href: '/episodios' },
    { label: names.frecuenciaInterna, href: '/frecuencia-interna', highlight: true },
    { label: names.shop, href: '/shop' },
    { label: names.contacto, href: '/contacto' },
  ];

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[9000] transition-all duration-700 ${
        scrolled || mobileOpen ? '' : ''
      }`}
        style={{
          background: scrolled || mobileOpen
            ? 'rgba(10,14,26,0.92)'
            : 'linear-gradient(to bottom, rgba(10,14,26,0.7) 0%, transparent 100%)',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        }}>

        {/* Progress bar — ultra thin red line at very bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
          <div className="h-full transition-all duration-100 ease-out"
            style={{
              width: `${scrollProgress * 100}%`,
              background: 'linear-gradient(to right, rgba(196,85,85,0.4), rgba(196,85,85,0.15))',
            }} />
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4">
          <div className="flex items-center justify-between gap-8">

            {/* Logo */}
            <Link to="/" className="group flex items-center gap-3 z-[110] flex-shrink-0">
              {content.brand?.navbarLogoUrl ? (
                <img src={content.brand.navbarLogoUrl} alt="sodaroja"
                  className="h-7 w-7 object-contain rounded-full transition-opacity duration-500 group-hover:opacity-80" />
              ) : (
                <div className="w-2 h-2 rounded-full transition-all duration-700 group-hover:scale-125"
                  style={{ background: 'rgba(196,85,85,0.8)', boxShadow: '0 0 6px rgba(196,85,85,0.3)' }} />
              )}
              <span className="tracking-[0.18em] text-soda-glow/85 transition-opacity duration-500 group-hover:opacity-60" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 300, letterSpacing: '0.18em', textTransform: 'lowercase' }}>
                sodaroja
              </span>
            </Link>

            {/* Desktop menu */}
            <div className="hidden lg:flex items-center gap-7 flex-1 justify-center">
              {menuItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link key={item.href} to={item.href}
                    className={`relative text-[11px] tracking-[0.15em] uppercase transition-all duration-500 group ${
                      item.highlight
                        ? active ? 'text-soda-red' : 'text-soda-red/45 hover:text-soda-red/80'
                        : active ? 'text-soda-lamp/80' : 'text-soda-lamp/35 hover:text-soda-lamp/65'
                    }`}>
                    {item.label}
                    {/* Active underline */}
                    <span className={`absolute -bottom-1 left-0 h-px transition-all duration-500 ease-out ${
                      item.highlight ? 'bg-soda-red/60' : 'bg-soda-lamp/35'
                    } ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  </Link>
                );
              })}
            </div>

            {/* Right: account + hamburger */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="hidden lg:block">
                {isLoggedIn ? (
                  <Link to="/mi-cuenta"
                    className="text-[11px] tracking-[0.15em] uppercase text-soda-lamp/30 hover:text-soda-lamp/60 transition-colors duration-500">
                    Mi Cuenta
                  </Link>
                ) : (
                  <Link to="/unirse"
                    className="text-[11px] tracking-[0.12em] uppercase px-4 py-2 rounded-sm transition-all duration-500 hover:scale-[1.02]"
                    style={{
                      color: 'rgba(196,85,85,0.75)',
                      border: '1px solid rgba(196,85,85,0.2)',
                      background: 'rgba(196,85,85,0.04)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(196,85,85,0.08)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196,85,85,0.35)';
                      (e.currentTarget as HTMLElement).style.color = 'rgba(196,85,85,1)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(196,85,85,0.04)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196,85,85,0.2)';
                      (e.currentTarget as HTMLElement).style.color = 'rgba(196,85,85,0.75)';
                    }}>
                    Unirse
                  </Link>
                )}
              </div>

              {/* Hamburger */}
              <button onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-soda-lamp/60 hover:text-soda-lamp transition-colors z-[110] relative"
                aria-label="Menu">
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[8999] lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0" style={{ background: 'rgba(10,14,26,0.65)', backdropFilter: 'blur(8px)' }} />
          <div className="absolute top-0 right-0 w-72 h-full pt-20 px-6 overflow-y-auto"
            style={{ background: 'rgba(10,14,26,0.96)', borderLeft: '1px solid rgba(212,197,176,0.07)' }}
            onClick={e => e.stopPropagation()}>
            <div className="space-y-0.5">
              {menuItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link key={item.href} to={item.href} onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between py-3.5 px-4 rounded-sm text-[11px] tracking-[0.18em] uppercase transition-all duration-400 ${
                      active
                        ? item.highlight ? 'text-soda-red bg-soda-red/5' : 'text-soda-lamp/80 bg-soda-mist/5'
                        : item.highlight ? 'text-soda-red/50 hover:text-soda-red/80' : 'text-soda-lamp/35 hover:text-soda-lamp/60'
                    }`}>
                    {item.label}
                    {active && <div className="w-1 h-1 rounded-full" style={{ background: item.highlight ? 'rgba(196,85,85,0.6)' : 'rgba(212,197,176,0.3)' }} />}
                  </Link>
                );
              })}
            </div>
            <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(212,197,176,0.07)' }}>
              {isLoggedIn ? (
                <Link to="/mi-cuenta" onClick={() => setMobileOpen(false)}
                  className="block w-full py-3 text-center text-[10px] tracking-[0.18em] uppercase text-soda-lamp/40 rounded-sm"
                  style={{ border: '1px solid rgba(212,197,176,0.1)' }}>
                  Mi Cuenta
                </Link>
              ) : (
                <Link to="/unirse" onClick={() => setMobileOpen(false)}
                  className="block w-full py-3.5 text-center text-[10px] tracking-[0.18em] uppercase text-soda-red/75 rounded-sm"
                  style={{ border: '1px solid rgba(196,85,85,0.25)', background: 'rgba(196,85,85,0.04)' }}>
                  Unirse
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
