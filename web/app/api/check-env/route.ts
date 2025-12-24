import { NextResponse } from 'next/server';
import { isStripeConfigured, getWebhookSecret } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  // Perform async checks for DB fallbacks
  const dbStripeConfigured = await isStripeConfigured();
  const dbWebhookSecret = await getWebhookSecret();

  // Check all settings from DB
  let dbSmtpConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
  let dbGoogleConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
  let dbGroqConfigured = !!process.env.GROQ_API_KEY;
  let dbCheckError = null;
  let dbData = null;

  // Fetch all settings from database
  try {
    const { data, error } = await supabaseAdmin.from('site_settings').select('key, value');
    if (error) {
      dbCheckError = error.message;
      console.error('Error fetching from site_settings:', error);
    } else {
      dbData = data;

      // Check SMTP from DB
      if (!dbSmtpConfigured) {
        const hasHost = data?.some((d: any) => d.key === 'SMTP_HOST' && d.value !== 'REPLACE_ME' && !d.value.includes('REPLACE'));
        const hasUser = data?.some((d: any) => d.key === 'SMTP_USER' && d.value !== 'REPLACE_ME' && !d.value.includes('REPLACE'));
        const hasPass = data?.some((d: any) => d.key === 'SMTP_PASSWORD' && d.value !== 'REPLACE_ME' && !d.value.includes('REPLACE'));
        dbSmtpConfigured = !!(hasHost && hasUser && hasPass);
      }

      // Check Google from DB
      if (!dbGoogleConfigured) {
        const hasClientId = data?.some((d: any) => d.key === 'GOOGLE_CLIENT_ID' && d.value !== 'REPLACE_ME' && !d.value.includes('REPLACE'));
        const hasClientSecret = data?.some((d: any) => d.key === 'GOOGLE_CLIENT_SECRET' && d.value !== 'REPLACE_ME' && !d.value.includes('REPLACE'));
        dbGoogleConfigured = !!(hasClientId && hasClientSecret);
      }

      // Check Groq from DB
      if (!dbGroqConfigured) {
        const hasGroqKey = data?.some((d: any) => d.key === 'GROQ_API_KEY' && d.value !== 'REPLACE_ME' && !d.value.includes('REPLACE'));
        dbGroqConfigured = !!hasGroqKey;
      }
    }
  } catch (e: any) {
    dbCheckError = e.message || 'Unknown error';
    console.error('Error checking settings from DB:', e);
  }

  // Check which environment variables are configured
  const envStatus = {
    supabase: {
      url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    mysql: {
      host: !!process.env.DB_HOST,
      port: !!process.env.DB_PORT,
      user: !!process.env.DB_USER,
      password: !!process.env.DB_PASSWORD,
      database: !!process.env.DB_NAME,
      actualHost: process.env.DB_HOST || 'NOT_SET',
      actualDatabase: process.env.DB_NAME || 'NOT_SET',
    },
    stripe: {
      publishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      secretKey: !!process.env.STRIPE_SECRET_KEY || dbStripeConfigured,
      webhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET || !!dbWebhookSecret,
      usingDatabaseFallback: dbStripeConfigured && !process.env.STRIPE_SECRET_KEY
    },
    email: {
      smtpHost: !!process.env.SMTP_HOST || dbSmtpConfigured,
      smtpPort: !!process.env.SMTP_PORT || dbSmtpConfigured,
      smtpUser: !!process.env.SMTP_USER || dbSmtpConfigured,
      smtpPassword: !!process.env.SMTP_PASSWORD || dbSmtpConfigured,
      adminEmail: !!process.env.ADMIN_EMAIL || dbSmtpConfigured,
      usingDatabaseFallback: dbSmtpConfigured && !process.env.SMTP_HOST
    },
    google: {
      clientId: !!process.env.GOOGLE_CLIENT_ID || dbGoogleConfigured,
      clientSecret: !!process.env.GOOGLE_CLIENT_SECRET || dbGoogleConfigured,
      redirectUri: !!process.env.GOOGLE_REDIRECT_URI,
      usingDatabaseFallback: dbGoogleConfigured && !process.env.GOOGLE_CLIENT_ID
    },
    groq: {
      apiKey: !!process.env.GROQ_API_KEY || dbGroqConfigured,
      usingDatabaseFallback: dbGroqConfigured && !process.env.GROQ_API_KEY
    },
    site: {
      url: !!process.env.NEXT_PUBLIC_URL,
      actualUrl: process.env.NEXT_PUBLIC_URL || 'NOT_SET',
    },
  };

  // Calculate overall status
  const allStripeConfigured =
    envStatus.stripe.publishableKey &&
    envStatus.stripe.secretKey &&
    envStatus.stripe.webhookSecret;

  const allSupabaseConfigured =
    envStatus.supabase.url &&
    envStatus.supabase.anonKey;

  const allEmailConfigured =
    envStatus.email.smtpHost &&
    envStatus.email.smtpPort &&
    envStatus.email.smtpUser &&
    envStatus.email.smtpPassword;

  const allMysqlConfigured =
    envStatus.mysql.host &&
    envStatus.mysql.port &&
    envStatus.mysql.user &&
    envStatus.mysql.password &&
    envStatus.mysql.database;

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    deploymentVersion: '1.0.3-mysql-integrated', // Updated to verify refresh
    environment: process.env.NODE_ENV || 'unknown',
    configured: envStatus,
    summary: {
      supabase: allSupabaseConfigured ? '✅ Configured' : '❌ Missing variables',
      mysql: allMysqlConfigured ? '✅ Configured' : '⚠️ Optional - Not configured',
      stripe: allStripeConfigured ? '✅ Configured' : '❌ Missing variables',
      email: allEmailConfigured ? '✅ Configured' : '❌ Missing variables',
      google: envStatus.google.clientId ? '✅ Configured' : '⚠️ Optional - Not configured',
      groq: envStatus.groq.apiKey ? '✅ Configured' : '⚠️ Optional - Not configured',
    },
    recommendations: [
      !allSupabaseConfigured ? '🔴 Add Supabase environment variables (REQUIRED)' : null,
      !allStripeConfigured ? '🔴 Add Stripe environment variables (REQUIRED for payments)' : null,
      !allEmailConfigured ? '🟡 Add Email/SMTP environment variables (REQUIRED for notifications)' : null,
      !envStatus.google.clientId ? '⚪ Add Google API variables (OPTIONAL - for calendar integration)' : null,
    ].filter(Boolean),
    allKeys: Object.keys(process.env).filter(k => !k.includes('PASS') && !k.includes('SECRET') && !k.includes('KEY')),
    secretKeysPresent: Object.keys(process.env).filter(k => k.includes('STRIPE') || k.includes('SMTP') || k.includes('SUPABASE')),
    // Debug info
    debug: {
      dbStripeConfigured,
      dbWebhookSecret: !!dbWebhookSecret,
      dbSmtpConfigured,
      dbGoogleConfigured,
      dbGroqConfigured,
      dbCheckError,
      dbDataCount: dbData?.length || 0,
      dbKeys: dbData?.map((d: any) => d.key) || []
    }
  });
}
