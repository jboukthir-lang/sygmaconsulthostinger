-- Create app_config table for site-wide configuration (separate from secrets)
-- This separates app configuration from sensitive data in site_settings

CREATE TABLE IF NOT EXISTS public.app_config (
  key TEXT PRIMARY KEY,

  -- Company Information
  company_name TEXT DEFAULT 'SYGMA CONSULT',
  company_tagline_en TEXT DEFAULT 'Your Strategic Partner for Growth',
  company_tagline_fr TEXT DEFAULT 'Votre Partenaire Stratégique pour la Croissance',
  company_tagline_ar TEXT DEFAULT 'شريكك الاستراتيجي للنمو',

  company_description_en TEXT DEFAULT 'Expert consulting for digital transformation and strategic growth',
  company_description_fr TEXT DEFAULT 'Conseil expert en transformation digitale et croissance stratégique',
  company_description_ar TEXT DEFAULT 'استشارات متخصصة في التحول الرقمي والنمو الاستراتيجي',

  -- Contact Information
  phone_primary TEXT DEFAULT '+33 7 52 03 47 86',
  phone_secondary TEXT,
  whatsapp_number TEXT DEFAULT '+33 7 52 03 47 86',
  email_primary TEXT DEFAULT 'contact@sygma-consult.com',
  email_secondary TEXT,

  -- Addresses
  address_paris_en TEXT DEFAULT '6 rue Paul Verlaine, 93130 Noisy-le-Sec, France',
  address_paris_fr TEXT DEFAULT '6 rue Paul Verlaine, 93130 Noisy-le-Sec, France',
  address_paris_ar TEXT DEFAULT '6 شارع بول فيرلين، 93130 نوازي لو سيك، فرنسا',

  address_tunis_en TEXT DEFAULT 'Les Berges du Lac II, 1053 Tunis, Tunisia',
  address_tunis_fr TEXT DEFAULT 'Les Berges du Lac II, 1053 Tunis, Tunisie',
  address_tunis_ar TEXT DEFAULT 'ضفاف البحيرة 2، 1053 تونس، تونس',

  -- Social Media
  linkedin_url TEXT,
  twitter_url TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT,

  -- Business Hours
  business_hours_en TEXT DEFAULT 'Monday - Friday: 9:00 AM - 6:00 PM',
  business_hours_fr TEXT DEFAULT 'Lundi - Vendredi: 9h00 - 18h00',
  business_hours_ar TEXT DEFAULT 'الإثنين - الجمعة: 9:00 صباحاً - 6:00 مساءً',

  -- Branding
  primary_color TEXT DEFAULT '#001F3F',
  secondary_color TEXT DEFAULT '#D4AF37',

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default 'main' record
INSERT INTO public.app_config (key)
VALUES ('main')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- Policies: Everyone can read, authenticated can update
CREATE POLICY "App config readable by all"
  ON public.app_config FOR SELECT
  USING (true);

CREATE POLICY "App config updatable by authenticated"
  ON public.app_config FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Permissions
GRANT SELECT ON public.app_config TO anon, authenticated;
GRANT UPDATE ON public.app_config TO authenticated;

COMMENT ON TABLE public.app_config IS 'Application-wide configuration and site settings (non-sensitive data)';
