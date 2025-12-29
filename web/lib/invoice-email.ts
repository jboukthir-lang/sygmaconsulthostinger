import nodemailer from 'nodemailer';
import { supabase } from './supabase';

export async function sendInvoiceEmail(
    recipientEmail: string,
    recipientName: string,
    invoiceNumber: string,
    pdfBuffer: Buffer,
    invoiceType: 'quote' | 'invoice' | 'credit_note'
) {
    try {
        // Get SMTP settings from database
        const { data: settings } = await supabase
            .from('site_settings')
            .select('*')
            .single();

        if (!settings) throw new Error('Site settings not found');

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || settings.smtp_host,
            port: parseInt(process.env.SMTP_PORT || settings.smtp_port || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER || settings.smtp_user,
                pass: process.env.SMTP_PASSWORD || settings.smtp_password,
            },
        });

        const typeLabels = {
            quote: { fr: 'Devis', en: 'Quote' },
            invoice: { fr: 'Facture', en: 'Invoice' },
            credit_note: { fr: 'Avoir', en: 'Credit Note' }
        };

        const label = typeLabels[invoiceType].fr;
        const companyName = settings.company_name || 'SYGMA CONSULT';

        const mailOptions = {
            from: `${companyName} <${process.env.SMTP_USER || settings.smtp_user}>`,
            to: recipientEmail,
            subject: `${label} ${invoiceNumber} - ${companyName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #001F3F 0%, #003366 100%); padding: 40px; text-align: center;">
                        <h1 style="color: #D4AF37; margin: 0; font-size: 32px;">${companyName}</h1>
                        <p style="color: white; margin: 10px 0 0 0;">Votre partenaire stratégique</p>
                    </div>
                    
                    <div style="padding: 40px; background: #f9f9f9;">
                        <h2 style="color: #001F3F; margin-top: 0;">Bonjour ${recipientName},</h2>
                        
                        <p style="color: #333; line-height: 1.6;">
                            Veuillez trouver ci-joint votre <strong>${label.toLowerCase()} ${invoiceNumber}</strong>.
                        </p>
                        
                        ${invoiceType === 'quote' ? `
                            <p style="color: #333; line-height: 1.6;">
                                Ce devis est valable 30 jours à compter de sa date d'émission.
                                Pour toute question, n'hésitez pas à nous contacter.
                            </p>
                        ` : ''}
                        
                        ${invoiceType === 'invoice' ? `
                            <p style="color: #333; line-height: 1.6;">
                                Merci de procéder au règlement dans les délais indiqués sur la facture.
                            </p>
                        ` : ''}
                        
                        <div style="margin: 30px 0; padding: 20px; background: white; border-left: 4px solid #D4AF37; border-radius: 4px;">
                            <p style="margin: 0; color: #666; font-size: 14px;">
                                <strong>Contact:</strong><br>
                                📧 ${settings.email_primary || 'contact@sygma-consult.com'}<br>
                                📞 ${settings.phone_primary || '+33 7 52 03 47 86'}<br>
                                🏢 ${settings.address_paris_fr || '6 rue Paul Verlaine, 93130 Noisy-le-Sec, France'}
                            </p>
                        </div>
                        
                        <p style="color: #666; font-size: 14px; margin-top: 30px;">
                            Cordialement,<br>
                            <strong style="color: #001F3F;">L'équipe ${companyName}</strong>
                        </p>
                    </div>
                    
                    <div style="padding: 20px; text-align: center; background: #001F3F; color: white; font-size: 12px;">
                        <p style="margin: 0;">
                            ${companyName} - ${settings.company_legal_form || 'SASU'} au capital de ${settings.company_capital || '1000'}€
                        </p>
                        <p style="margin: 5px 0 0 0; opacity: 0.8;">
                            SIRET: ${settings.company_siret || 'XXX XXX XXX XXXXX'} | 
                            TVA: ${settings.company_tva || 'FRXX XXX XXX XXX'} | 
                            RCS: ${settings.company_rcs || 'Paris B XXX XXX XXX'}
                        </p>
                    </div>
                </div>
            `,
            attachments: [
                {
                    filename: `${invoiceNumber}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}
