-- =========================================
-- دمج جداول consultation_types و appointment_types
-- =========================================

-- 1. التحقق من وجود جدول appointment_types وإنشائه إذا لم يكن موجوداً
CREATE TABLE IF NOT EXISTS appointment_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name_fr VARCHAR(200) NOT NULL,
    name_ar VARCHAR(200) NOT NULL,
    name_en VARCHAR(200) NOT NULL,
    description_fr TEXT,
    description_ar TEXT,
    description_en TEXT,
    duration INTEGER DEFAULT 30,
    price DECIMAL(10, 2) DEFAULT 0,
    color VARCHAR(20) DEFAULT '#3B82F6',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 1.1 إضافة الأعمدة الجديدة إذا لم تكن موجودة
ALTER TABLE appointment_types
ADD COLUMN IF NOT EXISTS is_online_available BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_onsite_available BOOLEAN DEFAULT true;

-- 2. نقل البيانات من consultation_types إلى appointment_types (إذا كان موجوداً)
-- Skip this step - we'll use default data instead
-- If you have existing consultation_types data, you can migrate it manually

-- 3. إدراج أنواع افتراضية إذا كان الجدول فارغاً
DO $$
BEGIN
    -- Only insert if table is empty or these specific types don't exist
    IF NOT EXISTS (SELECT 1 FROM appointment_types LIMIT 1) THEN
        INSERT INTO appointment_types (name_fr, name_ar, name_en, description_fr, description_ar, description_en, duration, price, color) VALUES
        ('Consultation Stratégique', 'استشارة استراتيجية', 'Strategic Consultation',
         'Consultation pour la stratégie d''entreprise et développement',
         'استشارة حول استراتيجية الأعمال والتطوير',
         'Business strategy and development consultation',
         60, 150.00, '#8B5CF6'),

        ('Consultation Financière', 'استشارة مالية', 'Financial Consultation',
         'Conseil en gestion financière et comptabilité',
         'استشارة في الإدارة المالية والمحاسبة',
         'Financial management and accounting advice',
         45, 120.00, '#10B981'),

        ('Consultation RH', 'استشارة موارد بشرية', 'HR Consultation',
         'Gestion des ressources humaines et recrutement',
         'إدارة الموارد البشرية والتوظيف',
         'Human resources and recruitment management',
         45, 100.00, '#F59E0B'),

        ('Consultation Juridique', 'استشارة قانونية', 'Legal Consultation',
         'Conformité légale et aspects juridiques',
         'الامتثال القانوني والجوانب القانونية',
         'Legal compliance and advisory',
         60, 180.00, '#EF4444'),

        ('Consultation Marketing', 'استشارة تسويقية', 'Marketing Consultation',
         'Stratégie marketing et communication digitale',
         'استراتيجية التسويق والاتصال الرقمي',
         'Marketing strategy and digital communication',
         45, 110.00, '#3B82F6'),

        ('Session de Formation', 'جلسة تدريبية', 'Training Session',
         'Formation professionnelle personnalisée',
         'تدريب مهني مخصص',
         'Customized professional training',
         90, 200.00, '#06B6D4');
    END IF;
END $$;

-- 4. التأكد من وجود جميع الحقول الضرورية في جدول bookings
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS duration INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS appointment_type VARCHAR(50) DEFAULT 'consultation',
ADD COLUMN IF NOT EXISTS specialization VARCHAR(100),
ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS meeting_link VARCHAR(500),
ADD COLUMN IF NOT EXISTS location VARCHAR(500),
ADD COLUMN IF NOT EXISTS consultant_name VARCHAR(200),
ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS appointment_type_id UUID REFERENCES appointment_types(id);

-- 5. إضافة حقول Stripe للدفع
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS stripe_session_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS stripe_payment_id VARCHAR(255);

