-- Migration to add user_id to invoices table
ALTER TABLE invoices
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
-- Optional: Enable RLS Policy for user
-- CREATE POLICY "Users can manage their own invoices" ON invoices
--     FOR ALL USING (auth.uid() = user_id);