// Script to check admin users in Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ldbsacdpkinbpcguvgai.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkYnNhY2Rwa2luYnBjZ3V2Z2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4OTUwNzgsImV4cCI6MjA4MTQ3MTA3OH0.Qib8uCPcd6CJypKa_oNEDThIQNfTluH2eJE0nsewwug';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAdminUsers() {
  console.log('🔍 Checking admin users in Supabase...\n');

  try {
    const { data: admins, error } = await supabase
      .from('admin_users')
      .select('*');

    if (error) {
      console.error('❌ Error:', error.message);
      console.log('\n📋 The admin_users table may not exist yet.');
      console.log('\nCreate it in Supabase SQL Editor with this SQL:');
      console.log(`
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  permissions JSONB DEFAULT '["read", "write"]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read admin_users"
  ON admin_users FOR SELECT
  USING (true);

CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
      `);
      return;
    }

    if (!admins || admins.length === 0) {
      console.log('⚠️  No admin users found!\n');
      console.log('📝 To create an admin:');
      console.log('1. Sign up at http://localhost:3000/signup');
      console.log('2. Use email: admin@sygma-consult.com');
      console.log('3. Use password: Admin@123456');
      console.log('4. Get your Firebase UID from the browser console after signup');
      console.log('5. Run this SQL in Supabase:\n');
      console.log(`INSERT INTO admin_users (user_id, email, role, permissions)
VALUES ('YOUR_FIREBASE_UID', 'admin@sygma-consult.com', 'super_admin',
'["read", "write", "delete", "manage_users"]'::jsonb);`);
      return;
    }

    console.log(`✅ Found ${admins.length} admin user(s):\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    admins.forEach((admin, index) => {
      console.log(`\n${index + 1}. 👤 Admin User:`);
      console.log(`   📧 Email: ${admin.email}`);
      console.log(`   🆔 User ID: ${admin.user_id}`);
      console.log(`   👑 Role: ${admin.role}`);
      console.log(`   🔐 Permissions: ${JSON.stringify(admin.permissions)}`);
      console.log(`   📅 Created: ${new Date(admin.created_at).toLocaleString()}`);
    });

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔐 LOGIN INSTRUCTIONS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. Go to: http://localhost:3000/login');
    console.log(`2. Use the email from above (${admins[0].email})`);
    console.log('3. Use the password you set during signup');
    console.log('4. You will be redirected to /admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkAdminUsers();
