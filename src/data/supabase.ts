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
