'use client'

import { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus, X, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'
import { t } from '@/lib/translations'

interface AppointmentType {
  id: string
  name_ar: string
  name_fr: string
  name_en: string
  description_ar: string | null
  description_fr: string | null
  description_en: string | null
  duration: number
  color: string
  price: number
  is_active: boolean
}

interface Appointment {
  id: string
  appointment_type_id: string
  title: string
  appointment_date: string
  start_time: string
  end_time: string
  client_name: string
  status: string
  appointment_types: AppointmentType
}

interface CalendarSettings {
  monday_enabled: boolean
  tuesday_enabled: boolean
  wednesday_enabled: boolean
  thursday_enabled: boolean
  friday_enabled: boolean
  saturday_enabled: boolean
  sunday_enabled: boolean
  monday_start: string
  monday_end: string
  tuesday_start: string
  tuesday_end: string
  wednesday_start: string
  wednesday_end: string
  thursday_start: string
  thursday_end: string
  friday_start: string
  friday_end: string
  saturday_start: string
  saturday_end: string
  sunday_start: string
  sunday_end: string
  slot_duration: number
  lunch_break_enabled: boolean
  lunch_break_start: string
  lunch_break_end: string
  min_advance_booking_hours: number
  max_advance_booking_days: number
}

export default function AppointmentsPage() {
  const { language } = useLanguage()
  const { user } = useAuth()

  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([])
  const [settings, setSettings] = useState<CalendarSettings | null>(null)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState({
    type_id: '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    notes: ''
  })

  const monthNames = {
    ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  }

  const dayNames = {
    ar: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    fr: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  }

  useEffect(() => {
    fetchData()
  }, [currentDate])

  useEffect(() => {
    if (selectedDate) {
      generateAvailableSlots(selectedDate)
    }
  }, [selectedDate, settings, appointments])

  async function fetchData() {
    setLoading(true)
    try {
      // Fetch appointment types
      const { data: types } = await supabase
        .from('appointment_types')
        .select('*')
        .eq('is_active', true)
        .order('duration')

      setAppointmentTypes(types || [])

      // Fetch settings
      const { data: settingsData } = await supabase
        .from('calendar_settings')
        .select('*')
        .single()

      setSettings(settingsData)

      // Fetch appointments for current month
      const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

      const { data: appointmentsData } = await supabase
        .from('appointments')
        .select(`
          *,
          appointment_types (*)
        `)
        .gte('appointment_date', firstDay.toISOString().split('T')[0])
        .lte('appointment_date', lastDay.toISOString().split('T')[0])
        .in('status', ['pending', 'confirmed'])

      setAppointments(appointmentsData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  function generateAvailableSlots(date: Date) {
    if (!settings) return

    const dayIndex = date.getDay()
    const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const dayKey = dayKeys[dayIndex]

    const enabledKey = `${dayKey}_enabled` as keyof CalendarSettings
    const startKey = `${dayKey}_start` as keyof CalendarSettings
    const endKey = `${dayKey}_end` as keyof CalendarSettings

    if (!settings[enabledKey]) {
      setAvailableSlots([])
      return
    }

    const startTime = settings[startKey] as string
    const endTime = settings[endKey] as string
    const slotDuration = settings.slot_duration

    const slots: string[] = []
    let currentTime = parseTime(startTime)
    const endTimeMinutes = parseTime(endTime)

    while (currentTime + slotDuration <= endTimeMinutes) {
      const timeStr = formatTime(currentTime)

      // Check if slot is during lunch break
      if (settings.lunch_break_enabled) {
        const lunchStart = parseTime(settings.lunch_break_start)
        const lunchEnd = parseTime(settings.lunch_break_end)

        if (currentTime >= lunchStart && currentTime < lunchEnd) {
          currentTime += slotDuration
          continue
        }
      }

      // Check if slot is already booked
      const dateStr = date.toISOString().split('T')[0]
      const isBooked = appointments.some(apt =>
        apt.appointment_date === dateStr && apt.start_time === timeStr
      )

      if (!isBooked) {
        slots.push(timeStr)
      }

      currentTime += slotDuration
    }

    setAvailableSlots(slots)
  }

  function parseTime(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number)
    return hours * 60 + minutes
  }

  function formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  function getDaysInMonth(date: Date) {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  function getAppointmentsForDate(date: Date) {
    const dateStr = date.toISOString().split('T')[0]
    return appointments.filter(apt => apt.appointment_date === dateStr)
  }

  function isDateDisabled(date: Date) {
    if (!settings) return true

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check if date is in the past
    if (date < today) return true

    // Check max advance booking
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + settings.max_advance_booking_days)
    if (date > maxDate) return true

    // Check if day of week is enabled
    const dayIndex = date.getDay()
    const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const enabledKey = `${dayKeys[dayIndex]}_enabled` as keyof CalendarSettings

    return !settings[enabledKey]
  }

  function previousMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  function nextMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  function handleDateClick(date: Date) {
    if (isDateDisabled(date)) return
    setSelectedDate(date)
    setBooking({ ...booking, date: date.toISOString().split('T')[0] })
    setShowBookingModal(true)
  }

  async function handleBooking() {
    if (!booking.type_id || !booking.date || !booking.time || !booking.name || !booking.email || !booking.phone) {
      alert(t('appointments.fillAllFields', language))
      return
    }

    try {
      const selectedType = appointmentTypes.find(t => t.id === booking.type_id)
      if (!selectedType) return

      const startTime = booking.time
      const endTimeMinutes = parseTime(startTime) + selectedType.duration
      const endTime = formatTime(endTimeMinutes)

      const { error } = await supabase
        .from('appointments')
        .insert({
          appointment_type_id: booking.type_id,
          title: `${booking.name} - ${selectedType[`name_${language}` as keyof AppointmentType]}`,
          appointment_date: booking.date,
          start_time: startTime,
          end_time: endTime,
          client_name: booking.name,
          client_email: booking.email,
          client_phone: booking.phone,
          client_notes: booking.notes,
          user_id: user?.uid || null,
          status: 'pending'
        })

      if (error) throw error

      alert(t('appointments.bookingSuccess', language))
      setShowBookingModal(false)
      setBooking({ type_id: '', date: '', time: '', name: '', email: '', phone: '', notes: '' })
      fetchData()
    } catch (error) {
      console.error('Error booking appointment:', error)
      alert(t('appointments.bookingError', language))
    }
  }

  const days = getDaysInMonth(currentDate)

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {t('appointments.title', language)}
          </h1>
          <p className="text-gray-600">
            {t('appointments.subtitle', language)}
          </p>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900">
              {monthNames[language][currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>

            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames[language].map((day, index) => (
              <div key={index} className="text-center font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="aspect-square" />
              }

              const dayAppointments = getAppointmentsForDate(date)
              const isDisabled = isDateDisabled(date)
              const isToday = date.toDateString() === new Date().toDateString()
              const isSelected = selectedDate?.toDateString() === date.toDateString()

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => handleDateClick(date)}
                  disabled={isDisabled}
                  className={`
                    aspect-square p-2 rounded-lg border-2 transition-all
                    ${isDisabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:border-blue-500 cursor-pointer'}
                    ${isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                    ${isSelected ? 'bg-blue-100 border-blue-600' : ''}
                  `}
                >
                  <div className="text-sm font-semibold mb-1">{date.getDate()}</div>
                  {dayAppointments.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-center">
                      {dayAppointments.slice(0, 3).map((apt, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: apt.appointment_types.color }}
                        />
                      ))}
                      {dayAppointments.length > 3 && (
                        <div className="text-xs text-gray-600">+{dayAppointments.length - 3}</div>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Appointment Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appointmentTypes.map((type) => (
            <div key={type.id} className="bg-white rounded-lg shadow p-6 border-2 border-transparent hover:border-blue-500 transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: type.color }}
                  />
                  <h3 className="font-semibold text-lg">
                    {type[`name_${language}` as keyof AppointmentType] as string}
                  </h3>
                </div>
                {type.price > 0 && (
                  <span className="text-blue-600 font-bold">{type.price} €</span>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-3">
                {type[`description_${language}` as keyof AppointmentType] as string}
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {type.duration} {t('appointments.minutes', language)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedDate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">
                {t('appointments.bookAppointment', language)}
              </h3>
              <button onClick={() => setShowBookingModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Date Display */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">
                  {t('appointments.selectedDate', language)}
                </div>
                <div className="font-semibold text-lg">
                  {selectedDate.toLocaleDateString(language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>

              {/* Appointment Type */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === 'ar' ? 'نوع الموعد' : language === 'fr' ? 'Type de rendez-vous' : 'Appointment Type'}
                </label>
                <select
                  value={booking.type_id}
                  onChange={(e) => setBooking({ ...booking, type_id: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option value="">
                    {language === 'ar' ? 'اختر نوع الموعد' : language === 'fr' ? 'Choisir le type' : 'Select Type'}
                  </option>
                  {appointmentTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type[`name_${language}` as keyof AppointmentType]} - {type.duration} {language === 'ar' ? 'دقيقة' : 'min'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Slot */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === 'ar' ? 'الوقت' : language === 'fr' ? 'Heure' : 'Time'}
                </label>
                {availableSlots.length === 0 ? (
                  <p className="text-red-600 text-sm">
                    {language === 'ar' ? 'لا توجد أوقات متاحة' : language === 'fr' ? 'Aucun créneau disponible' : 'No available slots'}
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setBooking({ ...booking, time: slot })}
                        className={`py-2 px-3 rounded-lg border-2 transition ${
                          booking.time === slot
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Client Info */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === 'ar' ? 'الاسم الكامل' : language === 'fr' ? 'Nom complet' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={booking.name}
                  onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder={language === 'ar' ? 'أدخل اسمك' : language === 'fr' ? 'Entrez votre nom' : 'Enter your name'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === 'ar' ? 'البريد الإلكتروني' : language === 'fr' ? 'Email' : 'Email'}
                </label>
                <input
                  type="email"
                  value={booking.email}
                  onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === 'ar' ? 'رقم الهاتف' : language === 'fr' ? 'Téléphone' : 'Phone'}
                </label>
                <input
                  type="tel"
                  value={booking.phone}
                  onChange={(e) => setBooking({ ...booking, phone: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === 'ar' ? 'ملاحظات' : language === 'fr' ? 'Notes' : 'Notes'}
                </label>
                <textarea
                  value={booking.notes}
                  onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  rows={3}
                  placeholder={language === 'ar' ? 'أي ملاحظات إضافية...' : language === 'fr' ? 'Commentaires additionnels...' : 'Additional comments...'}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-3 border rounded-lg hover:bg-gray-50"
                >
                  {language === 'ar' ? 'إلغاء' : language === 'fr' ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  onClick={handleBooking}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  {language === 'ar' ? 'تأكيد الحجز' : language === 'fr' ? 'Confirmer' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
