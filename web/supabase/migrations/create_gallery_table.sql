-- =========================================
-- إنشاء جدول الصور | Create Gallery Table
-- =========================================
-- 1. Create table
CREATE TABLE IF NOT EXISTS gallery_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title_en TEXT,
    title_fr TEXT,
    title_ar TEXT,
    category TEXT DEFAULT 'general',
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
-- 2. Create indexes
CREATE INDEX IF NOT EXISTS idx_gallery_active ON gallery_items(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery_items(category);
CREATE INDEX IF NOT EXISTS idx_gallery_order ON gallery_items(display_order);
-- 3. Automatic timestamp update
CREATE OR REPLACE FUNCTION update_gallery_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = TIMEZONE('utc', NOW());
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trigger_update_gallery_updated_at ON gallery_items;
CREATE TRIGGER trigger_update_gallery_updated_at BEFORE
UPDATE ON gallery_items FOR EACH ROW EXECUTE FUNCTION update_gallery_updated_at();
-- 4. Row Level Security (RLS)
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
-- Allow everyone to read active items
DROP POLICY IF EXISTS "Allow read active gallery items" ON gallery_items;
CREATE POLICY "Allow read active gallery items" ON gallery_items FOR
SELECT USING (is_active = true);
-- Allow admins to do everything
DROP POLICY IF EXISTS "Admins can manage gallery" ON gallery_items;
CREATE POLICY "Admins can manage gallery" ON gallery_items FOR ALL USING (auth.role() = 'authenticated');
-- 5. Storage Bucket Setup
-- Insert 'gallery' bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true) ON CONFLICT (id) DO NOTHING;
-- RLS for Storage - Renamed policies to avoid conflicts
DROP POLICY IF EXISTS "Gallery Public Access" ON storage.objects;
CREATE POLICY "Gallery Public Access" ON storage.objects FOR
SELECT USING (bucket_id = 'gallery');
DROP POLICY IF EXISTS "Gallery Auth Upload" ON storage.objects;
CREATE POLICY "Gallery Auth Upload" ON storage.objects FOR
INSERT WITH CHECK (
        bucket_id = 'gallery'
        AND auth.role() = 'authenticated'
    );
DROP POLICY IF EXISTS "Gallery Auth Update" ON storage.objects;
CREATE POLICY "Gallery Auth Update" ON storage.objects FOR
UPDATE USING (
        bucket_id = 'gallery'
        AND auth.role() = 'authenticated'
    );
DROP POLICY IF EXISTS "Gallery Auth Delete" ON storage.objects;
CREATE POLICY "Gallery Auth Delete" ON storage.objects FOR DELETE USING (
    bucket_id = 'gallery'
    AND auth.role() = 'authenticated'
);
-- 6. Comments
COMMENT ON TABLE gallery_items IS 'Table for landing page gallery images';