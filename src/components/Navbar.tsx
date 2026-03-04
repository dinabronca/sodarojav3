import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getContent } from '../data/content';
import { getCurrentUser } from '../data/auth';
import { Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const content = getContent();
  const names = content.sectionNames;
  const isLoggedIn = getCurrentUser() !== null;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const menuItems = [
    { label: names.inicio, href: '/', special: '' },
    { label: names.queEsEsto, href: '/que-es-esto', special: '' },
    { label: names.equipo, href: '/equipo', special: '' },
    { label: names.episodios, href: '/episodios', special: 'episodios' },
    { label: names.frecuenciaInterna, href: '/frecuencia-interna', special: 'frecuencia' },
    { label: names.shop, href: '/shop', special: '' },
    { label: names.contacto, href: '/contacto', special: '' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[9000] transition-all duration-500 ${
        scrolled || mobileOpen ? 'bg-soda-night/95 backdrop-blur-sm' : 'bg-transparent'
      }`}>
        {/* Bottom line when scrolled */}
        <div className={`absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'linear-gradient(90deg, transparent, rgba(196,85,85,0.12) 30%, rgba(212,197,176,0.06) 70%, transparent)' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="group flex items-center space-x-2.5 z-[110]">
              {content.brand?.navbarLogoUrl ? (
                <img src={content.brand.navbarLogoUrl} alt="sodaroja" className="h-7 w-7 object-contain rounded-full" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-soda-red group-hover:shadow-[0_0_8px_rgba(196,85,85,0.4)] transition-shadow duration-500" />
              )}
              <span className="font-serif text-lg tracking-[0.08em] text-soda-glow">sodaroja</span>
            </Link>

            {/* Desktop menu */}
            <div className="hidden lg:flex items-center space-x-8">
              {menuItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link key={item.href} to={item.href}
                    className={`text-[10px] tracking-[0.18em] uppercase relative group transition-colors duration-700 ${
                      item.special === 'frecuencia'
                        ? active ? 'text-soda-red' : 'text-soda-red/50 hover:text-soda-red'
                        : active ? 'text-soda-lamp' : 'text-soda-lamp/40 hover:text-soda-lamp'
                    }`}
                  >
                    {item.label}
                    <span className={`absolute -bottom-1.5 left-0 h-px transition-all duration-500 ${
                      item.special === 'frecuencia' ? 'bg-soda-red' : 'bg-soda-lamp/50'
                    } ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:block">
                {isLoggedIn ? (
                  <Link to="/mi-cuenta" className="text-[11px] tracking-[0.15em] uppercase text-soda-fog/50 hover:text-soda-lamp transition-colors duration-500">Mi Cuenta</Link>
                ) : (
                  <Link to="/unirse" className="text-[11px] tracking-[0.15em] uppercase text-soda-red/70 hover:text-soda-red transition-colors duration-500">Unirse</Link>
                )}
              </div>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-soda-lamp z-[110] relative" aria-label="Menu">
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[8999] lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-soda-night/90" />
          <div className="absolute top-0 right-0 w-72 h-full bg-soda-night border-l border-soda-mist/8 pt-20 px-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-1">
              {menuItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link key={item.href} to={item.href} onClick={() => setMobileOpen(false)}
                    className={`block py-3 px-4 text-[12px] tracking-[0.15em] uppercase transition-colors duration-500 ${
                      active ? 'text-soda-lamp' : item.special === 'frecuencia' ? 'text-soda-red/70' : 'text-soda-fog/50'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="mt-8 pt-6 border-t border-soda-mist/8">
              {isLoggedIn ? (
                <Link to="/mi-cuenta" onClick={() => setMobileOpen(false)} className="block w-full py-3 text-center text-[11px] tracking-[0.15em] uppercase text-soda-fog/50 border border-soda-mist/15 rounded-sm">Mi Cuenta</Link>
              ) : (
                <Link to="/unirse" onClick={() => setMobileOpen(false)} className="block w-full py-3 text-center text-[11px] tracking-[0.15em] uppercase text-soda-red/70 border border-soda-red/25 rounded-sm">Unirse</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
