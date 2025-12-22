-- Insert default data for site_settings table
-- This SQL file adds default site-wide settings

-- First ensure all required columns exist
DO $$
BEGIN
    -- Add any missing columns (safe to run multiple times)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'phone_secondary') THEN
        ALTER TABLE public.site_settings ADD COLUMN phone_secondary TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'email_secondary') THEN
        ALTER TABLE public.site_settings ADD COLUMN email_secondary TEXT;
    END IF;
END $$;

-- Insert or update the main settings record
INSERT INTO public.site_settings (
    key,
    company_name,
    company_description_en,
    company_description_fr,
    company_description_ar,
    phone_primary,
    phone_secondary,
    whatsapp_number,
    email_primary,
    email_secondary,
    address_paris_en,
    address_paris_fr,
    address_paris_ar,
    address_tunis_en,
    address_tunis_fr,
    address_tunis_ar,
    linkedin_url,
    twitter_url,
    facebook_url,
    instagram_url,
    youtube_url,
    primary_color,
    secondary_color,
    site_title_en,
    site_title_fr,
    site_title_ar,
    meta_description_en,
    meta_description_fr,
    meta_description_ar,
    business_hours_en,
    business_hours_fr,
    business_hours_ar,
    company_tagline_en,
    company_tagline_fr,
    company_tagline_ar
) VALUES (
    'main',
    'SYGMA CONSULT',

    -- Company Descriptions
    'Your trusted partner for business growth between Europe and Africa. Expert consulting services in digital transformation, market strategy, and sustainable development.',
    'Votre partenaire de confiance pour la croissance commerciale entre l''Europe et l''Afrique. Services de conseil experts en transformation digitale, stratégie de marché et développement durable.',
    'شريككم الموثوق في نمو الأعمال بين أوروبا وأفريقيا. خدمات استشارية متخصصة في التحول الرقمي واستراتيجية السوق والتنمية المستدامة.',

    -- Contact Information
    '+33 7 52 03 47 86',
    '+216 XX XXX XXX',
    '+33 7 52 03 47 86',
    'contact@sygma-consult.com',
    'info@sygma-consult.com',

    -- Paris Address
    '6 rue Paul Verlaine, 93130 Noisy-le-Sec, Paris, France',
    '6 rue Paul Verlaine, 93130 Noisy-le-Sec, Paris, France',
    '6 rue Paul Verlaine, 93130 Noisy-le-Sec، باريس، فرنسا',

    -- Tunis Address
    'Les Berges du Lac II, 1053 Tunis, Tunisia',
    'Les Berges du Lac II, 1053 Tunis, Tunisie',
    'Les Berges du Lac II, 1053 تونس، تونس',

    -- Social Media URLs
    'https://linkedin.com/company/sygma-consult',
    'https://twitter.com/sygmaconsult',
    'https://facebook.com/sygmaconsult',
    NULL,
    NULL,

    -- Branding Colors
    '#001F3F',
    '#D4AF37',

    -- SEO Metadata
    'SYGMA CONSULT - Business Consulting Paris & Tunis',
    'SYGMA CONSULT - Conseil d''Entreprise Paris & Tunis',
    'SYGMA CONSULT - استشارات أعمال باريس وتونس',

    'Expert consulting services connecting European and African markets. Digital transformation, strategic planning, and sustainable growth solutions.',
    'Services de conseil experts reliant les marchés européens et africains. Transformation digitale, planification stratégique et solutions de croissance durable.',
    'خدمات استشارية متخصصة تربط الأسواق الأوروبية والأفريقية. التحول الرقمي والتخطيط الاستراتيجي وحلول النمو المستدام.',

    -- Business Hours
    'Monday - Friday: 9:00 AM - 6:00 PM',
    'Lundi - Vendredi: 9h00 - 18h00',
    'الاثنين - الجمعة: 9:00 صباحاً - 6:00 مساءً',

    -- Taglines
    'Your Strategic Partner for Business Success',
    'Votre Partenaire Stratégique pour la Réussite',
    'شريكك الاستراتيجي لتحقيق النجاح'
) ON CONFLICT (key) DO UPDATE SET
    company_name = EXCLUDED.company_name,
    company_description_en = EXCLUDED.company_description_en,
    company_description_fr = EXCLUDED.company_description_fr,
    company_description_ar = EXCLUDED.company_description_ar,
    phone_primary = EXCLUDED.phone_primary,
    phone_secondary = EXCLUDED.phone_secondary,
    whatsapp_number = EXCLUDED.whatsapp_number,
    email_primary = EXCLUDED.email_primary,
    email_secondary = EXCLUDED.email_secondary,
    address_paris_en = EXCLUDED.address_paris_en,
    address_paris_fr = EXCLUDED.address_paris_fr,
    address_paris_ar = EXCLUDED.address_paris_ar,
    address_tunis_en = EXCLUDED.address_tunis_en,
    address_tunis_fr = EXCLUDED.address_tunis_fr,
    address_tunis_ar = EXCLUDED.address_tunis_ar,
    linkedin_url = EXCLUDED.linkedin_url,
    twitter_url = EXCLUDED.twitter_url,
    facebook_url = EXCLUDED.facebook_url,
    instagram_url = EXCLUDED.instagram_url,
    youtube_url = EXCLUDED.youtube_url,
    primary_color = EXCLUDED.primary_color,
    secondary_color = EXCLUDED.secondary_color,
    site_title_en = EXCLUDED.site_title_en,
    site_title_fr = EXCLUDED.site_title_fr,
    site_title_ar = EXCLUDED.site_title_ar,
    meta_description_en = EXCLUDED.meta_description_en,
    meta_description_fr = EXCLUDED.meta_description_fr,
    meta_description_ar = EXCLUDED.meta_description_ar,
    business_hours_en = EXCLUDED.business_hours_en,
    business_hours_fr = EXCLUDED.business_hours_fr,
    business_hours_ar = EXCLUDED.business_hours_ar,
    company_tagline_en = EXCLUDED.company_tagline_en,
    company_tagline_fr = EXCLUDED.company_tagline_fr,
    company_tagline_ar = EXCLUDED.company_tagline_ar;

-- Verify the data was inserted/updated
SELECT key, company_name, phone_primary, email_primary, address_paris_en, address_tunis_en
FROM public.site_settings
WHERE key = 'main';
