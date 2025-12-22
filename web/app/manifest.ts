import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Sygma Consult',
        short_name: 'Sygma',
        description: 'Premium Consulting Services in Paris & Tunis',
        start_url: '/',
        display: 'standalone',
        background_color: '#F8F9FA',
        theme_color: '#001F3F',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    }
}
