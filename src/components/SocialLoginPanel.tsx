import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Eye, EyeOff, ArrowRight, X } from 'lucide-react';
import { signInWithGoogle, signInWithTwitter, signInWithSpotify, signInWithEmail, signUpWithEmail } from '../data/supabase';

// ── ICONS ──────────────────────────────────────────────────────

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const TwitterXIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const SpotifyIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="#1DB954">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.371-.721.49-1.101.24-3.021-1.858-6.832-2.278-11.322-1.237-.422.1-.851-.16-.949-.584-.1-.421.16-.85.584-.948 4.911-1.121 9.121-.641 12.502 1.432.371.24.489.72.24 1.1l.046-.003zm1.47-3.27c-.299.469-.939.619-1.408.319-3.459-2.127-8.731-2.743-12.822-1.502-.529.16-1.088-.139-1.248-.669-.161-.529.139-1.088.669-1.248 4.671-1.42 10.471-.73 14.472 1.712.468.299.618.938.318 1.407l.019.001zm.127-3.402C15.503 8.32 8.39 8.1 4.72 9.223c-.637.19-1.307-.166-1.497-.802-.19-.637.166-1.307.802-1.497C8.15 5.637 15.962 5.9 20.441 8.502c.572.333.771 1.065.438 1.637-.333.572-1.065.77-1.637.438l-.124-.009z"/>
  </svg>
);

// ── COMPONENT ─────────────────────────────────────────────────

