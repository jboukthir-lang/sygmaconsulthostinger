-- Create storage bucket for public files if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('public', 'public', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for the public bucket
-- Allow anyone to read files
DROP POLICY IF EXISTS "Public files are accessible to everyone" ON storage.objects;
CREATE POLICY "Public files are accessible to everyone"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'public');

-- Allow authenticated users to upload files
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
CREATE POLICY "Authenticated users can upload files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'public' AND auth.role() = 'authenticated');

-- Allow admins to delete files
DROP POLICY IF EXISTS "Admins can delete files" ON storage.objects;
CREATE POLICY "Admins can delete files"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'public' AND
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()::text
    )
  );

-- Allow users to update their own files
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
CREATE POLICY "Users can update their own files"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'public' AND auth.uid() = owner)
  WITH CHECK (bucket_id = 'public' AND auth.uid() = owner);
