import { createClient } from '@supabase/supabase-js';

// Production Supabase credentials with fallback
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ||
  (process.env.NODE_ENV === 'production' ? 'https://ldbsacdpkinbpcguvgai.supabase.co' : 'https://placeholder.supabase.co');

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  (process.env.NODE_ENV === 'production'
    ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkYnNhY2Rwa2luYnBjZ3V2Z2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4OTUwNzgsImV4cCI6MjA4MTQ3MTA3OH0.Qib8uCPcd6CJypKa_oNEDThIQNfTluH2eJE0nsewwug'
    : 'placeholder-key');

if (process.env.NODE_ENV === 'production') {
  console.log('✅ Supabase initialized:', supabaseUrl);
} else if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('Warning: Missing Supabase environment variables. Using placeholders for build.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Booking {
  id?: string;
  user_id?: string;
  name: string;
  email: string;
  topic: string;
  date: string;
  time: string;
  status?: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  calendar_event_id?: string;
  meet_link?: string;
  consultant_id?: string;
  fee?: number;
  internal_notes?: string;
  duration?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Contact {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status?: 'new' | 'read' | 'replied';
  created_at?: string;
}

export interface Post {
  id?: string;
  title_en: string;
  title_fr: string;
  title_ar: string;
  slug: string;
  excerpt_en: string;
  excerpt_fr: string;
  excerpt_ar: string;
  content_en: string;
  content_fr: string;
  content_ar: string;
  author_id?: string;
  author_name: string;
  category: string;
  tags?: string[];
  featured_image?: string;
  published?: boolean;
  views?: number;
  reading_time?: number;
  seo_title_en?: string;
  seo_title_fr?: string;
  seo_title_ar?: string;
  seo_description_en?: string;
  seo_description_fr?: string;
  seo_description_ar?: string;
  seo_keywords?: string[];
  created_at?: string;
  updated_at?: string;
  published_at?: string;
}
