-- ========================================
-- نظام الإشعارات الكامل
-- Complete Notifications System
-- ========================================

-- إنشاء جدول الإشعارات
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info', -- info, success, warning, error
  is_read BOOLEAN DEFAULT false,
  link VARCHAR(500), -- رابط للصفحة المتعلقة
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  read_at TIMESTAMP WITH TIME ZONE
);

-- إضافة فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false;

-- تفعيل RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- حذف الـ policies القديمة
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
DROP POLICY IF EXISTS "System can create notifications" ON notifications;
DROP POLICY IF EXISTS "Admin can view all notifications" ON notifications;

-- السماح للمستخدمين برؤية إشعاراتهم الخاصة
CREATE POLICY "Users can view their own notifications"
ON notifications FOR SELECT
USING (auth.uid()::text = user_id::text);

-- السماح للمستخدمين بتحديث إشعاراتهم (read/unread)
CREATE POLICY "Users can update their own notifications"
ON notifications FOR UPDATE
USING (auth.uid()::text = user_id::text)
WITH CHECK (auth.uid()::text = user_id::text);

-- السماح للنظام بإنشاء إشعارات
CREATE POLICY "System can create notifications"
ON notifications FOR INSERT
WITH CHECK (true);

-- السماح للأدمن برؤية جميع الإشعارات
CREATE POLICY "Admin can view all notifications"
ON notifications FOR SELECT
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE user_id::text = auth.uid()::text)
);

-- السماح للأدمن بإنشاء إشعارات
CREATE POLICY "Admin can create notifications"
ON notifications FOR INSERT
WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE user_id::text = auth.uid()::text)
);

-- دالة لإنشاء إشعار تلقائياً عند حجز جديد
CREATE OR REPLACE FUNCTION create_booking_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- إشعار للمستخدم
  IF NEW.user_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, title, message, type, link)
    VALUES (
      NEW.user_id,
      CASE
        WHEN TG_OP = 'INSERT' THEN 'حجز جديد | New Booking'
        ELSE 'تحديث الحجز | Booking Update'
      END,
      CASE
        WHEN TG_OP = 'INSERT' THEN
          'تم إنشاء حجزك بنجاح. سيتم مراجعته قريباً. | Your booking has been created successfully. It will be reviewed soon.'
        WHEN NEW.status = 'confirmed' THEN
          'تم تأكيد حجزك! | Your booking has been confirmed!'
        WHEN NEW.status = 'cancelled' THEN
          'تم إلغاء حجزك. | Your booking has been cancelled.'
        ELSE
          'تم تحديث حالة حجزك. | Your booking status has been updated.'
      END,
      CASE
        WHEN NEW.status = 'confirmed' THEN 'success'
        WHEN NEW.status = 'cancelled' THEN 'error'
        ELSE 'info'
      END,
      '/profile/bookings'
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger لإنشاء إشعار عند حجز جديد أو تحديث
DROP TRIGGER IF EXISTS booking_notification_trigger ON bookings;
CREATE TRIGGER booking_notification_trigger
AFTER INSERT OR UPDATE OF status ON bookings
FOR EACH ROW
EXECUTE FUNCTION create_booking_notification();

-- دالة لحذف الإشعارات القديمة (أكثر من 30 يوم)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS void AS $$
BEGIN
  DELETE FROM notifications
  WHERE created_at < NOW() - INTERVAL '30 days'
  AND is_read = true;
END;
$$ LANGUAGE plpgsql;

-- إضافة بعض الإشعارات التجريبية (اختياري)
-- يمكنك حذف هذا الجزء في الإنتاج
INSERT INTO notifications (user_id, title, message, type, link)
SELECT
  id,
  'مرحباً في Sygma Consult | Welcome to Sygma Consult',
  'نحن سعداء بانضمامك إلينا! | We are happy to have you with us!',
  'success',
  '/profile'
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM notifications WHERE user_id = auth.users.id
)
LIMIT 5
ON CONFLICT DO NOTHING;

-- ========================================
-- ✅ تم! نظام الإشعارات جاهز
-- ✅ Done! Notifications system ready
-- ========================================
