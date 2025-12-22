'use client';

import Link from 'next/link'
import Header from '@/components/Header'
import { useLanguage } from '@/context/LanguageContext';

export default function NotFound() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-9xl font-serif font-bold text-[#001F3F] mb-4">404</h1>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">{t.notFound.title}</h2>
                <p className="text-xl text-gray-600 mb-8 max-w-lg">
                    {t.notFound.desc}
                </p>
                <Link
                    href="/"
                    className="inline-block bg-[#D4AF37] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#C5A028] transition-colors"
                >
                    {t.notFound.button}
                </Link>
            </div>
        </div>
    )
}
