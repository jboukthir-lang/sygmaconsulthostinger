-- DATA INTEGRITY VERIFICATION
-- Ensure the 'main' record exists so upserts are mostly UPDATEs
INSERT INTO public.app_config (key)
VALUES ('main') ON CONFLICT (key) DO NOTHING;
-- RLS POLICY RESET
-- First, disable RLS to clear any weird state (optional, but good for reset)
ALTER TABLE public.app_config DISABLE ROW LEVEL SECURITY;
-- Drop ALL existing policies to ensure no conflicts or leftovers
DROP POLICY IF EXISTS "App config readable by all" ON public.app_config;
DROP POLICY IF EXISTS "App config updatable by authenticated" ON public.app_config;
DROP POLICY IF EXISTS "App config insertable by authenticated" ON public.app_config;
DROP POLICY IF EXISTS "Allow public read access" ON public.app_config;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.app_config;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.app_config;
-- Re-enable RLS
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;
-- RECREATE POLICIES
-- 1. READ: Allow everyone (anon and authenticated) to read
CREATE POLICY "app_config_read_all" ON public.app_config FOR
SELECT USING (true);
-- 2. INSERT: Allow authenticated users to insert (required for upsert to work on new rows)
CREATE POLICY "app_config_insert_auth" ON public.app_config FOR
INSERT WITH CHECK (auth.role() = 'authenticated');
-- 3. UPDATE: Allow authenticated users to update
CREATE POLICY "app_config_update_auth" ON public.app_config FOR
UPDATE USING (auth.role() = 'authenticated');
-- GRANT PERMISSIONS
GRANT SELECT ON public.app_config TO anon,
    authenticated;
GRANT INSERT,
    UPDATE ON public.app_config TO authenticated;
-- Confirm completion
SELECT 'RLS Policies Reset Successfully' as status;