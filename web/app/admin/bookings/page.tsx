'use client';

import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import { supabase } from '@/lib/supabase';
import { CheckCircle, XCircle, Eye, Calendar, Link as LinkIcon, Edit, Save, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { t } from '@/lib/translations';

interface Booking {
  id: string;
  name: string;
  email: string;
  topic: string;
  date: string;
  time: string;
  status: string;
  consultation_type?: string;
  meeting_type?: string;
  meeting_link?: string;
  admin_notes?: string;
  user_id?: string;
  created_at: string;
}

export default function AdminBookingsPage() {
  const { language } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [meetingLink, setMeetingLink] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchBookings();

    // Real-time subscription
    const channel = supabase
      .channel('admin_bookings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
        },
        () => {
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchBookings() {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateBookingStatus(id: string, status: string) {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      // Refresh bookings
      fetchBookings();
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  }

  async function updateBookingDetails() {
    if (!editingBooking) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          meeting_link: meetingLink,
          admin_notes: adminNotes,
        })
        .eq('id', editingBooking.id);

      if (error) throw error;

      // Refresh bookings
      await fetchBookings();
      setEditingBooking(null);
      setMeetingLink('');
      setAdminNotes('');
    } catch (error) {
      console.error('Error updating booking details:', error);
    } finally {
      setSaving(false);
    }
  }

  function openEditModal(booking: Booking) {
    setEditingBooking(booking);
    setMeetingLink(booking.meeting_link || '');
    setAdminNotes(booking.admin_notes || '');
  }

  const filteredBookings = statusFilter === 'all'
    ? bookings
    : bookings.filter(b => b.status === statusFilter);

  const columns = [
    {
      header: t('admin.name', language),
      accessor: 'name' as keyof Booking,
      sortable: true,
    },
    {
      header: t('admin.email', language),
      accessor: 'email' as keyof Booking,
      sortable: true,
    },
    {
      header: t('bookings.topic', language),
      accessor: 'topic' as keyof Booking,
    },
    {
      header: t('consultations.date', language),
      accessor: (row: Booking) => new Date(row.date).toLocaleDateString(),
    },
    {
      header: t('admin.time', language),
      accessor: 'time' as keyof Booking,
    },
    {
      header: t('consultations.status', language),
      accessor: (row: Booking) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            row.status === 'confirmed'
              ? 'bg-green-100 text-green-700'
              : row.status === 'pending'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: t('consultations.actions', language),
      accessor: (row: Booking) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedBooking(row)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title={t('bookings.viewDetails', language)}
          >
            <Eye className="h-4 w-4 text-gray-600" />
          </button>
          <button
            onClick={() => openEditModal(row)}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
            title="Modifier"
          >
            <Edit className="h-4 w-4 text-blue-600" />
          </button>
          {row.status === 'pending' && (
            <>
              <button
                onClick={() => updateBookingStatus(row.id, 'confirmed')}
                className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                title={t('common.confirm', language)}
              >
                <CheckCircle className="h-4 w-4 text-green-600" />
              </button>
              <button
                onClick={() => updateBookingStatus(row.id, 'cancelled')}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                title={t('common.cancel', language)}
              >
                <XCircle className="h-4 w-4 text-red-600" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#001F3F]">{t('admin.bookingsManagement', language)}</h1>
          <p className="text-gray-600 mt-1">{t('admin.viewAndManageBookings', language)}</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmé</option>
            <option value="cancelled">Annulé</option>
          </select>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
            <Calendar className="h-5 w-5 text-[#001F3F]" />
            <span className="font-semibold text-[#001F3F]">{filteredBookings.length} {t('consultations.total', language)}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">{t('bookings.pending', language)}</p>
          <p className="text-2xl font-bold text-yellow-600">
            {bookings.filter((b) => b.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">{t('bookings.confirmed', language)}</p>
          <p className="text-2xl font-bold text-green-600">
            {bookings.filter((b) => b.status === 'confirmed').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">{t('consultations.cancelled', language)}</p>
          <p className="text-2xl font-bold text-red-600">
            {bookings.filter((b) => b.status === 'cancelled').length}
          </p>
        </div>
      </div>

      {/* Data Table */}
      <DataTable data={filteredBookings} columns={columns} searchable searchPlaceholder={t('common.search', language) + '...'} />

      {/* Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
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
                  <p className="text-sm text-gray-600 mb-1">{t('bookings.topic', language)}</p>
                  <p className="font-semibold">{selectedBooking.topic}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('consultations.status', language)}</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedBooking.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : selectedBooking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {selectedBooking.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('consultations.date', language)}</p>
                  <p className="font-semibold">{new Date(selectedBooking.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{t('admin.time', language)}</p>
                  <p className="font-semibold">{selectedBooking.time}</p>
                </div>
                {selectedBooking.consultation_type && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Type de consultation</p>
                    <p className="font-semibold">{selectedBooking.consultation_type}</p>
                  </div>
                )}
                {selectedBooking.meeting_type && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Type de réunion</p>
                    <p className="font-semibold capitalize">{selectedBooking.meeting_type}</p>
                  </div>
                )}
              </div>

              {selectedBooking.meeting_link && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Lien de réunion
                  </p>
                  <a
                    href={selectedBooking.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {selectedBooking.meeting_link}
                  </a>
                </div>
              )}

              {selectedBooking.admin_notes && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Notes admin
                  </p>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedBooking.admin_notes}</p>
                </div>
              )}

              {selectedBooking.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => updateBookingStatus(selectedBooking.id, 'confirmed')}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {t('bookings.confirmBooking', language)}
                  </button>
                  <button
                    onClick={() => updateBookingStatus(selectedBooking.id, 'cancelled')}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    {t('admin.cancelBooking', language)}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal - Meeting Link & Admin Notes */}
      {editingBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#001F3F]">
                Modifier les détails du rendez-vous
              </h2>
              <button
                onClick={() => {
                  setEditingBooking(null);
                  setMeetingLink('');
                  setAdminNotes('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Booking Info Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Client: </span>
                    <span className="font-semibold">{editingBooking.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date: </span>
                    <span className="font-semibold">{new Date(editingBooking.date).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Heure: </span>
                    <span className="font-semibold">{editingBooking.time}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Statut: </span>
                    <span className={`font-semibold ${
                      editingBooking.status === 'confirmed' ? 'text-green-600' :
                      editingBooking.status === 'pending' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {editingBooking.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Meeting Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Lien de réunion (Google Meet, Zoom, etc.)
                </label>
                <input
                  type="url"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Le client pourra accéder à ce lien depuis son espace
                </p>
              </div>

              {/* Admin Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Notes administratives (privées)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  placeholder="Notes internes, rappels, informations importantes..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ces notes sont visibles uniquement par les administrateurs
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setEditingBooking(null);
                    setMeetingLink('');
                    setAdminNotes('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={updateBookingDetails}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Enregistrer les modifications
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
