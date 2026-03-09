import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Heart, Radio, MessageCircle, BarChart3, Trophy, Settings, CreditCard, LogOut, ArrowRight, Bell, Gift, Instagram, Youtube, Twitter, Headphones, Calendar, Zap, Star, ExternalLink, ChevronRight } from 'lucide-react';
import { getCurrentUser } from '../data/auth';

// ============================================================
// PLANES & BENEFICIOS
// ============================================================
interface Plan { id: string; name: string; priceARS: number; priceUSD: number; description: string; featured?: boolean; }
const plans: Plan[] = [
  { id: 'plan-a', name: 'Mate', priceARS: 2500, priceUSD: 4, description: 'Un empujoncito que suma mucho' },
  { id: 'plan-b', name: 'Soda', priceARS: 5000, priceUSD: 8, description: 'El que más eligen', featured: true },
  { id: 'plan-c', name: 'Sifón', priceARS: 12500, priceUSD: 20, description: 'Para los que quieren que esto crezca' },
];
const benefits = [
  '2 episodios extras por mes', 'Sorteos exclusivos', 'Historias más profundas',
  'Acceso anticipado', 'Tu Número de Socio', 'Comunidad privada',
  'Sin publicidad', 'RSS privado', 'Descuentos en la tienda', 'Ser parte real del proyecto',
];

// ============================================================
// LOCALSTORAGE HELPERS (en producción → Supabase)
// ============================================================
const getLS = (k: string, d: any = []) => { try { return JSON.parse(localStorage.getItem(k) || JSON.stringify(d)); } catch { return d; } };
const setLS = (k: string, v: any) => localStorage.setItem(k, JSON.stringify(v));

