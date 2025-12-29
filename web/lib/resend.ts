import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

// Helper to get Resend instance with DB fallback
export async function getResendClient() {
    let apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
        try {
            const { supabaseAdmin } = await import('./supabase-admin');
            const { data } = await supabaseAdmin
                .from('site_settings')
                .select('value')
                .eq('key', 'RESEND_API_KEY')
                .single();

            if (data?.value && data.value !== 'REPLACE_ME' && !data.value.includes('REPLACE')) {
                apiKey = data.value;
                console.log('✅ Resend API key loaded from database fallback');
            }
        } catch (e) {
            console.error('Failed to load Resend API key from DB fallback:', e);
        }
    }

    if (!apiKey) return null;
    return new Resend(apiKey);
}

// Email configuration
// If you have verified your domain in Resend, use: 'Sygma Consult <contact@sygma-consult.com>'
// Otherwise, use the default: 'Sygma Consult <onboarding@resend.dev>'
export const EMAIL_FROM = process.env.EMAIL_FROM || 'Sygma Consult <onboarding@resend.dev>';
export const EMAIL_TO_ADMIN = process.env.ADMIN_EMAIL || 'contact@sygma-consult.com';
