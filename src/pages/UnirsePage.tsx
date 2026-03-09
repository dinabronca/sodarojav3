import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithGoogle,
  signInWithTwitter,
  signInWithSpotify,
  signInWithEmail,
  signUpWithEmail,
  upsertUserProfile,
  getUserProfile,
} from '../data/supabase';
import { loginUser, getCurrentUser } from '../data/auth';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const SpotifyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1DB954">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.371-.721.49-1.101.24-3.021-1.858-6.832-2.278-11.322-1.237-.422.1-.851-.16-.949-.584-.1-.421.16-.85.584-.948 4.911-1.121 9.121-.641 12.502 1.432.371.24.489.72.24 1.1l.046-.003zm1.47-3.27c-.299.469-.939.619-1.408.319-3.459-2.127-8.731-2.743-12.822-1.502-.529.16-1.088-.139-1.248-.669-.161-.529.139-1.088.669-1.248 4.671-1.42 10.471-.73 14.472 1.712.468.299.618.938.318 1.407l.019.001zm.127-3.402C15.503 8.32 8.39 8.1 4.72 9.223c-.637.19-1.307-.166-1.497-.802-.19-.637.166-1.307.802-1.497C8.15 5.637 15.962 5.9 20.441 8.502c.572.333.771 1.065.438 1.637-.333.572-1.065.77-1.637.438l-.124-.009z"/>
  </svg>
);

const Spinner = () => (
  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    className="w-4 h-4 border border-soda-lamp/30 rounded-full" style={{ borderTopColor: 'rgba(212,197,176,0.7)' }} />
);

const generateMemberNumber = (): string => {
  const vowels = 'AEIOU';
  const v1 = vowels[Math.floor(Math.random() * 5)];
  const v2 = vowels[Math.floor(Math.random() * 5)];
  const nums = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join('');
  return `${v1}${v2}-${nums}`;
};

