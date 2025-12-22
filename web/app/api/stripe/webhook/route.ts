import { NextRequest, NextResponse } from 'next/server';
import { stripe, formatAmountFromStripe, isStripeConfigured } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  // Check if Stripe is configured
  if (!isStripeConfigured() || !stripe || !webhookSecret) {
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
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
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
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
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
  const { data: booking, error: updateError } = await supabase
    .from('bookings')
    .update({
      payment_status: 'paid',
      status: 'confirmed',
      stripe_payment_id: session.payment_intent as string,
      stripe_session_id: session.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId)
    .select()
    .single();

  if (updateError) {
    console.error('Error updating booking:', updateError);
    throw updateError;
  }

  console.log(`✅ Booking ${bookingId} marked as paid and confirmed`);

  // Send confirmation email (implement your email sending logic)
  // await sendBookingConfirmation(booking);

  // Create notification for user
  if (booking.user_id) {
    await supabase.from('notifications').insert({
      user_id: booking.user_id,
      title: 'Payment Successful',
      message: `Your payment of €${formatAmountFromStripe(session.amount_total || 0)} has been processed successfully. Your consultation is confirmed for ${booking.date} at ${booking.time}.`,
      type: 'success',
      link: `/profile/bookings/${bookingId}`,
    });
  }

  // Create notification for admin
  await supabase.from('notifications').insert({
    title: 'New Paid Booking',
    message: `${booking.name} has completed payment for "${booking.topic}" on ${booking.date} at ${booking.time}`,
    type: 'booking',
    link: `/admin/bookings`,
  });

  console.log(`✅ Notifications created for booking ${bookingId}`);
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const bookingId = paymentIntent.metadata.booking_id;

  if (!bookingId) {
    console.error('No booking ID in payment intent metadata');
    return;
  }

  console.log(`Payment succeeded for booking: ${bookingId}, amount: ${formatAmountFromStripe(paymentIntent.amount)}`);

  // Additional logging or processing if needed
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const bookingId = paymentIntent.metadata.booking_id;

  if (!bookingId) {
    console.error('No booking ID in payment intent metadata');
    return;
  }

  console.log(`Payment failed for booking: ${bookingId}`);

  // Update booking status
  await supabase
    .from('bookings')
    .update({
      payment_status: 'failed',
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId);

  // Notify user of failed payment
  const { data: booking } = await supabase
    .from('bookings')
    .select('user_id, name')
    .eq('id', bookingId)
    .single();

  if (booking?.user_id) {
    await supabase.from('notifications').insert({
      user_id: booking.user_id,
      title: 'Payment Failed',
      message: 'Your payment could not be processed. Please try booking again or contact support.',
      type: 'error',
      link: `/book`,
    });
  }
}

async function handleRefund(charge: Stripe.Charge) {
  const bookingId = charge.metadata?.booking_id;

  if (!bookingId) {
    console.error('No booking ID in charge metadata');
    return;
  }

  console.log(`Refund issued for booking: ${bookingId}`);

  // Update booking status
  await supabase
    .from('bookings')
    .update({
      payment_status: 'refunded',
      status: 'cancelled',
      updated_at: new Date().toISOString(),
    })
    .eq('id', bookingId);

  // Notify user
  const { data: booking } = await supabase
    .from('bookings')
    .select('user_id, price')
    .eq('id', bookingId)
    .single();

  if (booking?.user_id) {
    await supabase.from('notifications').insert({
      user_id: booking.user_id,
      title: 'Refund Processed',
      message: `Your booking has been cancelled and €${booking.price} has been refunded to your account.`,
      type: 'info',
      link: `/profile/bookings`,
    });
  }
}
