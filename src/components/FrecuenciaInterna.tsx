import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Heart, Radio, MessageCircle, BarChart3, Trophy, Settings, CreditCard, LogOut, ArrowRight, Bell, Gift, Instagram, Youtube, Twitter, Headphones, Calendar, Zap, Star, ExternalLink, ChevronRight } from 'lucide-react';
import { getCurrentUser } from '../data/auth';
import { SocialLoginPanel } from './SocialLoginPanel';

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
  const [activeSection, setActiveSection] = useState<'mensajes' | 'notif'>('mensajes');

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
  const memberNumber = user?.memberNumber || '0042';
  const planData = plans.find(p => p.id === userPlan) || plans[1];

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
    completeMission(missionId); addSoditas(5); setMissions(getMissions());
  };
  const markNotifRead = (id: string) => {
    const updated = notifications.map((n: any) => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated); setLS('sodaroja-user-notifications', updated);
  };

  const navItems = [
    { id: 'mensajes' as const, label: 'Transmisiones', icon: Radio, count: messages.length },
    { id: 'notif' as const, label: 'Alertas', icon: Bell, count: unreadNotifs },
  ];

  return (
    <div className="min-h-screen" style={{ zIndex: 2, position: 'relative' }}>

      {/* ── TOP BAR ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mb-14 pb-10"
        style={{ borderBottom: '1px solid rgba(212,197,176,0.06)' }}
      >
        {/* Label */}
        <div className="flex items-center gap-3 mb-8">
          <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(196,85,85,0.9)', boxShadow: '0 0 8px rgba(196,85,85,0.6)' }} />
          <span className="text-[9px] tracking-[0.45em] uppercase" style={{ color: 'rgba(196,85,85,0.5)' }}>Frecuencia Interna</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
          {/* Identity */}
          <div className="flex items-center gap-6">
            {/* Avatar — larger, more dramatic */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                style={{
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  color: 'rgba(254,248,237,0.85)',
                  background: 'radial-gradient(circle at 35% 30%, rgba(196,85,85,0.3) 0%, rgba(10,14,26,0.95) 65%)',
                  border: '1px solid rgba(196,85,85,0.3)',
                  boxShadow: '0 0 30px rgba(196,85,85,0.12), inset 0 0 30px rgba(196,85,85,0.06)',
                }}>
                {(user?.name || 'S').charAt(0).toUpperCase()}
              </div>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-soda-deep"
                style={{ background: 'rgba(80,200,120,0.9)', boxShadow: '0 0 8px rgba(80,200,120,0.5)' }}
              />
            </div>
            <div>
              <h2 className="font-display leading-none mb-2" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 300, color: 'rgba(254,248,237,0.92)' }}>
                {user?.name || 'Suscriptor'}
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-[9px] tracking-[0.2em] font-mono" style={{ color: 'rgba(212,197,176,0.35)' }}>#{String(memberNumber).padStart(4, '0')}</span>
                <div className="w-px h-3" style={{ background: 'rgba(212,197,176,0.15)' }} />
                <span className="text-[10px] tracking-[0.08em]" style={{ color: 'rgba(196,85,85,0.55)' }}>{planData.name}</span>
              </div>
            </div>
          </div>

          {/* Stats + missions */}
          <div className="flex items-stretch gap-2">
            {[
              { n: listenedCount, l: 'escuchados', accent: 'rgba(138,155,196,0.6)' },
              { n: soditas, l: 'soditas', accent: 'rgba(196,85,85,0.6)' },
              { n: Object.keys(userVotes).length, l: 'votos', accent: 'rgba(212,197,176,0.4)' },
            ].map((s, i) => (
              <div key={i}
                className="flex flex-col items-center justify-center px-4 py-3 rounded-sm"
                style={{ background: 'rgba(212,197,176,0.02)', border: '1px solid rgba(212,197,176,0.06)', minWidth: '70px' }}>
                <span className="leading-none mb-1 font-mono" style={{ fontSize: '1.3rem', color: s.accent }}>{s.n}</span>
                <span className="text-[8px] tracking-[0.18em] uppercase" style={{ color: 'rgba(212,197,176,0.25)' }}>{s.l}</span>
              </div>
            ))}
            <button
              onClick={() => setShowMissions(!showMissions)}
              className="flex flex-col items-center justify-center gap-1.5 px-4 py-3 rounded-sm ml-1 transition-all duration-500"
              style={{
                background: showMissions ? 'rgba(138,155,196,0.07)' : 'rgba(138,155,196,0.02)',
                border: `1px solid rgba(138,155,196,${showMissions ? '0.22' : '0.07'})`,
              }}>
              <Star size={11} style={{ color: `rgba(138,155,196,${showMissions ? '0.7' : '0.4'})` }} />
              <span className="text-[8px] tracking-[0.15em] uppercase hidden sm:block" style={{ color: 'rgba(212,197,176,0.35)' }}>Misiones</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── MISIONES (expandible) ──────────────────────────── */}
      <AnimatePresence>
        {showMissions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden mb-10"
          >
            <div className="rounded-sm p-5 mb-2"
              style={{ background: 'rgba(138,155,196,0.03)', border: '1px solid rgba(138,155,196,0.08)' }}>
              <p className="text-[9px] tracking-[0.35em] uppercase text-soda-accent/40 mb-4">Cómo ganar soditas</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
                {missions.map(m => {
                  const Icon = m.icon;
                  const isSocial = m.id.startsWith('follow-');
                  return (
                    <div key={m.id}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all ${
                        m.completed
                          ? 'opacity-40'
                          : 'hover:bg-soda-accent/4'
                      }`}
                      style={{ border: `1px solid rgba(${m.completed ? '80,180,120' : '138,155,196'},${m.completed ? '0.12' : '0.07'})` }}>
                      <Icon size={11} className={m.completed ? 'text-emerald-400/60' : 'text-soda-accent/40'} />
                      <p className={`flex-1 text-[11px] ${m.completed ? 'text-emerald-400/50 line-through' : 'text-soda-lamp/50'}`}>{m.label}</p>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-soda-accent/40 text-[9px]">+{m.soditas}</span>
                        {isSocial && !m.completed && (
                          <button onClick={() => claimSocialMission(m.id)}
                            className="text-[8px] text-soda-accent/50 px-1.5 py-0.5 rounded-sm transition-colors hover:text-soda-accent/80"
                            style={{ border: '1px solid rgba(138,155,196,0.2)' }}>
                            ✓
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN LAYOUT ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 xl:gap-8">

        {/* LEFT — Content area */}
        <div className="space-y-5">

          {/* ── ENCUESTA + SORTEO — always visible at top ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* ENCUESTA */}
              {currentPoll ? (
                <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
                  className="rounded-sm overflow-hidden cursor-pointer group"
                  style={{ background:'linear-gradient(135deg, rgba(18,24,40,0.7) 0%, rgba(12,16,26,0.5) 100%)', border:'1px solid rgba(138,155,196,0.2)' }}
                  onClick={() => !pollCompleted && setActivePollPage(currentPoll.id)}>
                  {currentPoll.bannerUrl
                    ? <img src={currentPoll.bannerUrl} alt={currentPoll.question} className="w-full h-32 object-cover" />
                    : (
                      <div className="px-5 pt-5 pb-2"
                        style={{ background:'linear-gradient(135deg, rgba(138,155,196,0.08) 0%, transparent 70%)' }}>
                        <div className="flex items-center gap-2 mb-3">
                          <motion.div animate={{ scale:[1,1.4,1], opacity:[0.6,1,0.6] }} transition={{ duration:2, repeat:Infinity }}
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ background:'rgba(138,155,196,0.8)', boxShadow:'0 0 6px rgba(138,155,196,0.5)' }} />
                          <span className="text-soda-accent/60 text-[9px] tracking-[0.35em] uppercase">Encuesta activa</span>
                        </div>
                        <h4 className="font-serif text-lg text-soda-lamp/85 leading-snug mb-1">{currentPoll.question}</h4>
                      </div>
                    )
                  }
                  <div className="px-5 py-4">
                    {pollCompleted ? (
                      <p className="text-emerald-400/60 text-[11px] flex items-center gap-2">
                        <span>✓</span> Ya votaste · +3 soditas sumadas
                      </p>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-soda-accent/45 text-[10px]">Tu voto vale +3 soditas</span>
                        <span className="text-soda-lamp/60 text-[10px] tracking-[0.15em] uppercase flex items-center gap-1.5 group-hover:text-soda-lamp/90 transition-colors">
                          Votar <BarChart3 size={10} />
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="rounded-sm flex flex-col items-center justify-center py-10 px-5 text-center"
                  style={{ background:'rgba(14,18,30,0.4)', border:'1px solid rgba(138,155,196,0.08)' }}>
                  <BarChart3 size={20} className="mb-3" style={{ color:'rgba(138,155,196,0.2)' }} />
                  <p className="font-sans text-soda-lamp/20 text-sm mb-1">Sin encuesta activa</p>
                  <p className="text-soda-lamp/13 text-[10px]">Cuando haya una, aparece acá</p>
                </div>
              )}

              {/* SORTEO */}
              {currentRaffle ? (
                <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.08 }}
                  className="rounded-sm overflow-hidden"
                  style={{ background:'linear-gradient(135deg, rgba(22,16,28,0.7) 0%, rgba(14,10,20,0.5) 100%)', border:'1px solid rgba(196,85,85,0.2)' }}>
                  {currentRaffle.bannerUrl
                    ? <img src={currentRaffle.bannerUrl} alt={currentRaffle.title} className="w-full h-32 object-cover" />
                    : (
                      <div className="px-5 pt-5 pb-2"
                        style={{ background:'linear-gradient(135deg, rgba(196,85,85,0.08) 0%, transparent 70%)' }}>
                        <div className="flex items-center gap-2 mb-3">
                          <motion.div animate={{ scale:[1,1.4,1], opacity:[0.6,1,0.6] }} transition={{ duration:1.8, repeat:Infinity }}
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ background:'rgba(196,85,85,0.8)', boxShadow:'0 0 6px rgba(196,85,85,0.5)' }} />
                          <span className="text-soda-red/60 text-[9px] tracking-[0.35em] uppercase">Sorteo activo</span>
                        </div>
                        <h4 className="font-serif text-lg text-soda-lamp/85 leading-snug mb-1">{currentRaffle.title}</h4>
                        {currentRaffle.description && <p className="text-soda-lamp/35 text-[12px]">{currentRaffle.description}</p>}
                      </div>
                    )
                  }
                  <div className="px-5 py-4">
                    {raffleEntries[currentRaffle.id] ? (
                      <p className="text-emerald-400/60 text-[11px] flex items-center gap-2">
                        <span>✓</span> ¡Ya participás! Te avisamos si ganaste.
                      </p>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-soda-lamp/35 text-[10px]">Costo: </span>
                          <span className="text-soda-lamp/65 text-[10px] font-serif">{currentRaffle.soditasCost || 5} soditas</span>
                          {soditas < (currentRaffle.soditasCost || 5) && (
                            <span className="text-soda-red/45 text-[9px] ml-2 block mt-0.5">No tenés suficientes</span>
                          )}
                        </div>
                        <button onClick={() => enterRaffle(currentRaffle.id)}
                          disabled={soditas < (currentRaffle.soditasCost || 5)}
                          className={`px-4 py-2 rounded-sm text-[10px] tracking-[0.15em] uppercase transition-all duration-500 ${
                            soditas >= (currentRaffle.soditasCost || 5)
                              ? 'text-soda-lamp/70 hover:text-soda-glow hover:bg-soda-red/10'
                              : 'text-soda-lamp/18 cursor-not-allowed'
                          }`}
                          style={{ border:`1px solid rgba(196,85,85,${soditas >= (currentRaffle.soditasCost || 5) ? '0.3' : '0.1'})` }}>
                          Participar
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="rounded-sm flex flex-col items-center justify-center py-10 px-5 text-center"
                  style={{ background:'rgba(14,18,30,0.4)', border:'1px solid rgba(196,85,85,0.08)' }}>
                  <Trophy size={20} className="mb-3" style={{ color:'rgba(196,85,85,0.2)' }} />
                  <p className="font-sans text-soda-lamp/20 text-sm mb-1">Sin sorteo activo</p>
                  <p className="text-soda-lamp/13 text-[10px]">Guardá soditas para cuando aparezca uno</p>
                </div>
              )}
            </div>

          {/* Section nav tabs — mensajes + alertas */}
          <div className="flex items-center gap-1">
            {([
              { id: 'mensajes' as const, label: 'Transmisiones', icon: Radio, count: messages.length },
              { id: 'notif' as const, label: 'Alertas', icon: Bell, count: unreadNotifs },
            ] as const).map(({ id, label, icon: Icon, count }) => (
              <button key={id}
                onClick={() => setActiveSection(id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-[10px] tracking-[0.15em] uppercase transition-all duration-400 ${
                  activeSection === id ? 'text-soda-glow/80' : 'text-soda-lamp/30 hover:text-soda-lamp/55'
                }`}
                style={{
                  background: activeSection === id ? 'rgba(196,85,85,0.08)' : 'transparent',
                  border: `1px solid ${activeSection === id ? 'rgba(196,85,85,0.2)' : 'rgba(212,197,176,0.06)'}`,
                }}>
                <Icon size={10} className={activeSection === id ? 'text-soda-red/60' : 'text-soda-lamp/25'} />
                {label}
                {count > 0 && (
                  <span className="w-4 h-4 rounded-full text-[8px] flex items-center justify-center"
                    style={{ background:'rgba(196,85,85,0.7)', color:'white' }}>{count}</span>
                )}
              </button>
            ))}
          </div>

          {/* Section content */}
          <AnimatePresence mode="wait">
            <motion.div key={activeSection}
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}
              transition={{ duration:0.28 }}
              className="rounded-sm overflow-hidden"
              style={{ background:'rgba(20,24,36,0.5)', border:'1px solid rgba(212,197,176,0.07)', minHeight:'280px' }}
            >
              {/* TRANSMISIONES */}
              {activeSection === 'mensajes' && (
                <div>
                  <div className="px-6 py-5 flex items-center justify-between"
                    style={{ borderBottom:'1px solid rgba(212,197,176,0.06)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-sm flex items-center justify-center"
                        style={{ background:'rgba(196,85,85,0.1)', border:'1px solid rgba(196,85,85,0.18)' }}>
                        <Radio size={11} className="text-soda-red/65" />
                      </div>
                      <div>
                        <p className="text-soda-lamp/60 text-[10px] tracking-[0.2em] uppercase">Transmisiones</p>
                        <p className="text-soda-lamp/20 text-[9px] mt-0.5">Mensajes exclusivos del equipo</p>
                      </div>
                    </div>
                    {messages.length > 0 && <span className="text-soda-lamp/15 text-[9px] font-mono">{String(messages.length).padStart(2,'0')}</span>}
                  </div>
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                      <motion.div animate={{ opacity:[0.1,0.3,0.1] }} transition={{ duration:3.5, repeat:Infinity }}>
                        <Radio size={28} className="text-soda-red/25 mb-4" />
                      </motion.div>
                      <p className="font-sans text-soda-lamp/25 text-base mb-1">Silencio en la frecuencia...</p>
                      <p className="text-soda-lamp/18 text-[10px] max-w-xs">Los próximos mensajes del equipo aparecen aquí primero</p>
                    </div>
                  ) : (
                    <div className="divide-y" style={{ borderColor:'rgba(212,197,176,0.05)' }}>
                      {messages.slice().reverse().map((msg: any) => (
                        <div key={msg.id} className="px-6 py-5 hover:bg-white/[0.01] transition-colors">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm mt-0.5"
                              style={{ background:'rgba(196,85,85,0.07)', border:'1px solid rgba(196,85,85,0.1)' }}>
                              {msg.emoji || '📡'}
                            </div>
                            <div className="flex-1">
                              <p className="text-soda-lamp/65 text-sm leading-[1.7] mb-2">{msg.text}</p>
                              <p className="text-soda-lamp/18 text-[9px]">
                                {new Date(msg.date).toLocaleDateString('es-AR', { day:'numeric', month:'long', year:'numeric' })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* NOTIFICACIONES */}
              {activeSection === 'notif' && (
                <div>
                  <div className="px-6 py-5 flex items-center justify-between"
                    style={{ borderBottom:'1px solid rgba(212,197,176,0.06)' }}>
                    <p className="text-soda-lamp/50 text-[10px] tracking-[0.2em] uppercase">Alertas</p>
                    {unreadNotifs > 0 && (
                      <span className="text-[8px] px-2 py-0.5 rounded-full"
                        style={{ background:'rgba(196,85,85,0.5)', color:'white' }}>{unreadNotifs} nuevas</span>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                      <Bell size={24} className="text-soda-lamp/10 mb-4" />
                      <p className="text-soda-lamp/20 text-[11px]">Sin notificaciones por ahora</p>
                    </div>
                  ) : (
                    <div className="divide-y" style={{ borderColor:'rgba(212,197,176,0.05)' }}>
                      {notifications.slice().reverse().map((n: any) => (
                        <div key={n.id} onClick={() => markNotifRead(n.id)}
                          className={`px-6 py-4 cursor-pointer transition-colors hover:bg-white/[0.01] ${!n.read ? 'bg-soda-red/[0.02]' : ''}`}>
                          <div className="flex items-start gap-3">
                            <span className="text-sm flex-shrink-0 mt-0.5">
                              {n.type==='winner'?'🏆':n.type==='birthday'?'🎂':n.type==='payment'?'💳':n.type==='gift'?'🎁':'📬'}
                            </span>
                            <div className="flex-1">
                              <p className={`text-[12px] leading-relaxed ${!n.read?'text-soda-lamp/60':'text-soda-lamp/28'}`}>{n.text}</p>
                              <p className="text-soda-lamp/15 text-[9px] mt-1">
                                {new Date(n.date).toLocaleDateString('es-AR', { day:'numeric', month:'short' })}
                              </p>
                            </div>
                            {!n.read && <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background:'rgba(196,85,85,0.7)' }} />}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT — Plan sidebar */}
        <div className="space-y-4">

          {/* Plan card */}
          <div className="rounded-sm overflow-hidden"
            style={{ background: 'rgba(14,18,28,0.7)', border: '1px solid rgba(212,197,176,0.07)' }}>

            {/* Plan header */}
            <div className="relative px-6 py-7 overflow-hidden"
              style={{ borderBottom: '1px solid rgba(212,197,176,0.06)' }}>
              {/* Ambient glow */}
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 100% 120% at 50% 110%, rgba(196,85,85,0.07) 0%, transparent 65%)' }} />
              <p className="text-[9px] tracking-[0.35em] uppercase text-soda-lamp/28 mb-4 relative z-10">Plan activo</p>
              <div className="flex items-end justify-between relative z-10">
                <div>
                  <h3 className="font-serif text-3xl text-soda-glow/85 leading-none mb-2">{planData.name}</h3>
                  <p className="text-soda-lamp/30 text-xs leading-relaxed max-w-[160px]">{planData.description}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p className="text-soda-lamp/60 text-lg font-light leading-none">${planData.priceARS.toLocaleString('es-AR')}</p>
                  <p className="text-soda-lamp/20 text-[9px] mt-1">ARS/mes</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 relative z-10">
                <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.5, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(80,200,120,0.8)' }} />
                <span className="text-[9px] text-emerald-400/50 tracking-[0.15em] uppercase">Activo</span>
              </div>
            </div>

            {/* Plan options */}
            <div style={{ borderBottom: '1px solid rgba(212,197,176,0.05)' }}>
              {[
                { key: 'plan', label: 'Cambiar plan', Icon: ArrowRight },
                { key: 'payment', label: 'Método de pago', Icon: CreditCard },
                { key: 'history', label: 'Historial', Icon: BarChart3 },
              ].map(({ key, label, Icon }) => (
                <div key={key}>
                  <button onClick={() => setOpenPanel(openPanel === key ? null : key)}
                    className="w-full flex items-center justify-between px-5 py-3.5 transition-all group"
                    style={{ borderBottom: '1px solid rgba(212,197,176,0.04)' }}>
                    <div className="flex items-center gap-2.5">
                      <Icon size={10} className="text-soda-lamp/20 group-hover:text-soda-lamp/40 transition-colors" />
                      <span className="text-soda-lamp/35 text-[10px] tracking-[0.1em] group-hover:text-soda-lamp/55 transition-colors">{label}</span>
                    </div>
                    <ChevronRight size={10} className={`text-soda-lamp/15 transition-transform duration-300 ${openPanel === key ? 'rotate-90' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openPanel === key && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="px-5 py-3 space-y-1.5" style={{ background: 'rgba(10,14,22,0.3)' }}>
                          {key === 'plan' && plans.map(p => (
                            <button key={p.id} onClick={() => { setUserPlan(p.id); localStorage.setItem('sodaroja-user-plan', p.id); setOpenPanel(null); }}
                              className="w-full text-left px-3 py-2.5 rounded-sm text-[10px] transition-all"
                              style={{
                                border: `1px solid rgba(${userPlan === p.id ? '196,85,85,0.25' : '212,197,176,0.07'})`,
                                background: userPlan === p.id ? 'rgba(196,85,85,0.05)' : 'transparent',
                              }}>
                              <div className="flex justify-between">
                                <span className={userPlan === p.id ? 'text-soda-lamp/65' : 'text-soda-lamp/30'}>{p.name}</span>
                                <span className="text-soda-lamp/20">${p.priceARS.toLocaleString('es-AR')}</span>
                              </div>
                            </button>
                          ))}
                          {key === 'payment' && ['Visa ****6411', 'Mastercard ****2190', 'Mercado Pago'].map((m, i) => (
                            <button key={i} onClick={() => { setPayMethod(m); localStorage.setItem('sodaroja-pay-method', m); setOpenPanel(null); }}
                              className="w-full text-left px-3 py-2 rounded-sm text-[10px] transition-all"
                              style={{
                                border: `1px solid rgba(${payMethod === m ? '138,155,196,0.2' : '212,197,176,0.07'})`,
                                background: payMethod === m ? 'rgba(138,155,196,0.05)' : 'transparent',
                              }}>
                              <span className={payMethod === m ? 'text-soda-lamp/60' : 'text-soda-lamp/28'}>{i === 2 ? '📱' : '💳'} {m}</span>
                            </button>
                          ))}
                          {key === 'history' && [
                            { date: '01/02/2026', amount: 5000 },
                            { date: '01/01/2026', amount: 5000 },
                            { date: '01/12/2025', amount: 5000 },
                          ].map((h, i) => (
                            <div key={i} className="flex justify-between items-center px-3 py-2 rounded-sm"
                              style={{ border: '1px solid rgba(212,197,176,0.05)' }}>
                              <p className="text-soda-lamp/35 text-[10px]">{h.date}</p>
                              <p className="text-emerald-400/40 text-[9px]">✓ ${h.amount.toLocaleString('es-AR')}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Dar de baja */}
            <button className="w-full flex items-center gap-2 px-5 py-3.5 text-soda-lamp/15 hover:text-red-400/40 transition-colors text-[10px] tracking-[0.1em]">
              <LogOut size={10} />
              Dar de baja
            </button>
          </div>

          {/* Nº de socio — decorativo elegante */}
          <div className="rounded-sm px-6 py-6 text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(10,14,22,0.8) 0%, rgba(14,18,28,0.6) 100%)', border: '1px solid rgba(196,85,85,0.1)' }}>
            {/* Watermark number */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
              <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontStyle: 'normal', fontSize: '6.5rem', color: 'rgba(196,85,85,0.05)', lineHeight: 1 }}>
                {String(memberNumber).padStart(4, '0')}
              </span>
            </div>
            <p className="text-[9px] tracking-[0.4em] uppercase mb-3 relative z-10" style={{ color: 'rgba(212,197,176,0.2)' }}>Número de socio</p>
            <p className="relative z-10 tracking-[0.18em]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.6rem', fontStyle: 'normal', color: 'rgba(254,248,237,0.65)' }}>
              #{String(memberNumber).padStart(4, '0')}
            </p>
            <div className="mt-3 relative z-10 flex items-center justify-center gap-2">
              <div className="w-6 h-px" style={{ background: 'rgba(196,85,85,0.25)' }} />
              <p className="text-[9px] tracking-[0.15em]" style={{ color: 'rgba(212,197,176,0.2)' }}>desde {new Date().getFullYear()}</p>
              <div className="w-6 h-px" style={{ background: 'rgba(196,85,85,0.25)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* POLL OVERLAY */}
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
// PUBLIC VIEW — editorial redesign
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
      {(isMobile ? PARTICLES_MOBILE : PARTICLES_DESKTOP).map((p, i) => (
        <motion.div key={`p-${i}`} className="absolute w-1 h-1 bg-soda-red rounded-full opacity-40"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ y: [0, -50, 0], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay }}
        />
      ))}
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px" style={{ background: 'rgba(196,85,85,0.5)' }} />
            <span style={{ fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:'10px', letterSpacing:'0.35em', textTransform:'uppercase', fontWeight:300, color:'rgba(196,85,85,0.55)' }}>Membresía</span>
          </div>
          <h2 className="font-display text-soda-glow/85 mb-5" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 300 }}>Frecuencia <span className="font-serif italic text-soda-red/80" style={{ fontWeight: 400 }}>Interna</span></h2>
          <p className="font-sans text-soda-lamp/55 max-w-2xl" style={{ fontSize:'14px', fontWeight:300, lineHeight:1.75 }}>Las historias que se cuentan cuando la noche ya está avanzada</p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-3xl mx-auto mb-20">
          <p className="font-sans text-soda-lamp/45 text-center" style={{ fontSize:'14px', fontWeight:300, lineHeight:1.75 }}>Sodaroja es un proyecto independiente que hacemos con amor, pero tambi&#233;n con tiempo, energ&#237;a y recursos. Cada episodio lleva horas de investigaci&#243;n, edici&#243;n y producci&#243;n. Tu aporte nos permite seguir haci&#233;ndolo.</p>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h3 className="font-serif italic text-soda-glow/85 mb-8 text-center lg:text-left" style={{ fontSize:'1.4rem', fontWeight:400 }}>Elegí cómo querés sumarte</h3>
            <div className="space-y-6">
              {plans.map((plan, idx) => (
                <motion.div key={plan.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative bg-soda-night/50 rounded-sm p-8 transition-all duration-500 cursor-pointer ${
                    selectedPlan === plan.id ? 'border border-soda-red/60 scale-[1.01]' : plan.featured ? 'border border-soda-accent/40' : 'border border-soda-mist/15 hover:border-soda-mist/30'
                  }`}>
                  <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === plan.id ? 'border-soda-red bg-soda-red' : 'border-soda-mist/40'}`}>{selectedPlan === plan.id && <div className="w-2 h-2 bg-white rounded-full" />}</div>
                  {plan.featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-soda-red px-4 py-1 rounded-sm text-xs tracking-wider text-soda-glow">M&#193;S ELEGIDO</div>}
                  <div className="flex items-end justify-between pr-8">
                    <div><h4 className="font-serif italic text-soda-glow/85 mb-2" style={{ fontSize:'1.4rem', fontWeight:400 }}>{plan.name}</h4><p className="text-soda-fog font-sans text-sm">{plan.description}</p></div>
                    <div className="text-right"><div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'1.6rem', fontWeight:300, color:'rgba(212,197,176,0.85)', letterSpacing:'-0.02em', lineHeight:1 }}>${plan.priceARS.toLocaleString('es-AR')}</div><div style={{ fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:'11px', fontWeight:300, color:'rgba(212,197,176,0.35)', marginTop:'4px', letterSpacing:'0.1em' }}>USD ${plan.priceUSD}/mes</div></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h3 className="font-serif italic text-soda-glow/85 mb-8 text-center lg:text-left" style={{ fontSize:'1.4rem', fontWeight:400 }}>Qué te llevás al sumarte</h3>
            <div className="space-y-4">
              {benefits.map((b, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-sm border border-soda-accent/40 flex items-center justify-center group-hover:border-soda-red group-hover:bg-soda-red/10 transition-all"><Check size={14} className="text-soda-accent group-hover:text-soda-red" /></div>
                  <span className="font-sans group-hover:opacity-90 transition-opacity" style={{ fontWeight:300, fontSize:'14px', color:'rgba(212,197,176,0.7)' }}>{b}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16">
          <div className="mb-6 text-center"><div className="font-sans text-soda-lamp/60 text-sm mb-1">Plan seleccionado: <span className="text-soda-red font-medium">{currentPlan.name}</span></div><div className="text-soda-fog font-sans text-xs">${currentPlan.priceARS.toLocaleString('es-AR')} ARS / USD ${currentPlan.priceUSD} por mes</div></div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto mb-12">
            <button className="w-full sm:w-auto px-10 py-5 bg-soda-red/10 border border-soda-red/50 text-soda-glow rounded-sm hover:bg-soda-red/20 hover:border-soda-red/70 transition-all duration-500 tracking-wider font-sans">
              <span className="flex items-center justify-center gap-2"><Heart size={18} />SUSCRIBIRME (ARGENTINA)</span>
              <span className="block text-xs text-soda-lamp mt-1 opacity-70">Mercado Pago · ${currentPlan.priceARS.toLocaleString('es-AR')} ARS/mes</span>
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-soda-accent/8 border border-soda-accent/40 text-soda-glow rounded-sm hover:bg-soda-accent/15 hover:border-soda-accent/60 transition-all duration-500 tracking-wider font-sans">
              <span className="flex items-center justify-center gap-2"><Heart size={18} />SUSCRIBIRME (INTERNACIONAL)</span>
              <span className="block text-xs text-soda-lamp mt-1 opacity-70">USD ${currentPlan.priceUSD}/mes</span>
            </button>
          </div>
          <p className="text-soda-fog font-sans text-xs text-center mb-16">Cancelá cuando quieras, sin compromiso ni letra chica</p>
          <div className="max-w-sm mx-auto">
            <div className="flex items-center gap-4 mb-8 justify-center">
              <div className="w-12 h-px" style={{ background: 'rgba(212,197,176,0.1)' }} />
              <span className="text-[9px] tracking-[0.35em] uppercase font-sans" style={{ color: 'rgba(212,197,176,0.3)' }}>&#191;ya ten&#233;s cuenta?</span>
              <div className="w-12 h-px" style={{ background: 'rgba(212,197,176,0.1)' }} />
            </div>
            <SocialLoginPanel />
          </div>
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
      {isPremium ? <div className="max-w-6xl mx-auto relative z-10"><SubscriberDashboard /></div> : <PublicView />}
    </section>
  );
};
