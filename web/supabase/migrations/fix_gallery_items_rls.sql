-- Fix RLS for gallery_items table
-- Allow authenticated and anon users to manage gallery items
-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated to insert gallery" ON gallery_items;
DROP POLICY IF EXISTS "Allow authenticated to update gallery" ON gallery_items;
DROP POLICY IF EXISTS "Allow authenticated to delete gallery" ON gallery_items;
DROP POLICY IF EXISTS "Allow public to view gallery" ON gallery_items;
DROP POLICY IF EXISTS "Allow anon to insert gallery" ON gallery_items;
-- Enable RLS
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
-- Allow public to view
CREATE POLICY "Allow public to view gallery" ON gallery_items FOR
SELECT TO public USING (true);
-- Allow authenticated to insert
CREATE POLICY "Allow authenticated to insert gallery" ON gallery_items FOR
INSERT TO authenticated WITH CHECK (true);
-- Allow authenticated to update
CREATE POLICY "Allow authenticated to update gallery" ON gallery_items FOR
UPDATE TO authenticated USING (true) WITH CHECK (true);
-- Allow authenticated to delete
CREATE POLICY "Allow authenticated to delete gallery" ON gallery_items FOR DELETE TO authenticated USING (true);
-- Also allow anon for testing (temporary)
CREATE POLICY "Allow anon to insert gallery" ON gallery_items FOR
INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon to update gallery" ON gallery_items FOR
UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon to delete gallery" ON gallery_items FOR DELETE TO anon USING (true);
-- Grant permissions
GRANT ALL ON gallery_items TO authenticated;
GRANT ALL ON gallery_items TO anon;