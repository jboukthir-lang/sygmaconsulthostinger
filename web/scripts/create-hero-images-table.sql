-- Create hero_images table for managing homepage hero image
CREATE TABLE IF NOT EXISTS hero_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  uploaded_by TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_hero_images_active ON hero_images(is_active);

-- Add RLS policies
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read hero images
CREATE POLICY "Anyone can view active hero images"
  ON hero_images
  FOR SELECT
  USING (is_active = true);

-- Only admins can insert/update/delete hero images
CREATE POLICY "Admins can manage hero images"
  ON hero_images
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()::text
    )
  );

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_hero_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER hero_images_updated_at
  BEFORE UPDATE ON hero_images
  FOR EACH ROW
  EXECUTE FUNCTION update_hero_images_updated_at();

-- Comment
COMMENT ON TABLE hero_images IS 'Stores hero images for the homepage, managed by admins';
