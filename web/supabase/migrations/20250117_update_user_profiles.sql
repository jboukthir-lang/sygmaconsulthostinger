-- ========================================
-- تحديث جدول user_profiles لإضافة الحقول الجديدة
-- Update user_profiles table to add new fields
-- ========================================

-- إضافة حقول جديدة لجدول user_profiles
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS city VARCHAR(200),
ADD COLUMN IF NOT EXISTS address VARCHAR(500),
ADD COLUMN IF NOT EXISTS photo_url VARCHAR(500);

-- إنشاء bucket للصور في Supabase Storage (إذا لم يكن موجوداً)
-- Create storage bucket for images (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'public',
  'public',
  true,
  2097152, -- 2MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- السماح للجميع بقراءة الملفات من bucket public
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'public');

-- السماح للمستخدمين المصادقين برفع الملفات
DROP POLICY IF EXISTS "Allow authenticated users to upload" ON storage.objects;
CREATE POLICY "Allow authenticated users to upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'public');

-- السماح للمستخدمين بتحديث ملفاتهم الخاصة
DROP POLICY IF EXISTS "Allow users to update own files" ON storage.objects;
CREATE POLICY "Allow users to update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'public' AND owner = auth.uid())
WITH CHECK (bucket_id = 'public' AND owner = auth.uid());

-- السماح للمستخدمين بحذف ملفاتهم الخاصة
DROP POLICY IF EXISTS "Allow users to delete own files" ON storage.objects;
CREATE POLICY "Allow users to delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'public' AND owner = auth.uid());

-- ========================================
-- ✅ تم! الآن يمكن للمستخدمين رفع الصور
-- ✅ Done! Users can now upload images
-- ========================================
