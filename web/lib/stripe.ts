import Stripe from 'stripe';

// Getter function to get Stripe instance
// Using a function ensures we evaluate process.env at runtime, not just at module load
export async function getStripe() {
  let secretKey = process.env.STRIPE_SECRET_KEY;

  // High-availability fallback: Try getting from DB if env is missing
  if (!secretKey) {
    try {
      // Use admin client to bypass RLS
      const { supabaseAdmin } = await import('./supabase-admin');
      const { data } = await supabaseAdmin
        .from('site_settings')
        .select('value')
        .eq('key', 'STRIPE_SECRET_KEY')
        .single();

      if (data?.value && data.value !== 'REPLACE_ME') {
        secretKey = data.value;
        console.log('✅ Stripe secret loaded from database fallback');
      }
    } catch (e) {
      console.error('Failed to load Stripe secret from DB fallback:', e);
    }
  }

  if (!secretKey) return null;

  return new Stripe(secretKey, {
    apiVersion: '2025-12-15.clover' as any,
    typescript: true,
  });
}

// Helper to get Webhook Secret with fallback
export async function getWebhookSecret() {
  let secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    try {
      const { supabaseAdmin } = await import('./supabase-admin');
      const { data } = await supabaseAdmin
        .from('site_settings')
        .select('value')
        .eq('key', 'STRIPE_WEBHOOK_SECRET')
        .single();

      if (data?.value && data.value !== 'REPLACE_ME') {
        secret = data.value;
        console.log('✅ Stripe webhook secret loaded from database fallback');
      }
    } catch (e) {
      console.error('Failed to load Stripe webhook secret from DB fallback:', e);
    }
  }

  return secret;
}

// Helper function to check if Stripe is configured
export async function isStripeConfigured(): Promise<boolean> {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (secret) return true;

  // Check DB if env is missing
  try {
    const { supabaseAdmin } = await import('./supabase-admin');
    const { data } = await supabaseAdmin
      .from('site_settings')
      .select('value')
      .eq('key', 'STRIPE_SECRET_KEY')
      .single();
    return !!(data?.value && data.value !== 'REPLACE_ME');
  } catch {
    return false;
  }
}

export const CURRENCY = 'eur';

// Helper function to format amount for Stripe (convert EUR to cents)
export function formatAmountForStripe(amount: number, currency: string = CURRENCY): number {
  return Math.round(amount * 100);
}

// Helper function to format amount for display (convert cents to EUR)
export function formatAmountFromStripe(amount: number, currency: string = CURRENCY): number {
  return amount / 100;
}
