/**
 * Check RLS Policies on user_profiles table
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const envPath = join(__dirname, '..', '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    env[key.trim()] = valueParts.join('=').trim();
  }
});

// Initialize Supabase
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkRLS() {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  Sygma Consult - RLS Policy Check');
  console.log('═══════════════════════════════════════════════════════\n');

  try {
    // Try to select all users without authentication
    console.log('🔍 Testing SELECT on user_profiles (unauthenticated)...\n');

    const { data, error, count } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact' });

    if (error) {
      console.error('❌ Error querying user_profiles:');
      console.error('   Code:', error.code);
      console.error('   Message:', error.message);
      console.error('   Details:', error.details);
      console.error('   Hint:', error.hint);

      if (error.code === 'PGRST301' || error.message.includes('RLS')) {
        console.log('\n⚠️  RLS is BLOCKING access!');
        console.log('   This means Row Level Security policies are preventing reads.');
        console.log('\n📝 To fix this, you need to add a policy in Supabase:');
        console.log('\n   1. Go to: https://ldbsacdpkinbpcguvgai.supabase.co/project/ldbsacdpkinbpcguvgai/auth/policies');
        console.log('   2. Find the "user_profiles" table');
        console.log('   3. Add a policy with:');
        console.log('      - Policy name: "Enable read access for all users"');
        console.log('      - Allowed operation: SELECT');
        console.log('      - Target roles: authenticated, anon');
        console.log('      - USING expression: true');
        console.log('\n   OR run this SQL in Supabase SQL Editor:');
        console.log('\n   CREATE POLICY "Enable read access for all users"');
        console.log('   ON public.user_profiles FOR SELECT');
        console.log('   TO authenticated, anon');
        console.log('   USING (true);');
      }
    } else {
      console.log('✅ Successfully queried user_profiles table!');
      console.log(`   Found ${data?.length || 0} rows (count: ${count})\n`);

      if (data && data.length > 0) {
        console.log('📊 Sample data:');
        data.slice(0, 3).forEach((user, i) => {
          console.log(`\n   User ${i + 1}:`);
          console.log(`   - Email: ${user.email}`);
          console.log(`   - Full Name: ${user.full_name}`);
          console.log(`   - Created: ${new Date(user.created_at).toLocaleDateString()}`);
        });
      } else {
        console.log('⚠️  Table is accessible but empty!');
        console.log('   This means users are not being synced from Firebase to Supabase.');
        console.log('\n   Possible causes:');
        console.log('   1. AuthContext.tsx is not running (users not logging in)');
        console.log('   2. syncUserProfile() function is failing silently');
        console.log('   3. INSERT policy might be blocking writes');
        console.log('\n   Solution: Run the manual sync script after downloading serviceAccountKey.json');
      }
    }

    // Test INSERT policy
    console.log('\n🔍 Testing INSERT policy...\n');
    const testUser = {
      user_id: 'test_' + Date.now(),
      email: 'test@example.com',
      full_name: 'Test User',
      phone: '',
      photo_url: '',
      created_at: new Date().toISOString(),
    };

    const { error: insertError } = await supabase
      .from('user_profiles')
      .insert(testUser);

    if (insertError) {
      console.error('❌ INSERT is BLOCKED!');
      console.error('   Error:', insertError.message);
      console.log('\n📝 To fix INSERT policy, run this SQL in Supabase:');
      console.log('\n   CREATE POLICY "Enable insert for authenticated users only"');
      console.log('   ON public.user_profiles FOR INSERT');
      console.log('   TO authenticated');
      console.log('   WITH CHECK (true);');
    } else {
      console.log('✅ INSERT is allowed!');

      // Clean up test user
      await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', testUser.user_id);
      console.log('   (Test user cleaned up)');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }

  console.log('\n═══════════════════════════════════════════════════════\n');
}

checkRLS()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
