export default function JsonLd() {
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: 'SYGMA CONSULT',
        alternateName: 'Sygma Consult',
        url: 'https://sygma-consult.com',
        logo: 'https://sygma-consult.com/logo.png',
        description: 'Strategic consulting services bridging European and African markets. Digital transformation, market entry strategies, and cross-border commercial development.',
        address: [
            {
                '@type': 'PostalAddress',
                streetAddress: '6 rue Paul Verlaine',
                addressLocality: 'Noisy-le-Sec',
                postalCode: '93130',
                addressCountry: 'FR',
                addressRegion: 'Île-de-France',
            },
            {
                '@type': 'PostalAddress',
                addressLocality: 'Tunis',
                addressCountry: 'TN',
            },
        ],
        geo: [
            {
                '@type': 'GeoCoordinates',
                latitude: 48.8566,
                longitude: 2.3522,
            },
            {
                '@type': 'GeoCoordinates',
                latitude: 36.8065,
                longitude: 10.1815,
            },
        ],
        telephone: '+33752034786',
        email: 'contact@sygma-consult.com',
        priceRange: '$$',
        areaServed: [
            {
                '@type': 'Country',
                name: 'France',
            },
            {
                '@type': 'Country',
                name: 'Tunisia',
            },
            {
                '@type': 'Continent',
                name: 'Europe',
            },
            {
                '@type': 'Continent',
                name: 'Africa',
            },
        ],
        serviceType: [
            'Strategic Consulting',
            'Digital Transformation',
            'Market Entry Strategy',
            'Business Development',
            'Regulatory Compliance',
        ],
        sameAs: [
            'https://www.linkedin.com/company/sygma-consult',
            'https://twitter.com/sygmaconsult',
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
    );
}