export const SocialLoginPanel: React.FC = () => {
  const [mode, setMode] = useState<'options' | 'email'>('options');
  const [emailMode, setEmailMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleSocial = async (provider: 'google' | 'spotify' | 'twitter') => {
    setLoading(provider);
    setError('');
    try {
      const fn = provider === 'google' ? signInWithGoogle
        : provider === 'spotify' ? signInWithSpotify
        : signInWithTwitter;
      const { error } = await fn();
      if (error) setError(error.message);
    } catch (e: any) {
      setError(e?.message || 'Error al conectar');
    } finally {
      setLoading(null);
    }
  };

  const handleEmail = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Completá todos los campos'); return; }
    setLoading('email');
    setError('');
    try {
      if (emailMode === 'login') {
        const { error } = await signInWithEmail(email, password);
        if (error) setError(error.message === 'Invalid login credentials' ? 'Email o contraseña incorrectos' : error.message);
        else window.location.href = '/auth/callback';
      } else {
        if (!name.trim()) { setError('Ingresá tu nombre'); setLoading(null); return; }
        if (password.length < 6) { setError('Mínimo 6 caracteres'); setLoading(null); return; }
        const { error } = await signUpWithEmail(email, password, name);
        if (error) setError(error.message);
        else { setError(''); setMode('options'); setError('Revisá tu email para confirmar la cuenta'); }
      }
    } catch (err: any) {
      setError(err?.message || 'Error inesperado');
    } finally {
      setLoading(null);
    }
  };

  const socialButtons = [
    { id: 'google' as const, label: 'Continuar con Google', icon: <GoogleIcon />, style: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(254,248,237,0.75)' } },
    { id: 'spotify' as const, label: 'Continuar con Spotify', icon: <SpotifyIcon />, style: { background: 'rgba(29,185,84,0.06)', border: '1px solid rgba(29,185,84,0.2)', color: 'rgba(254,248,237,0.75)' } },
    { id: 'twitter' as const, label: 'Continuar con X', icon: <TwitterXIcon />, style: { background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(254,248,237,0.75)' } },
  ];

  return (
    <div className="w-full max-w-sm mx-auto">
      <AnimatePresence mode="wait">

        {/* ── OPTIONS ── */}
        {mode === 'options' && (
          <motion.div key="options"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {/* Social buttons */}
            {socialButtons.map(({ id, label, icon, style }) => (
              <motion.button
                key={id}
                onClick={() => handleSocial(id)}
                disabled={!!loading}
                className="w-full flex items-center gap-3 px-5 py-3.5 rounded-sm text-[12px] tracking-[0.08em] transition-all duration-400 hover:opacity-80 disabled:opacity-40"
                style={style}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex-shrink-0 w-5 flex items-center justify-center">
                  {loading === id ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                      className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ borderTopColor: 'rgba(255,255,255,0.7)' }} />
                  ) : icon}
                </span>
                {label}
              </motion.button>
            ))}

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px" style={{ background: 'rgba(212,197,176,0.1)' }} />
              <span className="text-[9px] tracking-[0.25em] uppercase" style={{ color: 'rgba(212,197,176,0.25)' }}>o</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(212,197,176,0.1)' }} />
            </div>

            {/* Email button */}
            <motion.button
              onClick={() => setMode('email')}
              className="w-full flex items-center gap-3 px-5 py-3.5 rounded-sm text-[12px] tracking-[0.08em] transition-all duration-400 hover:opacity-80"
              style={{ background: 'rgba(196,85,85,0.06)', border: '1px solid rgba(196,85,85,0.2)', color: 'rgba(254,248,237,0.75)' }}
              whileTap={{ scale: 0.98 }}
            >
              <Mail size={14} className="flex-shrink-0" style={{ color: 'rgba(196,85,85,0.6)' }} />
              Continuar con email
              <ArrowRight size={12} className="ml-auto opacity-40" />
            </motion.button>

            {error && (
              <p className="text-[11px] text-center pt-1" style={{ color: error.includes('Revisá') ? 'rgba(52,211,153,0.7)' : 'rgba(196,85,85,0.7)' }}>
                {error}
              </p>
            )}
          </motion.div>
        )}

        {/* ── EMAIL FORM ── */}
        {mode === 'email' && (
          <motion.div key="email"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex gap-3">
                <button onClick={() => setEmailMode('login')}
                  className={`text-[10px] tracking-[0.15em] uppercase pb-1 transition-all duration-300 ${emailMode === 'login' ? 'text-soda-lamp/80 border-b border-soda-red/50' : 'text-soda-lamp/25 hover:text-soda-lamp/45'}`}>
                  Ingresar
                </button>
                <button onClick={() => setEmailMode('register')}
                  className={`text-[10px] tracking-[0.15em] uppercase pb-1 transition-all duration-300 ${emailMode === 'register' ? 'text-soda-lamp/80 border-b border-soda-red/50' : 'text-soda-lamp/25 hover:text-soda-lamp/45'}`}>
                  Registrarse
                </button>
              </div>
              <button onClick={() => { setMode('options'); setError(''); }}
                className="text-soda-lamp/20 hover:text-soda-lamp/50 transition-colors">
                <X size={14} />
              </button>
            </div>

            <div className="space-y-3">
              {emailMode === 'register' && (
                <input
                  type="text" placeholder="Tu nombre" value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-sm text-[12px] bg-transparent outline-none transition-all duration-300"
                  style={{ border: '1px solid rgba(212,197,176,0.12)', color: 'rgba(254,248,237,0.8)',
                    '::placeholder': { color: 'rgba(212,197,176,0.25)' } } as any}
                />
              )}
              <input
                type="email" placeholder="tu@email.com" value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-sm text-[12px] bg-transparent outline-none"
                style={{ border: '1px solid rgba(212,197,176,0.12)', color: 'rgba(254,248,237,0.8)' }}
              />
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} placeholder="Contraseña" value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleEmail(e as any)}
                  className="w-full px-4 py-3 pr-11 rounded-sm text-[12px] bg-transparent outline-none"
                  style={{ border: '1px solid rgba(212,197,176,0.12)', color: 'rgba(254,248,237,0.8)' }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-soda-lamp/25 hover:text-soda-lamp/50 transition-colors">
                  {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>

              {error && (
                <p className="text-[11px]" style={{ color: error.includes('Revisá') ? 'rgba(52,211,153,0.7)' : 'rgba(196,85,85,0.7)' }}>
                  {error}
                </p>
              )}

              <motion.button
                onClick={handleEmail}
                disabled={!!loading}
                className="w-full py-3.5 rounded-sm text-[11px] tracking-[0.15em] uppercase flex items-center justify-center gap-2 transition-all duration-400 disabled:opacity-40"
                style={{ background: 'rgba(196,85,85,0.12)', border: '1px solid rgba(196,85,85,0.3)', color: 'rgba(254,248,237,0.8)' }}
                whileTap={{ scale: 0.98 }}
              >
                {loading === 'email' ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                    className="w-3.5 h-3.5 rounded-full border border-soda-red/20" style={{ borderTopColor: 'rgba(196,85,85,0.8)' }} />
                ) : (
                  <>{emailMode === 'login' ? 'Ingresar' : 'Crear cuenta'} <ArrowRight size={12} /></>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
