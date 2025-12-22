import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://ldbsacdpkinbpcguvgai.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkYnNhY2Rwa2luYnBjZ3V2Z2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4OTUwNzgsImV4cCI6MjA4MTQ3MTA3OH0.Qib8uCPcd6CJypKa_oNEDThIQNfTluH2eJE0nsewwug';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔧 Applying site_settings migration fix...\n');

// Read the SQL file
const sqlFilePath = path.join(__dirname, '..', 'supabase', 'migrations', 'fix_site_settings_table.sql');
const sql = fs.readFileSync(sqlFilePath, 'utf8');

console.log('📝 SQL Migration loaded');
console.log('⚠️  Note: This script uses the anon key and cannot execute DDL statements directly.');
console.log('📋 Please copy the SQL from fix_site_settings_table.sql and run it in Supabase SQL Editor.\n');

console.log('✅ To apply this migration:');
console.log('1. Go to: https://supabase.com/dashboard/project/ldbsacdpkinbpcguvgai/sql/new');
console.log('2. Copy the content from: web/supabase/migrations/fix_site_settings_table.sql');
console.log('3. Paste it in the SQL Editor');
console.log('4. Click "Run" or press Ctrl+Enter\n');

// Alternatively, let's try to insert the data directly
console.log('🔄 Attempting to insert default site settings data...\n');

try {
  const { data, error } = await supabase
    .from('site_settings')
    .upsert({
      key: 'main',
      company_name: 'SYGMA CONSULT',
      phone_primary: '+33 7 52 03 47 86',
      email_primary: 'contact@sygma-consult.com',
      whatsapp_number: '+33 7 52 03 47 86',
      address_paris_en: '6 rue Paul Verlaine, 93130 Noisy-le-Sec',
      address_paris_fr: '6 rue Paul Verlaine, 93130 Noisy-le-Sec',
      address_paris_ar: '6 rue Paul Verlaine, 93130 Noisy-le-Sec',
      address_tunis_en: 'Les Berges du Lac II, 1053 Tunis',
      address_tunis_fr: 'Les Berges du Lac II, 1053 Tunis',
      address_tunis_ar: 'Les Berges du Lac II, 1053 Tunis',
      company_description_en: 'Your trusted strategic partner for digital transformation, legal compliance, and business growth in Paris and Tunis.',
      company_description_fr: 'Votre partenaire stratégique de confiance pour la transformation numérique et la croissance à Paris et Tunis.',
      company_description_ar: 'شريكك الاستراتيجي الموثوق للتحول الرقمي، الامتثال القانوني، ونمو الأعمال في باريس وتونس.',
      business_hours_en: 'Monday - Friday: 9:00 AM - 6:00 PM',
      business_hours_fr: 'Lundi - Vendredi: 9h00 - 18h00',
      business_hours_ar: 'الاثنين - الجمعة: 9:00 صباحاً - 6:00 مساءً',
      primary_color: '#001F3F',
      secondary_color: '#D4AF37'
    }, {
      onConflict: 'key'
    })
    .select();

  if (error) {
    console.error('❌ Error inserting data:', error.message);
    console.log('\n💡 This might be because the columns don\'t exist yet.');
    console.log('   Please run the fix_site_settings_table.sql in Supabase SQL Editor first.\n');
  } else {
    console.log('✅ Default site settings inserted successfully!');
    console.log('📊 Data:', JSON.stringify(data, null, 2));
  }
} catch (err) {
  console.error('❌ Unexpected error:', err.message);
}

console.log('\n✅ Done!');
