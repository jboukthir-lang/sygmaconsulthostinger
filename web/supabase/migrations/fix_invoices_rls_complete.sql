-- Complete Fix for Invoices RLS
-- This ensures all authenticated users can create/manage invoices
-- 1. Disable RLS temporarily to clean up
ALTER TABLE invoices DISABLE ROW LEVEL SECURITY;
-- 2. Drop all existing policies
DROP POLICY IF EXISTS "Admins can manage invoices" ON invoices;
DROP POLICY IF EXISTS "Allow authenticated users to manage invoices" ON invoices;
DROP POLICY IF EXISTS "Service role can manage invoices" ON invoices;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON invoices;
-- 3. Re-enable RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
-- 4. Create simple, permissive policy for authenticated users
CREATE POLICY "authenticated_all_invoices" ON invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- 5. Grant necessary permissions
GRANT ALL ON invoices TO authenticated;
GRANT USAGE,
    SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;