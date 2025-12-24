#!/usr/bin/env node
/**
 * Enhance Services Table - Add images, pricing, and links to appointment_types
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

console.log('🔧 Enhancing Services Table...\n');

// Read the migration file
const migrationPath = join(dirname(__dirname), 'supabase', 'migrations', '20250124_enhance_services_table.sql');
const migrationSQL = readFileSync(migrationPath, 'utf8');

console.log('📋 Migration SQL loaded from:', migrationPath);
console.log('\n⚠️  Note: Cannot execute SQL directly via Supabase JS client.');
console.log('Please run this SQL manually in Supabase Dashboard:\n');
console.log('https://supabase.com/dashboard/project/ldbsacdpkinbpcguvgai/sql/new\n');
console.log('---SQL START---');
console.log(migrationSQL);
console.log('---SQL END---\n');

// Alternative: Try to verify the changes
console.log('🔍 Attempting to verify services table structure...\n');

try {
  // Check if we can read services
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .limit(1);

  if (error) {
    console.error('❌ Error reading services:', error.message);
  } else {
    console.log('✅ Services table accessible');
    if (data && data.length > 0) {
      console.log('\n📊 Current fields in services table:');
      console.log(Object.keys(data[0]).join(', '));

      // Check for new fields
      const hasImageUrl = 'image_url' in data[0];
      const hasPrice = 'price' in data[0];
      const hasDuration = 'duration_minutes' in data[0];

      console.log('\n🔍 New fields status:');
      console.log(`   image_url: ${hasImageUrl ? '✅ EXISTS' : '❌ MISSING'}`);
      console.log(`   price: ${hasPrice ? '✅ EXISTS' : '❌ MISSING'}`);
      console.log(`   duration_minutes: ${hasDuration ? '✅ EXISTS' : '❌ MISSING'}`);

      if (!hasImageUrl || !hasPrice || !hasDuration) {
        console.log('\n⚠️  Please run the migration SQL above to add missing fields');
      } else {
        console.log('\n✅ All new fields exist! Table is ready.');
      }
    }
  }

  // Check for junction table
  const { data: junctionData, error: junctionError } = await supabase
    .from('service_appointment_types')
    .select('*')
    .limit(1);

  if (junctionError) {
    if (junctionError.code === '42P01') {
      console.log('\n❌ Junction table service_appointment_types does NOT exist');
      console.log('   Please run the migration SQL to create it');
    } else {
      console.error('\n❌ Error checking junction table:', junctionError.message);
    }
  } else {
    console.log('\n✅ Junction table service_appointment_types EXISTS');
    console.log(`   Current links: ${junctionData?.length || 0}`);
  }

} catch (err) {
  console.error('💥 Unexpected error:', err);
}

console.log('\n\n📝 MANUAL STEPS:');
console.log('1. Copy the SQL above');
console.log('2. Go to https://supabase.com/dashboard/project/ldbsacdpkinbpcguvgai/sql/new');
console.log('3. Paste and run the SQL');
console.log('4. Run this script again to verify');
