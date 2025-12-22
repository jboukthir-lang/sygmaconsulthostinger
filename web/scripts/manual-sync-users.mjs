/**
 * Manual User Sync Script
 * Syncs existing users from Firebase Authentication to Supabase user_profiles
 */

import { createClient } from '@supabase/supabase-js';
import admin from 'firebase-admin';
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

// Initialize Firebase Admin
const serviceAccountPath = join(__dirname, '..', 'serviceAccountKey.json');
let firebaseApp;

try {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));

  if (!admin.apps.length) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } else {
    firebaseApp = admin.app();
  }

  console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
  console.error('❌ Error initializing Firebase Admin:', error.message);
  console.log('\n⚠️  Please make sure serviceAccountKey.json exists in the web directory');
  console.log('Download it from: https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk');
  process.exit(1);
}

async function syncUsers() {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  Sygma Consult - Manual User Sync');
  console.log('═══════════════════════════════════════════════════════\n');

  try {
    // Get all users from Firebase
    console.log('🔍 Fetching users from Firebase Authentication...\n');
    const listUsersResult = await admin.auth().listUsers();
    const firebaseUsers = listUsersResult.users;

    console.log(`✅ Found ${firebaseUsers.length} users in Firebase\n`);

    if (firebaseUsers.length === 0) {
      console.log('⚠️  No users to sync');
      return;
    }

    let syncedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const user of firebaseUsers) {
      console.log(`\n📝 Processing user: ${user.email || user.uid}`);

      try {
        // Check if user already exists in Supabase
        const { data: existingProfile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.uid)
          .single();

        if (existingProfile) {
          console.log(`   ⏭️  User already exists in Supabase - skipping`);
          skippedCount++;
          continue;
        }

        // Create user profile in Supabase
        const { error: insertError } = await supabase.from('user_profiles').insert({
          user_id: user.uid,
          email: user.email || '',
          full_name: user.displayName || '',
          photo_url: user.photoURL || '',
          phone: user.phoneNumber || '',
          created_at: new Date(user.metadata.creationTime).toISOString(),
        });

        if (insertError) {
          console.error(`   ❌ Error creating profile:`, insertError.message);
          errorCount++;
          continue;
        }

        console.log(`   ✅ Successfully synced to Supabase`);

        // Send welcome notification
        const { error: notifError } = await supabase.from('notifications').insert({
          user_id: user.uid,
          title: 'Welcome to Sygma Consult',
          message: 'Your account has been synced. Explore our services and book your first consultation!',
          type: 'system',
          link: '/',
        });

        if (notifError) {
          console.log(`   ⚠️  Notification not sent:`, notifError.message);
        } else {
          console.log(`   📬 Welcome notification sent`);
        }

        syncedCount++;

      } catch (error) {
        console.error(`   ❌ Error processing user:`, error.message);
        errorCount++;
      }
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  Sync Complete!');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`\n✅ Successfully synced: ${syncedCount} users`);
    console.log(`⏭️  Skipped (already exist): ${skippedCount} users`);
    console.log(`❌ Errors: ${errorCount} users`);
    console.log('\n═══════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Fatal error during sync:', error);
  }
}

// Run the sync
syncUsers()
  .then(() => {
    console.log('✅ Sync script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Sync script failed:', error);
    process.exit(1);
  });
