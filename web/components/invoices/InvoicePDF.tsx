import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register standard fonts if needed, but Helvetica is default.
// using standard Helvetica for now to ensure compatibility.

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: '20mm', // Matches screen padding
        fontFamily: 'Helvetica',
        fontSize: 9, // Base size
        color: '#1F2937', // gray-800
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    logoSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    logoBox: {
        width: 30, // Approx 10mm
        height: 30,
        backgroundColor: '#001F3F',
        borderRadius: 4,
        marginRight: 10,
    },
    companyInfo: {
        flexDirection: 'column',
    },
    companyName: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#001F3F',
        marginBottom: 2,
    },
    companySub: {
        fontSize: 8,
        color: '#6B7280',
        marginBottom: 4,
    },
    companyAddress: {
        fontSize: 8,
        color: '#6B7280',
        lineHeight: 1.2,
    },
    invoiceDetails: {
        alignItems: 'flex-end',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#001F3F',
        textTransform: 'uppercase',
    },
    invoiceNumber: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#D4AF37',
        marginBottom: 8,
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 2,
    },
    dateLabel: {
        fontSize: 8,
        color: '#4B5563',
        marginRight: 10,
    },
    dateValue: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#111827',
    },

    // Client & Status Row
    clientRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        borderBottomWidth: 1,
        borderBottomColor: '#F9FAFB', // gray-50 equivalent
        paddingBottom: 10,
        marginBottom: 20,
    },
    clientInfo: {
        width: '60%',
    },
    clientName: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#001F3F',
        marginBottom: 2,
    },
    clientText: {
        fontSize: 8,
        color: '#6B7280',
        lineHeight: 1.3,
    },
    statusSection: {
        alignItems: 'flex-end',
    },
    statusBadge: {
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: 2,
        backgroundColor: '#FEFCE8', // yellow-50
        borderWidth: 1,
        borderColor: '#FEF9C3', // yellow-100
        marginBottom: 4,
    },
    statusText: {
        fontSize: 7,
        color: '#A16207', // yellow-700
    },
    totalAmount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#001F3F',
    },

    // Table
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#001F3F',
        paddingBottom: 4,
        marginBottom: 4,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingVertical: 6,
    },
    colDesc: { width: '50%', textAlign: 'left', color: '#001F3F', fontWeight: 'bold' },
    colQty: { width: '15%', textAlign: 'center', color: '#001F3F', fontWeight: 'bold' },
    colPrice: { width: '17.5%', textAlign: 'right', color: '#001F3F', fontWeight: 'bold' },
    colTotal: { width: '17.5%', textAlign: 'right', color: '#001F3F', fontWeight: 'bold' },

    cellDesc: { width: '50%', textAlign: 'left', color: '#374151', fontSize: 9 },
    cellQty: { width: '15%', textAlign: 'center', color: '#6B7280', fontSize: 9 },
    cellPrice: { width: '17.5%', textAlign: 'right', color: '#6B7280', fontSize: 9 },
    cellTotal: { width: '17.5%', textAlign: 'right', color: '#111827', fontSize: 9, fontWeight: 'bold' },

    // Bottom Section
    bottomSection: {
        flexDirection: 'row',
        marginTop: 20,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    paymentInfo: {
        width: '60%',
        paddingRight: 20,
    },
    paymentTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    paymentTitle: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#001F3F',
        marginRight: 6,
    },
    paymentLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#F3F4F6',
    },
    paymentText: {
        fontSize: 7,
        color: '#6B7280',
        marginBottom: 2,
    },
    paymentLabel: {
        color: '#4B5563',
        fontWeight: 'medium', // Helvetica doesn't support medium, but we can stick to normal
    },
    totalsSection: {
        width: '40%',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    totalLabel: {
        fontSize: 9,
        color: '#4B5563',
    },
    totalValue: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#111827',
    },
    finalTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
        paddingTop: 4,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    finalTotalLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#001F3F',
    },
    finalTotalValue: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#001F3F',
    },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 20, // 20mm padding bottom
        left: 20,
        right: 20,
        textAlign: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 10,
    },
    thankYou: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#001F3F',
        marginBottom: 8,
        textAlign: 'center',
    },
    legalText: {
        fontSize: 6,
        color: '#9CA3AF',
        marginBottom: 1,
        textAlign: 'center',
    },
    divider: {
        height: 4,
        width: '100%',
        backgroundColor: '#001F3F', // Decorative top line simulated? 
        // Gradient not supported easily, use solid navy
        marginBottom: 20,
    }
});

// Helper to format currency
const formatCurrency = (amount: number) => {
    return (amount || 0).toFixed(2) + ' €';
};

// Helper for dates
const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR');
};

