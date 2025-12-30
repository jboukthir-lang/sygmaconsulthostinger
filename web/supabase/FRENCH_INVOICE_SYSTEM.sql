-- French Invoice System Schema
-- Compliant with French legal requirements
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    zip_code TEXT,
    country TEXT DEFAULT 'France',
    siret TEXT,
    tva_number TEXT,
    legal_form TEXT DEFAULT 'SAS',
    logo_url TEXT,
    subscription_plan TEXT DEFAULT 'free',
    subscription_status TEXT DEFAULT 'active',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Clients table
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'France',
    siret TEXT,
    tva_number TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    unit_price DECIMAL(10, 2) NOT NULL,
    vat_rate DECIMAL(5, 2) DEFAULT 20.0,
    unit TEXT DEFAULT 'unité',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE
    SET NULL,
        number TEXT NOT NULL,
        status TEXT DEFAULT 'draft' CHECK (
            status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')
        ),
        issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
        due_date DATE,
        notes TEXT,
        subtotal DECIMAL(10, 2) DEFAULT 0,
        tax_total DECIMAL(10, 2) DEFAULT 0,
        total DECIMAL(10, 2) DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(company_id, number)
);
-- Invoice items table
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity DECIMAL(10, 2) DEFAULT 1,
    unit_price DECIMAL(10, 2) DEFAULT 0,
    vat_rate DECIMAL(5, 2) DEFAULT 20.0,
    total DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
-- RLS Policies for companies
CREATE POLICY "Users can view own company" ON companies FOR
SELECT USING (owner_id = auth.uid()::text);
CREATE POLICY "Users can update own company" ON companies FOR
UPDATE USING (owner_id = auth.uid()::text);
CREATE POLICY "Users can insert own company" ON companies FOR
INSERT WITH CHECK (owner_id = auth.uid()::text);
-- RLS Policies for clients
CREATE POLICY "Users can view own clients" ON clients FOR
SELECT USING (
        company_id IN (
            SELECT id
            FROM companies
            WHERE owner_id = auth.uid()::text
        )
    );
CREATE POLICY "Users can manage own clients" ON clients FOR ALL USING (
    company_id IN (
        SELECT id
        FROM companies
        WHERE owner_id = auth.uid()::text
    )
);
-- RLS Policies for products
CREATE POLICY "Users can view own products" ON products FOR
SELECT USING (
        company_id IN (
            SELECT id
            FROM companies
            WHERE owner_id = auth.uid()::text
        )
    );
CREATE POLICY "Users can manage own products" ON products FOR ALL USING (
    company_id IN (
        SELECT id
        FROM companies
        WHERE owner_id = auth.uid()::text
    )
);
-- RLS Policies for invoices
CREATE POLICY "Users can view own invoices" ON invoices FOR
SELECT USING (
        company_id IN (
            SELECT id
            FROM companies
            WHERE owner_id = auth.uid()::text
        )
    );
CREATE POLICY "Users can manage own invoices" ON invoices FOR ALL USING (
    company_id IN (
        SELECT id
        FROM companies
        WHERE owner_id = auth.uid()::text
    )
);
-- RLS Policies for invoice_items
CREATE POLICY "Users can view own invoice items" ON invoice_items FOR
SELECT USING (
        invoice_id IN (
            SELECT id
            FROM invoices
            WHERE company_id IN (
                    SELECT id
                    FROM companies
                    WHERE owner_id = auth.uid()::text
                )
        )
    );
CREATE POLICY "Users can manage own invoice items" ON invoice_items FOR ALL USING (
    invoice_id IN (
        SELECT id
        FROM invoices
        WHERE company_id IN (
                SELECT id
                FROM companies
                WHERE owner_id = auth.uid()::text
            )
    )
);