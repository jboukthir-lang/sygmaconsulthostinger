import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: Request) {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Fetch counts in parallel
        const [clientsRes, invoicesRes, productsRes, revenueRes] = await Promise.all([
            // Total Clients
            supabaseAdmin
                .from('clients')
                .select('id', { count: 'exact', head: true })
                .eq('user_id', userId),

            // Total Invoices
            supabaseAdmin
                .from('invoices')
                .select('id', { count: 'exact', head: true })
                .eq('user_id', userId),

            // Total Products
            supabaseAdmin
                .from('products')
                .select('id', { count: 'exact', head: true })
                .eq('user_id', userId),

            // Total Revenue (Paid Invoices)
            supabaseAdmin
                .from('invoices')
                .select('total_incl_tax')
                .eq('user_id', userId)
                .eq('status', 'paid')
        ]);

        const totalClients = clientsRes.count || 0;
        const totalInvoices = invoicesRes.count || 0;
        const totalProducts = productsRes.count || 0;

        // Calculate Revenue
        const revenue = revenueRes.data?.reduce((sum, inv) => sum + (inv.total_incl_tax || 0), 0) || 0;

        return NextResponse.json({
            totalClients,
            totalInvoices,
            totalProducts,
            revenue
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