export const InvoicePDF = ({ invoice, company }: { invoice: any, company: any }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Top Decorative Line */}
            <View style={{ height: 4, width: '100%', backgroundColor: '#001F3F', marginBottom: 20 }} />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoSection}>
                    <View style={styles.logoBox} />
                    {/* Placeholder for Logo - primitive shape for now */}
                    <View style={styles.companyInfo}>
                        <Text style={styles.companyName}>{company?.name || 'Nom de votre entreprise'}</Text>
                        <Text style={styles.companySub}>Conseil & Stratégie</Text>
                        <Text style={styles.companyAddress}>{company?.address}</Text>
                        <Text style={styles.companyAddress}>{company?.postal_code} {company?.city}</Text>
                        <Text style={styles.companyAddress}>{company?.email}</Text>
                    </View>
                </View>
                <View style={styles.invoiceDetails}>
                    <Text style={styles.title}>FACTURE</Text>
                    <Text style={styles.invoiceNumber}>#{invoice.number}</Text>
                    <View style={styles.dateRow}>
                        <Text style={styles.dateLabel}>Date d'émission:</Text>
                        <Text style={styles.dateValue}>{formatDate(invoice.issue_date)}</Text>
                    </View>
                    <View style={styles.dateRow}>
                        <Text style={styles.dateLabel}>Date d'échéance:</Text>
                        <Text style={styles.dateValue}>{formatDate(invoice.due_date)}</Text>
                    </View>
                </View>
            </View>

            {/* Client & Status */}
            <View style={styles.clientRow}>
                <View style={styles.clientInfo}>
                    <Text style={styles.clientName}>{invoice.client?.name}</Text>
                    <Text style={styles.clientText}>{invoice.client?.company}</Text>
                    <Text style={styles.clientText}>{invoice.client?.address}</Text>
                    <Text style={styles.clientText}>{invoice.client?.city} {invoice.client?.country}</Text>
                    <Text style={styles.clientText}>{invoice.client?.email}</Text>
                </View>
                <View style={styles.statusSection}>
                    {/* Status Badge simulation */}
                    <View style={[styles.statusBadge,
                    invoice.status === 'paid' ? { backgroundColor: '#F0FDF4', borderColor: '#DCFCE7' } : // Green
                        invoice.status === 'sent' ? { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE' } : // Blue
                            { backgroundColor: '#FEFCE8', borderColor: '#FEF9C3' } // Yellow
                    ]}>
                        <Text style={[styles.statusText,
                        invoice.status === 'paid' ? { color: '#15803D' } :
                            invoice.status === 'sent' ? { color: '#1D4ED8' } :
                                { color: '#A16207' }
                        ]}>
                            {invoice.status === 'paid' ? 'Payée' : invoice.status === 'sent' ? 'Envoyée' : 'Brouillon'}
                        </Text>
                    </View>
                    <Text style={styles.totalAmount}>{formatCurrency(invoice.total)}</Text>
                </View>
            </View>

            {/* Table Header */}
            <View style={styles.tableHeader}>
                <Text style={styles.colDesc}>Description</Text>
                <Text style={styles.colQty}>Qté</Text>
                <Text style={styles.colPrice}>Prix Unit.</Text>
                <Text style={styles.colTotal}>Total</Text>
            </View>

            {/* Table Rows */}
            {invoice.items?.map((item: any, i: number) => (
                <View key={i} style={styles.tableRow}>
                    <Text style={styles.cellDesc}>{item.description}</Text>
                    <Text style={styles.cellQty}>{item.quantity || 1}</Text>
                    <Text style={styles.cellPrice}>{formatCurrency(item.price)}</Text>
                    <Text style={styles.cellTotal}>{formatCurrency((item.quantity || 1) * (item.price || 0))}</Text>
                </View>
            ))}

            {/* Bottom Section */}
            <View style={styles.bottomSection}>
                <View style={styles.paymentInfo}>
                    <View style={styles.paymentTitleRow}>
                        <Text style={styles.paymentTitle}>Virement Bancaire</Text>
                        <View style={styles.paymentLine} />
                    </View>
                    <Text style={styles.paymentText}>
                        <Text style={styles.paymentLabel}>Banque: </Text> Banque Populaire
                    </Text>
                    <Text style={styles.paymentText}>
                        <Text style={styles.paymentLabel}>IBAN: </Text> FR76 1234 5678 9012 3456 7890 123
                    </Text>
                    <Text style={styles.paymentText}>
                        <Text style={styles.paymentLabel}>BIC: </Text> BPOPFRPP   |   Ref: #{invoice.number}
                    </Text>
                </View>
                <View style={styles.totalsSection}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Sous-total</Text>
                        <Text style={styles.totalValue}>{formatCurrency(invoice.total / 1.2)}</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>TVA (20%)</Text>
                        <Text style={styles.totalValue}>{formatCurrency(invoice.total - (invoice.total / 1.2))}</Text>
                    </View>
                    <View style={styles.finalTotalRow}>
                        <Text style={styles.finalTotalLabel}>Total TTC</Text>
                        <Text style={styles.finalTotalValue}>{formatCurrency(invoice.total)}</Text>
                    </View>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.thankYou}>Merci pour votre confiance !</Text>
                {company && (
                    <>
                        <Text style={styles.legalText}>
                            {company.name} • {company.legal_form} au capital de {company.share_capital?.toLocaleString('fr-FR')} €
                        </Text>
                        <Text style={styles.legalText}>
                            Siège social : {company.address}, {company.postal_code} {company.city}
                        </Text>
                        <Text style={styles.legalText}>
                            RCS {company.rcs_city} : {company.siret} • TVA : {company.tva_number}
                        </Text>
                        <Text style={[styles.legalText, { marginTop: 4, opacity: 0.7 }]}>
                            Pénalité retard : 3x taux légal (Art. L. 441-6). Indemnité forfaitaire : 40 €.
                        </Text>
                    </>
                )}
            </View>
        </Page>
    </Document>
);
