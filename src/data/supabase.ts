/// <reference types="vite/client" />
// ============================================================
// SUPABASE CLIENT — ACTIVO
// URL: https://kkjwjwfvmkbzafiweelz.supabase.co
// ============================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kkjwjwfvmkbzafiweelz.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_A_OwmXxC7zhmjxohOaFa0Q_d3PqiX0t';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const SUPABASE_READY = true;

// ========== SITE CONTENT ==========

export const getContentFromDB = async () => {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('id', 1)
      .single();
    if (error) throw error;
    return data?.content || null;
  } catch {
    return null;
  }
};

export const saveContentToDB = async (content: any): Promise<{ error: any }> => {
  try {
    const { error } = await supabase
      .from('site_content')
      .upsert({ id: 1, content, updated_at: new Date().toISOString() });
    return { error };
  } catch (err) {
    return { error: err };
  }
};

// ========== AUTH ==========

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  return { data, error };
};

export const signInWithTwitter = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'twitter',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  return { data, error };
};

export const signInWithSpotify = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'spotify',
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  return { data, error };
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
};

export const signUpWithEmail = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name, display_name: name } },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const getSupabaseUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Upsert user profile in our own table (optional — for isPremium etc)
export const upsertUserProfile = async (userId: string, data: {
  name?: string; email?: string; isPremium?: boolean; memberNumber?: string; photoUrl?: string;
}) => {
  const { error } = await supabase
    .from('user_profiles')
    .upsert({ id: userId, ...data, updated_at: new Date().toISOString() }, { onConflict: 'id' });
  return { error };
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

// ========== STORAGE (imágenes) ==========

export const uploadImage = async (bucket: string, path: string, file: File): Promise<{ url: string | null; error: any }> => {
  try {
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
    if (error) return { url: null, error };
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
    return { url: urlData.publicUrl, error: null };
  } catch (err) {
    return { url: null, error: err };
  }
};
