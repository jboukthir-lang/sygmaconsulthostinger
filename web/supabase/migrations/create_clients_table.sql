-- Create Clients Table for Invoice System
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Client Information
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'France',
    -- Business Information
    siret TEXT,
    tva_number TEXT,
    company_type TEXT,
    -- SARL, SAS, etc.
    -- Additional
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    -- Constraints
    CONSTRAINT clients_email_unique UNIQUE (email)
);
-- Indexes
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_active ON clients(is_active);
-- RLS (Disabled for now, matching invoices)
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
-- Permissions
GRANT ALL ON clients TO anon;
GRANT ALL ON clients TO authenticated;
-- Add client_id to invoices table
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES clients(id);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);