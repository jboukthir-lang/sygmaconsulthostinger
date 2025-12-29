-- MASTER SETUP SCRIPT FOR SYGMA CONSULT
-- Run this script in the Supabase SQL Editor to set up your entire database.
-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- 2. Core Tables (Bookings & Contacts)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    topic TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
    reply TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 3. Clients & Invoices System
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'France',
    siret TEXT,
    tva_number TEXT,
    company_type TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    CONSTRAINT clients_email_unique UNIQUE (email)
);
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    type TEXT NOT NULL CHECK (type IN ('quote', 'invoice', 'credit_note')),
    status TEXT NOT NULL CHECK (
        status IN (
            'draft',
            'sent',
            'accepted',
            'rejected',
            'paid',
            'overdue',
            'cancelled'
        )
    ),
    number TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT,
    client_address TEXT,
    client_siret TEXT,
    client_id UUID REFERENCES clients(id),
    currency TEXT DEFAULT 'EUR',
    items JSONB NOT NULL DEFAULT '[]',
    total_excl_tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_incl_tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,
    notes TEXT,
    footer TEXT,
    CONSTRAINT invoices_number_unique UNIQUE (number)
);
-- 4. Site Settings (Merged Content + Secrets)
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE DEFAULT 'main',
    value TEXT,
    -- For secrets like SMTP_HOST
    description TEXT,
    -- Description for secrets
    -- Content Columns (Used when key='main')
    company_name TEXT DEFAULT 'SYGMA CONSULT',
    company_tagline_en TEXT,
    company_tagline_fr TEXT,
    company_tagline_ar TEXT,
    company_description_en TEXT,
    company_description_fr TEXT,
    company_description_ar TEXT,
    phone_primary TEXT,
    phone_secondary TEXT,
    whatsapp_number TEXT,
    email_primary TEXT,
    email_secondary TEXT,
    address_paris_en TEXT,
    address_paris_fr TEXT,
    address_paris_ar TEXT,
    address_tunis_en TEXT,
    address_tunis_fr TEXT,
    address_tunis_ar TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    youtube_url TEXT,
    business_hours_en TEXT,
    business_hours_fr TEXT,
    business_hours_ar TEXT,
    site_title_en TEXT,
    site_title_fr TEXT,
    site_title_ar TEXT,
    meta_description_en TEXT,
    meta_description_fr TEXT,
    meta_description_ar TEXT,
    primary_color TEXT DEFAULT '#001F3F',
    secondary_color TEXT DEFAULT '#D4AF37',
    company_siret TEXT,
    company_tva TEXT,
    company_rcs TEXT,
    company_capital TEXT,
    company_legal_form TEXT DEFAULT 'SASU',
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID
);
-- 5. Extended Features (Notifications, Documents, Profiles)
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (
        type IN ('booking', 'reminder', 'message', 'system')
    ),
    read BOOLEAN DEFAULT false,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    category TEXT CHECK (
        category IN ('contract', 'invoice', 'id', 'other')
    ),
    status TEXT DEFAULT 'pending' CHECK (
        status IN ('pending', 'processing', 'analyzed', 'failed')
    ),
    analysis_result JSONB,
    extracted_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'moderator')),
    permissions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    company TEXT,
    country TEXT,
    language TEXT DEFAULT 'fr' CHECK (language IN ('en', 'fr', 'ar')),
    avatar_url TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    service_slug TEXT NOT NULL,
    reason TEXT NOT NULL,
    score FLOAT NOT NULL,
    shown BOOLEAN DEFAULT false,
    clicked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    metadata JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_invoices_type ON invoices(type);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
-- 7. Functions
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION generate_invoice_number(doc_type TEXT) RETURNS TEXT AS $$
DECLARE prefix TEXT;
year TEXT;
last_num INT;
new_num TEXT;
BEGIN year := to_char(current_date, 'YYYY');
IF doc_type = 'quote' THEN prefix := 'QT-' || year || '-';
ELSIF doc_type = 'invoice' THEN prefix := 'INV-' || year || '-';
ELSIF doc_type = 'credit_note' THEN prefix := 'CN-' || year || '-';
ELSE RAISE EXCEPTION 'Invalid document type';
END IF;
SELECT COALESCE(
        MAX(
            CAST(
                SUBSTRING(
                    number
                    FROM LENGTH(prefix) + 1
                ) AS INT
            )
        ),
        0
    ) INTO last_num
