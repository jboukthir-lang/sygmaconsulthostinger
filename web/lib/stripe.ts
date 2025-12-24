import Stripe from 'stripe';

// Initialize Stripe only if the secret key is available
// This allows the app to build even if Stripe is not configured
// Getter function to get Stripe instance
// Using a function ensures we evaluate process.env at runtime, not just at module load
export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;

  return new Stripe(secretKey, {
    apiVersion: '2025-12-15.clover' as any,
    typescript: true,
  });
}

// Helper function to check if Stripe is configured
export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
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
