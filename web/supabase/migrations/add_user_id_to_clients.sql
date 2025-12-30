-- Migration to add user_id to clients table
ALTER TABLE clients
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON clients(user_id);
-- Enable RLS (optional, but good practice if not disabled)
-- ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
-- Allow users to see their own clients if RLS is enabled
-- CREATE POLICY "Users can manage their own clients" ON clients
--     FOR ALL USING (auth.uid() = user_id);