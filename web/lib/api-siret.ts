// SIRET API Integration for French Companies
// API: https://recherche-entreprises.api.gouv.fr (Open Data)

export interface SiretData {
    siret: string;
    name: string;
    address: string;
    city: string;
    postalCode: string;
    legalForm: string;
    tvaNumber?: string;
    active: boolean;
}

export async function lookupSiret(siret: string): Promise<SiretData | null> {
    try {
        // Remove spaces
        const cleanSiret = siret.replace(/\s/g, '');

        if (cleanSiret.length !== 14) {
            throw new Error('SIRET must be 14 digits');
        }

        const response = await fetch(`https://recherche-entreprises.api.gouv.fr/search?q=${cleanSiret}&page=1&per_page=1`);

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            return null;
        }

        const result = data.results[0];
        const siege = result.siege;

        return {
            siret: result.siret,
            name: result.nom_complet,
            address: `${siege.numero_voie || ''} ${siege.type_voie || ''} ${siege.libelle_voie || ''}`.trim(),
            city: siege.libelle_commune,
            postalCode: siege.code_postal,
            legalForm: result.nature_juridique_label,
            tvaNumber: `FR${calcTvaKey(cleanSiret.substring(0, 9))}${cleanSiret.substring(0, 9)}`,
            active: result.etat_administratif === 'A'
        };
    } catch (error) {
        console.error('SIRET lookup error:', error);
        return null;
    }
}

// Calculate TVA Intra key
function calcTvaKey(siren: string): string {
    const sirenNum = parseInt(siren, 10);
    const key = (12 + 3 * (sirenNum % 97)) % 97;
    return key.toString().padStart(2, '0');
}

export function validateSiret(siret: string): boolean {
    const clean = siret.replace(/\s/g, '');
    return /^\d{14}$/.test(clean);
}
