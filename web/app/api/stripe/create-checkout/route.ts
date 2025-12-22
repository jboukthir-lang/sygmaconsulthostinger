import { NextRequest, NextResponse } from 'next/server';
import { stripe, formatAmountForStripe, isStripeConfigured } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!isStripeConfigured() || !stripe) {
      return NextResponse.json(
        { error: 'Payment system is not configured. Please contact support.' },
        { status: 503 }
      );
    }

    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Fetch booking details from database
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    if (error || !booking) {
      console.error('Error fetching booking:', error);
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Ensure booking has a price
    if (!booking.price || booking.price <= 0) {
      return NextResponse.json(
        { error: 'Invalid booking price' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Consultation: ${booking.specialization || booking.topic}`,
              description: `${booking.duration || 30} minutes ${booking.is_online ? 'online' : 'in-person'} consultation`,
              images: [`${baseUrl}/logo.png`],
              metadata: {
                booking_id: bookingId,
                consultation_type: booking.specialization || 'General',
              },
            },
            unit_amount: formatAmountForStripe(booking.price),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/booking/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
      cancel_url: `${baseUrl}/booking/cancel?booking_id=${bookingId}`,
      client_reference_id: bookingId,
      customer_email: booking.email,
      metadata: {
        booking_id: bookingId,
        user_id: booking.user_id || 'guest',
        consultation_type: booking.specialization || 'General',
        date: booking.date,
        time: booking.time,
      },
      billing_address_collection: 'auto',
      payment_intent_data: {
        metadata: {
          booking_id: bookingId,
          user_id: booking.user_id || 'guest',
        },
      },
    });

    // Update booking with Stripe session ID
    await supabase
      .from('bookings')
      .update({
        stripe_session_id: session.id,
        payment_status: 'pending',
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId);

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      {
        error: error.message || 'An error occurred while creating checkout session',
      },
      { status: 500 }
    );
  }
}
