-- =============================================
-- ADD FIRST ADMIN USER
-- =============================================
-- This script adds your Firebase user as an admin
-- Replace 'YOUR_FIREBASE_UID' and 'your-email@example.com' with actual values

-- IMPORTANT: Get your Firebase UID from Firebase Console or after first login
-- You can find it in the browser console after logging in by running:
-- firebase.auth().currentUser.uid

-- Step 1: Insert admin user (replace with your Firebase UID and email)
INSERT INTO admin_users (user_id, email, role, permissions)
VALUES (
  'YOUR_FIREBASE_UID',  -- Replace with your Firebase UID
  'your-email@example.com',  -- Replace with your email
  'super_admin',
  '{"all": true}'::jsonb
)
ON CONFLICT (user_id) DO UPDATE
SET role = 'super_admin',
    permissions = '{"all": true}'::jsonb,
    updated_at = NOW();

-- Step 2: Verify the admin was created
SELECT * FROM admin_users WHERE user_id = 'YOUR_FIREBASE_UID';

-- =============================================
-- HOW TO GET YOUR FIREBASE UID:
-- =============================================
-- Method 1: From Firebase Console
--   1. Go to Firebase Console → Authentication → Users
--   2. Find your email and copy the UID
--
-- Method 2: After logging in to the app
--   1. Open browser console (F12)
--   2. Run this in console after you log in:
--      firebase.auth().currentUser.uid
--   3. Copy the UID that appears
--
-- Method 3: From the app code
--   1. Log in to the app
--   2. Open Profile page
--   3. Open browser console
--   4. The UID will be shown in network requests to Supabase

-- =============================================
-- EXAMPLE (DO NOT USE THESE VALUES):
-- =============================================
-- INSERT INTO admin_users (user_id, email, role, permissions)
-- VALUES (
--   'abc123xyz456',  -- Example UID
--   'admin@sygma-consult.com',
--   'super_admin',
--   '{"all": true}'::jsonb
-- );

-- =============================================
-- ADD MORE ADMINS (Optional)
-- =============================================
-- Uncomment and modify to add more admin users:

-- INSERT INTO admin_users (user_id, email, role, permissions)
-- VALUES
--   ('firebase_uid_2', 'moderator@sygma-consult.com', 'moderator', '{"bookings": true, "contacts": true}'::jsonb),
--   ('firebase_uid_3', 'admin2@sygma-consult.com', 'admin', '{"bookings": true, "contacts": true, "users": true}'::jsonb);
