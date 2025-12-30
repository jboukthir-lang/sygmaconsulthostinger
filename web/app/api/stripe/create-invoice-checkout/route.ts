
import { NextRequest, NextResponse } from 'next/server';
import { getStripe, formatAmountForStripe, isStripeConfigured } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
    try {
        const { invoiceId, userId } = await req.json();

        if (!invoiceId || !userId) {
            return NextResponse.json({ error: 'Invoice ID and User ID are required' }, { status: 400 });
        }

        // 1. Verify Stripe Configuration
        const stripeInstance = await getStripe();
        const isConfigured = await isStripeConfigured();
        if (!isConfigured || !stripeInstance) {
            return NextResponse.json(
                { error: 'Payment system is not configured. Please check site settings.' },
                { status: 503 }
            );
        }

        // 2. Fetch Invoice Details
        const { data: invoice, error: invoiceError } = await supabaseAdmin
            .from('invoices')
            .select('*, items:invoice_items(*), client:clients(*)')
            .eq('id', invoiceId)
            .eq('user_id', userId)
            .single();

        if (invoiceError || !invoice) {
            console.error("Invoice fetch error:", invoiceError);
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        // 3. Create Stripe Session
        const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

        // Construct line items from invoice items
        const line_items = invoice.items.map((item: any) => ({
            price_data: {
                currency: 'eur', // TODO: Make dynamic if needed
                product_data: {
                    name: item.description,
                },
                unit_amount: formatAmountForStripe(item.price),
            },
            quantity: item.quantity,
        }));

        // If no items, fallback (shouldn't happen for valid invoices)
        if (line_items.length === 0) {
            return NextResponse.json({ error: 'Invoice has no items' }, { status: 400 });
        }

        const session = await stripeInstance.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: line_items,
            mode: 'payment',
            success_url: `${baseUrl}/dashboard/entreprise/invoices/${invoiceId}?payment=success`,
            cancel_url: `${baseUrl}/dashboard/entreprise/invoices/${invoiceId}?payment=cancelled`,
            client_reference_id: invoiceId,
            customer_email: invoice.client?.email,
            metadata: {
                invoice_id: invoiceId,
                invoice_number: invoice.number,
                user_id: userId,
            },
            payment_intent_data: {
                metadata: {
                    invoice_id: invoiceId,
                    invoice_number: invoice.number,
                }
            }
        });

        return NextResponse.json({ url: session.url, sessionId: session.id });

    } catch (error: any) {
        console.error('Stripe invoice checkout error:', error);
        return NextResponse.json(
            { error: error.message || 'An error occurred' },
            { status: 500 }
        );
    }
}
