-- ========================================
-- إنشاء جداول التقويم والأوقات المتاحة
-- Create calendar and availability tables
-- ========================================

-- جدول الأوقات المتاحة
CREATE TABLE IF NOT EXISTS time_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  slot_duration INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- جدول التواريخ المحجوبة
CREATE TABLE IF NOT EXISTS blocked_dates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- إضافة فهارس
CREATE INDEX IF NOT EXISTS idx_time_slots_day ON time_slots(day_of_week);
CREATE INDEX IF NOT EXISTS idx_time_slots_available ON time_slots(is_available);
CREATE INDEX IF NOT EXISTS idx_blocked_dates_date ON blocked_dates(date);

-- Trigger لتحديث updated_at تلقائياً
DROP TRIGGER IF EXISTS update_time_slots_updated_at ON time_slots;
CREATE TRIGGER update_time_slots_updated_at
BEFORE UPDATE ON time_slots
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blocked_dates_updated_at ON blocked_dates;
CREATE TRIGGER update_blocked_dates_updated_at
BEFORE UPDATE ON blocked_dates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- تفعيل RLS
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

-- حذف الـ policies القديمة
DROP POLICY IF EXISTS "Allow public read access to time_slots" ON time_slots;
DROP POLICY IF EXISTS "Allow admin full access to time_slots" ON time_slots;
DROP POLICY IF EXISTS "Allow public read access to blocked_dates" ON blocked_dates;
DROP POLICY IF EXISTS "Allow admin full access to blocked_dates" ON blocked_dates;

-- السماح للجميع بقراءة الأوقات المتاحة
CREATE POLICY "Allow public read access to time_slots"
ON time_slots FOR SELECT
USING (true);

-- السماح للأدمن بالتحكم الكامل في الأوقات
CREATE POLICY "Allow admin full access to time_slots"
ON time_slots FOR ALL
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE user_id::text = auth.uid()::text)
)
WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE user_id::text = auth.uid()::text)
);

-- السماح للجميع بقراءة التواريخ المحجوبة
CREATE POLICY "Allow public read access to blocked_dates"
ON blocked_dates FOR SELECT
USING (true);

-- السماح للأدمن بالتحكم الكامل في التواريخ المحجوبة
CREATE POLICY "Allow admin full access to blocked_dates"
ON blocked_dates FOR ALL
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE user_id::text = auth.uid()::text)
)
WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE user_id::text = auth.uid()::text)
);

-- إضافة بيانات تجريبية (أوقات افتراضية)
INSERT INTO time_slots (day_of_week, start_time, end_time, is_available, slot_duration) VALUES
-- الاثنين
(1, '09:00', '12:00', true, 30),
(1, '14:00', '17:00', true, 30),
-- الثلاثاء
(2, '09:00', '12:00', true, 30),
(2, '14:00', '17:00', true, 30),
-- الأربعاء
(3, '09:00', '12:00', true, 30),
(3, '14:00', '17:00', true, 30),
-- الخميس
(4, '09:00', '12:00', true, 30),
(4, '14:00', '17:00', true, 30),
-- الجمعة
(5, '09:00', '12:00', true, 30)
ON CONFLICT DO NOTHING;

-- ========================================
-- ✅ تم! الآن يمكن للأدمن إدارة التقويم
-- ✅ Done! Admin can now manage calendar
-- ========================================
