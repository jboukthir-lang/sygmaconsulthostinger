import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Tarifs - Logiciel de Facturation | SYGMAINVOICE',
    description: 'Découvrez nos tarifs transparents. Plans adaptés aux freelances, TPE et PME. Essai gratuit sans engagement.',
    keywords: ['tarifs facturation', 'logiciel facturation', 'devis facture', 'TPE PME'],
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
    return children;
}
