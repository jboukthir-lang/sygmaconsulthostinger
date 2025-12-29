-- Add invoice-related fields to site_settings
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS invoice_footer TEXT;
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS invoice_payment_terms TEXT DEFAULT '30 jours';
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS invoice_bank_details TEXT;