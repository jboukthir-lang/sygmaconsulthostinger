'use client'

import { useState, useEffect } from 'react'
import { Save, Clock, Mail, Calendar, Bell, Globe, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/context/LanguageContext'

interface CalendarSettings {
  id?: string
  working_hours_start: string
  working_hours_end: string
  break_start?: string
  break_end?: string
  slot_duration: number
  max_advance_booking_days: number
  min_advance_booking_hours: number
  email_notifications: boolean
  sms_notifications: boolean
  reminder_hours_before: number
  google_calendar_sync: boolean
  auto_confirm_appointments: boolean
  working_days: string[]
  timezone: string
  cancellation_notice_hours: number
}

const TIMEZONES = [
  { value: 'Africa/Algiers', label: 'Algeria (GMT+1)' },
  { value: 'Africa/Cairo', label: 'Egypt (GMT+2)' },
  { value: 'Africa/Casablanca', label: 'Morocco (GMT+1)' },
  { value: 'Europe/Paris', label: 'France (GMT+1)' },
  { value: 'America/New_York', label: 'New York (GMT-5)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-8)' },
  { value: 'UTC', label: 'UTC (GMT+0)' }
]

const DAYS_OF_WEEK = [
  { value: 'monday', label_en: 'Monday', label_fr: 'Lundi', label_ar: 'الإثنين' },
  { value: 'tuesday', label_en: 'Tuesday', label_fr: 'Mardi', label_ar: 'الثلاثاء' },
  { value: 'wednesday', label_en: 'Wednesday', label_fr: 'Mercredi', label_ar: 'الأربعاء' },
  { value: 'thursday', label_en: 'Thursday', label_fr: 'Jeudi', label_ar: 'الخميس' },
  { value: 'friday', label_en: 'Friday', label_fr: 'Vendredi', label_ar: 'الجمعة' },
  { value: 'saturday', label_en: 'Saturday', label_fr: 'Samedi', label_ar: 'السبت' },
  { value: 'sunday', label_en: 'Sunday', label_fr: 'Dimanche', label_ar: 'الأحد' }
]

export default function CalendarSettings() {
  const { language } = useLanguage()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<CalendarSettings>({
    working_hours_start: '09:00',
    working_hours_end: '17:00',
    break_start: '12:00',
    break_end: '13:00',
    slot_duration: 30,
    max_advance_booking_days: 30,
    min_advance_booking_hours: 24,
    email_notifications: true,
    sms_notifications: false,
    reminder_hours_before: 24,
    google_calendar_sync: false,
    auto_confirm_appointments: false,
    working_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    timezone: 'Africa/Algiers',
    cancellation_notice_hours: 24
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    try {
      const { data, error } = await supabase
        .from('calendar_settings')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setSettings({
          ...data,
          working_days: data.working_days || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      if (settings.id) {
        // Update existing
        const { error } = await supabase
          .from('calendar_settings')
          .update(settings)
          .eq('id', settings.id)

        if (error) throw error
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('calendar_settings')
          .insert([settings])
          .select()
          .single()

        if (error) throw error
        if (data) setSettings({ ...settings, id: data.id })
      }

      alert(
        language === 'ar'
          ? 'تم حفظ الإعدادات بنجاح'
          : language === 'fr'
          ? 'Paramètres enregistrés avec succès'
          : 'Settings saved successfully'
      )
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  function toggleWorkingDay(day: string) {
    setSettings(prev => ({
      ...prev,
      working_days: prev.working_days.includes(day)
        ? prev.working_days.filter(d => d !== day)
        : [...prev.working_days, day]
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          {language === 'ar' ? 'إعدادات التقويم' : language === 'fr' ? 'Paramètres du Calendrier' : 'Calendar Settings'}
        </h2>
        <p className="text-gray-600 mt-1">
          {language === 'ar'
            ? 'قم بتكوين ساعات العمل والإشعارات وخيارات الحجز'
            : language === 'fr'
            ? 'Configurez les heures de travail, les notifications et les options de réservation'
            : 'Configure working hours, notifications, and booking options'}
        </p>
      </div>

      <div className="space-y-6">
        {/* Working Hours Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {language === 'ar' ? 'ساعات العمل' : language === 'fr' ? 'Heures de Travail' : 'Working Hours'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'بداية العمل' : language === 'fr' ? 'Début' : 'Start Time'}
              </label>
              <input
                type="time"
                value={settings.working_hours_start}
                onChange={(e) => setSettings({ ...settings, working_hours_start: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'نهاية العمل' : language === 'fr' ? 'Fin' : 'End Time'}
              </label>
              <input
                type="time"
                value={settings.working_hours_end}
                onChange={(e) => setSettings({ ...settings, working_hours_end: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'بداية الاستراحة' : language === 'fr' ? 'Début Pause' : 'Break Start'}
              </label>
              <input
                type="time"
                value={settings.break_start || ''}
                onChange={(e) => setSettings({ ...settings, break_start: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'نهاية الاستراحة' : language === 'fr' ? 'Fin Pause' : 'Break End'}
              </label>
              <input
                type="time"
                value={settings.break_end || ''}
                onChange={(e) => setSettings({ ...settings, break_end: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Working Days */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {language === 'ar' ? 'أيام العمل' : language === 'fr' ? 'Jours de Travail' : 'Working Days'}
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map(day => (
                <button
                  key={day.value}
                  onClick={() => toggleWorkingDay(day.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    settings.working_days.includes(day.value)
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {language === 'ar' ? day.label_ar : language === 'fr' ? day.label_fr : day.label_en}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Configuration */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {language === 'ar' ? 'إعدادات الحجز' : language === 'fr' ? 'Configuration des Réservations' : 'Booking Configuration'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'مدة الفترة (دقائق)' : language === 'fr' ? 'Durée du Créneau (min)' : 'Slot Duration (minutes)'}
              </label>
              <select
                value={settings.slot_duration}
                onChange={(e) => setSettings({ ...settings, slot_duration: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={15}>15 {language === 'ar' ? 'دقيقة' : language === 'fr' ? 'minutes' : 'minutes'}</option>
                <option value={30}>30 {language === 'ar' ? 'دقيقة' : language === 'fr' ? 'minutes' : 'minutes'}</option>
                <option value={60}>60 {language === 'ar' ? 'دقيقة' : language === 'fr' ? 'minutes' : 'minutes'}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'أقصى حد للحجز المسبق (أيام)' : language === 'fr' ? 'Réservation Maximale (jours)' : 'Max Advance Booking (days)'}
              </label>
              <input
                type="number"
                value={settings.max_advance_booking_days}
                onChange={(e) => setSettings({ ...settings, max_advance_booking_days: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الحد الأدنى للحجز المسبق (ساعات)' : language === 'fr' ? 'Réservation Minimale (heures)' : 'Min Advance Booking (hours)'}
              </label>
              <input
                type="number"
                value={settings.min_advance_booking_hours}
                onChange={(e) => setSettings({ ...settings, min_advance_booking_hours: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'إشعار الإلغاء (ساعات)' : language === 'fr' ? 'Préavis d\'Annulation (heures)' : 'Cancellation Notice (hours)'}
              </label>
              <input
                type="number"
                value={settings.cancellation_notice_hours}
                onChange={(e) => setSettings({ ...settings, cancellation_notice_hours: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="w-4 h-4 inline mr-1" />
                {language === 'ar' ? 'المنطقة الزمنية' : language === 'fr' ? 'Fuseau Horaire' : 'Timezone'}
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {TIMEZONES.map(tz => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {language === 'ar' ? 'الإشعارات' : language === 'fr' ? 'Notifications' : 'Notifications'}
            </h3>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={settings.email_notifications}
                onChange={(e) => setSettings({ ...settings, email_notifications: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-gray-900">
                  <Mail className="w-4 h-4 inline mr-2" />
                  {language === 'ar' ? 'إشعارات البريد الإلكتروني' : language === 'fr' ? 'Notifications Email' : 'Email Notifications'}
                </div>
                <div className="text-sm text-gray-600">
                  {language === 'ar'
                    ? 'إرسال تأكيدات وتذكيرات عبر البريد الإلكتروني'
                    : language === 'fr'
                    ? 'Envoyer des confirmations et rappels par email'
                    : 'Send confirmations and reminders via email'}
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={settings.sms_notifications}
                onChange={(e) => setSettings({ ...settings, sms_notifications: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-gray-900">
                  {language === 'ar' ? 'إشعارات SMS' : language === 'fr' ? 'Notifications SMS' : 'SMS Notifications'}
                </div>
                <div className="text-sm text-gray-600">
                  {language === 'ar'
                    ? 'إرسال تذكيرات عبر الرسائل النصية'
                    : language === 'fr'
                    ? 'Envoyer des rappels par SMS'
                    : 'Send reminders via text message'}
                </div>
              </div>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'التذكير قبل (ساعات)' : language === 'fr' ? 'Rappel Avant (heures)' : 'Reminder Before (hours)'}
              </label>
              <input
                type="number"
                value={settings.reminder_hours_before}
                onChange={(e) => setSettings({ ...settings, reminder_hours_before: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Integrations */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {language === 'ar' ? 'التكاملات' : language === 'fr' ? 'Intégrations' : 'Integrations'}
            </h3>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={settings.google_calendar_sync}
                onChange={(e) => setSettings({ ...settings, google_calendar_sync: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-gray-900">
                  {language === 'ar' ? 'مزامنة Google Calendar' : language === 'fr' ? 'Synchronisation Google Calendar' : 'Google Calendar Sync'}
                </div>
                <div className="text-sm text-gray-600">
                  {language === 'ar'
                    ? 'مزامنة المواعيد تلقائياً مع Google Calendar'
                    : language === 'fr'
                    ? 'Synchroniser automatiquement les rendez-vous avec Google Calendar'
                    : 'Automatically sync appointments with Google Calendar'}
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={settings.auto_confirm_appointments}
                onChange={(e) => setSettings({ ...settings, auto_confirm_appointments: e.target.checked })}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-gray-900">
                  {language === 'ar' ? 'تأكيد تلقائي للمواعيد' : language === 'fr' ? 'Confirmation Automatique' : 'Auto-confirm Appointments'}
                </div>
                <div className="text-sm text-gray-600">
                  {language === 'ar'
                    ? 'تأكيد المواعيد الجديدة تلقائياً بدون مراجعة يدوية'
                    : language === 'fr'
                    ? 'Confirmer automatiquement les nouveaux rendez-vous sans révision manuelle'
                    : 'Automatically confirm new appointments without manual review'}
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {language === 'ar' ? 'جاري الحفظ...' : language === 'fr' ? 'Enregistrement...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {language === 'ar' ? 'حفظ الإعدادات' : language === 'fr' ? 'Enregistrer les Paramètres' : 'Save Settings'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
