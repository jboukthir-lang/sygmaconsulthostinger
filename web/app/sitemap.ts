import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://sygmaconsult.vercel.app'
    const currentDate = new Date()

    // Homepage - Highest priority
    const homepage = [{
        url: baseUrl,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: 1.0,
    }]

    // Main pages - High priority
    const mainPages = [
        '/services',
        '/about',
        '/contact',
        '/book',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }))

    // Service pages - Very high priority (our main content)
    const services = [
        'strategic',
        'financial-legal',
        'visa',
        'corporate',
        'hr-training',
        'compliance',
        'digital',
        'real-estate',
    ].map((slug) => ({
        url: `${baseUrl}/services/${slug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.95,
    }))

    // Secondary pages - Medium priority
    const secondaryPages = [
        '/insights',
        '/careers',
        '/appointments',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    // Legal pages - Lower priority
    const legalPages = [
        '/legal',
        '/privacy',
        '/terms',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: currentDate,
        changeFrequency: 'yearly' as const,
        priority: 0.3,
    }))

    // Auth pages - Low priority
    const authPages = [
        '/login',
        '/signup',
        '/reset-password',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: currentDate,
        changeFrequency: 'yearly' as const,
        priority: 0.2,
    }))

    return [...homepage, ...mainPages, ...services, ...secondaryPages, ...legalPages, ...authPages]
}
