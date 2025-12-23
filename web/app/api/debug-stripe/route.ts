import { NextResponse } from 'next/server';

export async function GET() {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const stripePublic = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    return NextResponse.json({
        hasStripeSecret: !!stripeKey,
        hasStripePublic: !!stripePublic,
        secretKeyLength: stripeKey ? stripeKey.length : 0,
        publicKeyPrefix: stripePublic ? stripePublic.substring(0, 8) : 'none',
        timestamp: new Date().toISOString()
    });
}
