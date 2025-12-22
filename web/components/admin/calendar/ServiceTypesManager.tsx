'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X, Clock, DollarSign, Palette, CheckCircle2, XCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/context/LanguageContext'

interface ServiceType {
  id: string
  name_en: string
  name_fr: string
  name_ar: string
  description_en?: string
  description_fr?: string
  description_ar?: string
  duration: number
  price: number
  color: string
  is_active: boolean
  created_at?: string
}

const PRESET_COLORS = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#EF4444', '#F59E0B',
  '#10B981', '#06B6D4', '#6366F1', '#14B8A6', '#F97316'
]

export default function ServiceTypesManager() {
  const { language } = useLanguage()
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const [formData, setFormData] = useState<Partial<ServiceType>>({
    name_en: '',
    name_fr: '',
    name_ar: '',
    description_en: '',
    description_fr: '',
    description_ar: '',
    duration: 60,
    price: 0,
    color: PRESET_COLORS[0],
    is_active: true
  })

  useEffect(() => {
    fetchServiceTypes()
  }, [])

  async function fetchServiceTypes() {
    try {
      const { data, error } = await supabase
        .from('appointment_types')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setServiceTypes(data || [])
    } catch (error) {
      console.error('Error fetching service types:', error)
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(service: ServiceType) {
    setEditingId(service.id)
    setFormData(service)
    setShowNewForm(false)
  }

  function handleCancelEdit() {
    setEditingId(null)
    setShowNewForm(false)
    resetForm()
  }

  function resetForm() {
    setFormData({
      name_en: '',
      name_fr: '',
      name_ar: '',
      description_en: '',
      description_fr: '',
      description_ar: '',
      duration: 60,
      price: 0,
      color: PRESET_COLORS[0],
      is_active: true
    })
  }

  async function handleSave() {
    try {
      if (editingId) {
        // Update existing
        const { error } = await supabase
          .from('appointment_types')
          .update(formData)
          .eq('id', editingId)

        if (error) throw error
      } else {
        // Create new
        const { error } = await supabase
          .from('appointment_types')
          .insert([formData])

        if (error) throw error
      }

      await fetchServiceTypes()
      handleCancelEdit()
    } catch (error) {
      console.error('Error saving service type:', error)
      alert('Error saving service type')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(
      language === 'ar'
        ? 'هل أنت متأكد من حذف هذا النوع؟'
        : language === 'fr'
        ? 'Êtes-vous sûr de supprimer ce type?'
        : 'Are you sure you want to delete this service type?'
    )) return

    try {
      const { error } = await supabase
        .from('appointment_types')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchServiceTypes()
    } catch (error) {
      console.error('Error deleting service type:', error)
      alert('Error deleting service type')
    }
  }

  async function toggleActive(id: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('appointment_types')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error
      await fetchServiceTypes()
    } catch (error) {
      console.error('Error toggling active status:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {language === 'ar' ? 'أنواع الخدمات' : language === 'fr' ? 'Types de Services' : 'Service Types'}
          </h2>
          <p className="text-gray-600 mt-1">
            {language === 'ar'
              ? 'إدارة أنواع المواعيد والخدمات المتاحة'
              : language === 'fr'
              ? 'Gérer les types de rendez-vous et services disponibles'
              : 'Manage appointment types and available services'}
          </p>
        </div>
        <button
          onClick={() => {
            setShowNewForm(true)
            setEditingId(null)
            resetForm()
          }}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          {language === 'ar' ? 'نوع جديد' : language === 'fr' ? 'Nouveau Type' : 'New Type'}
        </button>
      </div>

      {/* New/Edit Form */}
      {(showNewForm || editingId) && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {editingId
                ? (language === 'ar' ? 'تعديل النوع' : language === 'fr' ? 'Modifier le Type' : 'Edit Type')
                : (language === 'ar' ? 'نوع جديد' : language === 'fr' ? 'Nouveau Type' : 'New Type')}
            </h3>
            <button onClick={handleCancelEdit} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Name EN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الاسم (إنجليزي)' : language === 'fr' ? 'Nom (Anglais)' : 'Name (English)'}
              </label>
              <input
                type="text"
                value={formData.name_en || ''}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Consultation"
              />
            </div>

            {/* Name FR */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الاسم (فرنسي)' : language === 'fr' ? 'Nom (Français)' : 'Name (French)'}
              </label>
              <input
                type="text"
                value={formData.name_fr || ''}
                onChange={(e) => setFormData({ ...formData, name_fr: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Consultation"
              />
            </div>

            {/* Name AR */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الاسم (عربي)' : language === 'fr' ? 'Nom (Arabe)' : 'Name (Arabic)'}
              </label>
              <input
                type="text"
                value={formData.name_ar || ''}
                onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="استشارة"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                {language === 'ar' ? 'المدة (دقائق)' : language === 'fr' ? 'Durée (minutes)' : 'Duration (minutes)'}
              </label>
              <input
                type="number"
                value={formData.duration || 60}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="15"
                step="15"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 inline mr-1" />
                {language === 'ar' ? 'السعر' : language === 'fr' ? 'Prix' : 'Price'}
              </label>
              <input
                type="number"
                value={formData.price || 0}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Palette className="w-4 h-4 inline mr-1" />
                {language === 'ar' ? 'اللون' : language === 'fr' ? 'Couleur' : 'Color'}
              </label>
              <div className="flex gap-2 flex-wrap">
                {PRESET_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      formData.color === color ? 'border-gray-900 scale-110' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الوصف (إنجليزي)' : language === 'fr' ? 'Description (Anglais)' : 'Description (English)'}
              </label>
              <textarea
                value={formData.description_en || ''}
                onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الوصف (فرنسي)' : language === 'fr' ? 'Description (Français)' : 'Description (French)'}
              </label>
              <textarea
                value={formData.description_fr || ''}
                onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الوصف (عربي)' : language === 'fr' ? 'Description (Arabe)' : 'Description (Arabic)'}
              </label>
              <textarea
                value={formData.description_ar || ''}
                onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-medium"
            >
              <Save className="w-4 h-4" />
              {language === 'ar' ? 'حفظ' : language === 'fr' ? 'Enregistrer' : 'Save'}
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              {language === 'ar' ? 'إلغاء' : language === 'fr' ? 'Annuler' : 'Cancel'}
            </button>
          </div>
        </div>
      )}

      {/* Service Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {serviceTypes.map(service => (
          <div
            key={service.id}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
          >
            {/* Color Header */}
            <div className="h-3" style={{ backgroundColor: service.color }} />

            <div className="p-6">
              {/* Header with Status */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {language === 'ar' ? service.name_ar : language === 'fr' ? service.name_fr : service.name_en}
                  </h3>
                  {service[`description_${language}` as keyof ServiceType] && (
                    <p className="text-sm text-gray-600">
                      {service[`description_${language}` as keyof ServiceType] as string}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => toggleActive(service.id, service.is_active)}
                  className={`ml-2 p-1 rounded-lg transition-colors ${
                    service.is_active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {service.is_active ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                </button>
              </div>

              {/* Details */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{service.duration} {language === 'ar' ? 'دقيقة' : language === 'fr' ? 'min' : 'min'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm font-medium">${service.price}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  {language === 'ar' ? 'تعديل' : language === 'fr' ? 'Modifier' : 'Edit'}
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {serviceTypes.length === 0 && !showNewForm && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {language === 'ar' ? 'لا توجد أنواع خدمات' : language === 'fr' ? 'Aucun type de service' : 'No service types'}
          </h3>
          <p className="text-gray-600 mb-4">
            {language === 'ar'
              ? 'ابدأ بإنشاء نوع خدمة جديد'
              : language === 'fr'
              ? 'Commencez par créer un nouveau type de service'
              : 'Get started by creating a new service type'}
          </p>
        </div>
      )}
    </div>
  )
}
