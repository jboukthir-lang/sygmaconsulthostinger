#!/usr/bin/env node
/**
 * Fix Services Table RLS Policies
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = 'https://ldbsacdpkinbpcguvgai.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkYnNhY2Rwa2luYnBjZ3V2Z2FpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTg5NTA3OCwiZXhwIjoyMDgxNDcxMDc4fQ.6n-kSxKBq_e4_NtYPRfyPDFHwjNhMiPmEP-GRbnhk4E';

const supabase = createClient(supabaseUrl, serviceRoleKey);

console.log('🔧 Fixing Services RLS Policies...\n');

const migrationSQL = `
-- Drop existing policies
DROP POLICY IF EXISTS "Allow read active services" ON services;
DROP POLICY IF EXISTS "Authenticated users see all services" ON services;
DROP POLICY IF EXISTS "Admins can modify services" ON services;

-- 1. Public can read ACTIVE services only
CREATE POLICY "Public can read active services"
    ON services
    FOR SELECT
    USING (is_active = true);

-- 2. Authenticated users can read ALL services
CREATE POLICY "Authenticated users can read all services"
    ON services
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- 3. Authenticated users can INSERT new services
CREATE POLICY "Authenticated users can insert services"
    ON services
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- 4. Authenticated users can UPDATE services
CREATE POLICY "Authenticated users can update services"
    ON services
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- 5. Authenticated users can DELETE services
CREATE POLICY "Authenticated users can delete services"
    ON services
    FOR DELETE
    USING (auth.role() = 'authenticated');
`;

try {
  // Execute SQL using service role
  console.log('Executing SQL migration...');

  // Split by semicolon and execute each statement
  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const statement of statements) {
    const { error } = await supabase.rpc('exec_sql', { query: statement }).catch(() => ({ error: null }));

    // Since RPC might not exist, try direct execution via Postgres REST API
    if (error) {
      console.log('⚠️  RPC method not available, trying direct execution...');
      // We'll use the migration file approach instead
      break;
    }
  }

  // Alternative: Try to verify the policies exist
  console.log('\n✅ Attempting to verify policies...');

  const { data: policies, error: policiesError } = await supabase
    .from('pg_policies')
    .select('*')
    .eq('tablename', 'services')
    .catch(() => ({ data: null, error: null }));

  if (policies) {
    console.log('\n📋 Current Policies on services table:');
    policies.forEach(p => console.log(`   - ${p.policyname}`));
  }

  console.log('\n⚠️  Manual Step Required:');
  console.log('Please run this SQL in Supabase SQL Editor:');
  console.log('https://supabase.com/dashboard/project/ldbsacdpkinbpcguvgai/sql/new\n');
  console.log('---SQL START---');
  console.log(migrationSQL);
  console.log('---SQL END---\n');

} catch (err) {
  console.error('💥 Error:', err);
  console.log('\n📍 Please run the migration manually in Supabase Dashboard');
  console.log('File: supabase/migrations/fix_services_rls_policies.sql');
}
