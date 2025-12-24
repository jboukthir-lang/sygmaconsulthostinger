-- =========================================
-- Fix Services Table RLS Policies
-- Fixes the issue where authenticated users cannot update/insert services
-- =========================================

-- Drop existing policies
DROP POLICY IF EXISTS "Allow read active services" ON services;
DROP POLICY IF EXISTS "Authenticated users see all services" ON services;
DROP POLICY IF EXISTS "Admins can modify services" ON services;

-- 1. Public can read ACTIVE services only
CREATE POLICY "Public can read active services"
    ON services
    FOR SELECT
    USING (is_active = true);

-- 2. Authenticated users can read ALL services
CREATE POLICY "Authenticated users can read all services"
    ON services
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- 3. Authenticated users can INSERT new services
CREATE POLICY "Authenticated users can insert services"
    ON services
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- 4. Authenticated users can UPDATE services
CREATE POLICY "Authenticated users can update services"
    ON services
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 5. Authenticated users can DELETE services
CREATE POLICY "Authenticated users can delete services"
    ON services
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- Add comment
COMMENT ON TABLE services IS 'Services table with proper RLS policies for authenticated users to manage services';

-- Verify policies
DO $$
BEGIN
    RAISE NOTICE '✅ Services RLS policies updated successfully!';
    RAISE NOTICE '';
    RAISE NOTICE '📋 Active Policies:';
    RAISE NOTICE '   1. Public → Read ACTIVE services only';
    RAISE NOTICE '   2. Authenticated → Read ALL services';
    RAISE NOTICE '   3. Authenticated → INSERT new services';
    RAISE NOTICE '   4. Authenticated → UPDATE existing services';
    RAISE NOTICE '   5. Authenticated → DELETE services';
    RAISE NOTICE '';
    RAISE NOTICE '🎉 You can now edit and save services in /admin/services';
END $$;
