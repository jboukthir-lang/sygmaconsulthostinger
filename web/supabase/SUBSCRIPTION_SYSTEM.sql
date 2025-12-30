-- Subscription Plans System
-- Manages subscription tiers and limits
-- Subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    price_monthly DECIMAL(10, 2) NOT NULL DEFAULT 0,
    price_yearly DECIMAL(10, 2) NOT NULL DEFAULT 0,
    description TEXT,
    max_clients INTEGER,
    max_invoices INTEGER,
    max_products INTEGER,
    max_users INTEGER DEFAULT 1,
    custom_branding BOOLEAN DEFAULT false,
    export_accounting BOOLEAN DEFAULT false,
    api_access BOOLEAN DEFAULT false,
    priority_support BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Insert default plans
INSERT INTO subscription_plans (
        name,
        display_name,
        price_monthly,
        price_yearly,
        description,
        max_clients,
        max_invoices,
        max_products,
        max_users,
        custom_branding,
        export_accounting,
        api_access,
        priority_support,
        sort_order
    )
VALUES (
        'free',
        'Gratuit',
        0,
        0,
        'Parfait pour les freelances qui débutent',
        3,
        NULL,
        10,
        1,
        false,
        false,
        false,
        false,
        1
    ),
    (
        'start',
        'Start',
        19,
        228,
        'Pour les petites entreprises en croissance',
        NULL,
        NULL,
        NULL,
        1,
        true,
        true,
        false,
        true,
        2
    ),
    (
        'pro',
        'Pro',
        49,
        588,
        'Fonctionnalités avancées pour les agences',
        NULL,
        NULL,
        NULL,
        5,
        true,
        true,
        true,
        true,
        3
    ),
    (
        'enterprise',
        'Enterprise',
        0,
        0,
        'Solution sur mesure pour les grandes structures',
        NULL,
        NULL,
        NULL,
        NULL,
        true,
        true,
        true,
        true,
        4
    ) ON CONFLICT (name) DO NOTHING;
-- Enable public read access for subscription plans
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view subscription plans" ON subscription_plans FOR
SELECT USING (true);
-- Add subscription columns to companies if not exists
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'companies'
        AND column_name = 'subscription_plan'
) THEN
ALTER TABLE companies
ADD COLUMN subscription_plan TEXT DEFAULT 'free';
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'companies'
        AND column_name = 'subscription_status'
) THEN
ALTER TABLE companies
ADD COLUMN subscription_status TEXT DEFAULT 'active';
END IF;
END $$;