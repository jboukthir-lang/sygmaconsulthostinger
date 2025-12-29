-- =========================================
-- Update Contacts Table for CRM Pipeline
-- =========================================
-- 1. Relax the status check constraint to allow more CRM stages
ALTER TABLE contacts DROP CONSTRAINT IF EXISTS contacts_status_check;
ALTER TABLE contacts
ADD CONSTRAINT contacts_status_check CHECK (
        status IN (
            'new',
            'read',
            'replied',
            'contacted',
            'proposal',
            'negotiation',
            'won',
            'lost'
        )
    );
-- 2. Add useful columns for CRM if they don't exist
ALTER TABLE contacts
ADD COLUMN IF NOT EXISTS company_name TEXT,
    ADD COLUMN IF NOT EXISTS phone TEXT,
    ADD COLUMN IF NOT EXISTS estimated_value DECIMAL(10, 2),
    ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high'));
-- 3. Comments
COMMENT ON COLUMN contacts.status IS 'CRM Stage: new, read, replied, contacted, proposal, negotiation, won, lost';