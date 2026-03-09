import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase, upsertUserProfile, getUserProfile } from '../data/supabase';
import { loginUser } from '../data/auth';

const generateMemberNumber = (): string => {
  const vowels = 'AEIOU';
  const v1 = vowels[Math.floor(Math.random() * 5)];
  const v2 = vowels[Math.floor(Math.random() * 5)];
  const nums = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join('');
  return `${v1}${v2}-${nums}`;
};

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'error'>('loading');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Exchange the code for a session (Supabase handles the URL hash/params)
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session?.user) {
          setStatus('error');
          setTimeout(() => navigate('/unirse'), 3000);
          return;
        }

        const user = session.user;
        const existing = await getUserProfile(user.id);

        let memberNumber = existing.data?.member_number || generateMemberNumber();

        if (!existing.data) {
          await upsertUserProfile(user.id, {
            name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Oyente',
            email: user.email || '',
            isPremium: false,
            memberNumber,
            photoUrl: user.user_metadata?.avatar_url || '',
          });
        }

        loginUser({
          name: existing.data?.name || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Oyente',
          email: user.email || '',
          passwordHash: '',
          photoUrl: existing.data?.photo_url || user.user_metadata?.avatar_url || '',
          isPremium: existing.data?.is_premium || false,
          memberNumber,
          createdAt: user.created_at,
        });

        navigate('/mi-cuenta');
        window.location.reload();
      } catch {
        setStatus('error');
        setTimeout(() => navigate('/unirse'), 3000);
      }
    };

    handleCallback();
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center">
      {status === 'loading' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border border-soda-mist/20 rounded-full mx-auto mb-6"
            style={{ borderTopColor: 'rgba(196,85,85,0.6)' }} />
          <p className="text-soda-lamp/35 text-sm font-light">Verificando cuenta...</p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <p className="text-soda-red/60 text-sm mb-2">Error al iniciar sesión</p>
          <p className="text-soda-lamp/30 text-xs">Redirigiendo...</p>
        </motion.div>
      )}
    </section>
  );
};
