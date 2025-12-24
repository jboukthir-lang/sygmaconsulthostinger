#!/usr/bin/env node
/**
 * Test services update with ANON key (like the browser does)
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ldbsacdpkinbpcguvgai.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkYnNhY2Rwa2luYnBjZ3V2Z2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4OTUwNzgsImV4cCI6MjA4MTQ3MTA3OH0.Qib8uCPcd6CJypKa_oNEDThIQNfTluH2eJE0nsewwug';

// Simulate authenticated user
const supabase = createClient(supabaseUrl, anonKey);

console.log('🔍 Testing Services with ANON key (Browser Simulation)...\n');

// First, we need to simulate a logged-in user
// In real app, user would be authenticated via auth.signIn
console.log('⚠️  Note: This test uses anon key without authentication');
console.log('   In production, user must be logged in via Supabase Auth\n');

try {
  // 1. Try to read services
  console.log('1️⃣ Reading services with anon key...');
  const { data: services, error: readError } = await supabase
    .from('services')
    .select('*')
    .limit(1);

  if (readError) {
    console.error('❌ Read Error:', readError.message);
  } else {
    console.log('✅ Read successful! Found', services?.length || 0, 'services');

    if (services && services.length > 0) {
      const testService = services[0];
      console.log('\n2️⃣ Testing UPDATE with anon key (UNAUTHENTICATED)...');
      console.log('   Service:', testService.title_en);

      // Try to update WITHOUT authentication
      const { error: updateError } = await supabase
        .from('services')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', testService.id);

      if (updateError) {
        console.error('\n❌ UPDATE FAILED (Expected - not authenticated)');
        console.error('   Error:', updateError.message);
        console.error('   Code:', updateError.code);

        console.log('\n🔍 This is the issue! RLS policies require authentication.');
        console.log('   When you edit services in /admin/services, you ARE logged in.');
        console.log('   Let me check if your user session is being passed correctly...\n');

        console.log('📋 SOLUTION - Run this SQL to allow authenticated users:');
        console.log('https://supabase.com/dashboard/project/ldbsacdpkinbpcguvgai/sql/new\n');
        console.log('--- COPY THIS SQL ---');
        console.log(`
-- Fix RLS policies for services table
DROP POLICY IF EXISTS "Allow read active services" ON services;
DROP POLICY IF EXISTS "Authenticated users see all services" ON services;
DROP POLICY IF EXISTS "Admins can modify services" ON services;

-- Allow everyone to read active services
CREATE POLICY "Public read active services"
  ON services FOR SELECT
  USING (is_active = true);

-- Allow authenticated to read all
CREATE POLICY "Authenticated read all services"
  ON services FOR SELECT
  USING (auth.role() = 'authenticated');

-- IMPORTANT: Allow authenticated to INSERT
CREATE POLICY "Authenticated insert services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- IMPORTANT: Allow authenticated to UPDATE
CREATE POLICY "Authenticated update services"
  ON services FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- IMPORTANT: Allow authenticated to DELETE
CREATE POLICY "Authenticated delete services"
  ON services FOR DELETE
  TO authenticated
  USING (true);

SELECT 'RLS policies updated successfully!' as status;
        `);
        console.log('--- END SQL ---\n');

      } else {
        console.log('✅ Update successful (Unexpected!)');
      }
    }
  }

} catch (err) {
  console.error('💥 Unexpected error:', err);
}
