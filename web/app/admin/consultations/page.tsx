'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Briefcase,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Clock,
  User,
  LayoutGrid,
  List,
  Video,
  Calendar
} from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import { motion } from 'framer-motion';

interface Consultation {
  id: string;
  client_name: string;
  client_email: string;
  service_type: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  consultant_id: string;
  date: string;
  time: string;
  duration: number;
  fee: number;
  notes: string;
  internal_notes: string;
  meet_link: string;
  created_at: string;
}

interface AdminUser {
  user_id: string;
  email: string;
  role: string;
}

export default function AdminConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);

  useEffect(() => {
    fetchConsultations();
    fetchAdmins();

    // Real-time subscription
    const channel = supabase
      .channel('admin_consultations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
        },
        () => {
          fetchConsultations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchAdmins() {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('user_id, email, role');
      if (!error && data) setAdmins(data);
    } catch (err) {
      console.error('Error fetching admins:', err);
    }
  }

  async function fetchConsultations() {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedData = (data || []).map(booking => ({
        id: booking.id,
        client_name: booking.name,
        client_email: booking.email,
        service_type: booking.topic,
        status: booking.status,
        consultant_id: booking.consultant_id || '',
        date: booking.date,
        time: booking.time,
        duration: booking.duration || 60,
        fee: booking.fee || 0,
        notes: booking.notes || '',
        internal_notes: booking.internal_notes || '',
        meet_link: booking.meet_link || '',
        created_at: booking.created_at,
      }));

      setConsultations(transformedData);
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateConsultation(id: string, updates: Partial<Consultation>) {
    setIsSaving(true);
    try {
      // Map back to DB fields if necessary (status, notes, etc.)
      const dbUpdates: any = { ...updates };
      if (updates.client_name) dbUpdates.name = updates.client_name;
      if (updates.client_email) dbUpdates.email = updates.client_email;
      if (updates.service_type) dbUpdates.topic = updates.service_type;

      const { error } = await supabase
        .from('bookings')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      // Update local state for immediate feedback
      setConsultations(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
      if (selectedConsultation?.id === id) {
        setSelectedConsultation(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (err) {
      console.error('Error updating consultation:', err);
      alert('Failed to update consultation');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteConsultation(id: string) {
    if (!confirm('Are you sure you want to delete this consultation? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Remove from local state
      setConsultations(prev => prev.filter(c => c.id !== id));
      if (showModal && selectedConsultation?.id === id) {
        setShowModal(false);
      }
    } catch (err) {
      console.error('Error deleting consultation:', err);
      alert('Failed to delete consultation');
    }
  }

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch =
      consultation.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.client_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.service_type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || consultation.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: consultations.length,
    scheduled: consultations.filter(c => c.status === 'confirmed').length,
    inProgress: consultations.filter(c => c.status === 'in-progress').length,
    completed: consultations.filter(c => c.status === 'completed').length,
    totalRevenue: consultations.filter(c => c.status === 'completed').reduce((sum, c) => sum + (c.fee || 0), 0),
  };

  function getStatusColor(status: string) {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-700';
      case 'confirmed':
        return 'bg-indigo-100 text-indigo-700';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#001F3F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading consultations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#001F3F]">Consultations</h1>
          <p className="text-gray-600 mt-1">Manage all consultation sessions</p>
        </div>
        <button
          onClick={() => {
            setSelectedConsultation({
              id: '',
              client_name: '',
              client_email: '',
              service_type: '',
              status: 'pending',
              consultant_id: '',
              date: new Date().toISOString().split('T')[0],
              time: '09:00',
              duration: 60,
              fee: 0,
              notes: '',
              internal_notes: '',
              meet_link: '',
              created_at: new Date().toISOString(),
            });
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] transition-colors"
        >
          <Plus className="h-5 w-5" />
          New Consultation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <StatsCard
          title="Total"
          value={stats.total.toString()}
          icon={Briefcase}
        />
        <StatsCard
          title="Scheduled"
          value={stats.scheduled.toString()}
          icon={Clock}
          subtitle="Upcoming"
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgress.toString()}
          icon={User}
          subtitle="Active now"
        />
        <StatsCard
          title="Completed"
          value={stats.completed.toString()}
          icon={Briefcase}
        />
        <StatsCard
          title="Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          subtitle="Total earned"
        />
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by client name, email, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001F3F]/20"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {['all', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filterStatus === status
                  ? 'bg-[#001F3F] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Content View */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Consultant</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredConsultations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No consultations found
                  </td>
                </tr>
              ) : (
                filteredConsultations.map((consultation) => (
                  <tr key={consultation.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{consultation.client_name}</p>
                        <p className="text-xs text-gray-500">{consultation.client_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{consultation.service_type}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">
                        {admins.find(a => a.user_id === consultation.consultant_id)?.email || 'None'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{new Date(consultation.date).toLocaleDateString()} {consultation.time}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{consultation.duration} min</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(consultation.status)}`}>
                        {consultation.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {consultation.meet_link && (
                          <a
                            href={consultation.meet_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Join Meeting"
                          >
                            <Video className="h-4 w-4" />
                          </a>
                        )}
                        <button
                          onClick={() => {
                            setSelectedConsultation(consultation);
                            setShowModal(true);
                          }}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteConsultation(consultation.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {showModal && selectedConsultation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#001F3F]">Consultation Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status Update */}
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">Change Status</label>
                  <select
                    value={selectedConsultation.status}
                    onChange={(e) => updateConsultation(selectedConsultation.id, { status: e.target.value as any })}
                    className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                  >
                    {['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map(s => (
                      <option key={s} value={s}>{s.replace('-', ' ')}</option>
                    ))}
                  </select>
                </div>

                {/* Consultant Assignment */}
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">Assign Consultant</label>
                  <select
                    value={selectedConsultation.consultant_id}
                    onChange={(e) => updateConsultation(selectedConsultation.id, { consultant_id: e.target.value })}
                    className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#001F3F]/20"
                  >
                    <option value="">Unassigned</option>
                    {admins.map(admin => (
                      <option key={admin.user_id} value={admin.user_id}>{admin.email}</option>
                    ))}
                  </select>
                </div>

                {/* Fee Management */}
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">Consultation Fee (€)</label>
                  <input
                    type="number"
                    value={selectedConsultation.fee}
                    onChange={(e) => updateConsultation(selectedConsultation.id, { fee: Number(e.target.value) })}
                    className="w-full p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#001F3F]/20 font-bold text-green-600"
                  />
                </div>

                {/* Meeting Link */}
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">Meeting Link (Join)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://..."
                      value={selectedConsultation.meet_link}
                      onChange={(e) => updateConsultation(selectedConsultation.id, { meet_link: e.target.value })}
                      className="flex-1 p-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#001F3F]/20 text-sm"
                    />
                    {selectedConsultation.meet_link && (
                      <a
                        href={selectedConsultation.meet_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        <Eye className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">Client Notes</label>
                  <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-700 min-h-[100px]">
                    {selectedConsultation.notes || 'No client notes provided.'}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-2">Internal Admin Notes</label>
                  <textarea
                    rows={4}
                    value={selectedConsultation.internal_notes}
                    onChange={(e) => updateConsultation(selectedConsultation.id, { internal_notes: e.target.value })}
                    placeholder="Add internal notes for consultants..."
                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#001F3F]/20 text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-[#001F3F] text-white rounded-lg hover:bg-[#003366] transition-colors"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