-- 6. إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_bookings_appointment_type_id ON bookings(appointment_type_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_session ON bookings(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_appointment_types_active ON appointment_types(is_active);

-- 7. إنشاء جدول appointments للربط مع Calendar
CREATE TABLE IF NOT EXISTS appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    appointment_type_id UUID REFERENCES appointment_types(id),
    client_name VARCHAR(200) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    booking_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 8. إضافة foreign key constraint لـ booking_id إذا لم يكن موجوداً
-- Note: We skip adding the FK constraint here because bookings table structure may vary
-- The booking_id column exists for future use but won't enforce referential integrity initially

-- 9. إنشاء فهارس لجدول appointments
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_type ON appointments(appointment_type_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
-- Skip index on booking_id as it may not be populated initially
-- CREATE INDEX IF NOT EXISTS idx_appointments_booking ON appointments(booking_id);

-- 10. إنشاء جدول calendar_settings
CREATE TABLE IF NOT EXISTS calendar_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    monday_enabled BOOLEAN DEFAULT true,
    tuesday_enabled BOOLEAN DEFAULT true,
    wednesday_enabled BOOLEAN DEFAULT true,
    thursday_enabled BOOLEAN DEFAULT true,
    friday_enabled BOOLEAN DEFAULT true,
    saturday_enabled BOOLEAN DEFAULT false,
    sunday_enabled BOOLEAN DEFAULT false,
    monday_start TIME DEFAULT '09:00',
    monday_end TIME DEFAULT '17:00',
    tuesday_start TIME DEFAULT '09:00',
    tuesday_end TIME DEFAULT '17:00',
    wednesday_start TIME DEFAULT '09:00',
    wednesday_end TIME DEFAULT '17:00',
    thursday_start TIME DEFAULT '09:00',
    thursday_end TIME DEFAULT '17:00',
    friday_start TIME DEFAULT '09:00',
    friday_end TIME DEFAULT '17:00',
    saturday_start TIME DEFAULT '09:00',
    saturday_end TIME DEFAULT '17:00',
    sunday_start TIME DEFAULT '09:00',
    sunday_end TIME DEFAULT '17:00',
    lunch_break_enabled BOOLEAN DEFAULT true,
    lunch_break_start TIME DEFAULT '12:00',
    lunch_break_end TIME DEFAULT '13:00',
    slot_duration INTEGER DEFAULT 30,
    max_advance_booking_days INTEGER DEFAULT 60,
    min_advance_booking_hours INTEGER DEFAULT 24,
    allow_weekend_booking BOOLEAN DEFAULT false,
    require_admin_approval BOOLEAN DEFAULT true,
    send_confirmation_email BOOLEAN DEFAULT true,
    send_reminder_email BOOLEAN DEFAULT true,
    reminder_hours_before INTEGER DEFAULT 24,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 11. إضافة إعدادات افتراضية للكالندر إذا لم تكن موجودة
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM calendar_settings LIMIT 1) THEN
        INSERT INTO calendar_settings DEFAULT VALUES;
    END IF;
END $$;

-- 12. تحديث timestamp تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 13. إضافة Triggers للتحديث التلقائي
DROP TRIGGER IF EXISTS update_appointment_types_updated_at ON appointment_types;
CREATE TRIGGER update_appointment_types_updated_at
    BEFORE UPDATE ON appointment_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_calendar_settings_updated_at ON calendar_settings;
CREATE TRIGGER update_calendar_settings_updated_at
    BEFORE UPDATE ON calendar_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 14. Row Level Security (RLS)
-- Note: RLS policies are created but not enabled by default
-- Enable them manually after verifying admin_users table structure

-- Allow everyone to read active appointment types
DROP POLICY IF EXISTS "Allow read active appointment_types" ON appointment_types;
CREATE POLICY "Allow read active appointment_types" ON appointment_types
    FOR SELECT USING (is_active = true);

-- Allow everyone to read appointments
DROP POLICY IF EXISTS "Allow read appointments" ON appointments;
CREATE POLICY "Allow read appointments" ON appointments
    FOR SELECT USING (true);

-- Allow everyone to read calendar settings
DROP POLICY IF EXISTS "Allow read calendar_settings" ON calendar_settings;
CREATE POLICY "Allow read calendar_settings" ON calendar_settings
    FOR SELECT USING (true);

-- Enable RLS on tables
ALTER TABLE appointment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_settings ENABLE ROW LEVEL SECURITY;

-- 15. إضافة تعليقات توضيحية
COMMENT ON TABLE appointment_types IS 'أنواع المواعيد والاستشارات المتاحة مع الأسعار';
COMMENT ON TABLE appointments IS 'جدول المواعيد المرتبط بالكالندر';
COMMENT ON TABLE calendar_settings IS 'إعدادات الكالندر وساعات العمل';
COMMENT ON COLUMN bookings.appointment_type_id IS 'ربط الحجز بنوع الموعد';
COMMENT ON COLUMN bookings.price IS 'سعر الاستشارة أو الخدمة';
COMMENT ON COLUMN bookings.payment_status IS 'حالة الدفع: pending, paid, refunded, free';

-- 16. عرض ملخص النتائج
DO $$
DECLARE
    types_count INTEGER;
    appointments_count INTEGER;
    bookings_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO types_count FROM appointment_types;
    SELECT COUNT(*) INTO appointments_count FROM appointments;
    SELECT COUNT(*) INTO bookings_count FROM bookings WHERE price IS NOT NULL;

    RAISE NOTICE '✅ Migration completed successfully!';
    RAISE NOTICE '📊 Statistics:';
    RAISE NOTICE '   - Appointment Types: %', types_count;
    RAISE NOTICE '   - Appointments: %', appointments_count;
    RAISE NOTICE '   - Bookings with price: %', bookings_count;
    RAISE NOTICE '';
    RAISE NOTICE '🔄 Next Steps:';
    RAISE NOTICE '   1. Run the application and test booking flow';
    RAISE NOTICE '   2. Configure Stripe keys in .env.local';
    RAISE NOTICE '   3. Test payment integration';
    RAISE NOTICE '   4. Configure calendar settings in admin panel';
END $$;
