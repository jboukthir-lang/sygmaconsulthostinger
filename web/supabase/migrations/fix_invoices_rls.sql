-- Fix RLS Policy for Invoices Table
-- Allow authenticated users full access
-- Drop existing policy
DROP POLICY IF EXISTS "Admins can manage invoices" ON invoices;
-- Create new policy that works with current auth
CREATE POLICY "Allow authenticated users to manage invoices" ON invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- Also allow service role (for API calls)
DROP POLICY IF EXISTS "Service role can manage invoices" ON invoices;
CREATE POLICY "Service role can manage invoices" ON invoices FOR ALL TO service_role USING (true) WITH CHECK (true);