-- =========================================
-- تحسين جدول الخدمات | Enhance Services Table
-- إضافة حقول الصور والأسعار والربط مع appointment_types
-- =========================================
-- 1. Add missing fields to services table
ALTER TABLE services
ADD COLUMN IF NOT EXISTS image_url TEXT,
    ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2),
    ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 60,
    ADD COLUMN IF NOT EXISTS is_bookable BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
-- 2. Create junction table to link services with appointment_types
CREATE TABLE IF NOT EXISTS service_appointment_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    appointment_type_id UUID NOT NULL REFERENCES appointment_types(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(service_id, appointment_type_id)
);
-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_service_appointment_types_service ON service_appointment_types(service_id);
CREATE INDEX IF NOT EXISTS idx_service_appointment_types_appointment ON service_appointment_types(appointment_type_id);
CREATE INDEX IF NOT EXISTS idx_services_bookable ON services(is_bookable);
CREATE INDEX IF NOT EXISTS idx_services_featured ON services(featured);
-- 4. Enable RLS on junction table
ALTER TABLE service_appointment_types ENABLE ROW LEVEL SECURITY;
-- Allow everyone to read
DROP POLICY IF EXISTS "Public can read service appointment types" ON service_appointment_types;
CREATE POLICY "Public can read service appointment types" ON service_appointment_types FOR
SELECT USING (true);
-- Allow authenticated to modify
DROP POLICY IF EXISTS "Authenticated can modify service appointment types" ON service_appointment_types;
CREATE POLICY "Authenticated can modify service appointment types" ON service_appointment_types FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
-- 5. Add service_id to bookings table if not exists
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'bookings'
        AND column_name = 'service_id'
) THEN
ALTER TABLE bookings
ADD COLUMN service_id UUID REFERENCES services(id);
CREATE INDEX idx_bookings_service ON bookings(service_id);
END IF;
END $$;
-- 6. Add comments
COMMENT ON COLUMN services.image_url IS 'URL للصورة المميزة للخدمة - Featured image URL for the service';
COMMENT ON COLUMN services.price IS 'السعر الافتراضي للخدمة - Default price for the service';
COMMENT ON COLUMN services.duration_minutes IS 'المدة الافتراضية بالدقائق - Default duration in minutes';
COMMENT ON COLUMN services.is_bookable IS 'هل يمكن حجز هذه الخدمة - Whether this service is bookable';
COMMENT ON COLUMN services.featured IS 'خدمة مميزة للعرض - Featured service for display';
COMMENT ON TABLE service_appointment_types IS 'ربط الخدمات بأنواع المواعيد - Links services to appointment types';
-- 7. Grant permissions
GRANT SELECT ON service_appointment_types TO anon,
    authenticated;
GRANT ALL ON service_appointment_types TO authenticated;
-- 8. Summary
DO $$
DECLARE services_count INTEGER;
appointment_types_count INTEGER;
BEGIN
SELECT COUNT(*) INTO services_count
FROM services;
SELECT COUNT(*) INTO appointment_types_count
FROM appointment_types;
RAISE NOTICE '✅ Services table enhanced successfully!';
RAISE NOTICE '';
RAISE NOTICE '📊 Statistics:';
RAISE NOTICE '   - Total Services: %',
services_count;
RAISE NOTICE '   - Total Appointment Types: %',
appointment_types_count;
RAISE NOTICE '';
RAISE NOTICE '🆕 New Features:';
RAISE NOTICE '   ✓ Services can now have images (image_url)';
RAISE NOTICE '   ✓ Services can now have pricing (price)';
RAISE NOTICE '   ✓ Services linked to appointment types';
RAISE NOTICE '   ✓ Bookings can now track which service was booked';
RAISE NOTICE '';
RAISE NOTICE '🔄 Next Steps:';
RAISE NOTICE '   1. Upload images for each service';
RAISE NOTICE '   2. Link services to appointment types';
RAISE NOTICE '   3. Update frontend to display service images';
RAISE NOTICE '   4. Update booking flow to select service';
END $$;