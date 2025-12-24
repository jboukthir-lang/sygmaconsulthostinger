import { NextRequest, NextResponse } from 'next/server';
import { getStripe, formatAmountFromStripe, isStripeConfigured } from '@/lib/stripe';
import { updateBooking, getBookingById } from '@/lib/local-storage';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  // Check if Stripe is configured
  const stripeInstance = getStripe();
  if (!isStripeConfigured() || !stripeInstance || !webhookSecret) {
    return NextResponse.json(
      { error: 'Payment system is not configured' },
      { status: 503 }
    );
  }

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripeInstance.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  console.log(`✅ Webhook received: ${event.type}`);

  // Handle different event types
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session);
        break;

      case 'payment_intent.succeeded':
        // Optional: logic for payment intent success if separate from checkout
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'charge.refunded':
        await handleRefund(event.data.object as Stripe.Charge);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error: any) {
    console.error(`Error processing event ${event.type}:`, error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const bookingId = session.client_reference_id || session.metadata?.booking_id;

  if (!bookingId) {
    console.error('No booking ID found in session');
    return;
  }

  console.log(`Processing payment for booking: ${bookingId}`);

  // Update booking status
  await updateBooking(bookingId, {
    payment_status: 'paid',
    status: 'confirmed',
    stripe_payment_id: session.payment_intent as string,
    stripe_session_id: session.id,
  });

  console.log(`✅ Booking ${bookingId} marked as paid and confirmed`);
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const bookingId = paymentIntent.metadata.booking_id;

  if (!bookingId) {
    return;
  }

  console.log(`Payment failed for booking: ${bookingId}`);

  // Update booking status
  await updateBooking(bookingId, {
    payment_status: 'failed'
  });
}

async function handleRefund(charge: Stripe.Charge) {
  const bookingId = charge.metadata?.booking_id;

  if (!bookingId) {
    return;
  }

  console.log(`Refund issued for booking: ${bookingId}`);

  // Update booking status
  await updateBooking(bookingId, {
    payment_status: 'refunded',
    status: 'cancelled'
  });
}