export const UnirsePage: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (getCurrentUser()) navigate('/mi-cuenta');
  }, []);

  const handleOAuth = async (provider: 'google' | 'twitter' | 'spotify') => {
    setLoading(provider);
    setError('');
    try {
      if (provider === 'google') await signInWithGoogle();
      else if (provider === 'twitter') await signInWithTwitter();
      else await signInWithSpotify();
    } catch {
      setError('Error al conectar. Intentá de nuevo.');
      setLoading(null);
    }
  };

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading('email');

    try {
      if (mode === 'login') {
        const { data, error: err } = await signInWithEmail(email, password);
        if (err || !data.user) {
          setError('Email o contraseña incorrectos');
          setLoading(null);
          return;
        }
        const profile = await getUserProfile(data.user.id);
        const localUser = {
          name: profile.data?.name || data.user.user_metadata?.full_name || email.split('@')[0],
          email: data.user.email || email,
          passwordHash: '',
          photoUrl: profile.data?.photo_url || data.user.user_metadata?.avatar_url || '',
          isPremium: profile.data?.is_premium || false,
          memberNumber: profile.data?.member_number || generateMemberNumber(),
          createdAt: data.user.created_at,
        };
        loginUser(localUser);
        navigate('/mi-cuenta');
        window.location.reload();

      } else {
        if (!name.trim()) { setError('Ingresá tu nombre'); setLoading(null); return; }
        if (password.length < 8) { setError('Mínimo 8 caracteres'); setLoading(null); return; }
        if (password !== confirmPassword) { setError('Las contraseñas no coinciden'); setLoading(null); return; }

        const { data, error: err } = await signUpWithEmail(email, password, name);
        if (err) {
          if (err.message?.includes('already registered') || err.message?.includes('already exists')) {
            setError('Ya existe una cuenta con ese email');
          } else {
            setError(err.message || 'Error al crear la cuenta');
          }
          setLoading(null);
          return;
        }

        if (data.user && data.session) {
          // Auto-confirmed (no email confirmation required)
          const memberNumber = generateMemberNumber();
          await upsertUserProfile(data.user.id, { name: name.trim(), email, isPremium: false, memberNumber });
          loginUser({ name: name.trim(), email, passwordHash: '', photoUrl: '', isPremium: false, memberNumber, createdAt: new Date().toISOString() });
          navigate('/mi-cuenta');
          window.location.reload();
        } else {
          // Email confirmation required
          setSuccess('¡Cuenta creada! Revisá tu email para confirmarla.');
        }
      }
    } catch {
      setError('Error inesperado. Intentá de nuevo.');
    }
    setLoading(null);
  };

  const inputBase = `w-full bg-transparent rounded-sm px-4 py-3 text-soda-lamp/75 text-sm placeholder-soda-lamp/18 focus:outline-none transition-all duration-300`;

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden">

      {/* Ambient bg */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(196,85,85,0.05) 0%, transparent 65%)' }} />
        <motion.div className="absolute" style={{ left: '5%', top: '15%', width: '45%', height: '50%',
          background: 'radial-gradient(ellipse, rgba(196,85,85,0.05) 0%, transparent 65%)', filter: 'blur(60px)' }}
          animate={{ x: [0, 30, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute" style={{ right: '5%', bottom: '20%', width: '40%', height: '45%',
          background: 'radial-gradient(ellipse, rgba(138,155,196,0.05) 0%, transparent 65%)', filter: 'blur(60px)' }}
          animate={{ x: [0, -25, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 5 }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[400px] relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full mb-5"
            style={{ background: 'rgba(196,85,85,0.08)', border: '1px solid rgba(196,85,85,0.2)', boxShadow: '0 0 20px rgba(196,85,85,0.08)' }}>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(196,85,85,0.8)' }} />
          </motion.div>
          <h1 className="font-serif text-3xl text-soda-glow/90 mb-2">
            {mode === 'register' ? 'Unirse a sodaroja' : 'Bienvenido de vuelta'}
          </h1>
          <p className="text-soda-lamp/30 text-sm">
            {mode === 'register' ? 'Creá tu cuenta para acceder a todo el contenido' : 'Ingresá a tu cuenta'}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-sm overflow-hidden"
          style={{ background: 'rgba(14,18,28,0.8)', border: '1px solid rgba(212,197,176,0.08)', backdropFilter: 'blur(20px)' }}>

          {/* Tabs */}
          <div className="flex" style={{ borderBottom: '1px solid rgba(212,197,176,0.07)' }}>
            {(['register', 'login'] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                className={`flex-1 py-3.5 text-[10px] tracking-[0.2em] uppercase transition-all duration-400 ${
                  mode === m ? 'text-soda-lamp/70' : 'text-soda-lamp/22 hover:text-soda-lamp/40'
                }`}
                style={{ borderBottom: mode === m ? '1px solid rgba(196,85,85,0.45)' : '1px solid transparent', marginBottom: '-1px' }}>
                {m === 'register' ? 'Crear cuenta' : 'Iniciar sesión'}
              </button>
            ))}
          </div>

          <div className="p-7 space-y-6">

            {/* OAuth */}
            <div className="space-y-2">
              {[
                { id: 'google' as const, label: 'Continuar con Google', icon: <GoogleIcon />,
                  border: 'rgba(212,197,176,0.1)', bg: 'rgba(212,197,176,0.025)' },
                { id: 'twitter' as const, label: 'Continuar con X', icon: <XIcon />,
                  border: 'rgba(212,197,176,0.1)', bg: 'rgba(212,197,176,0.025)' },
                { id: 'spotify' as const, label: 'Continuar con Spotify', icon: <SpotifyIcon />,
                  border: 'rgba(29,185,84,0.2)', bg: 'rgba(29,185,84,0.04)' },
              ].map(btn => (
                <button key={btn.id}
                  onClick={() => handleOAuth(btn.id)}
                  disabled={loading !== null}
                  className="w-full flex items-center gap-3.5 px-4 py-3 rounded-sm text-soda-lamp/60 text-[12px] transition-all duration-300 hover:text-soda-lamp/85 disabled:opacity-40"
                  style={{ border: `1px solid ${btn.border}`, background: btn.bg }}
                  onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = btn.bg.replace('0.025', '0.06').replace('0.04', '0.07'); }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = btn.bg; }}
                >
                  <span className="flex-shrink-0 flex items-center justify-center w-5">
                    {loading === btn.id ? <Spinner /> : btn.icon}
                  </span>
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: 'rgba(212,197,176,0.07)' }} />
              <span className="text-soda-lamp/18 text-[10px] tracking-[0.12em] uppercase">o con email</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(212,197,176,0.07)' }} />
            </div>

            {/* Email form */}
            <form onSubmit={handleEmail} className="space-y-2.5">
              <AnimatePresence>
                {mode === 'register' && (
                  <motion.div key="name-field"
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }} className="overflow-hidden">
                    <div className="relative">
                      <User size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-soda-lamp/18 pointer-events-none" />
                      <input type="text" value={name} onChange={e => setName(e.target.value)}
                        placeholder="Tu nombre"
                        className={`${inputBase} pl-9`}
                        style={{ border: '1px solid rgba(212,197,176,0.1)' }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <Mail size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-soda-lamp/18 pointer-events-none" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="tu@email.com" required
                  className={`${inputBase} pl-9`}
                  style={{ border: '1px solid rgba(212,197,176,0.1)' }} />
              </div>

              <div className="relative">
                <Lock size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-soda-lamp/18 pointer-events-none" />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'Mínimo 8 caracteres' : 'Contraseña'} required
                  className={`${inputBase} pl-9 pr-10`}
                  style={{ border: '1px solid rgba(212,197,176,0.1)' }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-soda-lamp/18 hover:text-soda-lamp/45 transition-colors">
                  {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>

              <AnimatePresence>
                {mode === 'register' && (
                  <motion.div key="confirm-field"
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }} className="overflow-hidden">
                    <div className="relative">
                      <Lock size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-soda-lamp/18 pointer-events-none" />
                      <input type={showPass ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Repetir contraseña"
                        className={`${inputBase} pl-9`}
                        style={{ border: '1px solid rgba(212,197,176,0.1)' }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {error && (
                  <motion.p key="err" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-soda-red/65 text-[12px]">
                    <AlertCircle size={12} /> {error}
                  </motion.p>
                )}
                {success && (
                  <motion.p key="ok" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-emerald-400/65 text-[12px] text-center">
                    ✓ {success}
                  </motion.p>
                )}
              </AnimatePresence>

              <button type="submit" disabled={loading !== null}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-sm text-[11px] tracking-[0.18em] uppercase transition-all duration-500 mt-1 disabled:opacity-40"
                style={{ background: 'rgba(196,85,85,0.1)', border: '1px solid rgba(196,85,85,0.22)', color: 'rgba(254,248,237,0.7)' }}>
                {loading === 'email' ? <Spinner /> : <>{mode === 'register' ? 'Crear cuenta' : 'Entrar'} <ArrowRight size={13} /></>}
              </button>
            </form>

            {/* Demo hint */}
            {mode === 'login' && (
              <div className="pt-4 text-center" style={{ borderTop: '1px solid rgba(212,197,176,0.06)' }}>
                <p className="text-soda-lamp/16 text-[10px] mb-1">Cuenta de prueba</p>
                <p className="text-soda-lamp/22 text-[10px]">premium@sodaroja.com · Sodaroja1!</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-soda-lamp/12 text-[10px] mt-5 leading-relaxed">
          Al continuar aceptás los términos de uso y la política de privacidad.
        </p>
      </motion.div>
    </section>
  );
};
