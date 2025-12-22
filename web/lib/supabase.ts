import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
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
