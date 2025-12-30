// SIRET API Integration for French Companies
// API: https://api.insee.fr/entreprises/sirene/V3

export interface SiretData {
    siret: string;
    name: string;
    address: string;
    city: string;
    postalCode: string;
    legalForm: string;
    tvaNumber?: string;
}

export async function lookupSiret(siret: string): Promise<SiretData | null> {
    try {
        // Remove spaces and validate format
        const cleanSiret = siret.replace(/\s/g, '');

        if (cleanSiret.length !== 14) {
            throw new Error('SIRET must be 14 digits');
        }

        // Mock data for development (replace with real API call in production)
        // Real API requires authentication: https://api.insee.fr

        return {
            siret: cleanSiret,
            name: 'Entreprise Example SARL',
            address: '123 Rue de la République',
            city: 'Paris',
            postalCode: '75001',
            legalForm: 'SARL',
            tvaNumber: `FR${cleanSiret.substring(0, 9)}`,
        };
    } catch (error) {
        console.error('SIRET lookup error:', error);
        return null;
    }
}

export function validateSiret(siret: string): boolean {
    const clean = siret.replace(/\s/g, '');
    return /^\d{14}$/.test(clean);
}
