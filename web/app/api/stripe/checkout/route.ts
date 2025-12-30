import { NextRequest, NextResponse } from 'next/server';

// Note: Stripe integration requires STRIPE_SECRET_KEY in environment variables
// This is a placeholder - actual Stripe integration should be implemented in production

export async function POST(request: NextRequest) {
    try {
        const { plan, billingCycle } = await request.json();

        // Validate input
        if (!plan || !billingCycle) {
            return NextResponse.json(
                { error: 'Missing required parameters' },
                { status: 400 }
            );
        }

        // Price mapping
        const prices: Record<string, { monthly: number; yearly: number }> = {
            start: { monthly: 19, yearly: 228 },
            pro: { monthly: 49, yearly: 588 },
        };

        const planPrices = prices[plan];
        if (!planPrices) {
            return NextResponse.json(
                { error: 'Invalid plan' },
                { status: 400 }
            );
        }

        const amount = billingCycle === 'yearly' ? planPrices.yearly : planPrices.monthly;

        // TODO: Implement actual Stripe checkout session creation
        // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
        // const session = await stripe.checkout.sessions.create({...});

        // For now, return mock response
        return NextResponse.json({
            sessionId: 'mock_session_id',
            url: '/dashboard/entreprise?payment=success',
            message: 'Stripe integration pending - redirect to dashboard',
        });

    } catch (error) {
        console.error('Stripe checkout error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
