'use client'

import { useState, useEffect } from 'react'
import {
  Calendar as CalendarIcon,
  Clock,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
  DollarSign,
  Users,
  Activity,
  Plus,
  Filter,
  Download,
  Settings as SettingsIcon
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/context/LanguageContext'
import CalendarView from '@/components/admin/calendar/CalendarView'
import AppointmentModal from '@/components/admin/calendar/AppointmentModal'
import ServiceTypesManager from '@/components/admin/calendar/ServiceTypesManager'
import CalendarSettings from '@/components/admin/calendar/CalendarSettings'

interface Appointment {
  id: string
  title: string
  appointment_date: string
  start_time: string
  end_time: string
  client_name: string
  client_email: string
  client_phone: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
  price: number
  appointment_type_id: string
  appointment_types?: {
    id: string
    name_en: string
    name_fr: string
    name_ar: string
    color: string
    duration: number
    price: number
  }
}

interface Stats {
  today: number
  thisWeek: number
  thisMonth: number
  pending: number
  confirmed: number
  cancelled: number
  revenue: number
  growth: number
}

export default function CalendarPage() {
  const { t, language } = useLanguage()
  const [activeView, setActiveView] = useState<'dashboard' | 'calendar' | 'types' | 'settings'>('dashboard')
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [stats, setStats] = useState<Stats>({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    revenue: 0,
    growth: 0
  })
  const [loading, setLoading] = useState(true)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  useEffect(() => {
    fetchAppointments()
  }, [])

  useEffect(() => {
    calculateStats()
  }, [appointments])

  async function fetchAppointments() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          appointment_types (
            id,
            name_en,
            name_fr,
            name_ar,
            color,
            duration,
            price
          )
        `)
        .order('appointment_date', { ascending: true })
        .order('start_time', { ascending: true })

      if (error) throw error
      setAppointments(data || [])
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  function calculateStats() {
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1)).toISOString().split('T')[0]
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]

    const todayAppts = appointments.filter(a => a.appointment_date === today)
    const weekAppts = appointments.filter(a => a.appointment_date >= startOfWeek)
    const monthAppts = appointments.filter(a => a.appointment_date >= startOfMonth)

    const pending = appointments.filter(a => a.status === 'pending').length
    const confirmed = appointments.filter(a => a.status === 'confirmed').length
    const cancelled = appointments.filter(a => a.status === 'cancelled').length

    const revenue = monthAppts
      .filter(a => a.status === 'completed' || a.status === 'confirmed')
      .reduce((sum, a) => sum + (a.price || 0), 0)

    setStats({
      today: todayAppts.length,
      thisWeek: weekAppts.length,
      thisMonth: monthAppts.length,
      pending,
      confirmed,
      cancelled,
      revenue,
      growth: 12 // This should be calculated from historical data
    })
  }

  function handleCreateAppointment() {
    setSelectedAppointment(null)
    setShowAppointmentModal(true)
  }

  function handleEditAppointment(appointment: Appointment) {
    setSelectedAppointment(appointment)
    setShowAppointmentModal(true)
  }

  function handleCloseModal() {
    setShowAppointmentModal(false)
    setSelectedAppointment(null)
    fetchAppointments()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <CalendarIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {language === 'ar' ? 'إدارة المواعيد' : language === 'fr' ? 'Gestion du Calendrier' : 'Calendar Management'}
                  </h1>
                  <p className="text-xs text-gray-500">
                    {language === 'ar' ? 'نظام متكامل لإدارة المواعيد' : language === 'fr' ? 'Système complet de gestion' : 'Complete appointment system'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCreateAppointment}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">
                  {language === 'ar' ? 'موعد جديد' : language === 'fr' ? 'Nouveau RDV' : 'New Appointment'}
                </span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 -mb-px">
            {[
              { id: 'dashboard', icon: Activity, label: language === 'ar' ? 'لوحة التحكم' : language === 'fr' ? 'Tableau de bord' : 'Dashboard' },
              { id: 'calendar', icon: CalendarIcon, label: language === 'ar' ? 'الكالندر' : language === 'fr' ? 'Calendrier' : 'Calendar' },
              { id: 'types', icon: Users, label: language === 'ar' ? 'الخدمات' : language === 'fr' ? 'Services' : 'Services' },
              { id: 'settings', icon: SettingsIcon, label: language === 'ar' ? 'الإعدادات' : language === 'fr' ? 'Paramètres' : 'Settings' }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all ${
                    activeView === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Today's Appointments */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <CalendarIcon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    {language === 'ar' ? 'اليوم' : language === 'fr' ? 'Aujourd\'hui' : 'Today'}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-gray-900">{stats.today}</p>
                  <p className="text-sm text-gray-600">
                    {language === 'ar' ? 'مواعيد اليوم' : language === 'fr' ? 'Rendez-vous' : 'Appointments'}
                  </p>
                </div>
              </div>

              {/* This Week */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                    {language === 'ar' ? 'هذا الأسبوع' : language === 'fr' ? 'Cette semaine' : 'This Week'}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-gray-900">{stats.thisWeek}</p>
                  <p className="text-sm text-gray-600">
                    {language === 'ar' ? 'مواعيد' : language === 'fr' ? 'Rendez-vous' : 'Appointments'}
                  </p>
                </div>
              </div>

              {/* Pending */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                    {language === 'ar' ? 'قيد الانتظار' : language === 'fr' ? 'En attente' : 'Pending'}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
                  <p className="text-sm text-gray-600">
                    {language === 'ar' ? 'يحتاج موافقة' : language === 'fr' ? 'Nécessite action' : 'Needs Action'}
                  </p>
                </div>
              </div>

              {/* Revenue */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    +{stats.growth}%
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-gray-900">{stats.revenue}€</p>
                  <p className="text-sm text-gray-600">
                    {language === 'ar' ? 'إيرادات الشهر' : language === 'fr' ? 'Revenus du mois' : 'Monthly Revenue'}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Confirmed */}
              <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-green-700">{stats.confirmed}</p>
                    <p className="text-sm text-green-600 font-medium mt-1">
                      {language === 'ar' ? 'مؤكدة' : language === 'fr' ? 'Confirmés' : 'Confirmed'}
                    </p>
                  </div>
                  <CheckCircle2 className="w-10 h-10 text-green-600 opacity-50" />
                </div>
              </div>

              {/* Cancelled */}
              <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl p-6 border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-red-700">{stats.cancelled}</p>
                    <p className="text-sm text-red-600 font-medium mt-1">
                      {language === 'ar' ? 'ملغاة' : language === 'fr' ? 'Annulés' : 'Cancelled'}
                    </p>
                  </div>
                  <XCircle className="w-10 h-10 text-red-600 opacity-50" />
                </div>
              </div>

              {/* This Month */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-blue-700">{stats.thisMonth}</p>
                    <p className="text-sm text-blue-600 font-medium mt-1">
                      {language === 'ar' ? 'هذا الشهر' : language === 'fr' ? 'Ce mois' : 'This Month'}
                    </p>
                  </div>
                  <Activity className="w-10 h-10 text-blue-600 opacity-50" />
                </div>
              </div>
            </div>

            {/* Recent Appointments Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">
                    {language === 'ar' ? 'المواعيد القادمة' : language === 'fr' ? 'Prochains rendez-vous' : 'Upcoming Appointments'}
                  </h2>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    {language === 'ar' ? 'عرض الكل' : language === 'fr' ? 'Voir tout' : 'View All'} →
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        {language === 'ar' ? 'التاريخ' : language === 'fr' ? 'Date' : 'Date'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        {language === 'ar' ? 'الوقت' : language === 'fr' ? 'Heure' : 'Time'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        {language === 'ar' ? 'العميل' : language === 'fr' ? 'Client' : 'Client'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        {language === 'ar' ? 'الخدمة' : language === 'fr' ? 'Service' : 'Service'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        {language === 'ar' ? 'الحالة' : language === 'fr' ? 'Statut' : 'Status'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {appointments.slice(0, 5).map((appointment) => (
                      <tr
                        key={appointment.id}
                        onClick={() => handleEditAppointment(appointment)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(appointment.appointment_date).toLocaleDateString(language === 'ar' ? 'ar' : language === 'fr' ? 'fr' : 'en')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {appointment.start_time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{appointment.client_name}</div>
                          <div className="text-xs text-gray-500">{appointment.client_email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {appointment.appointment_types && (
                            <span
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: `${appointment.appointment_types.color}20`,
                                color: appointment.appointment_types.color
                              }}
                            >
                              {appointment.appointment_types[`name_${language}` as keyof typeof appointment.appointment_types] as string}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {appointment.status === 'pending' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              {language === 'ar' ? 'قيد الانتظار' : language === 'fr' ? 'En attente' : 'Pending'}
                            </span>
                          )}
                          {appointment.status === 'confirmed' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {language === 'ar' ? 'مؤكد' : language === 'fr' ? 'Confirmé' : 'Confirmed'}
                            </span>
                          )}
                          {appointment.status === 'cancelled' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              {language === 'ar' ? 'ملغى' : language === 'fr' ? 'Annulé' : 'Cancelled'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeView === 'calendar' && (
          <CalendarView
            appointments={appointments}
            onEditAppointment={handleEditAppointment}
            onRefresh={fetchAppointments}
          />
        )}

        {activeView === 'types' && (
          <ServiceTypesManager />
        )}

        {activeView === 'settings' && (
          <CalendarSettings />
        )}
      </div>

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <AppointmentModal
          appointment={selectedAppointment}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}
