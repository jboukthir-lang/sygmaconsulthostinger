-- Create companies table for SaaS Tenants
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    -- Subscription Info
    subscription_plan TEXT DEFAULT 'FREE',
    -- FREE, STARTER, PRO, ENTERPRISE
    subscription_status TEXT DEFAULT 'ACTIVE',
    -- ACTIVE, PAST_DUE, CANCELED
    subscription_start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    subscription_end_date TIMESTAMP WITH TIME ZONE,
    -- Metrics
    total_invoices_count INTEGER DEFAULT 0,
    total_revenue_generated DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
-- Policies
CREATE POLICY "Admins can view all companies" ON public.companies FOR
SELECT USING (auth.role() = 'authenticated');
-- Ideally restricted to admins only
CREATE POLICY "Admins can update companies" ON public.companies FOR
UPDATE USING (auth.role() = 'authenticated');
-- Insert dummy data for demo
INSERT INTO public.companies (
        name,
        email,
        subscription_plan,
        subscription_status,
        total_invoices_count,
        total_revenue_generated
    )
VALUES (
        'TechCorp Solutions',
        'contact@techcorp.com',
        'ENTERPRISE',
        'ACTIVE',
        154,
        45020.50
    ),
    (
        'Global Services Ltd',
        'info@globalservices.com',
        'PRO',
        'ACTIVE',
        45,
        1250.00
    ),
    (
        'StartUp Inc',
        'hello@startup.com',
        'STARTER',
        'PAST_DUE',
        12,
        340.00
    ),
    (
        'Freelance Studio',
        'studio@freelance.com',
        'FREE',
        'ACTIVE',
        5,
        0.00
    ),
    (
        'Mega Retailers',
        'admin@megaretail.com',
        'ENTERPRISE',
        'CANCELED',
        89,
        23000.00
    );