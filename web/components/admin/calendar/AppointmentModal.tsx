'use client'

import { useState, useEffect } from 'react'
import { X, Save, Loader2, Calendar, Clock, User, Mail, Phone, Video, MapPin, DollarSign, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/context/LanguageContext'

interface AppointmentType {
  id: string
  name_en: string
  name_fr: string
  name_ar: string
  duration: number
  price: number
  color: string
}

interface Appointment {
  id?: string
  title?: string
  appointment_date?: string
  start_time?: string
  end_time?: string
  client_name?: string
  client_email?: string
  client_phone?: string
  status?: string
  appointment_type_id?: string
  notes?: string
  is_online?: boolean
  price?: number
}

interface AppointmentModalProps {
  appointment: Appointment | null
  onClose: () => void
}

export default function AppointmentModal({ appointment, onClose }: AppointmentModalProps) {
  const { language } = useLanguage()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([])

  const [formData, setFormData] = useState({
    client_name: appointment?.client_name || '',
    client_email: appointment?.client_email || '',
    client_phone: appointment?.client_phone || '',
    appointment_type_id: appointment?.appointment_type_id || '',
    appointment_date: appointment?.appointment_date || '',
    start_time: appointment?.start_time || '',
    end_time: appointment?.end_time || '',
    is_online: appointment?.is_online ?? true,
    notes: appointment?.notes || '',
    status: appointment?.status || 'confirmed',
    add_to_google_calendar: true
  })

  useEffect(() => {
    fetchAppointmentTypes()
  }, [])

  async function fetchAppointmentTypes() {
    try {
      const { data, error } = await supabase
        .from('appointment_types')
        .select('*')
        .eq('is_active', true)
        .order('name_en')

      if (error) throw error
      setAppointmentTypes(data || [])

      if (data && data.length > 0 && !formData.appointment_type_id) {
        setFormData(prev => ({ ...prev, appointment_type_id: data[0].id }))
      }
    } catch (error) {
      console.error('Error fetching appointment types:', error)
    }
  }

  async function handleSubmit() {
    setLoading(true)
    try {
      const selectedType = appointmentTypes.find(t => t.id === formData.appointment_type_id)

      const appointmentData = {
        client_name: formData.client_name,
        client_email: formData.client_email,
        client_phone: formData.client_phone,
        appointment_type_id: formData.appointment_type_id,
        appointment_date: formData.appointment_date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        is_online: formData.is_online,
        notes: formData.notes,
        status: formData.status,
        title: selectedType?.[`name_${language}` as keyof AppointmentType] || 'Appointment',
        price: selectedType?.price || 0,
        duration: selectedType?.duration || 60
      }

      let result
      if (appointment?.id) {
        // Update existing
        const { error } = await supabase
          .from('appointments')
          .update(appointmentData)
          .eq('id', appointment.id)

        if (error) throw error
      } else {
        // Create new
        const { data, error } = await supabase
          .from('appointments')
          .insert([appointmentData])
          .select()
          .single()

        if (error) throw error
        result = data

        // Add to Google Calendar if checkbox is checked
        if (formData.add_to_google_calendar && result) {
          await createGoogleCalendarEvent(result, selectedType)
        }
      }

      onClose()
    } catch (error) {
      console.error('Error saving appointment:', error)
      alert('Error saving appointment')
    } finally {
      setLoading(false)
    }
  }

  async function createGoogleCalendarEvent(appointmentData: any, serviceType: AppointmentType | undefined) {
    try {
      const response = await fetch('/api/bookings/create-with-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId: appointmentData.id,
          title: serviceType?.[`name_${language}` as keyof AppointmentType] || 'Appointment',
          description: formData.notes || `Appointment with ${formData.client_name}`,
          startTime: `${formData.appointment_date}T${formData.start_time}:00`,
          endTime: `${formData.appointment_date}T${formData.end_time}:00`,
          attendees: [formData.client_email],
          location: formData.is_online ? 'Online (Google Meet)' : 'Office'
        })
      })

      if (!response.ok) {
        console.error('Failed to create Google Calendar event')
      }
    } catch (error) {
      console.error('Error creating Google Calendar event:', error)
    }
  }

  const selectedType = appointmentTypes.find(t => t.id === formData.appointment_type_id)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {appointment?.id
                  ? (language === 'ar' ? 'تعديل الموعد' : language === 'fr' ? 'Modifier le RDV' : 'Edit Appointment')
                  : (language === 'ar' ? 'موعد جديد' : language === 'fr' ? 'Nouveau RDV' : 'New Appointment')}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`h-1 w-12 rounded-full transition-all ${
                      s <= step ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Step 1: Client Info */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
              <div className="flex items-center gap-2 text-blue-600 mb-4">
                <User className="w-5 h-5" />
                <h3 className="text-lg font-semibold">
                  {language === 'ar' ? 'معلومات العميل' : language === 'fr' ? 'Informations client' : 'Client Information'}
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'الاسم' : language === 'fr' ? 'Nom' : 'Name'} *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder={language === 'ar' ? 'اسم العميل' : language === 'fr' ? 'Nom du client' : 'Client name'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'البريد الإلكتروني' : language === 'fr' ? 'Email' : 'Email'} *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.client_email}
                    onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="client@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'رقم الهاتف' : language === 'fr' ? 'Téléphone' : 'Phone'}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.client_phone}
                    onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="+33 X XX XX XX XX"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Service Selection */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
              <div className="flex items-center gap-2 text-blue-600 mb-4">
                <Calendar className="w-5 h-5" />
                <h3 className="text-lg font-semibold">
                  {language === 'ar' ? 'اختر الخدمة' : language === 'fr' ? 'Choisir le service' : 'Select Service'}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appointmentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setFormData({ ...formData, appointment_type_id: type.id })}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.appointment_type_id === type.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: type.color }}
                      />
                      {formData.appointment_type_id === type.id && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {type[`name_${language}` as keyof AppointmentType]}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {type.duration} min
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {type.price}€
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {language === 'ar' ? 'نوع الاجتماع' : language === 'fr' ? 'Type de réunion' : 'Meeting Type'}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setFormData({ ...formData, is_online: true })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.is_online
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Video className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-sm font-medium text-gray-900">
                      {language === 'ar' ? 'عبر الإنترنت' : language === 'fr' ? 'En ligne' : 'Online'}
                    </div>
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, is_online: false })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      !formData.is_online
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <MapPin className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-sm font-medium text-gray-900">
                      {language === 'ar' ? 'في المكتب' : language === 'fr' ? 'Au bureau' : 'In-person'}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Date & Time */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
              <div className="flex items-center gap-2 text-blue-600 mb-4">
                <Clock className="w-5 h-5" />
                <h3 className="text-lg font-semibold">
                  {language === 'ar' ? 'التاريخ والوقت' : language === 'fr' ? 'Date et heure' : 'Date & Time'}
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'التاريخ' : language === 'fr' ? 'Date' : 'Date'} *
                </label>
                <input
                  type="date"
                  required
                  value={formData.appointment_date}
                  onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'وقت البداية' : language === 'fr' ? 'Heure de début' : 'Start Time'} *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'ar' ? 'وقت النهاية' : language === 'fr' ? 'Heure de fin' : 'End Time'} *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'ar' ? 'ملاحظات' : language === 'fr' ? 'Notes' : 'Notes'}
                </label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder={language === 'ar' ? 'أي ملاحظات إضافية...' : language === 'fr' ? 'Notes supplémentaires...' : 'Any additional notes...'}
                />
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
              <div className="flex items-center gap-2 text-blue-600 mb-4">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="text-lg font-semibold">
                  {language === 'ar' ? 'تأكيد الموعد' : language === 'fr' ? 'Confirmer le RDV' : 'Confirm Appointment'}
                </h3>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-200">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="text-sm text-blue-600 font-medium mb-1">
                        {language === 'ar' ? 'العميل' : language === 'fr' ? 'Client' : 'Client'}
                      </div>
                      <div className="font-semibold text-gray-900">{formData.client_name}</div>
                      <div className="text-sm text-gray-600">{formData.client_email}</div>
                      {formData.client_phone && (
                        <div className="text-sm text-gray-600">{formData.client_phone}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="text-sm text-blue-600 font-medium mb-1">
                        {language === 'ar' ? 'الخدمة' : language === 'fr' ? 'Service' : 'Service'}
                      </div>
                      <div className="font-semibold text-gray-900">
                        {selectedType?.[`name_${language}` as keyof AppointmentType]}
                      </div>
                      <div className="text-sm text-gray-600">
                        {selectedType?.duration} min • {selectedType?.price}€
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="text-sm text-blue-600 font-medium mb-1">
                        {language === 'ar' ? 'التاريخ والوقت' : language === 'fr' ? 'Date et heure' : 'Date & Time'}
                      </div>
                      <div className="font-semibold text-gray-900">
                        {new Date(formData.appointment_date).toLocaleDateString(language === 'ar' ? 'ar' : language === 'fr' ? 'fr' : 'en', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formData.start_time} - {formData.end_time}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    {formData.is_online ? (
                      <Video className="w-5 h-5 text-blue-600 mt-0.5" />
                    ) : (
                      <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                    )}
                    <div>
                      <div className="text-sm text-blue-600 font-medium mb-1">
                        {language === 'ar' ? 'الموقع' : language === 'fr' ? 'Lieu' : 'Location'}
                      </div>
                      <div className="font-semibold text-gray-900">
                        {formData.is_online
                          ? (language === 'ar' ? 'عبر الإنترنت' : language === 'fr' ? 'En ligne (Google Meet)' : 'Online (Google Meet)')
                          : (language === 'ar' ? 'في المكتب' : language === 'fr' ? 'Au bureau' : 'In-person')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {!appointment?.id && (
                <label className="flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={formData.add_to_google_calendar}
                    onChange={(e) => setFormData({ ...formData, add_to_google_calendar: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      {language === 'ar' ? 'إضافة إلى Google Calendar' : language === 'fr' ? 'Ajouter à Google Calendar' : 'Add to Google Calendar'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === 'ar' ? 'سيتم إنشاء حدث تلقائياً مع رابط Google Meet' : language === 'fr' ? 'Créer automatiquement un événement avec lien Google Meet' : 'Automatically create event with Google Meet link'}
                    </div>
                  </div>
                </label>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <button
              onClick={() => step > 1 ? setStep(step - 1) : onClose()}
              className="px-6 py-2.5 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-all"
              disabled={loading}
            >
              {step > 1
                ? (language === 'ar' ? 'السابق' : language === 'fr' ? 'Précédent' : 'Previous')
                : (language === 'ar' ? 'إلغاء' : language === 'fr' ? 'Annuler' : 'Cancel')}
            </button>

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && (!formData.client_name || !formData.client_email)) ||
                  (step === 3 && (!formData.appointment_date || !formData.start_time || !formData.end_time))
                }
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {language === 'ar' ? 'التالي' : language === 'fr' ? 'Suivant' : 'Next'} →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-medium hover:from-green-700 hover:to-green-800 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {language === 'ar' ? 'جاري الحفظ...' : language === 'fr' ? 'Enregistrement...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {language === 'ar' ? 'حفظ الموعد' : language === 'fr' ? 'Enregistrer' : 'Save Appointment'}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
