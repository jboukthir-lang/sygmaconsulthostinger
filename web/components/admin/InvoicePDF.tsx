import React from 'react';
import { Invoice } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';

interface InvoicePDFProps {
    invoice: Invoice;
    settings: any; // Site Settings for company info
}

// This component is designed to be printed
export const InvoicePDF = React.forwardRef<HTMLDivElement, InvoicePDFProps>(({ invoice, settings }, ref) => {
    const { t } = useLanguage();

    // Helper to format currency
    const formatCurrency = (amount: number, currency = 'EUR') => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    const isQuote = invoice.type === 'quote';
    const title = isQuote ? t.admin.invoicesView.type.quote : t.admin.invoicesView.type.invoice;
    const dateLabel = t.admin.invoicesView.fields.date;
    const dueLabel = t.admin.invoicesView.fields.dueDate;

    return (
        <div ref={ref} className="bg-white p-8 max-w-[210mm] mx-auto min-h-[297mm] text-sm relative" id="invoice-print">
            {/* Header */}
            <div className="flex justify-between items-start mb-12">
                <div>
                    {/* Company Logo placeholder or text */}
                    <div className="text-2xl font-bold text-[#001F3F] mb-2">{settings?.company_name || 'SYGMA CONSULT'}</div>
                    <div className="text-gray-500 whitespace-pre-line text-xs">
                        {settings?.address_paris_fr}<br />
                        SIRET: {settings?.company_siret || 'PENDING'}<br />
                        TVA: {settings?.company_tva || 'PENDING'}<br />
                        {settings?.email_primary} | {settings?.phone_primary}
                    </div>
                </div>
                <div className="text-right">
                    <h1 className="text-4xl font-light text-[#D4AF37] mb-2">{title}</h1>
                    <div className="text-gray-600 font-mono text-lg">#{invoice.number}</div>
                    <div className="mt-4 text-xs text-gray-500">
                        <div><span className="font-semibold">{dateLabel}:</span> {new Date(invoice.issue_date).toLocaleDateString()}</div>
                        {!isQuote && invoice.due_date && (
                            <div><span className="font-semibold">{dueLabel}:</span> {new Date(invoice.due_date).toLocaleDateString()}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Client Info */}
            <div className="mb-12 border-l-4 border-[#001F3F] pl-6 py-2 bg-gray-50/50">
                <h3 className="text-gray-400 uppercase text-xs tracking-wider mb-2">{t.admin.invoicesView.fields.client}</h3>
                <div className="font-bold text-lg text-gray-900">{invoice.client_name}</div>
                {invoice.client_address && <div className="text-gray-600 whitespace-pre-line">{invoice.client_address}</div>}
                {invoice.client_email && <div className="text-gray-500">{invoice.client_email}</div>}
                {invoice.client_siret && <div className="text-gray-500 text-xs mt-1">SIRET: {invoice.client_siret}</div>}
            </div>

            {/* Items Table */}
            <table className="w-full mb-12">
                <thead className="border-b-2 border-[#001F3F]">
                    <tr>
                        <th className="text-left py-3 font-semibold text-[#001F3F] w-[50%]">Description</th>
                        <th className="text-center py-3 font-semibold text-[#001F3F] w-[10%]">Qty</th>
                        <th className="text-right py-3 font-semibold text-[#001F3F] w-[20%]">Unit Price</th>
                        <th className="text-right py-3 font-semibold text-[#001F3F] w-[20%]">Total</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {invoice.items.map((item, i) => (
                        <tr key={i}>
                            <td className="py-4 text-gray-700">{item.description}</td>
                            <td className="py-4 text-center text-gray-700">{item.quantity}</td>
                            <td className="py-4 text-right text-gray-700">{formatCurrency(item.unit_price, invoice.currency)}</td>
                            <td className="py-4 text-right font-medium text-gray-900">{formatCurrency(item.total, invoice.currency)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-12">
                <div className="w-[40%] space-y-3">
                    <div className="flex justify-between text-gray-600">
                        <span>Total HT</span>
                        <span>{formatCurrency(invoice.total_excl_tax, invoice.currency)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>TVA ({invoice.items[0]?.tax_rate || 20}%)</span>
                        <span>{formatCurrency(invoice.total_tax, invoice.currency)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-[#001F3F] border-t-2 border-[#D4AF37] pt-3">
                        <span>Total TTC</span>
                        <span>{formatCurrency(invoice.total_incl_tax, invoice.currency)}</span>
                    </div>
                </div>
            </div>

            {/* Footer / Notes */}
            {invoice.notes && (
                <div className="mb-8">
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Notes</h4>
                    <p className="text-gray-600 text-sm italic">{invoice.notes}</p>
                </div>
            )}

            {isQuote && (
                <div className="mt-12 border-t border-gray-200 pt-8 flex justify-between">
                    <div className="w-1/3 text-center">
                        <div className="h-20 border-b border-dashed border-gray-300 mb-2"></div>
                        <p className="text-xs text-gray-500">Date et Signature (Client)</p>
                        <p className="text-xs text-gray-400">"Bon pour accord"</p>
                    </div>
                    <div className="w-1/3 text-center">
                        <div className="h-20 border-b border-dashed border-gray-300 mb-2"></div>
                        <p className="text-xs text-gray-500">Date et Signature (Sygma)</p>
                    </div>
                </div>
            )}

            <div className="absolute bottom-8 left-8 right-8 text-center text-[10px] text-gray-400 border-t border-gray-100 pt-4">
                <p>
                    {settings?.company_name} - {settings?.company_legal_form || 'SASU'} au capital de {settings?.company_capital || '1000'}€ -
                    RCS: {settings?.company_rcs || 'Paris B 123 456 789'} -
                    Siège social: {settings?.address_paris_fr}
                </p>
                <p>Generated by Sygma OS on {new Date().toLocaleDateString()}</p>
            </div>
        </div>
    );
});

InvoicePDF.displayName = 'InvoicePDF';
