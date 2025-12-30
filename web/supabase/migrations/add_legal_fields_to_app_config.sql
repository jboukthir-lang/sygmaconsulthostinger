-- Add legal information columns to app_config table
ALTER TABLE public.app_config
ADD COLUMN IF NOT EXISTS siret TEXT,
    ADD COLUMN IF NOT EXISTS tva_number TEXT,
    ADD COLUMN IF NOT EXISTS legal_form TEXT DEFAULT 'SAS',
    ADD COLUMN IF NOT EXISTS capital TEXT,
    ADD COLUMN IF NOT EXISTS rcs_city TEXT;
COMMENT ON COLUMN public.app_config.siret IS 'Numéro SIRET';
COMMENT ON COLUMN public.app_config.tva_number IS 'Numéro de TVA Intracommunautaire';