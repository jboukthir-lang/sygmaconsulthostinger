'use client'

import { useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const { t } = useLanguage();

    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-[#001F3F] mb-4">{t.error.title}</h2>
                <p className="text-gray-600 mb-8">{t.error.desc}</p>
                <button
                    onClick={() => reset()}
                    className="bg-[#001F3F] text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-colors"
                >
                    {t.error.button}
                </button>
            </div>
        </div>
    )
}