// ============================================================
// AURORA BOREAL + RAYOS
// ============================================================
const AuroraEffect: React.FC = () => {
  const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768);
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 1 }}>
      {/* Aurora rojo/magenta */}
      <motion.div className="absolute" style={{ left: '-15%', top: '-25%', width: '80%', height: '60%',
        background: 'radial-gradient(ellipse at 30% 50%, rgba(196,85,85,0.12) 0%, rgba(139,58,58,0.05) 40%, transparent 70%)',
        filter: 'blur(60px)' }}
        animate={{ x: [0, 100, -40, 0], y: [0, 40, -25, 0], opacity: [0.5, 0.8, 0.6, 0.5] }}
        transition={{ duration: isMobile ? 35 : 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Aurora azul */}
      <motion.div className="absolute" style={{ right: '-10%', top: '5%', width: '65%', height: '55%',
        background: 'radial-gradient(ellipse at 60% 40%, rgba(138,155,196,0.10) 0%, rgba(100,130,180,0.04) 40%, transparent 70%)',
        filter: 'blur(55px)' }}
        animate={{ x: [0, -70, 50, 0], y: [0, -35, 25, 0], opacity: [0.4, 0.7, 0.5, 0.4] }}
        transition={{ duration: isMobile ? 38 : 25, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />
      {/* Aurora verde tenue */}
      {!isMobile && <motion.div className="absolute" style={{ left: '15%', bottom: '-5%', width: '70%', height: '40%',
        background: 'radial-gradient(ellipse at 50% 80%, rgba(80,180,120,0.05) 0%, transparent 60%)',
        filter: 'blur(55px)' }}
        animate={{ x: [0, 60, -40, 0], opacity: [0.3, 0.55, 0.35, 0.3] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
      />}

      {/* ===== RAYOS DE LUZ ===== */}
      {[0, 1, 2, 3, 4].map(i => (
        <motion.div key={`ray-${i}`} className="absolute"
          style={{
            left: `${10 + i * 20}%`, top: 0, width: '2px', height: '100%',
            background: `linear-gradient(to bottom, transparent 0%, ${i % 2 === 0 ? 'rgba(196,85,85,0.12)' : 'rgba(138,155,196,0.08)'} 30%, ${i % 2 === 0 ? 'rgba(196,85,85,0.06)' : 'rgba(138,155,196,0.04)'} 70%, transparent 100%)`,
          }}
          animate={{
            opacity: [0, 0.8, 0.3, 0.9, 0],
            scaleX: [1, 1.5, 1, 2, 1],
          }}
          transition={{ duration: 12 + i * 3, repeat: Infinity, delay: i * 3.5, ease: 'easeInOut' }}
        />
      ))}
      {/* Rayos diagonales anchos */}
      {!isMobile && [0, 1].map(i => (
        <motion.div key={`dray-${i}`} className="absolute"
          style={{
            left: `${20 + i * 45}%`, top: '-10%', width: '80px', height: '120%',
            background: `linear-gradient(${150 + i * 30}deg, transparent 0%, rgba(196,85,85,0.03) 40%, rgba(138,155,196,0.02) 60%, transparent 100%)`,
            filter: 'blur(20px)',
            transform: `rotate(${-15 + i * 8}deg)`,
          }}
          animate={{ opacity: [0.1, 0.4, 0.1], x: [0, 30, 0] }}
          transition={{ duration: 10 + i * 4, repeat: Infinity, ease: 'easeInOut', delay: i * 5 }}
        />
      ))}
    </div>
  );
};

// ============================================================
// SODITAS MISSIONS SYSTEM
// ============================================================
interface Mission { id: string; label: string; icon: React.ElementType; soditas: number; completed: boolean; type: 'one-time' | 'recurring'; }

const getMissions = (): Mission[] => {
  const completed: string[] = getLS('sodaroja-missions-done', []);
  const listenedCount = getLS('sodaroja-listened', []).length;
  const pollCount = Object.keys(getLS('sodaroja-user-poll-votes', {})).length;
  
  // Read config from admin (or use defaults)
  const config: any[] | null = (() => { try { return JSON.parse(localStorage.getItem('sodaroja-missions-config') || 'null'); } catch { return null; } })();
  
  const defaultConfig = [
    { id: 'listen-1', label: 'Escuchar tu primer episodio', icon: 'Headphones', soditas: 3, type: 'auto' },
    { id: 'listen-5', label: 'Escuchar 5 episodios', icon: 'Headphones', soditas: 8, type: 'auto' },
    { id: 'listen-10', label: 'Escuchar 10 episodios', icon: 'Star', soditas: 15, type: 'auto' },
    { id: 'follow-ig', label: 'Seguinos en Instagram', icon: 'Instagram', soditas: 5, type: 'social' },
    { id: 'follow-yt', label: 'Suscribite en YouTube', icon: 'Youtube', soditas: 5, type: 'social' },
    { id: 'follow-tw', label: 'Seguinos en X (Twitter)', icon: 'Twitter', soditas: 5, type: 'social' },
    { id: 'streak-3', label: '3 meses consecutivos suscripto', icon: 'Calendar', soditas: 10, type: 'auto' },
    { id: 'streak-6', label: '6 meses consecutivos suscripto', icon: 'Zap', soditas: 25, type: 'auto' },
    { id: 'poll-vote', label: 'Votar en una encuesta', icon: 'BarChart3', soditas: 3, type: 'recurring' },
    { id: 'early-bird', label: 'Ser de los primeros en escuchar', icon: 'Zap', soditas: 5, type: 'auto' },
  ];

  const iconMap: Record<string, React.ElementType> = { Headphones, Star, Instagram, Youtube, Twitter, Calendar, Zap, BarChart3, Trophy, Heart };
  const items = config || defaultConfig;

  return items.map((m: any) => {
    let autoCompleted = false;
    if (m.id === 'listen-1') autoCompleted = listenedCount >= 1;
    else if (m.id === 'listen-5') autoCompleted = listenedCount >= 5;
    else if (m.id === 'listen-10') autoCompleted = listenedCount >= 10;
    else if (m.id === 'poll-vote') autoCompleted = pollCount > 0;
    else autoCompleted = completed.includes(m.id);
    
    return {
      id: m.id,
      label: m.label,
      icon: iconMap[m.icon] || Star,
      soditas: m.soditas,
      completed: autoCompleted,
      type: m.type === 'recurring' ? 'recurring' as const : 'one-time' as const,
    };
  });
};

const completeMission = (missionId: string) => {
  const done: string[] = getLS('sodaroja-missions-done', []);
  if (!done.includes(missionId)) { done.push(missionId); setLS('sodaroja-missions-done', done); }
};

// ============================================================
// SUBSCRIBER DASHBOARD
// ============================================================
const SubscriberDashboard: React.FC = () => {
  const user = getCurrentUser();
  const [messages, setMessages] = useState<any[]>([]);
  const [polls, setPolls] = useState<any[]>([]);
  const [pollVotes, setPollVotes] = useState<Record<string, Record<string, number>>>({});
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});
  const [raffles, setRaffles] = useState<any[]>([]);
  const [raffleEntries, setRaffleEntries] = useState<Record<string, boolean>>({});
  const [soditas, setSoditas] = useState(10);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [showMissions, setShowMissions] = useState(false);
  const [activePollPage, setActivePollPage] = useState<string | null>(null);
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState('plan-b');
  const [payMethod, setPayMethod] = useState('Mercado Pago');

  useEffect(() => {
    setMessages(getLS('sodaroja-internal-messages'));
    setPolls(getLS('sodaroja-polls'));
    setPollVotes(getLS('sodaroja-poll-votes', {}));
    setUserVotes(getLS('sodaroja-user-poll-votes', {}));
    setRaffles(getLS('sodaroja-raffles'));
    setRaffleEntries(getLS('sodaroja-raffle-entries', {}));
    setSoditas(parseInt(localStorage.getItem('sodaroja-user-bubbles') || '10'));
    setNotifications(getLS('sodaroja-user-notifications', []));
    setMissions(getMissions());
    setUserPlan(localStorage.getItem('sodaroja-user-plan') || 'plan-b');
    setPayMethod(localStorage.getItem('sodaroja-pay-method') || 'Mercado Pago');
  }, []);

  const listenedCount = useMemo(() => getLS('sodaroja-listened').length, []);
  const activePolls = polls.filter((p: any) => p.active);
  const activeRaffles = raffles.filter((r: any) => r.active);
  const currentPoll = activePolls[0];
  const currentRaffle = activeRaffles[0];
  const unreadNotifs = notifications.filter((n: any) => !n.read).length;

  const addSoditas = (amount: number) => {
    const n = soditas + amount; setSoditas(n); localStorage.setItem('sodaroja-user-bubbles', String(n));
  };

  const pollCompleted = currentPoll ? userVotes[currentPoll.id] !== undefined : true;

  const enterRaffle = (raffleId: string) => {
    const cost = raffles.find((r: any) => r.id === raffleId)?.soditasCost || 5;
    if (soditas < cost || raffleEntries[raffleId]) return;
    const ns = soditas - cost; setSoditas(ns); localStorage.setItem('sodaroja-user-bubbles', String(ns));
    const ne = { ...raffleEntries, [raffleId]: true }; setRaffleEntries(ne); setLS('sodaroja-raffle-entries', ne);
  };

  const claimSocialMission = (missionId: string) => {
    completeMission(missionId);
    addSoditas(5);
    setMissions(getMissions());
  };

  const markNotifRead = (id: string) => {
    const updated = notifications.map((n: any) => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated); setLS('sodaroja-user-notifications', updated);
  };

  // BANNER IMAGE SIZES (for Photoshop):
  // Encuesta banner: 800×200 px
  // Sorteo banner: 800×200 px


  const memberNumber = user?.memberNumber || '0042';

  return (
    <div className="relative" style={{ zIndex: 2 }}>

      {/* ===== HERO HEADER ===== */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-16 pb-16 border-b border-soda-mist/8"
      >
        {/* Decorative background number — only digits, no # */}
        <div className="absolute right-0 top-0 select-none pointer-events-none overflow-hidden" style={{ lineHeight: 1 }}>
          <span className="font-serif italic" style={{ fontSize: 'clamp(5rem, 20vw, 16rem)', color: 'rgba(139,58,58,0.028)' }}>
            {String(memberNumber).padStart(4,'0')}
          </span>
        </div>

        <div className="relative z-10">
          {/* Label */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-soda-red/50" />
            <span className="text-soda-red/55 text-[9px] tracking-[0.4em] uppercase font-light">Frecuencia Interna</span>
          </div>

          {/* Welcome */}
          <h2 className="font-serif text-4xl sm:text-5xl text-soda-glow/90 leading-[1.05] mb-3">
            Bienvenido/a,{' '}
            <em className="text-soda-red/75">{user?.name || 'suscriptor'}</em>
          </h2>
          <p className="text-soda-lamp/30 text-[11px] tracking-[0.12em] font-light mb-8">
            Socio Nº {String(memberNumber).padStart(4,'0')} · Plan {plans.find(p => p.id === userPlan)?.name || 'Soda'}
          </p>

          {/* Status chips */}
          <div className="flex items-center gap-3 flex-wrap">
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-flex items-center gap-2 border border-soda-red/18 rounded-sm px-3 py-1.5"
              style={{ background: 'rgba(196,85,85,0.05)' }}
            >
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-soda-red rounded-full"
                style={{ boxShadow: '0 0 5px rgba(196,85,85,0.5)' }}
              />
              <span className="text-soda-red/70 text-[9px] tracking-[0.25em] uppercase">Señal activa</span>
            </motion.div>

            <button
              onClick={() => setShowMissions(!showMissions)}
              className="inline-flex items-center gap-2 border border-soda-accent/15 rounded-sm px-3 py-1.5 transition-all duration-500 hover:border-soda-accent/30"
              style={{ background: 'rgba(138,155,196,0.05)' }}
            >
              <span className="text-sm leading-none">🥤</span>
              <div className="flex items-baseline gap-1">
                <span className="text-soda-lamp/85 text-sm font-serif">{soditas}</span>
                <span className="text-soda-lamp/28 text-[9px] tracking-[0.1em]">soditas</span>
              </div>
              <ChevronRight size={10} className={`text-soda-lamp/22 transition-transform duration-300 ${showMissions ? 'rotate-90' : ''}`} />
            </button>

            {unreadNotifs > 0 && (
              <div className="inline-flex items-center gap-1.5 border border-soda-lamp/10 rounded-sm px-3 py-1.5"
                style={{ background: 'rgba(212,197,176,0.04)' }}>
                <Bell size={10} className="text-soda-lamp/40" />
                <span className="text-soda-lamp/40 text-[9px]">{unreadNotifs}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ===== MISIONES (expandible) ===== */}
      <AnimatePresence>
        {showMissions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden mb-10"
          >
            <div className="border border-soda-accent/10 rounded-sm p-6" style={{ background: 'rgba(138,155,196,0.03)' }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-5 h-px bg-soda-accent/35" />
                <span className="text-soda-lamp/35 text-[9px] tracking-[0.3em] uppercase">Cómo ganar soditas</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {missions.map(m => {
                  const Icon = m.icon;
                  const isSocial = m.id.startsWith('follow-');
                  return (
                    <div key={m.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-sm border transition-all ${
                      m.completed ? 'border-emerald-500/12 bg-emerald-500/3' : 'border-soda-mist/8 hover:border-soda-accent/15'
                    }`}>
                      <Icon size={12} className={m.completed ? 'text-emerald-400/60' : 'text-soda-lamp/30'} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-[11px] ${m.completed ? 'text-emerald-400/60 line-through' : 'text-soda-lamp/60'}`}>{m.label}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-soda-accent/55 text-[9px]">+{m.soditas} 🥤</span>
                        {isSocial && !m.completed && (
                          <button onClick={() => claimSocialMission(m.id)}
                            className="text-[9px] text-soda-accent/60 border border-soda-accent/20 rounded-sm px-2 py-0.5 hover:bg-soda-accent/8 transition-all">
                            Hecho
                          </button>
                        )}
                        {m.completed && <span className="text-emerald-400/55 text-[9px]">✓</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== GRID PRINCIPAL ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">

        {/* ===== TRANSMISIONES — COL IZQUIERDA ===== */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-sm border border-soda-mist/10 overflow-hidden"
            style={{ background: 'linear-gradient(160deg, rgba(22,28,42,0.55) 0%, rgba(14,18,28,0.35) 100%)' }}>
            <div className="px-6 py-5 border-b border-soda-mist/8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-sm flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(196,85,85,0.1)', border: '1px solid rgba(196,85,85,0.18)' }}>
                  <Radio size={10} className="text-soda-red/65" />
                </div>
                <div>
                  <h3 className="text-soda-lamp/70 text-[10px] tracking-[0.15em] uppercase">Transmisiones</h3>
                  <p className="text-soda-lamp/22 text-[9px] mt-0.5">Mensajes exclusivos del equipo</p>
                </div>
              </div>
              {messages.length > 0 && <span className="text-soda-lamp/20 text-[9px] font-mono">{messages.length}</span>}
            </div>
            <div className="max-h-[380px] overflow-y-auto scrollbar-hide">
              {messages.length === 0 ? (
                <div className="px-6 py-14 text-center">
                  <motion.div animate={{ opacity: [0.08, 0.25, 0.08] }} transition={{ duration: 4, repeat: Infinity }}>
                    <Radio size={26} className="text-soda-red/30 mx-auto mb-4" />
                  </motion.div>
                  <p className="text-soda-lamp/35 font-serif text-sm italic mb-1">Silencio en la frecuencia...</p>
                  <p className="text-soda-lamp/18 text-[10px]">Los próximos mensajes aparecen acá primero</p>
                </div>
              ) : (
                <div className="divide-y divide-soda-mist/5">
                  {messages.slice().reverse().map((msg: any) => (
                    <div key={msg.id} className="px-6 py-4 hover:bg-soda-mist/3 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 text-xs"
                          style={{ background: 'rgba(196,85,85,0.08)', border: '1px solid rgba(196,85,85,0.12)' }}>
                          {msg.emoji || '📡'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-soda-lamp/65 text-[13px] leading-[1.65]">{msg.text}</p>
                          <p className="text-soda-lamp/18 text-[9px] mt-2 font-light">
                            {new Date(msg.date).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notificaciones */}
          <div className="rounded-sm border border-soda-mist/8 overflow-hidden"
            style={{ background: 'linear-gradient(160deg, rgba(16,20,32,0.45) 0%, rgba(10,14,22,0.28) 100%)' }}>
            <div className="px-6 py-4 border-b border-soda-mist/6 flex items-center gap-2">
              <Bell size={11} className="text-soda-lamp/35" />
              <h3 className="text-soda-lamp/50 text-[9px] tracking-[0.18em] uppercase flex-1">Notificaciones</h3>
              {unreadNotifs > 0 && (
                <span className="bg-soda-red/60 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center">{unreadNotifs}</span>
              )}
            </div>
            <div className="max-h-40 overflow-y-auto scrollbar-hide">
              {notifications.length === 0 ? (
                <div className="px-6 py-5 text-center">
                  <p className="text-soda-lamp/18 text-[10px]">Sin notificaciones</p>
                </div>
              ) : (
                <div className="divide-y divide-soda-mist/4">
                  {notifications.slice().reverse().map((n: any) => (
                    <div key={n.id} onClick={() => markNotifRead(n.id)}
                      className={`px-5 py-3 cursor-pointer transition-colors ${!n.read ? 'bg-soda-red/4' : ''} hover:bg-soda-mist/3`}>
                      <div className="flex items-start gap-2.5">
                        <span className="text-[12px] flex-shrink-0 mt-0.5">{n.type === 'winner' ? '🏆' : n.type === 'birthday' ? '🎂' : n.type === 'payment' ? '💳' : n.type === 'gift' ? '🎁' : '📬'}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[11px] leading-relaxed ${!n.read ? 'text-soda-lamp/65' : 'text-soda-lamp/32'}`}>{n.text}</p>
                          <p className="text-soda-lamp/18 text-[9px] mt-0.5">{new Date(n.date).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}</p>
                        </div>
                        {!n.read && <div className="w-1 h-1 bg-soda-red rounded-full flex-shrink-0 mt-2" />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== CENTRO — Encuesta + Sorteo + Stats ===== */}
        <div className="lg:col-span-4 space-y-5">

          {/* ENCUESTA */}
          <div className="rounded-sm border overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, rgba(18,24,40,0.55) 0%, rgba(12,16,26,0.35) 100%)',
              borderColor: currentPoll ? 'rgba(138,155,196,0.16)' : 'rgba(42,49,66,0.35)'
            }}>
            {currentPoll ? (
              <>
                {currentPoll.bannerUrl ? (
                  <img src={currentPoll.bannerUrl} alt={currentPoll.question} className="w-full h-auto cursor-pointer" onClick={() => setActivePollPage(currentPoll.id)} />
                ) : (
                  <div className="px-6 py-5 border-b border-soda-mist/6"
                    style={{ background: 'linear-gradient(90deg, rgba(138,155,196,0.07) 0%, transparent 100%)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-soda-accent/55" style={{ boxShadow: '0 0 4px rgba(138,155,196,0.45)' }} />
                      <span className="text-soda-accent/55 text-[9px] tracking-[0.3em] uppercase">Encuesta activa</span>
                    </div>
                    <h4 className="text-soda-lamp/75 font-serif text-[15px] leading-snug">{currentPoll.question}</h4>
                  </div>
                )}
                {userVotes[currentPoll.id] !== undefined ? (
                  <div className="px-6 py-4">
                    <p className="text-emerald-400/55 text-[10px] flex items-center gap-2">
                      <span>✓</span> Ya votaste · +3 🥤 sumadas
                    </p>
                  </div>
                ) : (
                  <div className="px-6 py-4">
                    <button onClick={() => setActivePollPage(currentPoll.id)}
                      className="w-full py-3 rounded-sm text-soda-lamp/60 text-[10px] tracking-[0.15em] uppercase flex items-center justify-center gap-2 transition-all duration-500 hover:text-soda-lamp/80 border border-soda-accent/15 hover:border-soda-accent/30"
                      style={{ background: 'rgba(138,155,196,0.06)' }}>
                      <BarChart3 size={12} /> Votar · +3 🥤
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="px-6 py-10 text-center">
                <BarChart3 size={22} className="text-soda-accent/15 mx-auto mb-3" />
                <p className="text-soda-lamp/32 font-serif text-sm italic">Sin encuestas activas</p>
                <p className="text-soda-lamp/16 text-[9px] mt-1">Cuando haya una, sumás soditas votando</p>
              </div>
            )}
          </div>

          {/* SORTEO */}
          <div className="rounded-sm border overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, rgba(20,16,26,0.55) 0%, rgba(12,10,18,0.35) 100%)',
              borderColor: currentRaffle ? 'rgba(196,85,85,0.18)' : 'rgba(42,49,66,0.35)'
            }}>
            {currentRaffle ? (
              <>
                {currentRaffle.bannerUrl ? (
                  <img src={currentRaffle.bannerUrl} alt={currentRaffle.title} className="w-full h-auto" />
                ) : (
                  <div className="px-6 py-5 border-b border-soda-mist/6"
                    style={{ background: 'linear-gradient(90deg, rgba(196,85,85,0.07) 0%, transparent 100%)' }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-soda-red/55" style={{ boxShadow: '0 0 4px rgba(196,85,85,0.45)' }} />
                          <span className="text-soda-red/55 text-[9px] tracking-[0.3em] uppercase">Sorteo</span>
                        </div>
                        <h4 className="text-soda-lamp/75 font-serif text-[15px]">{currentRaffle.title}</h4>
                        {currentRaffle.description && <p className="text-soda-lamp/32 text-[10px] mt-1">{currentRaffle.description}</p>}
                      </div>
                      <span className="text-xl flex-shrink-0">🎰</span>
                    </div>
                  </div>
                )}
                <div className="px-6 py-4">
                  {raffleEntries[currentRaffle.id] ? (
                    <div className="text-center py-1">
                      <p className="text-emerald-400/60 text-[10px]">¡Ya estás participando! 🎉</p>
                      <p className="text-soda-lamp/22 text-[9px] mt-0.5">Te avisamos si ganaste</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-soda-lamp/30 text-[10px]">Costo: <span className="text-soda-lamp/55">{currentRaffle.soditasCost || 5} 🥤</span></span>
                      <button onClick={() => enterRaffle(currentRaffle.id)} disabled={soditas < (currentRaffle.soditasCost || 5)}
                        className={`px-4 py-2 rounded-sm text-[10px] tracking-[0.12em] uppercase transition-all duration-500 ${
                          soditas >= (currentRaffle.soditasCost || 5)
                            ? 'border border-soda-red/25 text-soda-lamp/60 hover:bg-soda-red/10 hover:border-soda-red/45 hover:text-soda-lamp/80'
                            : 'border border-soda-mist/8 text-soda-lamp/18 cursor-not-allowed'
                        }`}>
                        Participar
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="px-6 py-10 text-center">
                <Trophy size={22} className="text-soda-red/12 mx-auto mb-3" />
                <p className="text-soda-lamp/32 font-serif text-sm italic">Sin sorteos activos</p>
                <p className="text-soda-lamp/16 text-[9px] mt-1">Guardá soditas para cuando haya uno</p>
              </div>
            )}
          </div>

          {/* Tus números — más elegante */}
          <div className="rounded-sm border border-soda-mist/8 p-5 overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg, rgba(14,18,28,0.6) 0%, rgba(10,13,22,0.4) 100%)' }}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-4 h-px bg-soda-red/35" />
              <span className="text-soda-lamp/28 text-[9px] tracking-[0.25em] uppercase">Tus números</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { n: listenedCount, l: 'Eps', e: '🎧' },
                { n: soditas, l: 'Soditas', e: '🥤' },
                { n: Object.keys(userVotes).length, l: 'Votos', e: '📊' },
                { n: Object.keys(raffleEntries).filter(k => raffleEntries[k]).length, l: 'Sorteos', e: '🎰' },
              ].map((s, i) => (
                <div key={i} className="text-center py-3 rounded-sm border border-soda-mist/8"
                  style={{ background: 'rgba(10,14,26,0.5)' }}>
                  <div className="text-[9px] mb-1.5 opacity-60">{s.e}</div>
                  <div className="text-soda-glow/80 text-xl font-serif leading-none mb-1">{s.n}</div>
                  <div className="text-soda-lamp/22 text-[8px] tracking-wide">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== DERECHA — Plan + Config ===== */}
        <div className="lg:col-span-3">
          <div className="rounded-sm border border-soda-mist/8 overflow-hidden h-full"
            style={{ background: 'linear-gradient(160deg, rgba(16,20,32,0.5) 0%, rgba(10,14,22,0.3) 100%)' }}>

            {/* Plan header */}
            <div className="px-5 py-6 border-b border-soda-mist/6 relative overflow-hidden">
              {/* Subtle red glow behind plan name */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(196,85,85,0.05) 0%, transparent 70%)' }} />
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="text-soda-lamp/35 text-[9px] tracking-[0.2em] uppercase">Plan activo</span>
                <span className="text-emerald-400/55 text-[8px] border border-emerald-500/15 rounded-sm px-2 py-0.5">Activo</span>
              </div>
              <h4 className="text-soda-glow/80 font-serif text-2xl mb-1 relative z-10">
                {plans.find(p => p.id === userPlan)?.name || 'Soda'}
              </h4>
              <div className="flex items-baseline gap-1 relative z-10">
                <span className="text-soda-lamp/55 text-lg font-light">
                  ${(plans.find(p => p.id === userPlan)?.priceARS || 5000).toLocaleString('es-AR')}
                </span>
                <span className="text-soda-lamp/22 text-[9px]">ARS/mes</span>
              </div>
            </div>

            <div className="divide-y divide-soda-mist/5">
              {[
                { key: 'plan', label: 'Cambiar plan', icon: null },
                { key: 'payment', label: 'Pago', icon: CreditCard },
                { key: 'history', label: 'Historial', icon: BarChart3 },
              ].map(({ key, label, icon: Icon }) => (
                <div key={key}>
                  <button onClick={() => setOpenPanel(openPanel === key ? null : key)}
                    className="w-full flex items-center justify-between px-5 py-3.5 text-soda-lamp/35 hover:text-soda-lamp/58 hover:bg-soda-mist/3 transition-all">
                    <div className="flex items-center gap-2">
                      {Icon && <Icon size={10} className="text-soda-lamp/20" />}
                      <span className="text-[10px] tracking-[0.1em]">{label}</span>
                    </div>
                    <ChevronRight size={10} className={`transition-transform duration-300 ${openPanel === key ? 'rotate-90' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openPanel === key && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="px-5 pb-3 space-y-1.5">
                          {key === 'plan' && plans.map(p => (
                            <button key={p.id} onClick={() => { setUserPlan(p.id); localStorage.setItem('sodaroja-user-plan', p.id); setOpenPanel(null); }}
                              className={`w-full text-left px-3 py-2.5 rounded-sm border text-[10px] transition-all ${
                                userPlan === p.id ? 'border-soda-red/25 text-soda-lamp/65' : 'border-soda-mist/8 text-soda-lamp/32 hover:border-soda-mist/15 hover:text-soda-lamp/50'
                              }`} style={userPlan === p.id ? { background: 'rgba(196,85,85,0.06)' } : {}}>
                              <div className="flex justify-between">
                                <span>{p.name}</span>
                                <span className="text-soda-lamp/25">${p.priceARS.toLocaleString('es-AR')}</span>
                              </div>
                            </button>
                          ))}
                          {key === 'payment' && ['Visa ****6411', 'Mastercard ****2190', 'Mercado Pago'].map((m, i) => (
                            <button key={i} onClick={() => { setPayMethod(m); localStorage.setItem('sodaroja-pay-method', m); setOpenPanel(null); }}
                              className={`w-full text-left px-3 py-2 rounded-sm border text-[10px] transition-all ${
                                payMethod === m ? 'border-soda-accent/22 text-soda-lamp/62' : 'border-soda-mist/8 text-soda-lamp/30 hover:border-soda-mist/15'
                              }`} style={payMethod === m ? { background: 'rgba(138,155,196,0.06)' } : {}}>
                              {i === 2 ? '📱' : '💳'} {m}
                            </button>
                          ))}
                          {key === 'history' && [
                            { date: '01/02/2026', amount: 5000 },
                            { date: '01/01/2026', amount: 5000 },
                            { date: '01/12/2025', amount: 5000 },
                          ].map((h, i) => (
                            <div key={i} className="flex justify-between items-center px-3 py-2 border border-soda-mist/5 rounded-sm">
                              <div>
                                <p className="text-soda-lamp/45 text-[10px]">{h.date}</p>
                                <p className="text-soda-lamp/22 text-[9px]">${h.amount.toLocaleString('es-AR')} ARS</p>
                              </div>
                              <span className="text-emerald-400/45 text-[9px]">Pagado</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              <button className="w-full flex items-center gap-2 px-5 py-3.5 text-soda-lamp/18 hover:text-red-400/45 transition-all text-[10px] tracking-[0.1em]">
                <LogOut size={10} /> Dar de baja
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== POLL PAGE (overlay) ===== */}
      <AnimatePresence>
        {activePollPage && currentPoll && !pollCompleted && (
          <PollPage poll={currentPoll} onClose={() => setActivePollPage(null)} onComplete={(answers) => {
            const questions = currentPoll.questions || [{ question: currentPoll.question, options: currentPoll.options }];
            const nv = { ...pollVotes };
            questions.forEach((_: any, qi: number) => {
              const key = `${currentPoll.id}-q${qi}`;
              if (!nv[key]) nv[key] = {};
              const ans = answers[qi];
              if (ans !== undefined) nv[key][String(ans)] = (nv[key][String(ans)] || 0) + 1;
            });
            setPollVotes(nv); setLS('sodaroja-poll-votes', nv);
            const nuv = { ...userVotes, [currentPoll.id]: 1 }; setUserVotes(nuv); setLS('sodaroja-user-poll-votes', nuv);
            addSoditas(3);
            setActivePollPage(null);
          }} />
        )}
      </AnimatePresence>
    </div>
  );
};


// Multi-question poll page component
const PollPage: React.FC<{ poll: any; onClose: () => void; onComplete: (answers: Record<number, number>) => void }> = ({ poll, onClose, onComplete }) => {
  const questions = poll.questions || [{ question: poll.question, options: poll.options }];
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const total = questions.length;

  const selectOption = (optIdx: number) => {
    const newAnswers = { ...answers, [current]: optIdx };
    setAnswers(newAnswers);
    if (current < total - 1) {
      setTimeout(() => setCurrent(current + 1), 300);
    } else {
      setTimeout(() => onComplete(newAnswers), 400);
    }
  };

  const q = questions[current];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-soda-night/95" />
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-soda-deep border border-soda-accent/20 rounded-sm" style={{ WebkitOverflowScrolling: 'touch' }} onClick={e => e.stopPropagation()}>
        {current === 0 && poll.bannerUrl && <img src={poll.bannerUrl} alt="" className="w-full h-auto" />}
        <div className="p-6">
          {/* Progress */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-soda-fog text-[11px]">{current + 1} de {total}</span>
            <div className="flex-1 mx-3 h-1 bg-soda-mist/10 rounded-full overflow-hidden">
              <motion.div className="h-full bg-soda-red/60 rounded-full" animate={{ width: `${((current + 1) / total) * 100}%` }} />
            </div>
            <span className="text-soda-accent text-[11px]">+3 🥤</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              <h3 className="text-soda-glow font-serif text-lg mb-4">{q.question}</h3>
              <div className="space-y-2">
                {q.options.map((opt: string, idx: number) => {
                  const selected = answers[current] === idx;
                  return (
                    <button key={idx} onClick={() => selectOption(idx)}
                      className={`w-full text-left px-4 py-3 rounded-sm text-sm transition-all ${
                        selected ? 'border border-soda-red/50 bg-soda-red/10 text-soda-lamp' : 'border border-soda-mist/15 text-soda-fog hover:border-soda-red/30 hover:bg-soda-red/5 hover:text-soda-lamp'
                      }`}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 bg-soda-night/80 rounded-full flex items-center justify-center text-soda-fog hover:text-soda-lamp">✕</button>
      </motion.div>
    </motion.div>
  );
};

// Partículas con posiciones fijas — evita recalcular en cada render
const PARTICLES_MOBILE = [
  { x: 12, y: 18, dur: 6.2, delay: 0.3 }, { x: 45, y: 72, dur: 8.1, delay: 2.1 },
  { x: 78, y: 35, dur: 5.7, delay: 1.4 }, { x: 33, y: 55, dur: 7.3, delay: 3.8 },
];
const PARTICLES_DESKTOP = [
  { x: 8, y: 12, dur: 6.2, delay: 0.3 }, { x: 23, y: 68, dur: 8.1, delay: 2.1 },
  { x: 45, y: 33, dur: 5.7, delay: 1.4 }, { x: 67, y: 78, dur: 9.4, delay: 0.8 },
  { x: 82, y: 22, dur: 7.3, delay: 3.8 }, { x: 15, y: 45, dur: 6.8, delay: 1.9 },
  { x: 55, y: 15, dur: 5.3, delay: 4.2 }, { x: 91, y: 55, dur: 8.6, delay: 2.7 },
  { x: 38, y: 88, dur: 7.1, delay: 0.6 }, { x: 72, y: 42, dur: 6.4, delay: 3.3 },
  { x: 5, y: 75, dur: 9.2, delay: 1.1 }, { x: 48, y: 58, dur: 5.9, delay: 4.7 },
  { x: 85, y: 85, dur: 7.8, delay: 2.4 }, { x: 28, y: 25, dur: 6.1, delay: 0.9 },
  { x: 62, y: 62, dur: 8.9, delay: 3.6 }, { x: 18, y: 92, dur: 5.4, delay: 1.7 },
  { x: 93, y: 30, dur: 7.6, delay: 4.1 }, { x: 42, y: 48, dur: 9.8, delay: 0.4 },
  { x: 75, y: 18, dur: 6.7, delay: 2.9 }, { x: 35, y: 72, dur: 8.3, delay: 3.1 },
];

// ============================================================
// PUBLIC VIEW (unchanged)
// ============================================================
const PublicView: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('plan-b');
  const currentPlan = plans.find(p => p.id === selectedPlan) || plans[1];
  const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768);

  return (
    <>
      {[...Array(isMobile ? 3 : 6)].map((_, i) => (
        <motion.div key={`w-${i}`} className="absolute left-1/2 top-1/2 border-2 border-soda-red rounded-full pointer-events-none"
          style={{ width: `${300 + i * 150}px`, height: `${300 + i * 150}px`, marginLeft: `-${150 + i * 75}px`, marginTop: `-${150 + i * 75}px` }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}
      {/* Partículas con posiciones fijas — Math.random() en render directo causa posiciones distintas en cada re-render */}
      {(isMobile ? PARTICLES_MOBILE : PARTICLES_DESKTOP).map((p, i) => (
        <motion.div key={`p-${i}`} className="absolute w-1 h-1 bg-soda-red rounded-full opacity-40"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ y: [0, -50, 0], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay }}
        />
      ))}
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <motion.div animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }} transition={{ duration: 3, repeat: Infinity }} className="inline-block mb-8">
            <div className="text-8xl text-soda-red">◉</div>
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-serif text-soda-glow mb-6">Frecuencia <em className="text-soda-red/85">Interna</em></h2>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-soda-red to-transparent mx-auto mb-8" />
          <p className="text-soda-lamp text-xl font-light max-w-2xl mx-auto mb-8">Las historias que se cuentan cuando la noche ya está avanzada</p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-3xl mx-auto mb-20">
          <p className="text-soda-fog text-base font-light leading-relaxed text-center">Sodaroja es un proyecto independiente que hacemos con amor, pero también con tiempo, energía y recursos. Cada episodio lleva horas de investigación, edición y producción. Tu aporte nos permite seguir haciéndolo.</p>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h3 className="text-2xl font-serif text-soda-glow mb-8 text-center lg:text-left">Elegí cómo querés sumarte</h3>
            <div className="space-y-6">
              {plans.map((plan, idx) => (
                <motion.div key={plan.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative bg-soda-night/50 rounded-sm p-8 transition-all duration-500 cursor-pointer ${
                    selectedPlan === plan.id ? 'border border-soda-red/60 scale-[1.01]' : plan.featured ? 'border border-soda-accent/40' : 'border border-soda-mist/15 hover:border-soda-mist/30'
                  }`}>
                  <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === plan.id ? 'border-soda-red bg-soda-red' : 'border-soda-mist/40'}`}>{selectedPlan === plan.id && <div className="w-2 h-2 bg-white rounded-full" />}</div>
                  {plan.featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-soda-red px-4 py-1 rounded-sm text-xs tracking-wider text-soda-glow">MÁS ELEGIDO</div>}
                  <div className="flex items-end justify-between pr-8">
                    <div><h4 className="text-2xl font-serif text-soda-glow mb-2">{plan.name}</h4><p className="text-soda-fog text-sm">{plan.description}</p></div>
                    <div className="text-right"><div className="text-3xl font-light text-soda-lamp">${plan.priceARS.toLocaleString('es-AR')}</div><div className="text-sm text-soda-fog">USD ${plan.priceUSD}/mes</div></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h3 className="text-2xl font-serif text-soda-glow mb-8 text-center lg:text-left">Qué te llevas al sumarte</h3>
            <div className="space-y-4">
              {benefits.map((b, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-sm border border-soda-accent/40 flex items-center justify-center group-hover:border-soda-red group-hover:bg-soda-red/10 transition-all"><Check size={14} className="text-soda-accent group-hover:text-soda-red" /></div>
                  <span className="text-soda-lamp font-light group-hover:text-soda-glow transition-colors">{b}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16">
          <div className="mb-6 text-center"><div className="text-soda-lamp text-sm mb-1">Plan seleccionado: <span className="text-soda-red font-medium">{currentPlan.name}</span></div><div className="text-soda-fog text-xs">${currentPlan.priceARS.toLocaleString('es-AR')} ARS / USD ${currentPlan.priceUSD} por mes</div></div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <button className="w-full sm:w-auto px-10 py-5 bg-soda-red/10 border border-soda-red/50 text-soda-glow rounded-sm hover:bg-soda-red/20 hover:border-soda-red/70 transition-all duration-500 tracking-wider">
              <span className="flex items-center justify-center gap-2"><Heart size={18} />SUSCRIBIRME (ARGENTINA)</span>
              <span className="block text-xs text-soda-lamp mt-1 opacity-70">Mercado Pago · ${currentPlan.priceARS.toLocaleString('es-AR')} ARS/mes</span>
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-soda-accent/8 border border-soda-accent/40 text-soda-glow rounded-sm hover:bg-soda-accent/15 hover:border-soda-accent/60 transition-all duration-500 tracking-wider">
              <span className="flex items-center justify-center gap-2"><Heart size={18} />SUSCRIBIRME (INTERNACIONAL)</span>
              <span className="block text-xs text-soda-lamp mt-1 opacity-70">USD ${currentPlan.priceUSD}/mes</span>
            </button>
          </div>
          <p className="text-soda-fog text-xs mt-8 font-light text-center">Cancelá cuando quieras, sin compromiso ni letra chica</p>
        </motion.div>
      </div>
    </>
  );
};

// ============================================================
// MAIN
// ============================================================
export const FrecuenciaInterna: React.FC = () => {
  const user = getCurrentUser();
  const isPremium = user?.isPremium === true;
  return (
    <section id="frecuencia-interna" className="relative py-24 sm:py-32 px-6 bg-gradient-to-b from-soda-night via-soda-deep to-soda-night overflow-hidden">
      {isPremium && <AuroraEffect />}
      {isPremium ? <div className="max-w-7xl mx-auto relative z-10"><SubscriberDashboard /></div> : <PublicView />}
    </section>
  );
};
