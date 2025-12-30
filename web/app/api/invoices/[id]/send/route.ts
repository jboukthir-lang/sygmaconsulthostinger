
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const userId = request.headers.get('x-user-id');
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // 1. Verify Invoice Exists
        const { data: invoice, error } = await supabaseAdmin
            .from('invoices')
            .select('*, client:clients(email)')
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        if (error || !invoice) {
            return NextResponse.json({ error: 'Facture introuvable' }, { status: 404 });
        }

        if (!invoice.client_email) {
            // Try to find email from client_email denormalized field OR the relation
            if (!invoice.client?.email) {
                return NextResponse.json({ error: 'Aucune adresse email trouvée pour ce client.' }, { status: 400 });
            }
        }

        const targetEmail = invoice.client_email || invoice.client?.email;

        // 2. MOCK Sending Email
        // In a real scenario, we would use Resend, SendGrid, or Nodemailer here.
        // For now, we simulate success and update the status.
        console.log(`[MOCK EMAIL] Sending Invoice #${invoice.number} to ${targetEmail}`);

        // 3. Update Invoice Status to 'sent'
        const { error: updateError } = await supabaseAdmin
            .from('invoices')
            .update({ status: 'sent' })
            .eq('id', params.id);

        if (updateError) throw updateError;

        return NextResponse.json({ success: true, message: `Email simulé envoyé à ${targetEmail}` });

    } catch (error: any) {
        console.error("Email Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
