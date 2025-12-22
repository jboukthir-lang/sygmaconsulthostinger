-- Add Stripe-related columns to bookings table
-- Execute this in Supabase SQL Editor after setting up Stripe

-- Add stripe_session_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'bookings'
    AND column_name = 'stripe_session_id'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN stripe_session_id VARCHAR(255);
  END IF;
END $$;

-- Add stripe_payment_intent_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'bookings'
    AND column_name = 'stripe_payment_intent_id'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN stripe_payment_intent_id VARCHAR(255);
  END IF;
END $$;

-- Create index on stripe_session_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_session
ON public.bookings(stripe_session_id);

-- Create index on stripe_payment_intent_id
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_payment_intent
ON public.bookings(stripe_payment_intent_id);

COMMENT ON COLUMN public.bookings.stripe_session_id IS 'Stripe Checkout Session ID';
COMMENT ON COLUMN public.bookings.stripe_payment_intent_id IS 'Stripe Payment Intent ID';

-- Display success message
DO $$
BEGIN
  RAISE NOTICE '✅ Stripe columns added successfully!';
  RAISE NOTICE '📝 Next steps:';
  RAISE NOTICE '   1. Configure Stripe keys in .env.local';
  RAISE NOTICE '   2. Set up webhooks in Stripe Dashboard';
  RAISE NOTICE '   3. Test payment flow';
END $$;
