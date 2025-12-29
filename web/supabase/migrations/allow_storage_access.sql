-- Drop existing policies to prevent "already exists" errors
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow Anon Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow Anon Updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow Anon Deletes" ON storage.objects;
DROP POLICY IF EXISTS "Allow Anon Select" ON storage.objects;
-- Create the 'public' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('public', 'public', true) ON CONFLICT (id) DO NOTHING;
-- Grant usage on storage schema
GRANT USAGE ON SCHEMA storage TO anon,
    authenticated,
    service_role;
-- Grant permissions for all buckets
GRANT ALL ON TABLE storage.buckets TO anon,
    authenticated,
    service_role;
GRANT ALL ON TABLE storage.objects TO anon,
    authenticated,
    service_role;
-- Allow public access to all files in the 'public' bucket
CREATE POLICY "Public Access" ON storage.objects FOR
SELECT USING (bucket_id = 'public');
-- Allow anonymous uploads/updates/deletes to 'public' bucket
CREATE POLICY "Allow Anon Uploads" ON storage.objects FOR
INSERT WITH CHECK (bucket_id = 'public');
CREATE POLICY "Allow Anon Updates" ON storage.objects FOR
UPDATE USING (bucket_id = 'public');
CREATE POLICY "Allow Anon Deletes" ON storage.objects FOR DELETE USING (bucket_id = 'public');