-- Drop existing table if it was created incorrectly by a previous script
DROP TABLE IF EXISTS public.site_settings;
-- Create a secure table for sensitive site settings
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
-- Deny all public access
CREATE POLICY "Deny all public access" ON public.site_settings FOR ALL TO public USING (false);
-- Allow service_role (backend) access only
CREATE POLICY "Service role can manage settings" ON public.site_settings FOR ALL TO service_role USING (true);
-- Insert initial empty keys (user will fill them in Supabase UI)
INSERT INTO public.site_settings (key, description, value)
VALUES (
        'STRIPE_SECRET_KEY',
        'Stripe Secret Key (sk_...)',
        'REPLACE_ME'
    ),
    (
        'STRIPE_WEBHOOK_SECRET',
        'Stripe Webhook Signing Secret (whsec_...)',
        'REPLACE_ME'
    ),
    (
        'SMTP_PASSWORD',
        'SMTP/Email Password',
        'REPLACE_ME'
    ),
    (
        'SMTP_USER',
        'SMTP Username (email)',
        'REPLACE_ME'
    ),
    (
        'SMTP_HOST',
        'SMTP Host (e.g., smtp.hostinger.com)',
        'REPLACE_ME'
    ),
    (
        'SMTP_PORT',
        'SMTP Port (e.g., 465)',
        'REPLACE_ME'
    ) ON CONFLICT (key) DO NOTHING;