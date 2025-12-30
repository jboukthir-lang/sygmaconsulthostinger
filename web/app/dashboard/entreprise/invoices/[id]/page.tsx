'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Printer, Download, Mail, Building2, MapPin, Phone, Mail as MailIcon } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useReactToPrint } from 'react-to-print';

export default function InvoiceViewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params); // Unwrap params (Next.js 15)
    const { user } = useAuth();
    const [invoice, setInvoice] = useState<any | null>(null);
    const [company, setCompany] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const componentRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: componentRef, // Updated API for newer versions of react-to-print
        documentTitle: `Facture-${invoice?.number || 'Draft'}`,
    });

    const handleDownloadPDF = async () => {
        // Fallback to print if manual PDF generation is not ready,
        // or trigger the backend route if available
        try {
            const res = await fetch(`/api/invoices/${id}/generate/pdf`, { // Assuming we will create this
                headers: { 'x-user-id': user!.uid }
            });
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Facture-${invoice?.number}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                // If backend generation fails, fallback to browser print
                handlePrint();
            }
        } catch (e) {
            handlePrint();
        }
    };

    const handleEmail = async () => {
        if (!confirm('Voulez-vous envoyer cette facture par email au client ?')) return;

        try {
            const res = await fetch(`/api/invoices/${id}/send`, {
                method: 'POST',
                headers: { 'x-user-id': user!.uid }
            });

            if (res.ok) {
                alert('Email envoyé avec succès !');
                // Update status locally if needed
                setInvoice({ ...invoice, status: 'sent' });
            } else {
                const err = await res.json();
                alert('Erreur lors de l\'envoi : ' + (err.error || 'Inconnue'));
            }
        } catch (error) {
            console.error(error);
            alert('Erreur technique lors de l\'envoi.');
        }
    };

    useEffect(() => {
        if (user && id) {
            fetchData();
        }
    }, [user, id]);

    const fetchData = async () => {
        try {
            const [invoiceRes, companyRes] = await Promise.all([
                fetch(`/api/invoices/${id}`, { headers: { 'x-user-id': user!.uid } }),
                fetch(`/api/settings`, { headers: { 'x-user-id': user!.uid } })
            ]);

            if (invoiceRes.ok) {
                const invData = await invoiceRes.json();
                setInvoice(invData);
            }

            if (companyRes.ok) {
                const compData = await companyRes.json();
                setCompany(compData);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-500">Chargement...</div>;
    if (!invoice) return <div className="p-12 text-center text-red-500">Facture introuvable</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <style jsx global>{`
                @media print {
                    @page { margin: 20mm; size: auto; }
                    body { visibility: hidden; }
                    #invoice-content { visibility: visible; position: absolute; left: 0; top: 0; width: 100%; }
                    #invoice-content * { visibility: visible; }
                    /* Ensure headers/footers from browser don't hide content */
                }
            `}</style>

            {/* Header / Actions */}
            <div className="flex justify-between items-center print:hidden">
                <Link
                    href="/dashboard/entreprise/invoices"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                    Retour aux factures
                </Link>
                <div className="flex gap-3">
                    <button
                        onClick={() => handlePrint()}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors shadow-sm"
                    >
                        <Printer className="h-5 w-5" />
                        Imprimer
                    </button>
                    <button
                        onClick={() => handleDownloadPDF()}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition-colors shadow-sm"
                    >
                        <Download className="h-5 w-5" />
                        Télécharger PDF
                    </button>
                    <button
                        onClick={handleEmail}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
                    >
                        <Mail className="h-5 w-5" />
                        Envoyer par email
                    </button>
                </div>
            </div>

            {/* Invoice Preview */}
            <div id="invoice-content" className="bg-white shadow-lg rounded-xl overflow-hidden print:shadow-none print:overflow-visible" ref={componentRef}>
                <div className="p-12 space-y-12">
                    {/* Header: Company & Invoice Info */}
                    <div className="flex justify-between items-start">
                        <div className="space-y-4">
                            {/* Logo Placeholder */}
                            <div className="h-16 w-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                <Building2 className="h-8 w-8" />
                                <span className="ml-2 font-medium">Votre Logo</span>
                            </div>
                            <div className="text-gray-600 text-sm space-y-1">
                                <p className="font-bold text-gray-900 text-lg">{company?.name || 'Votre Entreprise'}</p>
                                <p>{company?.address || 'Adresse'}</p>
                                <p>{company?.postal_code} {company?.city}</p>
                                <p>{company?.email}</p>
                                <p>{company?.phone}</p>
                            </div>
                        </div>
                        <div className="text-right space-y-2">
                            <h1 className="text-4xl font-light text-[#001F3F] tracking-tight">FACTURE</h1>
                            <p className="text-gray-500 font-medium">#{invoice.number}</p>
                            <div className="pt-4 space-y-1 text-sm">
                                <p className="text-gray-600">Date d'émission: <span className="font-semibold text-gray-900">{new Date(invoice.issue_date).toLocaleDateString('fr-FR')}</span></p>
                                <p className="text-gray-600">Date d'échéance: <span className="font-semibold text-gray-900">{new Date(invoice.due_date).toLocaleDateString('fr-FR')}</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Client Info */}
                    <div className="flex justify-between items-end border-t border-gray-100 pt-8">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Facturé à</p>
                            <div className="text-gray-900">
                                <p className="font-bold text-xl">{invoice.client_name}</p>
                                <p className="text-gray-600">{invoice.client_email}</p>
                                {/* Client address would be here if available in the joined query */}
                            </div>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize
                            ${invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                                invoice.status === 'sent' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                            {invoice.status === 'paid' ? 'Payée' : invoice.status === 'sent' ? 'Envoyée' : 'Brouillon'}
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="border rounded-lg overflow-hidden border-gray-200">
                        <table className="w-full">
                            <thead className="bg-gray-50 text-gray-900 text-sm font-semibold uppercase">
                                <tr>
                                    <th className="px-6 py-4 text-left">Description</th>
                                    <th className="px-6 py-4 text-right">Qté</th>
                                    <th className="px-6 py-4 text-right">Prix Unitaire</th>
                                    <th className="px-6 py-4 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {invoice.items?.map((item: any, i: number) => (
                                    <tr key={i} className="text-gray-700 text-sm">
                                        <td className="px-6 py-4 font-medium text-gray-900">{item.description}</td>
                                        <td className="px-6 py-4 text-right">{item.quantity}</td>
                                        <td className="px-6 py-4 text-right">{item.price} €</td>
                                        <td className="px-6 py-4 text-right font-medium">{(item.quantity * item.price).toFixed(2)} €</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end">
                        <div className="w-80 space-y-3">
                            <div className="flex justify-between text-gray-600">
                                <span>Sous-total</span>
                                <span>{(invoice.total / 1.2).toFixed(2)} €</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>TVA (20%)</span>
                                <span>{(invoice.total - (invoice.total / 1.2)).toFixed(2)} €</span>
                            </div>
                            <div className="flex justify-between text-2xl font-bold text-[#001F3F] border-t border-gray-200 pt-4 mt-4">
                                <span>Total TTC</span>
                                <span>{invoice.total?.toFixed(2)} €</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Notes */}
                    <div className="border-t border-gray-100 pt-8 text-sm text-gray-500 space-y-2 print:text-xs">
                        <p><span className="font-semibold text-gray-900">Note:</span> Merci pour votre confiance. En cas de retard de paiement, une pénalité de 3 fois le taux d'intérêt légal sera appliquée.</p>
                        <p className="mt-4 text-center text-gray-400">SIRET: {company?.siret} - TVA: {company?.tva_number}</p>
                        {company?.website && <p className="text-center text-gray-400">{company.website}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
