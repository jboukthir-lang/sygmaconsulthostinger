'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight, Settings } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export default function ServiceTypesManager() {
  const { language } = useLanguage()
  const router = useRouter()

  return (
    <div className="p-12 text-center bg-white rounded-2xl shadow-sm border border-gray-200 m-6">
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <Settings className="w-8 h-8 text-blue-600" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {language === 'ar' ? 'إدارة الخدمات' : language === 'fr' ? 'Gestion des Services' : 'Service Management'}
      </h2>

      <p className="text-gray-600 max-w-lg mx-auto mb-8 text-lg">
        {language === 'ar'
          ? 'تم نقل إدارة خدمات المواعيد إلى صفحة الخدمات المركزية لتوحيد الإدارة.'
          : language === 'fr'
            ? 'La gestion des services de rendez-vous a été déplacée vers la page centrale des services pour une gestion unifiée.'
            : 'Appointment service management has been moved to the central Services page for unified management.'}
      </p>

      <button
        onClick={() => router.push('/admin/services')}
        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg transition-all font-medium text-lg group"
      >
        {language === 'ar' ? 'الذهاب إلى الخدمات' : language === 'fr' ? 'Aller aux Services' : 'Go to Services'}
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  )
}
