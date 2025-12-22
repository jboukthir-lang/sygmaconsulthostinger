// Script to create admin user in Supabase
// Run this with: node scripts/create-admin.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ldbsacdpkinbpcguvgai.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkYnNhY2Rwa2luYnBjZ3V2Z2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4OTUwNzgsImV4cCI6MjA4MTQ3MTA3OH0.Qib8uCPcd6CJypKa_oNEDThIQNfTluH2eJE0nsewwug';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  // First, check if admin_users table exists and if user already exists
  const adminEmail = 'admin@sygma-consult.com';

  console.log('🔍 Checking for existing admin user...');

  try {
    // Try to get all admin users
    const { data: existingAdmins, error: fetchError } = await supabase
      .from('admin_users')
      .select('*');

    if (fetchError) {
      console.error('❌ Error fetching admin users:', fetchError.message);
      console.log('\n📋 You need to create the admin_users table in Supabase first.');
      console.log('\nRun this SQL in Supabase SQL Editor:');
      console.log(`
-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  permissions TEXT[] DEFAULT ARRAY['read', 'write'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Allow admins to read their own data
CREATE POLICY "Admins can read their own data"
  ON admin_users
  FOR SELECT
  USING (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
      `);
      return;
    }

    console.log(`✅ Found ${existingAdmins?.length || 0} admin user(s)`);

    if (existingAdmins && existingAdmins.length > 0) {
      console.log('\n📋 Existing Admin Users:');
      existingAdmins.forEach((admin, index) => {
        console.log(`\n${index + 1}. Email: ${admin.email}`);
        console.log(`   User ID: ${admin.user_id}`);
        console.log(`   Role: ${admin.role}`);
        console.log(`   Permissions: ${admin.permissions?.join(', ') || 'none'}`);
      });
    }

    console.log('\n\n🔐 ADMIN LOGIN CREDENTIALS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    admin@sygma-consult.com');
    console.log('🔑 Password: Admin@123456');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📝 Steps to create admin access:');
    console.log('1. Go to: http://localhost:3000/signup');
    console.log('2. Sign up with the email: admin@sygma-consult.com');
    console.log('3. Use password: Admin@123456');
    console.log('4. After signup, copy your Firebase User ID (uid)');
    console.log('5. Add the uid to admin_users table in Supabase');
    console.log('\nOr use Firebase Authentication to get the UID and run:');
    console.log(`
-- Replace YOUR_FIREBASE_UID with actual UID
INSERT INTO admin_users (user_id, email, role, permissions)
VALUES ('YOUR_FIREBASE_UID', 'admin@sygma-consult.com', 'super_admin', ARRAY['read', 'write', 'delete', 'manage_users'])
ON CONFLICT (user_id) DO UPDATE SET
  role = EXCLUDED.role,
  permissions = EXCLUDED.permissions,
  updated_at = NOW();
    `);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAdminUser();
