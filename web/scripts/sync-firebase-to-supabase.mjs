#!/usr/bin/env node

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = 'https://ldbsacdpkinbpcguvgai.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkYnNhY2Rwa2luYnBjZ3V2Z2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4OTUwNzgsImV4cCI6MjA4MTQ3MTA3OH0.Qib8uCPcd6CJypKa_oNEDThIQNfTluH2eJE0nsewwug';

const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Firebase Admin
const serviceAccountPath = path.join(process.cwd(), '..', 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ serviceAccountKey.json not found!');
  console.error('Expected location:', serviceAccountPath);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

initializeApp({
  credential: cert(serviceAccount)
});

async function syncUsers() {
  console.log('🔄 Starting Firebase to Supabase sync...\n');

  try {
    // Get all users from Firebase
    const listUsersResult = await getAuth().listUsers();
    const firebaseUsers = listUsersResult.users;

    console.log(`✅ Found ${firebaseUsers.length} users in Firebase Authentication\n`);

    if (firebaseUsers.length === 0) {
      console.log('⚠️  No users to sync');
      return;
    }

    let synced = 0;
    let skipped = 0;
    let errors = 0;

    for (const user of firebaseUsers) {
      console.log(`\n📝 Processing: ${user.email || user.uid}`);

      // Check if user already exists in Supabase
      const { data: existing } = await supabase
        .from('user_profiles')
        .select('user_id')
        .eq('user_id', user.uid)
        .single();

      if (existing) {
        console.log('   ⏭️  Already exists in Supabase');
        skipped++;
        continue;
      }

      // Create user profile in Supabase
      const { error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: user.uid,
          email: user.email || '',
          full_name: user.displayName || '',
          phone: user.phoneNumber || '',
          photo_url: user.photoURL || '',
          created_at: user.metadata.creationTime,
        });

      if (error) {
        console.error('   ❌ Error:', error.message);
        errors++;
      } else {
        console.log('   ✅ Synced successfully');
        synced++;
      }
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('Sync Summary:');
    console.log(`  ✅ Synced: ${synced}`);
    console.log(`  ⏭️  Skipped: ${skipped}`);
    console.log(`  ❌ Errors: ${errors}`);
    console.log('═══════════════════════════════════════════════════════');

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

console.log('═══════════════════════════════════════════════════════');
console.log('  Firebase to Supabase User Sync');
console.log('═══════════════════════════════════════════════════════\n');

syncUsers().then(() => {
  console.log('\n✅ Sync complete!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Sync failed:', error);
  process.exit(1);
});
