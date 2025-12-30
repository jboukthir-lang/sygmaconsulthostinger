-- Ultra-Simplified Fix for "user_id does not exist"
-- Run this script to force the addition of the missing columns
-- 1. Force add user_id to clients (ignoring if table missing, but throwing error if fails)
ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS user_id TEXT;
-- 2. Force add user_id to invoices
ALTER TABLE public.invoices
ADD COLUMN IF NOT EXISTS user_id TEXT;
-- 3. Create Expenses Table (Safe Check)
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
-- 4. Create Projects Table (Safe Check)
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
-- 5. Create Team Members Table (Safe Check)
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
-- 6. Create Products Table (Safe Check)
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
-- 7. Create Indexes (Only run these AFTER columns are definitely added)
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON public.clients(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_products_user_id ON public.products(user_id);
-- 8. Disable RLS
ALTER TABLE public.expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
-- 9. Grant Permissions
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