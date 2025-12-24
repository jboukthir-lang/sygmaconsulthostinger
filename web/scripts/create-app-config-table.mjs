#!/usr/bin/env node
/**
 * Create app_config table for site configuration (separate from secrets)
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ldbsacdpkinbpcguvgai.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkYnNhY2Rwa2luYnBjZ3V2Z2FpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTg5NTA3OCwiZXhwIjoyMDgxNDcxMDc4fQ.6n-kSxKBq_e4_NtYPRfyPDFHwjNhMiPmEP-GRbnhk4E';

const supabase = createClient(supabaseUrl, serviceRoleKey);

console.log('🔧 Creating app_config table and inserting default record...\n');

try {
  // First, check if table exists by trying to select from it
  const { data: checkData, error: checkError } = await supabase
    .from('app_config')
    .select('key')
    .eq('key', 'main')
    .single();

  if (!checkError || checkError.code === 'PGRST116') {
    // Table exists, check if 'main' record exists
    if (checkData) {
      console.log('✅ app_config table already exists with main record');
      console.log('📊 Current data:', checkData);
      process.exit(0);
    } else {
      // Table exists but no 'main' record, insert it
      console.log('📝 Table exists, inserting main record...');
      const { data, error } = await supabase
        .from('app_config')
        .insert({ key: 'main' })
        .select();

      if (error) {
        console.error('❌ Error inserting main record:', error.message);
        process.exit(1);
      }

      console.log('✅ Main record inserted successfully!');
      console.log('📊 Record:', data);
      process.exit(0);
    }
  }

  // Table doesn't exist, need to create it via SQL
  console.log('⚠️  Table does not exist. Creating via SQL...');

  const createTableSQL = `
    -- Create app_config table
    CREATE TABLE IF NOT EXISTS public.app_config (
      key TEXT PRIMARY KEY,
      company_name TEXT DEFAULT 'SYGMA CONSULT',
      company_tagline_en TEXT DEFAULT 'Your Strategic Partner for Growth',
      company_tagline_fr TEXT DEFAULT 'Votre Partenaire Stratégique pour la Croissance',
      company_tagline_ar TEXT DEFAULT 'شريكك الاستراتيجي للنمو',
      company_description_en TEXT DEFAULT 'Expert consulting for digital transformation and strategic growth',
      company_description_fr TEXT DEFAULT 'Conseil expert en transformation digitale et croissance stratégique',
      company_description_ar TEXT DEFAULT 'استشارات متخصصة في التحول الرقمي والنمو الاستراتيجي',
      phone_primary TEXT DEFAULT '+33 7 52 03 47 86',
      phone_secondary TEXT,
      whatsapp_number TEXT DEFAULT '+33 7 52 03 47 86',
      email_primary TEXT DEFAULT 'contact@sygma-consult.com',
      email_secondary TEXT,
      address_paris_en TEXT DEFAULT '6 rue Paul Verlaine, 93130 Noisy-le-Sec, France',
      address_paris_fr TEXT DEFAULT '6 rue Paul Verlaine, 93130 Noisy-le-Sec, France',
      address_paris_ar TEXT DEFAULT '6 شارع بول فيرلين، 93130 نوازي لو سيك، فرنسا',
      address_tunis_en TEXT DEFAULT 'Les Berges du Lac II, 1053 Tunis, Tunisia',
      address_tunis_fr TEXT DEFAULT 'Les Berges du Lac II, 1053 Tunis, Tunisie',
      address_tunis_ar TEXT DEFAULT 'ضفاف البحيرة 2، 1053 تونس، تونس',
      linkedin_url TEXT,
      twitter_url TEXT,
      facebook_url TEXT,
      instagram_url TEXT,
      youtube_url TEXT,
      business_hours_en TEXT DEFAULT 'Monday - Friday: 9:00 AM - 6:00 PM',
      business_hours_fr TEXT DEFAULT 'Lundi - Vendredi: 9h00 - 18h00',
      business_hours_ar TEXT DEFAULT 'الإثنين - الجمعة: 9:00 صباحاً - 6:00 مساءً',
      primary_color TEXT DEFAULT '#001F3F',
      secondary_color TEXT DEFAULT '#D4AF37',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Insert default 'main' record
    INSERT INTO public.app_config (key)
    VALUES ('main')
    ON CONFLICT (key) DO NOTHING;

    -- Enable RLS
    ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "App config readable by all" ON public.app_config;
    DROP POLICY IF EXISTS "App config updatable by authenticated" ON public.app_config;

    -- Policies: Everyone can read, authenticated can update
    CREATE POLICY "App config readable by all"
      ON public.app_config FOR SELECT
      USING (true);

    CREATE POLICY "App config updatable by authenticated"
      ON public.app_config FOR UPDATE
      USING (auth.role() = 'authenticated');

    -- Permissions
    GRANT SELECT ON public.app_config TO anon, authenticated;
    GRANT UPDATE ON public.app_config TO authenticated;
  `;

  // Execute via RPC or direct SQL
  const { data: sqlData, error: sqlError } = await supabase.rpc('exec_sql', { sql: createTableSQL }).catch(() => {
    // RPC might not exist, try alternative
    return { data: null, error: { message: 'RPC not available' } };
  });

  if (sqlError) {
    console.error('❌ Cannot create table via script. Please run this SQL manually in Supabase Dashboard:');
    console.log('\n---SQL START---');
    console.log(createTableSQL);
    console.log('---SQL END---\n');
    console.log('📍 Go to: https://supabase.com/dashboard/project/ldbsacdpkinbpcguvgai/sql/new');
    process.exit(1);
  }

  console.log('✅ Table created successfully!');

} catch (err) {
  console.error('💥 Unexpected error:', err);
  process.exit(1);
}
