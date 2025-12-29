-- Fix Storage RLS for gallery uploads
-- Allow authenticated users to upload to gallery bucket
-- Create policy for INSERT (upload)
DROP POLICY IF EXISTS "Allow authenticated uploads to gallery" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to gallery" ON storage.objects FOR
INSERT TO authenticated WITH CHECK (bucket_id = 'gallery');
-- Create policy for SELECT (view)
DROP POLICY IF EXISTS "Allow public to view gallery" ON storage.objects;
CREATE POLICY "Allow public to view gallery" ON storage.objects FOR
SELECT TO public USING (bucket_id = 'gallery');
-- Create policy for UPDATE
DROP POLICY IF EXISTS "Allow authenticated to update gallery" ON storage.objects;
CREATE POLICY "Allow authenticated to update gallery" ON storage.objects FOR
UPDATE TO authenticated USING (bucket_id = 'gallery');
-- Create policy for DELETE
DROP POLICY IF EXISTS "Allow authenticated to delete gallery" ON storage.objects;
CREATE POLICY "Allow authenticated to delete gallery" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'gallery');
-- Also allow anon for uploads (temporary for testing)
DROP POLICY IF EXISTS "Allow anon uploads to gallery" ON storage.objects;
CREATE POLICY "Allow anon uploads to gallery" ON storage.objects FOR
INSERT TO anon WITH CHECK (bucket_id = 'gallery');