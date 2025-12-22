-- Fix migration: Update site_settings table structure
-- Created: 2025-12-21
-- Description: Adds missing columns and inserts default data

-- First, let's add the missing columns if they don't exist
DO $$
BEGIN
  -- Add company information columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'company_name') THEN
    ALTER TABLE public.site_settings ADD COLUMN company_name TEXT DEFAULT 'SYGMA CONSULT';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'company_tagline_en') THEN
    ALTER TABLE public.site_settings ADD COLUMN company_tagline_en TEXT DEFAULT 'Your Strategic Partner for Business Success';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'company_tagline_fr') THEN
    ALTER TABLE public.site_settings ADD COLUMN company_tagline_fr TEXT DEFAULT 'Votre Partenaire Stratégique pour la Réussite';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'company_tagline_ar') THEN
    ALTER TABLE public.site_settings ADD COLUMN company_tagline_ar TEXT DEFAULT 'شريكك الاستراتيجي لتحقيق النجاح';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'company_description_en') THEN
    ALTER TABLE public.site_settings ADD COLUMN company_description_en TEXT DEFAULT 'Your trusted strategic partner for digital transformation, legal compliance, and business growth in Paris and Tunis.';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'company_description_fr') THEN
    ALTER TABLE public.site_settings ADD COLUMN company_description_fr TEXT DEFAULT 'Votre partenaire stratégique de confiance pour la transformation numérique et la croissance à Paris et Tunis.';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'company_description_ar') THEN
    ALTER TABLE public.site_settings ADD COLUMN company_description_ar TEXT DEFAULT 'شريكك الاستراتيجي الموثوق للتحول الرقمي، الامتثال القانوني، ونمو الأعمال في باريس وتونس.';
  END IF;

  -- Add contact information columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'phone_primary') THEN
    ALTER TABLE public.site_settings ADD COLUMN phone_primary TEXT DEFAULT '+33 7 52 03 47 86';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'phone_secondary') THEN
    ALTER TABLE public.site_settings ADD COLUMN phone_secondary TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'whatsapp_number') THEN
    ALTER TABLE public.site_settings ADD COLUMN whatsapp_number TEXT DEFAULT '+33 7 52 03 47 86';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'email_primary') THEN
    ALTER TABLE public.site_settings ADD COLUMN email_primary TEXT DEFAULT 'contact@sygma-consult.com';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'email_secondary') THEN
    ALTER TABLE public.site_settings ADD COLUMN email_secondary TEXT;
  END IF;

  -- Add address columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'address_paris_en') THEN
    ALTER TABLE public.site_settings ADD COLUMN address_paris_en TEXT DEFAULT '6 rue Paul Verlaine, 93130 Noisy-le-Sec';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'address_paris_fr') THEN
    ALTER TABLE public.site_settings ADD COLUMN address_paris_fr TEXT DEFAULT '6 rue Paul Verlaine, 93130 Noisy-le-Sec';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'address_paris_ar') THEN
    ALTER TABLE public.site_settings ADD COLUMN address_paris_ar TEXT DEFAULT '6 rue Paul Verlaine, 93130 Noisy-le-Sec';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'address_tunis_en') THEN
    ALTER TABLE public.site_settings ADD COLUMN address_tunis_en TEXT DEFAULT 'Les Berges du Lac II, 1053 Tunis';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'address_tunis_fr') THEN
    ALTER TABLE public.site_settings ADD COLUMN address_tunis_fr TEXT DEFAULT 'Les Berges du Lac II, 1053 Tunis';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'address_tunis_ar') THEN
    ALTER TABLE public.site_settings ADD COLUMN address_tunis_ar TEXT DEFAULT 'Les Berges du Lac II, 1053 Tunis';
  END IF;

  -- Add social media columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'linkedin_url') THEN
    ALTER TABLE public.site_settings ADD COLUMN linkedin_url TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'twitter_url') THEN
    ALTER TABLE public.site_settings ADD COLUMN twitter_url TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'facebook_url') THEN
    ALTER TABLE public.site_settings ADD COLUMN facebook_url TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'instagram_url') THEN
    ALTER TABLE public.site_settings ADD COLUMN instagram_url TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'youtube_url') THEN
    ALTER TABLE public.site_settings ADD COLUMN youtube_url TEXT;
  END IF;

  -- Add business hours columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'business_hours_en') THEN
    ALTER TABLE public.site_settings ADD COLUMN business_hours_en TEXT DEFAULT 'Monday - Friday: 9:00 AM - 6:00 PM';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'business_hours_fr') THEN
    ALTER TABLE public.site_settings ADD COLUMN business_hours_fr TEXT DEFAULT 'Lundi - Vendredi: 9h00 - 18h00';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'business_hours_ar') THEN
    ALTER TABLE public.site_settings ADD COLUMN business_hours_ar TEXT DEFAULT 'الاثنين - الجمعة: 9:00 صباحاً - 6:00 مساءً';
  END IF;

  -- Add SEO columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'site_title_en') THEN
    ALTER TABLE public.site_settings ADD COLUMN site_title_en TEXT DEFAULT 'Sygma Consult - Strategic Business Consulting';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'site_title_fr') THEN
    ALTER TABLE public.site_settings ADD COLUMN site_title_fr TEXT DEFAULT 'Sygma Consult - Conseil Stratégique';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'site_title_ar') THEN
    ALTER TABLE public.site_settings ADD COLUMN site_title_ar TEXT DEFAULT 'سيجما كونسلت - استشارات استراتيجية';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'meta_description_en') THEN
    ALTER TABLE public.site_settings ADD COLUMN meta_description_en TEXT DEFAULT 'Premium consulting services for digital transformation, legal compliance, and business growth in Paris and Tunis.';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'meta_description_fr') THEN
    ALTER TABLE public.site_settings ADD COLUMN meta_description_fr TEXT DEFAULT 'Services de conseil premium pour la transformation numérique, la conformité juridique et la croissance des entreprises à Paris et Tunis.';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'meta_description_ar') THEN
    ALTER TABLE public.site_settings ADD COLUMN meta_description_ar TEXT DEFAULT 'خدمات استشارية متميزة للتحول الرقمي والامتثال القانوني ونمو الأعمال في باريس وتونس.';
  END IF;

  -- Add branding columns
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'primary_color') THEN
    ALTER TABLE public.site_settings ADD COLUMN primary_color TEXT DEFAULT '#001F3F';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'secondary_color') THEN
    ALTER TABLE public.site_settings ADD COLUMN secondary_color TEXT DEFAULT '#D4AF37';
  END IF;
END $$;

-- Now insert or update the default record with the key field
INSERT INTO public.site_settings (
  key,
  company_name,
  phone_primary,
  email_primary
)
VALUES (
  'main',
  'SYGMA CONSULT',
  '+33 7 52 03 47 86',
  'contact@sygma-consult.com'
)
ON CONFLICT (key) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  phone_primary = EXCLUDED.phone_primary,
  email_primary = EXCLUDED.email_primary;

-- Ensure RLS policies exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'site_settings'
    AND policyname = 'Site settings are viewable by everyone'
  ) THEN
    CREATE POLICY "Site settings are viewable by everyone"
      ON public.site_settings
      FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'site_settings'
    AND policyname = 'Site settings are updatable by authenticated users'
  ) THEN
    CREATE POLICY "Site settings are updatable by authenticated users"
      ON public.site_settings
      FOR UPDATE
      USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated');
  END IF;
END $$;
