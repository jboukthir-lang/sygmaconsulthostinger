'use client';

import Link from 'next/link';
import { XCircle, ArrowLeft, HelpCircle, RefreshCw } from 'lucide-react';
import Header from '@/components/Header';
import { useLanguage } from '@/context/LanguageContext';
import { useSearchParams } from 'next/navigation';

export default function BookingCancelPage() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking_id');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Cancel Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#001F3F] mb-2">
              {language === 'ar' ? 'تم إلغاء الدفع' : language === 'fr' ? 'Paiement Annulé' : 'Payment Cancelled'}
            </h1>
            <p className="text-gray-600 text-lg">
              {language === 'ar'
                ? 'لم يتم إكمال عملية الدفع'
                : language === 'fr'
                ? 'Votre paiement n\'a pas été complété'
                : 'Your payment was not completed'}
            </p>
          </div>

          {/* Information */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <HelpCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">
                  {language === 'ar'
                    ? 'لم يتم تأكيد حجزك بعد. لم يتم خصم أي مبلغ من حسابك.'
                    : language === 'fr'
                    ? 'Votre réservation n\'a pas été confirmée. Aucun montant n\'a été débité de votre compte.'
                    : 'Your booking has not been confirmed. No amount has been charged to your account.'}
                </p>
              </div>
            </div>
          </div>

          {/* Common Reasons */}
          <div className="mb-8">
            <h3 className="font-semibold text-[#001F3F] mb-4">
              {language === 'ar' ? 'أسباب شائعة للإلغاء:' : language === 'fr' ? 'Raisons courantes d\'annulation:' : 'Common Reasons for Cancellation:'}
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                <span>
                  {language === 'ar'
                    ? 'ضغطت على زر "رجوع" في المتصفح'
                    : language === 'fr'
                    ? 'Vous avez cliqué sur le bouton "Retour" du navigateur'
                    : 'You clicked the browser\'s "Back" button'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                <span>
                  {language === 'ar'
                    ? 'قررت عدم المتابعة بالحجز'
                    : language === 'fr'
                    ? 'Vous avez décidé de ne pas continuer avec la réservation'
                    : 'You decided not to proceed with the booking'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 mt-1">•</span>
                <span>
                  {language === 'ar'
                    ? 'كانت هناك مشكلة في معلومات البطاقة'
                    : language === 'fr'
                    ? 'Il y avait un problème avec les informations de carte'
                    : 'There was an issue with your card information'}
                </span>
              </li>
            </ul>
          </div>

          {/* What to Do */}
          <div className="mb-8 bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold text-[#001F3F] mb-3">
              {language === 'ar' ? 'ماذا يمكنك فعله الآن؟' : language === 'fr' ? 'Que pouvez-vous faire maintenant?' : 'What Can You Do Now?'}
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <RefreshCw className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  {language === 'ar'
                    ? 'حاول مرة أخرى إذا كنت لا تزال ترغب في الحجز'
                    : language === 'fr'
                    ? 'Essayez à nouveau si vous souhaitez toujours réserver'
                    : 'Try again if you still want to book'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  {language === 'ar'
                    ? 'اتصل بنا إذا واجهت مشاكل تقنية'
                    : language === 'fr'
                    ? 'Contactez-nous si vous rencontrez des problèmes techniques'
                    : 'Contact us if you\'re experiencing technical issues'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowLeft className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  {language === 'ar'
                    ? 'استكشف خدماتنا الأخرى'
                    : language === 'fr'
                    ? 'Explorez nos autres services'
                    : 'Explore our other services'}
                </span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/book"
              className="flex-1 px-6 py-4 bg-[#001F3F] text-white text-center rounded-lg hover:bg-[#003366] transition-colors font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              {language === 'ar' ? 'حاول مرة أخرى' : language === 'fr' ? 'Réessayer' : 'Try Again'}
            </Link>
            <Link
              href="/"
              className="flex-1 px-6 py-4 bg-white border-2 border-gray-300 text-gray-800 text-center rounded-lg hover:bg-gray-50 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              {language === 'ar' ? 'العودة للرئيسية' : language === 'fr' ? 'Retour à l\'accueil' : 'Back to Home'}
            </Link>
          </div>

          {/* Contact Support */}
          <div className="mt-8 text-center pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-3">
              {language === 'ar' ? 'هل تحتاج مساعدة؟' : language === 'fr' ? 'Besoin d\'aide?' : 'Need Help?'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-[#D4AF37] hover:text-[#C5A028] font-semibold"
              >
                <HelpCircle className="w-5 h-5" />
                {language === 'ar' ? 'اتصل بالدعم' : language === 'fr' ? 'Contacter le support' : 'Contact Support'}
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-[#D4AF37] hover:text-[#C5A028] font-semibold"
              >
                {language === 'ar' ? 'عرض الخدمات' : language === 'fr' ? 'Voir les services' : 'View Services'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
