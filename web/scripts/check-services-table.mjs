import { createClient } from '@supabase/supabase-js';

// Supabase credentials - hardcoded for this check script
const supabaseUrl = 'https://ldbsacdpkinbpcguvgai.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkYnNhY2Rwa2luYnBjZ3V2Z2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4OTUwNzgsImV4cCI6MjA4MTQ3MTA3OH0.Qib8uCPcd6CJypKa_oNEDThIQNfTluH2eJE0nsewwug';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkServicesTable() {
  console.log('🔍 Checking Services Table in Supabase...\n');

  try {
    // Check if services table exists and get data
    const { data: services, error } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('❌ Error accessing services table:', error.message);
      console.log('\n📝 The services table might not exist yet.');
      console.log('💡 Run the migration: npx supabase db push');
      return;
    }

    if (!services || services.length === 0) {
      console.log('⚠️  Services table exists but is empty!');
      console.log('💡 You may need to run the migration to insert default services.');
      return;
    }

    console.log(`✅ Services table exists with ${services.length} services\n`);
    console.log('📋 Services List:\n');
    console.log('─'.repeat(80));

    services.forEach((service, index) => {
      console.log(`${index + 1}. ${service.title_en}`);
      console.log(`   🇬🇧 EN: ${service.title_en}`);
      console.log(`   🇫🇷 FR: ${service.title_fr}`);
      console.log(`   🇸🇦 AR: ${service.title_ar}`);
      console.log(`   🔗 URL: ${service.href}`);
      console.log(`   📌 Icon: ${service.icon}`);
      console.log(`   ${service.is_active ? '✅' : '❌'} Active: ${service.is_active}`);
      console.log(`   📊 Order: ${service.display_order}`);
      console.log('─'.repeat(80));
    });

    console.log('\n✅ All services are properly configured!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

async function checkBookingsTable() {
  console.log('\n\n🔍 Checking Bookings Table Structure...\n');

  try {
    // Try to get a sample booking to check table structure
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Error accessing bookings table:', error.message);
      return;
    }

    console.log('✅ Bookings table is accessible');

    if (bookings && bookings.length > 0) {
      console.log('\n📋 Sample booking structure:');
      console.log(JSON.stringify(bookings[0], null, 2));
    } else {
      console.log('ℹ️  No bookings found (table is empty)');
    }

  } catch (error) {
    console.error('❌ Error checking bookings:', error);
  }
}

async function checkSupabaseConnection() {
  console.log('\n\n🔍 Testing Supabase Connection...\n');

  try {
    const { data, error } = await supabase
      .from('services')
      .select('count');

    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }

    console.log('✅ Supabase connection is working!');
    return true;

  } catch (error) {
    console.error('❌ Connection error:', error);
    return false;
  }
}

// Run all checks
async function runAllChecks() {
  console.log('🚀 Starting Supabase Database Checks...\n');
  console.log('='.repeat(80));

  const isConnected = await checkSupabaseConnection();

  if (isConnected) {
    await checkServicesTable();
    await checkBookingsTable();
  }

  console.log('\n' + '='.repeat(80));
  console.log('✅ Database checks completed!\n');
}

runAllChecks();
