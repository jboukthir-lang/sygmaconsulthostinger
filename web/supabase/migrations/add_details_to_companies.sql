-- Add missing columns to companies table to support Onboarding
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id),
    ADD COLUMN IF NOT EXISTS siret TEXT,
    ADD COLUMN IF NOT EXISTS tva_number TEXT,
    ADD COLUMN IF NOT EXISTS legal_form TEXT,
    ADD COLUMN IF NOT EXISTS address TEXT,
    ADD COLUMN IF NOT EXISTS city TEXT,
    ADD COLUMN IF NOT EXISTS zip_code TEXT,
    ADD COLUMN IF NOT EXISTS country TEXT;
-- Create index for owner_id
CREATE INDEX IF NOT EXISTS idx_companies_owner_id ON public.companies(owner_id);
-- Update RLS to allow owners to manage their company
DROP POLICY IF EXISTS "Owners can manage their company" ON public.companies;
CREATE POLICY "Owners can manage their company" ON public.companies USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
-- Allow authenticated users to insert (for onboarding)
-- The API uses supabaseAdmin so it bypasses RLS, but for client-side usage:
DROP POLICY IF EXISTS "Authenticated can insert company" ON public.companies;
CREATE POLICY "Authenticated can insert company" ON public.companies FOR
INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);