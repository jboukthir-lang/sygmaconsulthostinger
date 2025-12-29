'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Grid, List, Calendar as CalendarIcon } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

interface Appointment {
  id: string
  title: string
  appointment_date: string
  start_time: string
  end_time: string
  client_name: string
  client_email: string
  client_phone: string
  price: number
  appointment_type_id: string
  service_id?: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
  appointment_types?: {
    id: string
    name_en: string
    name_fr: string
    name_ar: string
    color: string
    duration: number
    price: number
  }
  services?: {
    id: string
    title_en: string
    title_fr: string
    title_ar: string
    color: string
    price: number
    image_url: string
  }
}

interface CalendarViewProps {
  appointments: Appointment[]
  onEditAppointment: (appointment: Appointment) => void
  onRefresh: () => void
}

export default function CalendarView({ appointments, onEditAppointment, onRefresh }: CalendarViewProps) {
  const { language } = useLanguage()
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [currentDate, setCurrentDate] = useState(new Date())

  // Get days in current month
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days = []

    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    const startingDayOfWeek = firstDay.getDay()
    const adjustedStart = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1 // Monday = 0

    // Add previous month's trailing days
    for (let i = adjustedStart; i > 0; i--) {
      const prevDate = new Date(year, month, 1 - i)
      days.push({ date: prevDate, isCurrentMonth: false })
    }

    // Add current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true })
    }

    // Add next month's leading days to complete the grid
    const remainingDays = 42 - days.length // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false })
    }

    return days
  }

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return appointments.filter(apt => apt.appointment_date === dateStr)
  }

  // Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const monthName = currentDate.toLocaleDateString(language === 'ar' ? 'ar' : language === 'fr' ? 'fr' : 'en', {
    month: 'long',
    year: 'numeric'
  })

  const weekDays = language === 'ar'
    ? ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد']
    : language === 'fr'
      ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white">{monthName}</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousMonth}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToToday}
                className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                {language === 'ar' ? 'اليوم' : language === 'fr' ? 'Aujourd\'hui' : 'Today'}
              </button>
              <button
                onClick={goToNextMonth}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'month'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-white/80 hover:text-white'
                }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'week'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-white/80 hover:text-white'
                }`}
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'day'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-white/80 hover:text-white'
                }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      {viewMode === 'month' && (
        <div className="p-6">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center py-2">
                <span className="text-xs font-semibold text-gray-600 uppercase">{day}</span>
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {getDaysInMonth().map((dayObj, index) => {
              const dayAppointments = getAppointmentsForDate(dayObj.date)
              const isToday = dayObj.date.toDateString() === new Date().toDateString()

              return (
                <div
                  key={index}
                  className={`min-h-[120px] border rounded-xl p-2 transition-all hover:shadow-md ${dayObj.isCurrentMonth
                    ? 'bg-white border-gray-200'
                    : 'bg-gray-50 border-gray-100'
                    } ${isToday ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                >
                  {/* Day Number */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-sm font-semibold ${dayObj.isCurrentMonth
                        ? isToday
                          ? 'text-white bg-blue-600 w-6 h-6 rounded-full flex items-center justify-center'
                          : 'text-gray-900'
                        : 'text-gray-400'
                        }`}
                    >
                      {dayObj.date.getDate()}
                    </span>
                    {dayAppointments.length > 0 && (
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">
                        {dayAppointments.length}
                      </span>
                    )}
                  </div>

                  {/* Appointments */}
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 2).map((apt) => (
                      <button
                        key={apt.id}
                        onClick={() => onEditAppointment(apt)}
                        className="w-full text-left px-2 py-1 rounded-md text-xs font-medium transition-all hover:shadow-sm"
                        style={{
                          backgroundColor: `${(apt.services?.color || apt.appointment_types?.color) || '#3B82F6'}20`,
                          color: (apt.services?.color || apt.appointment_types?.color) || '#3B82F6'
                        }}
                      >
                        <div className="truncate">{apt.start_time}</div>
                        <div className="truncate font-semibold">{apt.client_name}</div>
                      </button>
                    ))}
                    {dayAppointments.length > 2 && (
                      <div className="text-xs text-gray-500 text-center py-1">
                        +{dayAppointments.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Week View - Coming Soon */}
      {viewMode === 'week' && (
        <div className="p-12 text-center">
          <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {language === 'ar' ? 'عرض الأسبوع' : language === 'fr' ? 'Vue hebdomadaire' : 'Week View'}
          </h3>
          <p className="text-gray-600">
            {language === 'ar' ? 'قريباً...' : language === 'fr' ? 'Bientôt disponible...' : 'Coming soon...'}
          </p>
        </div>
      )}

      {/* Day View - Coming Soon */}
      {viewMode === 'day' && (
        <div className="p-12 text-center">
          <List className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {language === 'ar' ? 'عرض اليوم' : language === 'fr' ? 'Vue quotidienne' : 'Day View'}
          </h3>
          <p className="text-gray-600">
            {language === 'ar' ? 'قريباً...' : language === 'fr' ? 'Bientôt disponible...' : 'Coming soon...'}
          </p>
        </div>
      )}
    </div>
  )
}
