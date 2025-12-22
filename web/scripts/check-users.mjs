#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ldbsacdpkinbpcguvgai.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkYnNhY2Rwa2luYnBjZ3V2Z2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4OTUwNzgsImV4cCI6MjA4MTQ3MTA3OH0.Qib8uCPcd6CJypKa_oNEDThIQNfTluH2eJE0nsewwug';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUsers() {
  console.log('🔍 Checking user_profiles table...\n');

  try {
    // Check user profiles
    const { data: profiles, error: profilesError, count } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('❌ Error fetching user profiles:');
      console.error('Message:', profilesError.message);
      console.error('Details:', profilesError.details);
      console.error('Hint:', profilesError.hint);
      console.error('Code:', profilesError.code);

      if (profilesError.code === 'PGRST116' || profilesError.message.includes('policy')) {
        console.log('\n⚠️  This looks like a Row Level Security (RLS) issue!');
        console.log('📋 Solutions:');
        console.log('1. Check RLS policies on user_profiles table');
        console.log('2. Make sure admin users can read all profiles');
        console.log('3. Consider disabling RLS temporarily for testing');
      }
      return;
    }

    console.log(`✅ Found ${count} users in user_profiles table\n`);

    if (profiles && profiles.length > 0) {
      console.log('👥 Users:');
      profiles.forEach((profile, index) => {
        console.log(`\n${index + 1}. ${profile.full_name || 'No name'}`);
        console.log(`   Email: ${profile.email}`);
        console.log(`   User ID: ${profile.user_id}`);
        console.log(`   Phone: ${profile.phone || 'N/A'}`);
        console.log(`   City: ${profile.city || 'N/A'}`);
        console.log(`   Created: ${new Date(profile.created_at).toLocaleDateString('fr-FR')}`);
      });
    } else {
      console.log('⚠️  No users found in the database');
      console.log('This could mean:');
      console.log('1. No users have registered yet');
      console.log('2. RLS policies are blocking access');
      console.log('3. Users are in a different table');
    }

    // Check admin users
    console.log('\n\n🔍 Checking admin_users table...\n');
    const { data: admins, error: adminsError } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (adminsError) {
      console.error('❌ Error fetching admin users:', adminsError.message);
    } else {
      console.log(`✅ Found ${admins?.length || 0} admin users\n`);
      if (admins && admins.length > 0) {
        console.log('👮 Admin Users:');
        admins.forEach((admin, index) => {
          console.log(`${index + 1}. ${admin.email} (${admin.role})`);
        });
      }
    }

    // Check bookings
    console.log('\n\n🔍 Checking bookings table...\n');
    const { data: bookings, error: bookingsError, count: bookingsCount } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true });

    if (bookingsError) {
      console.error('❌ Error fetching bookings:', bookingsError.message);
    } else {
      console.log(`✅ Found ${bookingsCount || 0} bookings\n`);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

console.log('═══════════════════════════════════════════════════════');
console.log('  Sygma Consult - User Database Check');
console.log('═══════════════════════════════════════════════════════\n');

checkUsers().then(() => {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('Check complete!');
  console.log('═══════════════════════════════════════════════════════');
  process.exit(0);
});
