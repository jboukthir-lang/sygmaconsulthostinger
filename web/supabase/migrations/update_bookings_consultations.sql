-- =========================================
-- تحديث جدول bookings للاستشارات
-- Update Bookings Table for Consultations
-- =========================================

-- 1. إضافة الأعمدة المفقودة إلى جدول bookings
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS consultant_id UUID,
ADD COLUMN IF NOT EXISTS fee DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS internal_notes TEXT;

-- 2. إضافة foreign key constraint للمستشار
-- Note: Only if admin_users table exists and has user_id column
DO $$
BEGIN
    -- Check if admin_users table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'admin_users') THEN
        -- Add foreign key if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.table_constraints
            WHERE constraint_name = 'bookings_consultant_id_fkey'
            AND table_name = 'bookings'
        ) THEN
            ALTER TABLE bookings
            ADD CONSTRAINT bookings_consultant_id_fkey
            FOREIGN KEY (consultant_id) REFERENCES admin_users(user_id) ON DELETE SET NULL;

            RAISE NOTICE '✅ Foreign key constraint added for consultant_id';
        ELSE
            RAISE NOTICE 'ℹ️  Foreign key constraint already exists for consultant_id';
        END IF;
    ELSE
        RAISE NOTICE '⚠️  admin_users table does not exist - skipping foreign key';
    END IF;
END $$;

-- 3. إنشاء فهرس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_bookings_consultant ON bookings(consultant_id);
CREATE INDEX IF NOT EXISTS idx_bookings_fee ON bookings(fee);

-- 4. إضافة تعليقات توضيحية
COMMENT ON COLUMN bookings.consultant_id IS 'معرف المستشار المعين - Assigned consultant user ID';
COMMENT ON COLUMN bookings.fee IS 'رسوم الاستشارة بالدولار - Consultation fee in EUR';
COMMENT ON COLUMN bookings.internal_notes IS 'ملاحظات داخلية للإداريين فقط - Internal admin notes only';

-- 5. تحديث RLS policies إذا لزم الأمر
-- Allow consultants to see their own bookings
DROP POLICY IF EXISTS "Consultants can see assigned bookings" ON bookings;
CREATE POLICY "Consultants can see assigned bookings" ON bookings
    FOR SELECT USING (
        consultant_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM admin_users
            WHERE user_id = auth.uid()
        )
    );

-- 6. عرض ملخص النتائج
DO $$
DECLARE
    total_bookings INTEGER;
    assigned_bookings INTEGER;
    total_fees DECIMAL(10, 2);
BEGIN
    SELECT COUNT(*) INTO total_bookings FROM bookings;
    SELECT COUNT(*) INTO assigned_bookings FROM bookings WHERE consultant_id IS NOT NULL;
    SELECT COALESCE(SUM(fee), 0) INTO total_fees FROM bookings WHERE status = 'completed';

    RAISE NOTICE '✅ Bookings table updated successfully!';
    RAISE NOTICE '📊 Statistics:';
    RAISE NOTICE '   - Total Bookings: %', total_bookings;
    RAISE NOTICE '   - Assigned to Consultants: %', assigned_bookings;
    RAISE NOTICE '   - Total Completed Fees: €%', total_fees;
    RAISE NOTICE '';
    RAISE NOTICE '🔄 Next Steps:';
    RAISE NOTICE '   1. Go to /admin/consultations';
    RAISE NOTICE '   2. Assign consultants to bookings';
    RAISE NOTICE '   3. Set consultation fees';
    RAISE NOTICE '   4. Add internal notes for team communication';
END $$;
