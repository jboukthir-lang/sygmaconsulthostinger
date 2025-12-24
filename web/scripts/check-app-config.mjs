#!/usr/bin/env node
/**
 * Check app_config table data
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ldbsacdpkinbpcguvgai.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkYnNhY2Rwa2luYnBjZ3V2Z2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4OTUwNzgsImV4cCI6MjA4MTQ3MTA3OH0.Qib8uCPcd6CJypKa_oNEDThIQNfTluH2eJE0nsewwug';

const supabase = createClient(supabaseUrl, anonKey);

console.log('🔍 Checking app_config table...\n');

try {
  const { data, error } = await supabase
    .from('app_config')
    .select('*')
    .eq('key', 'main')
    .single();

  if (error) {
    console.error('❌ Error:', error);
    console.log('\n📋 Error details:');
    console.log('  Code:', error.code);
    console.log('  Message:', error.message);
    console.log('  Details:', error.details);
    console.log('  Hint:', error.hint);
  } else {
    console.log('✅ Successfully fetched app_config!');
    console.log('\n📊 Data:');
    console.log(JSON.stringify(data, null, 2));
  }

  // Also try fetching all records
  console.log('\n\n🔍 Fetching ALL records...');
  const { data: allData, error: allError } = await supabase
    .from('app_config')
    .select('*');

  if (allError) {
    console.error('❌ Error fetching all:', allError.message);
  } else {
    console.log('✅ Total records:', allData?.length || 0);
    console.log('📊 All data:', JSON.stringify(allData, null, 2));
  }

} catch (err) {
  console.error('💥 Unexpected error:', err);
}
