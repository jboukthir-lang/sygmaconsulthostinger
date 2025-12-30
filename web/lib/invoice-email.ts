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

        // Use entreprise@sygmaconsult.com specifically for invoices
        const invoiceSenderEmail = 'entreprise@sygmaconsult.com';

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || settings.smtp_host || 'smtp.hostinger.com',
            port: 465, // Force SSL for Hostinger
            secure: true,
            auth: {
                user: invoiceSenderEmail,
                pass: process.env.SMTP_PASSWORD || settings.smtp_password, // Uses the common password provided
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
            from: `${companyName} <${invoiceSenderEmail}>`,
            to: recipientEmail,
            subject: `${label} ${invoiceNumber} - ${companyName}`,
            html: `
                <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f6f8; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <!-- Header with Logo -->
                    <div style="background: white; padding: 30px; text-align: center; border-bottom: 2px solid #D4AF37;">
                        <img src="https://www.sygmaconsult.com/logo_sygma.png" alt="${companyName}" style="height: 60px; max-width: 200px; object-fit: contain;">
                        <p style="color: #666; margin: 10px 0 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Excellence & Innovation</p>
                    </div>
                    
                    <!-- Main Content -->
                    <div style="padding: 40px; background: white;">
                        <h2 style="color: #001F3F; margin-top: 0; font-size: 24px;">Bonjour ${recipientName},</h2>
                        
                        <p style="color: #4a5568; line-height: 1.6; font-size: 16px;">
                            Nous espérons que vous allez bien.
                        </p>
                        <p style="color: #4a5568; line-height: 1.6; font-size: 16px;">
                            Veuillez trouver ci-joint votre document <strong>${label} ${invoiceNumber}</strong>.
                        </p>
                        
                        ${invoiceType === 'quote' ? `
                            <div style="background-color: #f8fafc; border-left: 4px solid #001F3F; padding: 15px; margin: 25px 0;">
                                <p style="margin: 0; color: #2d3748; font-weight: 500;">
                                    Ce devis est valable <strong>30 jours</strong>. Nous restons à votre disposition pour le valider ensemble.
                                </p>
                            </div>
                        ` : ''}
                        
                        ${invoiceType === 'invoice' ? `
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.sygmaconsult.com/dashboard/client/invoices" style="background-color: #001F3F; color: white; padding: 12px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; border: 2px solid #001F3F; display: inline-block;">
                                    Accéder au Portail Client
                                </a>
                                <p style="margin-top: 15px; font-size: 12px; color: #718096;">
                                    Vous pouvez consulter et payer vos factures directement en ligne.
                                </p>
                            </div>
                        ` : ''}
                        
                        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                            <p style="color: #4a5568; font-size: 16px; font-weight: bold; margin-bottom: 5px;">Besoin d'aide ?</p>
                            <p style="color: #718096; margin: 0; line-height: 1.5;">
                                Notre équipe est à votre écoute :<br>
                                <a href="mailto:${settings.email_primary || 'contact@sygmasolution.com'}" style="color: #001F3F; text-decoration: none;">${settings.email_primary || 'contact@sygmasolution.com'}</a> | 
                                <span style="color: #718096;">${settings.phone_primary || '+33 7 52 03 47 86'}</span>
                            </p>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="padding: 25px; text-align: center; background-color: #001F3F; color: rgba(255,255,255,0.8); font-size: 12px;">
                        <p style="margin: 0 0 10px 0; font-weight: bold; color: white; font-size: 14px;">${companyName}</p>
                        <p style="margin: 0 0 10px 0;">
                            ${settings.address_paris_fr || '6 rue Paul Verlaine, 93130 Noisy-le-Sec, France'}
                        </p>
                        <div style="border-top: 1px solid rgba(255,255,255,0.2); margin: 15px auto; width: 50%;"></div>
                        <p style="margin: 0;">
                            ${settings.company_legal_form || 'SASU'} au capital de ${settings.company_capital || '1000'}€ • 
                            SIRET: ${settings.company_siret || '98363765400019'}
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
