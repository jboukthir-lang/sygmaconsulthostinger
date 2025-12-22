import Stripe from 'stripe';

// Initialize Stripe only if the secret key is available
// This allows the app to build even if Stripe is not configured
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2024-11-20.acacia',
      typescript: true,
    })
  : null;

// Helper function to check if Stripe is configured
export function isStripeConfigured(): boolean {
  return !!stripeSecretKey;
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
