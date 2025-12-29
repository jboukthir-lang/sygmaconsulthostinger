-- Disable RLS completely for invoices table (for testing)
ALTER TABLE invoices DISABLE ROW LEVEL SECURITY;
-- Drop all policies
DROP POLICY IF EXISTS "Admins can manage invoices" ON invoices;
DROP POLICY IF EXISTS "Allow authenticated users to manage invoices" ON invoices;
DROP POLICY IF EXISTS "Service role can manage invoices" ON invoices;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON invoices;
DROP POLICY IF EXISTS "authenticated_all_invoices" ON invoices;
-- Grant full access
GRANT ALL ON invoices TO anon;
GRANT ALL ON invoices TO authenticated;
GRANT USAGE,
    SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE,
    SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;