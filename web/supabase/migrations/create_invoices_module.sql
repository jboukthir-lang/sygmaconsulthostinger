-- =========================================
-- Invoicing Module Schema (Fixed RLS)
-- Supports: Devis (Quotes), Factures (Invoices), Avoirs (Credit Notes)
-- =========================================
-- 1. Create Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Document Details
    type TEXT NOT NULL CHECK (type IN ('quote', 'invoice', 'credit_note')),
    status TEXT NOT NULL CHECK (
        status IN (
            'draft',
            'sent',
            'accepted',
            'rejected',
            'paid',
            'overdue',
            'cancelled'
        )
    ),
    number TEXT NOT NULL,
    -- Format: INV-2024-001 or QT-2024-001
    -- Client Details (Snapshot at time of invoice)
    client_name TEXT NOT NULL,
    client_email TEXT,
    client_address TEXT,
    client_siret TEXT,
    -- Optional: French Business ID for B2B
    -- Financials
    currency TEXT DEFAULT 'EUR',
    items JSONB NOT NULL DEFAULT '[]',
    -- [{ desc, qty, price, tax }]
    total_excl_tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_incl_tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
    -- Dates
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,
    -- Required for Invoices
    -- Meta
    notes TEXT,
    footer TEXT,
    -- For "Bon pour accord" or bank details
    -- Constraints
    CONSTRAINT invoices_number_unique UNIQUE (number)
);
-- 2. Indexes for fast search
CREATE INDEX IF NOT EXISTS idx_invoices_type ON invoices(type);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices(client_email);
-- 3. RLS Policies
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
-- Allow Authenticated Users (Admins) to manage invoices
DROP POLICY IF EXISTS "Admins can manage invoices" ON invoices;
CREATE POLICY "Admins can manage invoices" ON invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- 4. Function to Auto-Generate Invoice Numbers
CREATE OR REPLACE FUNCTION generate_invoice_number(doc_type TEXT) RETURNS TEXT AS $$
DECLARE prefix TEXT;
year TEXT;
last_num INT;
new_num TEXT;
BEGIN year := to_char(current_date, 'YYYY');
IF doc_type = 'quote' THEN prefix := 'QT-' || year || '-';
ELSIF doc_type = 'invoice' THEN prefix := 'INV-' || year || '-';
ELSIF doc_type = 'credit_note' THEN prefix := 'CN-' || year || '-';
ELSE RAISE EXCEPTION 'Invalid document type';
END IF;
-- Find the last number for this year and type
SELECT COALESCE(
        MAX(
            CAST(
                SUBSTRING(
                    number
                    FROM LENGTH(prefix) + 1
                ) AS INT
            )
        ),
        0
    ) INTO last_num
FROM invoices
WHERE number LIKE prefix || '%';
-- Increment
new_num := prefix || LPAD((last_num + 1)::TEXT, 4, '0');
RETURN new_num;
END;
$$ LANGUAGE plpgsql;
-- 5. Add company legal info to site_settings (if not exists)
-- This will store SIRET, TVA, RCS for invoices
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'site_settings'
        AND column_name = 'company_siret'
) THEN
ALTER TABLE site_settings
ADD COLUMN company_siret TEXT;
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'site_settings'
        AND column_name = 'company_tva'
) THEN
ALTER TABLE site_settings
ADD COLUMN company_tva TEXT;
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'site_settings'
        AND column_name = 'company_rcs'
) THEN
ALTER TABLE site_settings
ADD COLUMN company_rcs TEXT;
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'site_settings'
        AND column_name = 'company_capital'
) THEN
ALTER TABLE site_settings
ADD COLUMN company_capital TEXT;
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'site_settings'
        AND column_name = 'company_legal_form'
) THEN
ALTER TABLE site_settings
ADD COLUMN company_legal_form TEXT DEFAULT 'SASU';
END IF;
END $$;