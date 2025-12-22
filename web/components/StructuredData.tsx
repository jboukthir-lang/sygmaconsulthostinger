export default function StructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Sygma Consult',
    alternateName: 'SYGMA CONSULT',
    url: 'https://sygmaconsult.vercel.app',
    logo: 'https://sygmaconsult.vercel.app/logo.png',
    description: 'Cabinet de conseil expert en transformation digitale, conseil juridique et stratégie de croissance. Présent à Paris et Tunis.',
    address: [
      {
        '@type': 'PostalAddress',
        addressLocality: 'Paris',
        addressCountry: 'FR',
      },
      {
        '@type': 'PostalAddress',
        addressLocality: 'Tunis',
        addressCountry: 'TN',
      },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['French', 'Arabic', 'English'],
    },
    sameAs: [
      'https://www.linkedin.com/company/sygma-consult',
      'https://twitter.com/sygmaconsult',
      'https://www.facebook.com/sygmaconsult',
    ],
    areaServed: [
      {
        '@type': 'Country',
        name: 'France',
      },
      {
        '@type': 'Country',
        name: 'Tunisia',
      },
    ],
  };

  const professionalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Sygma Consult',
    image: 'https://sygmaconsult.vercel.app/logo.png',
    '@id': 'https://sygmaconsult.vercel.app',
    url: 'https://sygmaconsult.vercel.app',
    telephone: '+33-XX-XX-XX-XX-XX',
    priceRange: '$$',
    address: [
      {
        '@type': 'PostalAddress',
        streetAddress: 'Paris',
        addressLocality: 'Paris',
        addressCountry: 'FR',
      },
      {
        '@type': 'PostalAddress',
        streetAddress: 'Tunis',
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
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
    },
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Consulting Services',
    provider: {
      '@type': 'Organization',
      name: 'Sygma Consult',
    },
    areaServed: ['France', 'Tunisia', 'Europe', 'North Africa'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Consulting Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Transformation Digitale',
            description: 'Services de transformation digitale pour entreprises',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Conseil Stratégique',
            description: 'Conseil stratégique et accompagnement de croissance',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Conseil Juridique',
            description: 'Conseil juridique et compliance pour entreprises',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Visa & Immigration',
            description: 'Accompagnement visa et immigration professionnelle',
          },
        },
      ],
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: 'https://sygmaconsult.vercel.app',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
