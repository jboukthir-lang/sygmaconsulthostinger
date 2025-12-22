'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Calendar, Clock, MapPin, Video, Download, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import { useLanguage } from '@/context/LanguageContext';

interface Booking {
  id: string;
  name: string;
  email: string;
  topic: string;
  date: string;
  time: string;
  duration: number;
  is_online: boolean;
  meeting_link?: string;
  location?: string;
  consultant_name?: string;
  price: number;
  specialization: string;
}

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, language } = useLanguage();

  const sessionId = searchParams.get('session_id');
  const bookingId = searchParams.get('booking_id');

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    } else {
      setLoading(false);
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (error) throw error;

      if (data) {
        setBooking(data);
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'ar' ? 'ar-TN' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 text-[#001F3F] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Success Icon & Message */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#001F3F] mb-2">
              {language === 'ar' ? 'تم الدفع بنجاح!' : language === 'fr' ? 'Paiement Réussi!' : 'Payment Successful!'}
            </h1>
            <p className="text-gray-600 text-lg">
              {language === 'ar'
                ? 'تم تأكيد استشارتك'
                : language === 'fr'
                ? 'Votre consultation est confirmée'
                : 'Your consultation has been confirmed'}
            </p>
          </div>

          {/* Booking Details */}
          {booking && (
            <div className="space-y-4 mb-8">
              {/* Date */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0">
                  <Calendar className="w-6 h-6 text-[#001F3F]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">
                    {language === 'ar' ? 'التاريخ' : language === 'fr' ? 'Date' : 'Date'}
                  </p>
                  <p className="text-lg font-semibold text-[#001F3F]">{formatDate(booking.date)}</p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0">
                  <Clock className="w-6 h-6 text-[#001F3F]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">
                    {language === 'ar' ? 'الوقت' : language === 'fr' ? 'Heure' : 'Time'}
                  </p>
                  <p className="text-lg font-semibold text-[#001F3F]">
                    {booking.time} ({booking.duration} {language === 'ar' ? 'دقيقة' : language === 'fr' ? 'minutes' : 'minutes'})
                  </p>
                </div>
              </div>

              {/* Meeting Type & Location */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0">
                  {booking.is_online ? (
                    <Video className="w-6 h-6 text-[#001F3F]" />
                  ) : (
                    <MapPin className="w-6 h-6 text-[#001F3F]" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">
                    {language === 'ar' ? 'نوع الاجتماع' : language === 'fr' ? 'Type de réunion' : 'Meeting Type'}
                  </p>
                  <p className="text-lg font-semibold text-[#001F3F]">
                    {booking.is_online
                      ? language === 'ar'
                        ? 'عبر الإنترنت (فيديو)'
                        : language === 'fr'
                        ? 'En ligne (Vidéo)'
                        : 'Online (Video Call)'
                      : language === 'ar'
                      ? 'حضوري'
                      : language === 'fr'
                      ? 'En personne'
                      : 'In-Person'}
                  </p>
                  {booking.location && !booking.is_online && (
                    <p className="text-sm text-gray-600 mt-1">{booking.location}</p>
                  )}
                </div>
              </div>

              {/* Meeting Link */}
              {booking.meeting_link && booking.is_online && (
                <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Video className="w-5 h-5 text-blue-600" />
                    <p className="text-sm font-semibold text-blue-900">
                      {language === 'ar' ? 'رابط الاجتماع:' : language === 'fr' ? 'Lien de réunion:' : 'Meeting Link:'}
                    </p>
                  </div>
                  <a
                    href={booking.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline break-all text-sm"
                  >
                    {booking.meeting_link}
                  </a>
                </div>
              )}

              {/* Consultant */}
              {booking.consultant_name && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {language === 'ar' ? 'المستشار المسؤول:' : language === 'fr' ? 'Consultant:' : 'Consultant:'}
                  </p>
                  <p className="text-lg font-semibold text-green-800">{booking.consultant_name}</p>
                </div>
              )}
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl mb-6">
            <h3 className="font-bold text-[#001F3F] mb-4 text-lg">
              {language === 'ar' ? 'الخطوات التالية:' : language === 'fr' ? 'Prochaines étapes:' : 'What\'s Next?'}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold text-xl">✓</span>
                <span className="text-gray-700">
                  {language === 'ar'
                    ? 'ستتلقى بريداً إلكترونياً للتأكيد مع جميع التفاصيل'
                    : language === 'fr'
                    ? 'Vous recevrez un e-mail de confirmation avec tous les détails'
                    : 'You\'ll receive a confirmation email with all the details'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold text-xl">✓</span>
                <span className="text-gray-700">
                  {language === 'ar'
                    ? 'سنرسل لك تذكيراً قبل 24 ساعة من موعدك'
                    : language === 'fr'
                    ? 'Nous vous enverrons un rappel 24 heures avant votre consultation'
                    : 'We\'ll send you a reminder 24 hours before your consultation'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 font-bold text-xl">✓</span>
                <span className="text-gray-700">
                  {language === 'ar'
                    ? 'يمكنك عرض وإدارة حجزك من ملفك الشخصي'
                    : language === 'fr'
                    ? 'Vous pouvez consulter et gérer votre réservation depuis votre profil'
                    : 'You can view and manage your booking in your profile'}
                </span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/profile/bookings"
              className="flex-1 px-6 py-4 bg-[#001F3F] text-white text-center rounded-lg hover:bg-[#003366] transition-colors font-semibold shadow-lg hover:shadow-xl"
            >
              {language === 'ar' ? 'عرض حجوزاتي' : language === 'fr' ? 'Voir mes réservations' : 'View My Bookings'}
            </Link>
            <Link
              href="/"
              className="flex-1 px-6 py-4 bg-white border-2 border-gray-300 text-gray-800 text-center rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              {language === 'ar' ? 'العودة للرئيسية' : language === 'fr' ? 'Retour à l\'accueil' : 'Back to Home'}
            </Link>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <p className="text-gray-600 mb-2">
            {language === 'ar' ? 'هل تحتاج مساعدة؟' : language === 'fr' ? 'Besoin d\'aide?' : 'Need Help?'}
          </p>
          <Link href="/contact" className="text-[#D4AF37] hover:text-[#C5A028] font-semibold">
            {language === 'ar' ? 'اتصل بنا' : language === 'fr' ? 'Contactez-nous' : 'Contact Us'}
          </Link>
        </div>
      </div>
    </div>
  );
}
