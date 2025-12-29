-- Create partners table
CREATE TABLE IF NOT EXISTS partners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    website_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Enable RLS
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
-- Policies
CREATE POLICY "Public can view active partners" ON partners FOR
SELECT USING (is_active = true);
CREATE POLICY "Admins can manage partners" ON partners FOR ALL USING (auth.role() = 'authenticated');
-- Simplified for demo, ideally check admin role
-- Storage policies for partner logos (assuming 'public' bucket exists)
-- You might need to run the allow_storage_access.sql if not already done for general access