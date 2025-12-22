'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Calendar, Clock, Video, MapPin, XCircle, DollarSign, User, MessageSquare } from 'lucide-react';
import { t } from '@/lib/translations';

interface Booking {
  id: string;
  name: string;
  email: string;
  topic: string;
  date: string;
  time: string;
  status: string;
  duration?: number;
  appointment_type?: string;
  specialization?: string;
  is_online?: boolean;
  meeting_link?: string;
  location?: string;
  consultant_name?: string;
  price?: number;
  payment_status?: string;
  notes?: string;
  notes_admin?: string;
  created_at: string;
}

export default function ProfileBookingsPage() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (user) {
      fetchBookings();

      // Real-time subscription
      const channel = supabase
        .channel('profile_bookings')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookings',
            filter: `email=eq.${user.email}`,
          },
          () => {
            fetchBookings();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  async function fetchBookings() {
    try {
      if (!user?.email) return;

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('email', user.email)
        .order('date', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function cancelBooking(id: string) {
    if (!confirm(t('bookings.confirmCancel', language))) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', id);

      if (error) throw error;
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filter === 'upcoming') {
      return bookingDate >= today && booking.status !== 'cancelled';
    } else if (filter === 'past') {
      return bookingDate < today || booking.status === 'cancelled';
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('admin.loadingBookings', language)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#001F3F]">{t('bookings.myBookings', language)}</h1>
          <p className="text-gray-600 mt-1">{t('bookings.viewManage', language)}</p>
        </div>
        <button
          onClick={() => (window.location.href = '/book')}
          className="px-4 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] transition-colors"
        >
          {t('bookings.newBooking', language)}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 inline-flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all'
              ? 'bg-[#001F3F] text-white'
              : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          {t('bookings.all', language)} ({bookings.length})
        </button>
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-4 py-2 rounded-lg transition-colors ${filter === 'upcoming'
              ? 'bg-[#001F3F] text-white'
              : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          {t('bookings.upcoming', language)}
        </button>
        <button
          onClick={() => setFilter('past')}
          className={`px-4 py-2 rounded-lg transition-colors ${filter === 'past'
              ? 'bg-[#001F3F] text-white'
              : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
          {t('bookings.past', language)}
        </button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{t('bookings.noBookings', language)}</p>
          </div>
        ) : (
          filteredBookings.map((booking) => {
            const isPast = new Date(booking.date) < new Date();
            const isUpcoming = new Date(booking.date) >= new Date() && booking.status !== 'cancelled';

            return (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <h3 className="text-lg font-bold text-[#001F3F]">{booking.topic}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-700'
                            : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                      >
                        {booking.status}
                      </span>
                      {booking.payment_status && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.payment_status === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : booking.payment_status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                        >
                          {booking.payment_status}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#001F3F]" />
                        <span>{new Date(booking.date).toLocaleDateString(language)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#001F3F]" />
                        <span>{booking.time} ({booking.duration || 30} {t('bookings.minutes', language)})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {booking.is_online ? (
                          <>
                            <Video className="h-4 w-4 text-[#001F3F]" />
                            <span>{t('bookings.online', language)}</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="h-4 w-4 text-[#001F3F]" />
                            <span>{t('bookings.onsite', language)}</span>
                          </>
                        )}
                      </div>
                      {booking.consultant_name && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-[#001F3F]" />
                          <span>{booking.consultant_name}</span>
                        </div>
                      )}
                      {booking.price && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-[#001F3F]" />
                          <span>{booking.price}€</span>
                        </div>
                      )}
                      {booking.specialization && (
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-[#001F3F]" />
                          <span className="text-xs">{booking.specialization}</span>
                        </div>
                      )}
                    </div>

                    {booking.meeting_link && isUpcoming && (
                      <a
                        href={booking.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <Video className="h-4 w-4" />
                        {t('bookings.joinMeeting', language)}
                      </a>
                    )}

                    {booking.location && !booking.is_online && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <MapPin className="h-4 w-4" />
                        <span>{booking.location}</span>
                      </div>
                    )}

                    {booking.notes_admin && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                        <p className="font-semibold text-blue-900 mb-1">{t('bookings.adminNote', language)}:</p>
                        <p className="text-blue-800">{booking.notes_admin}</p>
                      </div>
                    )}

                    {isPast && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="h-4 w-4" />
                        <span>{t('bookings.ended', language)}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="px-4 py-2 text-[#001F3F] hover:bg-gray-100 rounded-lg transition-colors text-sm"
                    >
                      {t('bookings.viewDetails', language)}
                    </button>
                    {isUpcoming && booking.status !== 'cancelled' && (
                      <button
                        onClick={() => cancelBooking(booking.id)}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                      >
                        <XCircle className="h-4 w-4" />
                        {t('common.cancel', language)}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#001F3F]">{t('admin.bookingDetails', language)}</h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('admin.name', language)}</p>
                  <p className="font-semibold">{selectedBooking.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('admin.email', language)}</p>
                  <p className="font-semibold">{selectedBooking.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('consultations.date', language)}</p>
                  <p className="font-semibold">{new Date(selectedBooking.date).toLocaleDateString(language)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('admin.time', language)}</p>
                  <p className="font-semibold">{selectedBooking.time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('bookings.duration', language)}</p>
                  <p className="font-semibold">{selectedBooking.duration || 30} {t('bookings.minutes', language)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('bookings.type', language)}</p>
                  <p className="font-semibold">{selectedBooking.is_online ? 'Online' : 'On-site'}</p>
                </div>
                {selectedBooking.consultant_name && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t('bookings.consultant', language)}</p>
                    <p className="font-semibold">{selectedBooking.consultant_name}</p>
                  </div>
                )}
                {selectedBooking.price && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t('bookings.price', language)}</p>
                    <p className="font-semibold">{selectedBooking.price}€</p>
                  </div>
                )}
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 mb-1">{t('consultations.status', language)}</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${selectedBooking.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : selectedBooking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                  >
                    {selectedBooking.status}
                  </span>
                </div>
              </div>

              {selectedBooking.notes && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">{t('bookings.notes', language)}:</p>
                  <p className="text-gray-800">{selectedBooking.notes}</p>
                </div>
              )}

              {selectedBooking.notes_admin && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900 font-semibold mb-1">{t('bookings.adminNote', language)}:</p>
                  <p className="text-blue-800">{selectedBooking.notes_admin}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
