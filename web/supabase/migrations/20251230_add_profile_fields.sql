-- Migration to add professional fields to user_profiles
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS company_name TEXT,
    ADD COLUMN IF NOT EXISTS job_title TEXT,
    ADD COLUMN IF NOT EXISTS website TEXT;
-- Verify RLS policies allow update (usually they do for "own profile")
-- existing policies usually cover "update own profile"