FROM invoices
WHERE number LIKE prefix || '%';
new_num := prefix || LPAD((last_num + 1)::TEXT, 4, '0');
RETURN new_num;
END;
$$ LANGUAGE plpgsql;
-- 8. Triggers
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE
UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_contacts_updated_at ON contacts;
CREATE TRIGGER update_contacts_updated_at BEFORE
UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at BEFORE
UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
CREATE TRIGGER update_invoices_updated_at BEFORE
UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at BEFORE
UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at BEFORE
UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE
UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- 9. Key Data Insertion 
-- 9a. Main Content
INSERT INTO site_settings (
        key,
        company_name,
        phone_primary,
        email_primary,
        address_paris_en,
        address_tunis_en
    )
VALUES (
        'main',
        'SYGMA CONSULT',
        '+33 7 52 03 47 86',
        'contact@sygma-consult.com',
        '6 rue Paul Verlaine, 93130 Noisy-le-Sec, Paris, France',
        'Les Berges du Lac II, 1053 Tunis, Tunisia'
    ) ON CONFLICT (key) DO NOTHING;
-- 9b. Secrets (Database Fallback)
INSERT INTO site_settings (key, value, description)
VALUES (
        'STRIPE_SECRET_KEY',
        'REPLACE_ME',
        'Stripe Secret Key'
    ),
    (
        'STRIPE_WEBHOOK_SECRET',
        'REPLACE_ME',
        'Stripe Webhook Secret'
    ),
    ('SMTP_HOST', 'smtp.hostinger.com', 'SMTP Host'),
    ('SMTP_PORT', '465', 'SMTP Port'),
    (
        'SMTP_USER',
        'contact@sygma-consult.com',
        'SMTP User'
    ),
    ('SMTP_PASSWORD', 'REPLACE_ME', 'SMTP Password'),
    (
        'GOOGLE_CLIENT_ID',
        'REPLACE_ME',
        'Google Client ID'
    ),
    (
        'GOOGLE_CLIENT_SECRET',
        'REPLACE_ME',
        'Google Client Secret'
    ) ON CONFLICT (key) DO NOTHING;
-- 10. RLS Policies (Basic Setup)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
-- Allow anonymous inserts for public forms
DROP POLICY IF EXISTS "Public bookings insert" ON bookings;
CREATE POLICY "Public bookings insert" ON bookings FOR
INSERT TO anon WITH CHECK (true);
DROP POLICY IF EXISTS "Public contacts insert" ON contacts;
CREATE POLICY "Public contacts insert" ON contacts FOR
INSERT TO anon WITH CHECK (true);
-- Allow everyone to read MAIN site settings ONLY (Protect Secrets)
DROP POLICY IF EXISTS "Public site settings read" ON site_settings;
CREATE POLICY "Public site settings read" ON site_settings FOR
SELECT TO anon,
    authenticated USING (key = 'main');
-- Allow authenticated users to view/edit their own data
DROP POLICY IF EXISTS "Users view own bookings" ON bookings;
CREATE POLICY "Users view own bookings" ON bookings FOR
SELECT TO authenticated USING (user_id = auth.uid()::text);
DROP POLICY IF EXISTS "Users view own notifications" ON notifications;
CREATE POLICY "Users view own notifications" ON notifications FOR
SELECT TO authenticated USING (user_id = auth.uid()::text);
DROP POLICY IF EXISTS "Users view own documents" ON documents;
CREATE POLICY "Users view own documents" ON documents FOR
SELECT TO authenticated USING (user_id = auth.uid()::text);
DROP POLICY IF EXISTS "Users view own profile" ON user_profiles;
CREATE POLICY "Users view own profile" ON user_profiles FOR
SELECT TO authenticated USING (user_id = auth.uid()::text);
-- Service Role (Admin) Full Access
DROP POLICY IF EXISTS "Admin full access bookings" ON bookings;
CREATE POLICY "Admin full access bookings" ON bookings TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Admin full access contacts" ON contacts;
CREATE POLICY "Admin full access contacts" ON contacts TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Admin full access clients" ON clients;
CREATE POLICY "Admin full access clients" ON clients TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Admin full access invoices" ON invoices;
CREATE POLICY "Admin full access invoices" ON invoices TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Admin full access settings" ON site_settings;
CREATE POLICY "Admin full access settings" ON site_settings TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Admin full access notifications" ON notifications;
CREATE POLICY "Admin full access notifications" ON notifications TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Admin full access documents" ON documents;
CREATE POLICY "Admin full access documents" ON documents TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Admin full access profiles" ON user_profiles;
CREATE POLICY "Admin full access profiles" ON user_profiles TO service_role USING (true) WITH CHECK (true);
-- Fix Invoice RLS for Authenticated users
DROP POLICY IF EXISTS "Authenticated all invoices" ON invoices;
CREATE POLICY "Authenticated all invoices" ON invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);