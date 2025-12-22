-- Migration: Create site_settings table for managing site-wide configuration
-- Created: 2025-12-21
-- Description: Allows admins to manage company information, contact details, and social media links

-- Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Company Information
  company_name TEXT DEFAULT 'SYGMA CONSULT',
  company_tagline_en TEXT DEFAULT 'Your Strategic Partner for Business Success',
  company_tagline_fr TEXT DEFAULT 'Votre Partenaire Stratégique pour la Réussite',
  company_tagline_ar TEXT DEFAULT 'شريكك الاستراتيجي لتحقيق النجاح',

  company_description_en TEXT DEFAULT 'Your trusted strategic partner for digital transformation, legal compliance, and business growth in Paris and Tunis.',
  company_description_fr TEXT DEFAULT 'Votre partenaire stratégique de confiance pour la transformation numérique et la croissance à Paris et Tunis.',
  company_description_ar TEXT DEFAULT 'شريكك الاستراتيجي الموثوق للتحول الرقمي، الامتثال القانوني، ونمو الأعمال في باريس وتونس.',

  -- Contact Information
  phone_primary TEXT DEFAULT '+33 7 52 03 47 86',
  phone_secondary TEXT,
  whatsapp_number TEXT DEFAULT '+33 7 52 03 47 86',
  email_primary TEXT DEFAULT 'contact@sygma-consult.com',
  email_secondary TEXT,

  -- Addresses
  address_paris_en TEXT DEFAULT '6 rue Paul Verlaine, 93130 Noisy-le-Sec',
  address_paris_fr TEXT DEFAULT '6 rue Paul Verlaine, 93130 Noisy-le-Sec',
  address_paris_ar TEXT DEFAULT '6 rue Paul Verlaine, 93130 Noisy-le-Sec',

  address_tunis_en TEXT DEFAULT 'Les Berges du Lac II, 1053 Tunis',
  address_tunis_fr TEXT DEFAULT 'Les Berges du Lac II, 1053 Tunis',
  address_tunis_ar TEXT DEFAULT 'Les Berges du Lac II, 1053 Tunis',

  -- Social Media Links
  linkedin_url TEXT,
  twitter_url TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT,

  -- Business Hours (JSON format for flexibility)
  business_hours_en TEXT DEFAULT 'Monday - Friday: 9:00 AM - 6:00 PM',
  business_hours_fr TEXT DEFAULT 'Lundi - Vendredi: 9h00 - 18h00',
  business_hours_ar TEXT DEFAULT 'الاثنين - الجمعة: 9:00 صباحاً - 6:00 مساءً',

  -- SEO & Metadata
  site_title_en TEXT DEFAULT 'Sygma Consult - Strategic Business Consulting',
  site_title_fr TEXT DEFAULT 'Sygma Consult - Conseil Stratégique',
  site_title_ar TEXT DEFAULT 'سيجما كونسلت - استشارات استراتيجية',

  meta_description_en TEXT DEFAULT 'Premium consulting services for digital transformation, legal compliance, and business growth in Paris and Tunis.',
  meta_description_fr TEXT DEFAULT 'Services de conseil premium pour la transformation numérique, la conformité juridique et la croissance des entreprises à Paris et Tunis.',
  meta_description_ar TEXT DEFAULT 'خدمات استشارية متميزة للتحول الرقمي والامتثال القانوني ونمو الأعمال في باريس وتونس.',

  -- Branding
  primary_color TEXT DEFAULT '#001F3F',
  secondary_color TEXT DEFAULT '#D4AF37',

  -- System
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Insert default settings
INSERT INTO public.site_settings (id)
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_site_settings_updated_at_trigger ON public.site_settings;
CREATE TRIGGER update_site_settings_updated_at_trigger
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_site_settings_updated_at();

-- Enable Row Level Security
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read site settings
CREATE POLICY "Site settings are viewable by everyone"
  ON public.site_settings
  FOR SELECT
  USING (true);

-- Policy: Only authenticated users can update site settings
CREATE POLICY "Site settings are updatable by authenticated users"
  ON public.site_settings
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_site_settings_active ON public.site_settings(is_active);

-- Grant permissions
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT UPDATE ON public.site_settings TO authenticated;

-- Add helpful comment
COMMENT ON TABLE public.site_settings IS 'Stores site-wide configuration including company info, contact details, social media links, and branding';
