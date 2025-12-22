import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
// If you have verified your domain in Resend, use: 'Sygma Consult <contact@sygma-consult.com>'
// Otherwise, use the default: 'Sygma Consult <onboarding@resend.dev>'
export const EMAIL_FROM = process.env.EMAIL_FROM || 'Sygma Consult <onboarding@resend.dev>';
export const EMAIL_TO_ADMIN = process.env.ADMIN_EMAIL || 'contact@sygma-consult.com';
