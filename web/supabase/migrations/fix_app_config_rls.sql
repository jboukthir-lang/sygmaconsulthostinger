-- Allow INSERT for authenticated users on app_config
-- This is required for upsert operations to work if the row doesn't exist yet,
-- or if RLS checks INSERT permissions even for updates in some upsert scenarios.
CREATE POLICY "App config insertable by authenticated" ON public.app_config FOR
INSERT WITH CHECK (auth.role() = 'authenticated');
GRANT INSERT ON public.app_config TO authenticated;
-- Also verify UPDATE grant just in case
GRANT UPDATE ON public.app_config TO authenticated;