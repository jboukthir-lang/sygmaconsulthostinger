import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendInvoiceEmail } from '@/lib/invoice-email';
import jsPDF from 'jspdf';

export async function POST(request: NextRequest) {
    try {
        const { invoiceId, action } = await request.json();

        const { data: invoice, error: invoiceError } = await supabase
            .from('invoices')
            .select('*')
            .eq('id', invoiceId)
            .single();

        if (invoiceError || !invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        const { data: settings } = await supabase.from('site_settings').select('*').single();
        const pdfBuffer = await generateInvoicePDF(invoice, settings);

        if (action === 'download') {
            return new NextResponse(pdfBuffer, {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `attachment; filename="${invoice.number}.pdf"`
                }
            });
        }

        if (action === 'email') {
            if (!invoice.client_email) {
                return NextResponse.json({ error: 'Email client manquant' }, { status: 400 });
            }

            await sendInvoiceEmail(
                invoice.client_email,
                invoice.client_name,
                invoice.number,
                Buffer.from(pdfBuffer),
                invoice.type
            );

            await supabase.from('invoices').update({ status: 'sent' }).eq('id', invoiceId);
            return NextResponse.json({ success: true, message: 'Email envoyé avec succès' });
        }

        return NextResponse.json({ error: 'Action invalide' }, { status: 400 });
    } catch (error: any) {
        console.error('Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function generateInvoicePDF(invoice: any, settings: any): Promise<Uint8Array> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const isQuote = invoice.type === 'quote';
    const title = isQuote ? 'DEVIS' : invoice.type === 'invoice' ? 'FACTURE' : 'AVOIR';
    const primaryColor = '#001F3F';
    const goldColor = '#D4AF37';
    const grayColor = '#6b7280';

    let yPos = 20;

    // Header
    doc.setFontSize(24);
    doc.setTextColor(primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text(settings?.company_name || 'SYGMA CONSULT', 20, yPos);

    doc.setFontSize(28);
    doc.setTextColor(goldColor);
    doc.text(title, pageWidth - 20, yPos, { align: 'right' });

    yPos += 10;

    // Company info
    doc.setFontSize(9);
    doc.setTextColor(grayColor);
    doc.setFont('helvetica', 'normal');
    doc.text(settings?.address_paris_fr || '6 rue Paul Verlaine, 93130 Noisy-le-Sec', 20, yPos);
    yPos += 4;
    doc.text(`SIRET: ${settings?.company_siret || 'XXX XXX XXX XXXXX'}`, 20, yPos);
    yPos += 4;
    doc.text(`TVA: ${settings?.company_tva || 'FRXX XXX XXX XXX'}`, 20, yPos);
    yPos += 4;
    doc.text(`${settings?.email_primary || 'contact@sygma-consult.com'}`, 20, yPos);

    // Invoice number
    yPos = 35;
    doc.setFontSize(11);
    doc.setFont('courier', 'bold');
    doc.text(invoice.number, pageWidth - 20, yPos, { align: 'right' });
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Date: ${new Date(invoice.issue_date).toLocaleDateString('fr-FR')}`, pageWidth - 20, yPos, { align: 'right' });

    yPos = 65;

    // Client box
    doc.setFillColor(249, 250, 251);
    doc.rect(20, yPos, pageWidth - 40, 30, 'F');
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(2);
    doc.line(20, yPos, 20, yPos + 30);

    yPos += 8;
    doc.setFontSize(10);
    doc.setTextColor(primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('CLIENT', 25, yPos);

    yPos += 6;
    doc.setFontSize(11);
    doc.setTextColor('#000000');
    doc.text(invoice.client_name, 25, yPos);

    yPos += 5;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(grayColor);
    if (invoice.client_address) {
        doc.text(invoice.client_address, 25, yPos);
        yPos += 4;
    }
    if (invoice.client_email) {
        doc.text(invoice.client_email, 25, yPos);
        yPos += 4;
    }
    if (invoice.client_siret) {
        doc.text(`SIRET: ${invoice.client_siret}`, 25, yPos);
    }

    yPos = 105;

    // Table header
    doc.setFillColor(primaryColor);
    doc.rect(20, yPos, pageWidth - 40, 8, 'F');

    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('DESCRIPTION', 22, yPos + 5.5);
    doc.text('QTE', pageWidth - 85, yPos + 5.5, { align: 'center' });
    doc.text('PRIX HT', pageWidth - 65, yPos + 5.5, { align: 'right' });
    doc.text('TVA', pageWidth - 45, yPos + 5.5, { align: 'right' });
    doc.text('TOTAL HT', pageWidth - 22, yPos + 5.5, { align: 'right' });

    yPos += 8;

    // Items
    doc.setTextColor('#000000');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    invoice.items.forEach((item: any, index: number) => {
        if (yPos > pageHeight - 60) {
            doc.addPage();
            yPos = 20;
        }

        if (index % 2 === 0) {
            doc.setFillColor(249, 250, 251);
            doc.rect(20, yPos, pageWidth - 40, 8, 'F');
        }

        doc.text(item.description, 22, yPos + 5.5);
        doc.text(item.quantity.toString(), pageWidth - 85, yPos + 5.5, { align: 'center' });
        doc.text(`${item.unit_price.toFixed(2)} €`, pageWidth - 65, yPos + 5.5, { align: 'right' });
        doc.text(`${item.tax_rate}%`, pageWidth - 45, yPos + 5.5, { align: 'right' });
        doc.text(`${item.total.toFixed(2)} €`, pageWidth - 22, yPos + 5.5, { align: 'right' });

        yPos += 8;
        doc.setDrawColor(229, 231, 235);
        doc.line(20, yPos, pageWidth - 20, yPos);
    });

    yPos += 10;

    // Totals
    const totalsX = pageWidth - 70;
    doc.setFontSize(10);
    doc.setTextColor(grayColor);

    doc.text('Total HT', totalsX, yPos);
    doc.text(`${invoice.total_excl_tax.toFixed(2)} €`, pageWidth - 22, yPos, { align: 'right' });
    yPos += 6;

    doc.text('TVA (20%)', totalsX, yPos);
    doc.text(`${invoice.total_tax.toFixed(2)} €`, pageWidth - 22, yPos, { align: 'right' });
    yPos += 8;

    doc.setDrawColor(goldColor);
    doc.setLineWidth(0.5);
    doc.line(totalsX, yPos - 2, pageWidth - 20, yPos - 2);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor);
    doc.text('Total TTC', totalsX, yPos);
    doc.text(`${invoice.total_incl_tax.toFixed(2)} €`, pageWidth - 22, yPos, { align: 'right' });

    yPos += 15;

    // Notes
    if (invoice.notes) {
        doc.setFillColor(249, 250, 251);
        doc.roundedRect(20, yPos, pageWidth - 40, 20, 3, 3, 'F');
        yPos += 6;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(primaryColor);
        doc.text('Notes', 25, yPos);
        yPos += 5;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(grayColor);
        const splitNotes = doc.splitTextToSize(invoice.notes, pageWidth - 50);
        doc.text(splitNotes, 25, yPos);
        yPos += splitNotes.length * 4 + 10;
    }

    // Signature for quotes
    if (isQuote && yPos < pageHeight - 40) {
        yPos = Math.max(yPos, pageHeight - 50);
        const signWidth = 60;
        const leftX = 30;
        const rightX = pageWidth - 90;

        doc.setDrawColor(156, 163, 175);
        doc.setLineWidth(0.3);
        doc.line(leftX, yPos, leftX + signWidth, yPos);
        doc.line(rightX, yPos, rightX + signWidth, yPos);

        yPos += 5;
        doc.setFontSize(8);
        doc.setTextColor(grayColor);
        doc.text('Date et Signature Client', leftX + signWidth / 2, yPos, { align: 'center' });
        doc.text('"Bon pour accord"', leftX + signWidth / 2, yPos + 3, { align: 'center' });
        doc.text('Date et Signature Sygma', rightX + signWidth / 2, yPos, { align: 'center' });
    }

    // Footer
    doc.setFontSize(7);
    doc.setTextColor(grayColor);
    doc.setFont('helvetica', 'normal');
    const footerY = pageHeight - 15;
    doc.text(`${settings?.company_name || 'SYGMA CONSULT'} - ${settings?.company_legal_form || 'SASU'} au capital de ${settings?.company_capital || '1000'}€`, pageWidth / 2, footerY, { align: 'center' });
    doc.text(`RCS: ${settings?.company_rcs || 'Paris B XXX XXX XXX'} - Siege: ${settings?.address_paris_fr || '6 rue Paul Verlaine, 93130 Noisy-le-Sec'}`, pageWidth / 2, footerY + 3, { align: 'center' });

    return doc.output('arraybuffer');
}
