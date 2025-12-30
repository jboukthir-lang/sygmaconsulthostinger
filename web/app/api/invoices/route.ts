import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: Request) {
    try {
        const userId = request.headers.get('x-user-id');
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data, error } = await supabaseAdmin
            .from('invoices')
            .select(`
        *,
        client:clients(name, email)
      `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const userId = request.headers.get('x-user-id');
        if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const json = await request.json();
        const { items, ...invoiceData } = json;

        // Generate Invoice Number if not provided
        let invoiceNumber = invoiceData.number;
        if (!invoiceNumber) {
            // Check GLOBAL last invoice to avoid unique constraint violations
            const { data: lastInvoice } = await supabaseAdmin
                .from('invoices')
                .select('number')
                // .eq('user_id', userId) // REMOVED: Number must be unique globally
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            const currentYear = new Date().getFullYear();
            if (lastInvoice && lastInvoice.number) {
                // Try to increment
                // Format assumption: INV-YYYY-XXXX
                const parts = lastInvoice.number.split('-');
                if (parts.length === 3 && parts[1] == currentYear) {
                    const seq = parseInt(parts[2]);
                    if (!isNaN(seq)) {
                        invoiceNumber = `INV-${currentYear}-${(seq + 1).toString().padStart(4, '0')}`;
                    }
                }
            }

            if (!invoiceNumber) {
                // Default fallback
                invoiceNumber = `INV-${currentYear}-0001`;
            }
        }

        // 2. Fetch Client Details for Denormalization (Snapshot)
        if (invoiceData.client_id) {
            const { data: clientDetails } = await supabaseAdmin
                .from('clients')
                .select('*')
                .eq('id', invoiceData.client_id)
                .single();

            if (clientDetails) {
                invoiceData.client_name = clientDetails.name;
                invoiceData.client_email = clientDetails.email;
                // Format: Address, Zip City, Country
                const parts = [
                    clientDetails.address,
                    [clientDetails.postal_code, clientDetails.city].filter(Boolean).join(' '),
                    clientDetails.country
                ].filter(Boolean);
                invoiceData.client_address = parts.join(', ');
            }
        }

        // 1. Create Invoice
        const { data: invoice, error: invoiceError } = await supabaseAdmin
            .from('invoices')
            .insert([{ ...invoiceData, user_id: userId, number: invoiceNumber }])
            .select()
            .single();

        if (invoiceError) throw invoiceError;

        // 2. Create Invoice Items
        if (items && items.length > 0) {
            const { error: itemsError } = await supabaseAdmin
                .from('invoice_items')
                .insert(
                    items.map((item: any) => ({
                        description: item.description, // Explicit mapping to be safe
                        quantity: item.quantity,
                        unit_price: item.price, // Map prop 'price' to DB col 'unit_price'
                        invoice_id: invoice.id,
                    }))
                );

            if (itemsError) throw itemsError;
        }

        return NextResponse.json(invoice);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
