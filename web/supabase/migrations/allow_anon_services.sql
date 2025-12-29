-- Grants for services table
GRANT ALL ON TABLE public.services TO anon;
GRANT ALL ON TABLE public.services TO service_role;
GRANT ALL ON TABLE public.services TO authenticated;
-- Grants for hero_images table (just in case, as we saw it used earlier)
GRANT ALL ON TABLE public.hero_images TO anon;
GRANT ALL ON TABLE public.hero_images TO service_role;
GRANT ALL ON TABLE public.hero_images TO authenticated;
-- Ensure sequences are accessible if any
GRANT USAGE,
    SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;