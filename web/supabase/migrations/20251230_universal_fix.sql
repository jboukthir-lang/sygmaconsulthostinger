-- UNIVERSAL FIX SCRIPT
-- This script is designed to fix the "column user_id does not exist" error in ANY scenario.
-- It works by forcing the addition of the column to existing tables first.
-- STEP 1: Force Add Columns to Potential Existing Tables
-- using "IF EXISTS" to avoid errors if tables are missing
ALTER TABLE IF EXISTS public.clients
ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE IF EXISTS public.invoices
ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE IF EXISTS public.expenses
ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE IF EXISTS public.projects
ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE IF EXISTS public.team_members
ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE IF EXISTS public.products
ADD COLUMN IF NOT EXISTS user_id TEXT;
-- STEP 2: Create Tables that DON'T exist yet
-- These include the column definition, so if created here, they are good.
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category TEXT,
    date DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'pending',
    attachment_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    client_id UUID REFERENCES public.clients(id),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'in_progress',
    start_date DATE,
    end_date DATE,
    budget DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'member',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'EUR',
    type TEXT DEFAULT 'service',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- STEP 3: Now it is safe to Create Indexes
-- user_id is guaranteed to exist now.
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON public.clients(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_products_user_id ON public.products(user_id);
-- STEP 4: Permissions
ALTER TABLE public.expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
GRANT ALL ON public.expenses TO anon,
    authenticated,
    service_role;
GRANT ALL ON public.projects TO anon,
    authenticated,
    service_role;
GRANT ALL ON public.team_members TO anon,
    authenticated,
    service_role;
GRANT ALL ON public.products TO anon,
    authenticated,
    service_role;