import { NextResponse } from 'next/server';

export async function GET() {
  // Check which environment variables are configured
  const envStatus = {
    supabase: {
      url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    stripe: {
      publishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      secretKey: !!process.env.STRIPE_SECRET_KEY,
      webhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
    },
    email: {
      smtpHost: !!process.env.SMTP_HOST,
      smtpPort: !!process.env.SMTP_PORT,
      smtpUser: !!process.env.SMTP_USER,
      smtpPassword: !!process.env.SMTP_PASSWORD,
      adminEmail: !!process.env.ADMIN_EMAIL,
    },
    google: {
      clientId: !!process.env.GOOGLE_CLIENT_ID,
      clientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: !!process.env.GOOGLE_REDIRECT_URI,
    },
    groq: {
      apiKey: !!process.env.GROQ_API_KEY,
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

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    configured: envStatus,
    summary: {
      supabase: allSupabaseConfigured ? '✅ Configured' : '❌ Missing variables',
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
  });
}
