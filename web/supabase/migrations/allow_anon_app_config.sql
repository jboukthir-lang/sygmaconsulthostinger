-- Allow ANON updates - IDEMPOTENT SCRIPT
-- Safe to run multiple times.
-- 1. Drop existing policies to prevent "already exists" errors
DROP POLICY IF EXISTS "app_config_update_anon" ON public.app_config;
DROP POLICY IF EXISTS "app_config_insert_anon" ON public.app_config;
DROP POLICY IF EXISTS "app_config_insert_auth" ON public.app_config;
DROP POLICY IF EXISTS "app_config_update_auth" ON public.app_config;
-- 2. CREATE permissive policies for ANON (Firebase Users)
CREATE POLICY "app_config_update_anon" ON public.app_config FOR
UPDATE USING (true);
CREATE POLICY "app_config_insert_anon" ON public.app_config FOR
INSERT WITH CHECK (true);
-- 3. Grant permissions to anon role
GRANT INSERT,
    UPDATE ON public.app_config TO anon;
SELECT 'Anon Access Successfully Enabled' as status;