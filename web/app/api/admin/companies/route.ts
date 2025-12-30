import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabase = supabaseAdmin;

        // 1. Fetch Companies
        const { data: companies, error: companiesError } = await supabase
            .from('companies')
            .select('*')
            .order('created_at', { ascending: false });

        if (companiesError) throw companiesError;

        // 2. Fetch Subscription Plans (to get prices)
        const { data: plans, error: plansError } = await supabase
            .from('subscription_plans')
            .select('*');

        if (plansError) console.error('Error fetching plans:', plansError);

        // Map plan prices
        const planMap = (plans || []).reduce((acc: any, plan: any) => {
            acc[plan.name.toLowerCase()] = plan.price_monthly;
            return acc;
        }, { free: 0, start: 19, pro: 49, enterprise: 0 }); // Fallbacks

        // 3. Fetch Invoices (for total revenue)
        // Since we might not have 'companies.invoices' foreign key linkage available in REST easily without embedding,
        // we can fetch aggregated invoice stats or just use the local 'companies.total_revenue_generated' if reliable.
        // For "primitive" fix -> We will CALCULATE stats from real invoice data if possible.
        // Let's try fetching all 'paid' invoices to get accurate revenue.
        const { data: paidInvoices, error: invoicesError } = await supabase
            .from('invoices')
            .select('subtotal, company_id')
            .eq('status', 'paid');

        // Calculate Revenue per Company from real invoices
        const revenueByCompany: Record<string, number> = {};
        if (paidInvoices) {
            paidInvoices.forEach(inv => {
                const cid = inv.company_id;
                revenueByCompany[cid] = (revenueByCompany[cid] || 0) + Number(inv.subtotal || 0);
            });
        }

        // --- Calculate Dashboard Stats ---
        const totalCompanies = companies.length;
        const activeCompanies = companies.filter(c => c.subscription_status === 'ACTIVE' || c.subscription_status === 'active').length;

        // MRR = Sum of monthly price of all active subscriptions
        const mrr = companies.reduce((sum, c) => {
            if (c.subscription_status?.toLowerCase() === 'active') {
                const price = planMap[c.subscription_plan?.toLowerCase()] || 0;
                return sum + Number(price);
            }
            return sum;
        }, 0);

        // Churn = Inactive companies / Total companies (Basic calculation)
        const cancelledCompanies = companies.filter(c => c.subscription_status === 'CANCELED' || c.subscription_status === 'canceled').length;
        const churnRate = totalCompanies > 0 ? (cancelledCompanies / totalCompanies) * 100 : 0;

        // Enhance Company Objects with reliable stats
        const enhancedCompanies = companies.map(c => ({
            ...c,
            real_revenue: revenueByCompany[c.id] || c.total_revenue_generated || 0,
            plan_price: planMap[c.subscription_plan?.toLowerCase()] || 0
        }));

        return NextResponse.json({
            companies: enhancedCompanies,
            stats: {
                totalCompanies,
                activeSubscriptions: activeCompanies,
                mrr,
                churnRate,
                totalRevenue: Object.values(revenueByCompany).reduce((a, b) => a + b, 0)
            }
        });

    } catch (error: any) {
        console.error('Error fetching admin stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stats', details: error.message },
            { status: 500 }
        );
    }
}
