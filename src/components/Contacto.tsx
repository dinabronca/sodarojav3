import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Instagram, Send, CheckCircle, AlertCircle, Loader2, MessageSquare, Lightbulb, Briefcase, HelpCircle, Heart, Bug } from 'lucide-react';
import { getContent } from '../data/content';
import { EditorialHeader } from './Editorial';
import { MailEffects } from '../effects/SectionBackgrounds';

const subjectOptions = [
  { id: 'mensaje', label: 'Mensaje', icon: MessageSquare, desc: 'Quiero escribirles algo, saludar o compartir algo.' },
  { id: 'sugerencia', label: 'Sugerencia', icon: Lightbulb, desc: 'Tengo una idea para un episodio, ciudad o mejora.' },
  { id: 'patrocinio', label: 'Patrocinio', icon: Briefcase, desc: 'Me interesa colaborar o patrocinar el proyecto.' },
  { id: 'historias', label: 'Tengo una historia', icon: Heart, desc: 'Quiero contarles algo que viví o escuché.' },
  { id: 'problema', label: 'Problema técnico', icon: Bug, desc: 'Algo no funciona bien o encontré un error.' },
  { id: 'otro', label: 'Otro', icon: HelpCircle, desc: 'Cualquier otra consulta o tema.' },
];

export const Contacto: React.FC = () => {
  const contacto = getContent().contacto;
  const meta = getContent().meta;
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const subjectLabel = subjectOptions.find(s => s.id === formData.subject)?.label || 'Mensaje';
    const fullSubject = `[${subjectLabel}] Contacto de ${formData.name}`;
    const ejsService = meta?.emailjsServiceId || '';
    const ejsTemplate = meta?.emailjsTemplateId || '';
    const ejsKey = meta?.emailjsPublicKey || '';

    if (ejsService && ejsTemplate && ejsKey) {
      setStatus('sending');
      try {
        const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ service_id: ejsService, template_id: ejsTemplate, user_id: ejsKey,
            template_params: { from_name: formData.name, from_email: formData.email, subject: fullSubject, message: formData.message, to_email: contacto.email } }),
        });
        if (res.ok) { setStatus('sent'); setFormData({ name: '', email: '', subject: '', message: '' }); setTimeout(() => setStatus('idle'), 4000); }
        else { setStatus('error'); setTimeout(() => setStatus('idle'), 3000); }
      } catch { setStatus('error'); setTimeout(() => setStatus('idle'), 3000); }
    } else {
      const subject = encodeURIComponent(fullSubject);
      const body = encodeURIComponent(`De: ${formData.name} (${formData.email})\n\n${formData.message}`);
      window.location.href = `mailto:${contacto.email}?subject=${subject}&body=${body}`;
      setStatus('sent'); setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const selectedOpt = subjectOptions.find(s => s.id === formData.subject);
  const ic = "w-full bg-soda-slate/40 backdrop-blur-sm border border-soda-mist/20 rounded-sm px-4 py-3 text-soda-lamp focus:border-soda-accent focus:outline-none transition-colors text-sm";

  return (
    <section id="contacto" className="relative py-28 sm:py-36 px-6 bg-gradient-to-b from-soda-night to-soda-deep overflow-hidden">
      <MailEffects />
      {/* Floating light particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div key={`cp-${i}`} className="absolute rounded-full pointer-events-none"
          style={{
            left: `${2 + (i * 5) % 96}%`,
            top: `${3 + (i * 7.1) % 90}%`,
            width: 3 + (i % 3) * 2,
            height: 3 + (i % 3) * 2,
            background: i % 3 === 0 ? 'rgba(196,85,85,0.25)' : 'rgba(138,155,196,0.2)',
          }}
          animate={{ y: [0, -40, 0], opacity: [0, 0.6, 0] }}
          transition={{ duration: 8 + (i % 5) * 2, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
        />
      ))}

      <div className="relative z-10 max-w-5xl mx-auto">
        <EditorialHeader
          label="Hablemos"
          title="Ponete en"
          titleAccent="contacto"
          subtitle="Tenés una historia para contar? Querés colaborar? Escribinos."
          center
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Subject — selectable with descriptions */}
              <div>
                <label className="block text-soda-lamp text-sm mb-3">Asunto</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {subjectOptions.map((opt) => {
                    const Icon = opt.icon;
                    const selected = formData.subject === opt.id;
                    return (
                      <button type="button" key={opt.id} onClick={() => setFormData({ ...formData, subject: opt.id })}
                        className={`text-left px-3 py-2.5 rounded-sm border transition-all duration-500 ${
                          selected
                            ? 'border-soda-accent/40 bg-soda-accent/8 text-soda-lamp'
                            : 'border-soda-mist/10 bg-soda-slate/15 text-soda-fog/70 hover:border-soda-mist/20 hover:text-soda-fog'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-0.5">
                          <Icon size={14} className={selected ? 'text-soda-accent' : 'text-soda-fog'} />
                          <span className="text-xs font-medium tracking-wide">{opt.label}</span>
                        </div>
                        <p className="text-[11px] opacity-60 leading-tight">{opt.desc}</p>
                      </button>
                    );
                  })}
                </div>
                {/* Selected confirmation with description */}
                {selectedOpt && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2 px-3 py-2 bg-soda-accent/5 border border-soda-accent/15 rounded-sm">
                    <p className="text-soda-accent text-xs flex items-center gap-2"><selectedOpt.icon size={12} />{selectedOpt.desc}</p>
                  </motion.div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-soda-lamp text-sm mb-2">Tu nombre</label><input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={ic} placeholder="Juan Perez" /></div>
                <div><label className="block text-soda-lamp text-sm mb-2">Tu email</label><input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={ic} placeholder="tu@email.com" /></div>
              </div>

              <div><label className="block text-soda-lamp text-sm mb-2">Mensaje</label><textarea required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} rows={5} className={ic + ' resize-none'} placeholder="Contanos..." /></div>

              <button type="submit" disabled={status === 'sending' || !formData.subject} className={`w-full py-4 border rounded-sm transition-all duration-500 tracking-widest flex items-center justify-center gap-2 text-[11px] ${
                status === 'sent' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                : status === 'error' ? 'bg-red-500/10 border-red-500/40 text-red-400/80'
                : !formData.subject ? 'border-soda-mist/15 text-soda-fog/50 cursor-not-allowed'
                : 'bg-soda-accent/8 border-soda-accent/30 text-soda-lamp/80 hover:bg-soda-accent/15 hover:border-soda-accent/45 hover:text-soda-lamp'
              }`}>
                {status === 'idle' && <><Send size={16} />ENVIAR MENSAJE</>}
                {status === 'sending' && <><Loader2 size={16} className="animate-spin" />ENVIANDO...</>}
                {status === 'sent' && <><CheckCircle size={16} />MENSAJE ENVIADO</>}
                {status === 'error' && <><AlertCircle size={16} />ERROR AL ENVIAR</>}
              </button>
              {!formData.subject && status === 'idle' && <p className="text-soda-fog text-xs text-center">Seleccioná un asunto para enviar</p>}
            </form>
          </motion.div>

          {/* Info sidebar */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="space-y-6">
            <div className="bg-soda-slate/40 backdrop-blur-sm border border-soda-mist/20 rounded-sm p-8">
              <h3 className="text-xl font-serif text-soda-glow mb-6">Líneas directas</h3>
              <div className="space-y-4">
                <a href={`mailto:${contacto.email}`} className="flex items-center gap-4 text-soda-lamp hover:text-soda-glow transition-colors group"><Mail size={24} className="text-soda-accent group-hover:text-soda-lamp transition-colors" /><span>{contacto.email}</span></a>
                <a href={`https://instagram.com/${contacto.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-soda-lamp hover:text-soda-glow transition-colors group"><Instagram size={24} className="text-soda-accent group-hover:text-soda-lamp transition-colors" /><span>{contacto.instagram}</span></a>
              </div>
            </div>
            <p className="text-soda-fog text-sm font-light">Respondemos todos los mensajes. Puede que tarde un poco, pero llegamos.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
