-- Migration: Update Bookings Table for Professional Management
-- Date: 2024-12-19

-- 1. Add new columns to the bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS consultant_id TEXT,
ADD COLUMN IF NOT EXISTS fee NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS meeting_link TEXT,
ADD COLUMN IF NOT EXISTS internal_notes TEXT,
ADD COLUMN IF NOT EXISTS duration INTEGER DEFAULT 60;

-- 2. Update the status check constraint to include more professional states
-- We need to drop the old constraint first
ALTER TABLE bookings 
DROP CONSTRAINT IF EXISTS bookings_status_check;

-- Add the new expanded constraint
ALTER TABLE bookings 
ADD CONSTRAINT bookings_status_check 
CHECK (status IN ('pending', 'confirmed', 'in-progress', 'completed', 'cancelled'));

-- 3. (Optional) Create a view or link to admin_users for clarity
-- This allows referencing admin_users as consultants
COMMENT ON COLUMN bookings.consultant_id IS 'Refers to the user_id in the admin_users table';

-- 4. Enable RLS for the new columns (inherited from the table level)
-- No additional specific action needed if table-level RLS is already active.

-- Migration completed successfully
