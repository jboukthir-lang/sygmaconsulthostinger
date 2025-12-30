
import React from 'react';

interface InvoiceLegalFooterProps {
    settings: {
        legal_form?: string;
        share_capital?: number;
        rcs_city?: string;
        siret?: string;
        tva_number?: string;
        company_name?: string;
        address?: string;
        postal_code?: string;
        city?: string;
    } | null;
    tvaApplicable: boolean;
}

export default function InvoiceLegalFooter({ settings, tvaApplicable }: InvoiceLegalFooterProps) {
    if (!settings) return null;

    const {
        legal_form,
        share_capital,
        rcs_city,
        siret,
        tva_number,
        company_name,
        address,
        postal_code,
        city
    } = settings;

    return (
        <div className="mt-4 pt-4 border-t border-gray-100 text-[8px] text-gray-400 text-center space-y-1 bg-white">
            <p>
                {company_name} • {legal_form} au capital de {share_capital?.toLocaleString('fr-FR')} €
            </p>
            <p>
                Siège social : {address}, {postal_code} {city}
            </p>
            <p>
                RCS {rcs_city} : {siret} • TVA : {tva_number || 'N/A'}
            </p>

            <div className="mt-2 text-[7px] text-gray-300">
                <p>
                    Pénalité retard : 3x taux légal (Art. L. 441-6). Indemnité forfaitaire : 40 €.
                </p>
                {!tvaApplicable && (
                    <p className="mt-0.5">
                        TVA non applicable, ex art. 293 B du CGI.
                    </p>
                )}
            </div>
        </div>
    );
}
