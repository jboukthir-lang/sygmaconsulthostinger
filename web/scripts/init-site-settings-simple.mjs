#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ldbsacdpkinbpcguvgai.supabase.co';
const serviceRoleKey = process.argv[2] || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkYnNhY2Rwa2luYnBjZ3V2Z2FpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTg5NTA3OCwiZXhwIjoyMDgxNDcxMDc4fQ.6n-kSxKBq_e4_NtYPRfyPDFHwjNhMiPmEP-GRbnhk4E';

const supabase = createClient(supabaseUrl, serviceRoleKey);

console.log('🔧 Checking current table structure...\n');

// First, let's check what columns exist
const { data: existingData, error: checkError } = await supabase
  .from('site_settings')
  .select('*')
  .limit(1);

if (checkError) {
  console.error('❌ Error:', checkError.message);
}

console.log('📊 Current data sample:', existingData);
console.log('\nℹ️  The current site_settings table uses key-value structure for secrets.');
console.log('ℹ️  The admin/settings/site page expects a different structure with company_name, etc.');
console.log('\n💡 Solution: We need to either:');
console.log('   1. Create a separate table for site configuration (recommended)');
console.log('   2. Modify the admin page to work with key-value structure');
console.log('\nFor now, you can manually add site settings through Supabase dashboard.');
