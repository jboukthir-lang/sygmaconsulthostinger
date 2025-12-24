#!/usr/bin/env node
/**
 * Create main site settings record
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ldbsacdpkinbpcguvgai.supabase.co';
const serviceRoleKey = process.argv[2];

if (!serviceRoleKey || serviceRoleKey.length < 20) {
  console.error('❌ Usage: node scripts/create-site-settings.mjs YOUR_SERVICE_ROLE_KEY');
  console.error('📍 Get service role key from Supabase dashboard');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

console.log('🔧 Creating main site settings record...\n');

const mainSettings = {
  key: 'main',
  company_name: 'Sygma Consult',
  company_tagline_en: 'Your Strategic Partner for Growth',
  company_tagline_fr: 'Votre Partenaire Stratégique pour la Croissance',
  company_tagline_ar: 'شريكك الاستراتيجي للنمو',
  company_description_en: 'Expert consulting firm specializing in digital transformation, legal & fiscal compliance, and strategic growth. Serving clients in Paris and Tunis.',
  company_description_fr: 'Cabinet de conseil expert en transformation digitale, conformité juridique et fiscale, et croissance stratégique. Au service des clients à Paris et Tunis.',
  company_description_ar: 'شركة استشارات متخصصة في التحول الرقمي والامتثال القانوني والضريبي والنمو الاستراتيجي. نخدم العملاء في باريس وتونس.',
  phone_primary: '+33 7 52 03 47 86',
  phone_secondary: '',
  whatsapp_number: '+33 7 52 03 47 86',
  email_primary: 'contact@sygma-consult.com',
  email_secondary: '',
  address_paris_en: '6 rue Paul Verlaine, 93130 Noisy-le-Sec, France',
  address_paris_fr: '6 rue Paul Verlaine, 93130 Noisy-le-Sec, France',
  address_paris_ar: '6 شارع بول فيرلين، 93130 نوازي لو سيك، فرنسا',
  address_tunis_en: 'Les Berges du Lac II, 1053 Tunis, Tunisia',
  address_tunis_fr: 'Les Berges du Lac II, 1053 Tunis, Tunisie',
  address_tunis_ar: 'ضفاف البحيرة 2، 1053 تونس، تونس',
  linkedin_url: 'https://www.linkedin.com/company/sygma-consult',
  twitter_url: '',
  facebook_url: '',
  instagram_url: '',
  youtube_url: '',
  business_hours_en: 'Monday - Friday: 9:00 AM - 6:00 PM',
  business_hours_fr: 'Lundi - Vendredi: 9h00 - 18h00',
  business_hours_ar: 'الإثنين - الجمعة: 9:00 صباحاً - 6:00 مساءً',
  primary_color: '#001F3F',
  secondary_color: '#D4AF37'
};

try {
  const { data, error } = await supabase
    .from('site_settings')
    .upsert(mainSettings, { onConflict: 'key' })
    .select();

  if (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }

  console.log('✅ Main site settings created successfully!');
  console.log('📊 Record:', data);
  console.log('\n🎉 You can now access https://sygmaconsult.com/admin/settings/site/');

} catch (err) {
  console.error('💥 Error:', err);
  process.exit(1);
}
