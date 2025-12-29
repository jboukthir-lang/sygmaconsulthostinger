-- Enable RLS on tables (good practice, ensuring we control via policy)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;
-- 1. Services Table Policies
DROP POLICY IF EXISTS "Enable all access for anon" ON public.services;
CREATE POLICY "Enable all access for anon" ON public.services FOR ALL TO anon,
service_role,
authenticated USING (true) WITH CHECK (true);
-- 2. Hero Images Table Policies
DROP POLICY IF EXISTS "Enable all access for anon" ON public.hero_images;
CREATE POLICY "Enable all access for anon" ON public.hero_images FOR ALL TO anon,
service_role,
authenticated USING (true) WITH CHECK (true);
-- 3. App Config Table Policies
DROP POLICY IF EXISTS "Enable all access for anon" ON public.app_config;
CREATE POLICY "Enable all access for anon" ON public.app_config FOR ALL TO anon,
service_role,
authenticated USING (true) WITH CHECK (true);
-- Grant simple permissions again just to be sure
GRANT ALL ON TABLE public.services TO anon;
GRANT ALL ON TABLE public.hero_images TO anon;
GRANT ALL ON TABLE public.app_config TO anon;
GRANT USAGE,
    SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;