import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anonKey);

export const supabase = supabaseConfigured
  ? createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true }
    })
  : null;

export const MENU_BUCKET = import.meta.env.VITE_SUPABASE_MENU_BUCKET || "menu-images";
export const OFFER_BUCKET = import.meta.env.VITE_SUPABASE_OFFER_BUCKET || "offer-banners";
