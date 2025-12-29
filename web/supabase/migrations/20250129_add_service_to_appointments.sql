-- =========================================
-- ربط المواعيد بالخدمات | Link Appointments to Services
-- =========================================
-- 1. Add service_id to appointments table
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS service_id UUID REFERENCES services(id);
-- 2. Create index for performance
CREATE INDEX IF NOT EXISTS idx_appointments_service ON appointments(service_id);
-- 3. Update RLS policies to allow access (if needed)
-- (Existing policies on appointments table should cover this as they allow access to all authenticated users or public depending on setup)