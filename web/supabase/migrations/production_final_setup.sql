-- ==============================================
-- 🚀 SYGMA CONSULT - FINAL PRODUCTION SETUP (Sanitized)
-- ==============================================
-- ⚠️ IMPORTANT: Do NOT commit real secrets here.
-- Run the version with real secrets MANUALLY in Supabase SQL Editor.
-- 1. Create/Recreate Secure Table
DROP TABLE IF EXISTS public.site_settings;
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 2. Secure the table (Backend access only)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Deny all public access" ON public.site_settings FOR ALL TO public USING (false);
CREATE POLICY "Service role can manage settings" ON public.site_settings FOR ALL TO service_role USING (true);
-- 3. INSERT PLACEHOLDERS (Fill these manually in Supabase UI or via SQL Editor)
INSERT INTO public.site_settings (key, value, description)
VALUES (
        'STRIPE_SECRET_KEY',
        'REPLACE_WITH_REAL_KEY',
        'Stripe Live Secret Key'
    ),
    (
        'STRIPE_WEBHOOK_SECRET',
        'REPLACE_WITH_REAL_KEY',
        'Stripe Webhook Secret'
    ),
    (
        'SMTP_HOST',
        'REPLACE_WITH_REAL_KEY',
        'Hostinger SMTP Host'
    ),
    (
        'SMTP_PORT',
        'REPLACE_WITH_REAL_KEY',
        'Hostinger SMTP Port'
    ),
    (
        'SMTP_USER',
        'REPLACE_WITH_REAL_KEY',
        'SMTP Email Account'
    ),
    (
        'SMTP_PASSWORD',
        'REPLACE_WITH_REAL_KEY',
        'SMTP Email Password'
    ),
    (
        'ADMIN_EMAIL',
        'REPLACE_WITH_REAL_KEY',
        'Admin Notification Receiver'
    ),
    (
        'GOOGLE_CLIENT_ID',
        'REPLACE_WITH_REAL_KEY',
        'Google OAuth Client ID'
    ),
    (
        'GOOGLE_CLIENT_SECRET',
        'REPLACE_WITH_REAL_KEY',
        'Google OAuth Client Secret'
    ),
    (
        'GROQ_API_KEY',
        'REPLACE_WITH_REAL_KEY',
        'Groq AI API Key'
    ) ON CONFLICT (key) DO NOTHING;