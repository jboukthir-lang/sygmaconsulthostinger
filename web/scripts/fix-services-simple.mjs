#!/usr/bin/env node
/**
 * Simple test to verify services update works
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ldbsacdpkinbpcguvgai.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkYnNhY2Rwa2luYnBjZ3V2Z2FpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTg5NTA3OCwiZXhwIjoyMDgxNDcxMDc4fQ.6n-kSxKBq_e4_NtYPRfyPDFHwjNhMiPmEP-GRbnhk4E';

const supabase = createClient(supabaseUrl, serviceRoleKey);

console.log('🔍 Testing Services Table Access...\n');

try {
  // 1. Try to read services
  console.log('1️⃣ Reading services...');
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
      console.log('\n2️⃣ Testing update on service:', testService.title_en);

      // Try to update with service role key
      const { error: updateError } = await supabase
        .from('services')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', testService.id);

      if (updateError) {
        console.error('❌ Update Error:', updateError.message);
        console.error('Error details:', updateError);
        console.log('\n⚠️  This means RLS policies are blocking updates!');
        console.log('\n📋 You need to run this SQL in Supabase Dashboard:');
        console.log('https://supabase.com/dashboard/project/ldbsacdpkinbpcguvgai/sql/new\n');
        console.log('--- COPY THIS SQL ---');
        console.log(`
-- Grant all permissions on services table
GRANT ALL ON services TO authenticated;
GRANT ALL ON services TO service_role;

-- Drop restrictive policies
DROP POLICY IF EXISTS "Allow read active services" ON services;
DROP POLICY IF EXISTS "Authenticated users see all services" ON services;
DROP POLICY IF EXISTS "Admins can modify services" ON services;
DROP POLICY IF EXISTS "Public can read active services" ON services;
DROP POLICY IF EXISTS "Authenticated users can read all services" ON services;
DROP POLICY IF EXISTS "Authenticated users can insert services" ON services;
DROP POLICY IF EXISTS "Authenticated users can update services" ON services;
DROP POLICY IF EXISTS "Authenticated users can delete services" ON services;

-- Create simple permissive policies
CREATE POLICY "Enable read for all users"
  ON services FOR SELECT
  USING (true);

CREATE POLICY "Enable all for authenticated users"
  ON services FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
        `);
        console.log('--- END SQL ---\n');
      } else {
        console.log('✅ Update successful with service_role key!');
        console.log('✅ Services table is working correctly!');
      }
    }
  }

} catch (err) {
  console.error('💥 Unexpected error:', err);
}
