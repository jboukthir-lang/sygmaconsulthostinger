'use client';

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle2, ChevronLeft, ChevronRight, Loader2, Video, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

// Default time slots
const DEFAULT_TIME_SLOTS = [
    "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"
];

interface AppointmentType {
    id: string;
    name_fr: string;
    name_ar: string;
    name_en: string;
    description_fr?: string;
    description_ar?: string;
    description_en?: string;
    duration: number;
    price: number;
    color?: string;
    is_online_available: boolean;
    is_onsite_available: boolean;
    is_active: boolean;
}

export default function BookingCalendar() {
    const { t, language } = useLanguage();
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [step, setStep] = useState(1);
    const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([]);
    const [timeSlots, setTimeSlots] = useState<string[]>(DEFAULT_TIME_SLOTS);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    const [formData, setFormData] = useState({
        name: user?.displayName || '',
        email: user?.email || '',
        appointmentTypeId: '',
        is_online: true,
        notes: ''
    });

    // Load appointment types and time slots from database
    useEffect(() => {
        loadAppointmentTypes();
        loadTimeSlots();
    }, []);

    // Update form data when user changes
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.displayName || prev.name,
                email: user.email || prev.email
            }));
        }
    }, [user]);

    async function loadAppointmentTypes() {
        try {
            // Try appointment_types first (unified table)
            let { data, error } = await supabase
                .from('appointment_types')
                .select('*')
                .eq('is_active', true)
                .order('name_fr');

            // Fallback to consultation_types if appointment_types doesn't exist
            if (error && error.code === '42P01') {
                const result = await supabase
                    .from('consultation_types')
                    .select('*')
                    .eq('is_active', true)
                    .order('name_fr');
                data = result.data;
                error = result.error;
            }

            if (error) throw error;
            if (data && data.length > 0) {
                setAppointmentTypes(data);
                setFormData(prev => ({ ...prev, appointmentTypeId: data[0].id }));
            }
        } catch (error) {
            console.error('Error loading appointment types:', error);
        } finally {
            setLoadingData(false);
        }
    }

    async function loadTimeSlots() {
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('value_json')
                .eq('key', 'available_time_slots')
                .single();

            if (!error && data?.value_json) {
                setTimeSlots(data.value_json as string[]);
            }
        } catch (error) {
            console.error('Error loading time slots:', error);
        }
    }

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setSelectedTime(null);
    };

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate || !selectedTime) return;

        setIsLoading(true);

        try {
            // Format date to YYYY-MM-DD
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;

            // Get selected appointment type details
            const selectedAppointment = appointmentTypes.find((apt: AppointmentType) => apt.id === formData.appointmentTypeId);
            const appointmentPrice = selectedAppointment?.price || 0;

            const response = await fetch('/api/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    topic: language === 'fr'
                        ? selectedAppointment?.name_fr
                        : language === 'ar'
                            ? selectedAppointment?.name_ar
                            : selectedAppointment?.name_en,
                    date: formattedDate,
                    time: selectedTime,
                    user_id: user?.uid || null,
                    duration: selectedAppointment?.duration || 30,
                    appointment_type: 'consultation',
                    appointment_type_id: formData.appointmentTypeId,
                    specialization: language === 'fr'
                        ? selectedAppointment?.name_fr
                        : language === 'ar'
                            ? selectedAppointment?.name_ar
                            : selectedAppointment?.name_en,
                    is_online: formData.is_online,
                    notes: formData.notes,
                    price: appointmentPrice,
                    payment_status: appointmentPrice > 0 ? 'pending' : 'free'
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || errorData.error || 'Booking failed');
            }

            const result = await response.json();
            console.log('Booking created:', result);

            // If appointment has a price, redirect to Stripe checkout
            if (appointmentPrice > 0 && result.booking?.id) {
                const checkoutResponse = await fetch('/api/stripe/create-checkout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        bookingId: result.booking.id
                    }),
                });

                if (!checkoutResponse.ok) {
                    throw new Error('Failed to create checkout session');
                }

                const checkoutData = await checkoutResponse.json();

                // Redirect to Stripe Checkout
                if (checkoutData.url) {
                    window.location.href = checkoutData.url;
                } else {
                    throw new Error('No checkout URL received');
                }
            } else {
                // Free consultation - show success
                setStep(3);
            }
        } catch (error) {
            console.error('Error booking:', error);
            alert(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Generate calendar days for current month
    const getDaysInMonth = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];

        // Add previous month's trailing days
        const startingDayOfWeek = firstDay.getDay();
        const adjustedStart = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1; // Monday = 0

        for (let i = adjustedStart; i > 0; i--) {
            const prevDate = new Date(year, month, 1 - i);
            days.push({ date: prevDate, isCurrentMonth: false });
        }

        // Add current month days
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push({ date: new Date(year, month, i), isCurrentMonth: true });
        }

        return days;
    };

    const monthName = currentMonth.toLocaleDateString(language, { month: 'long', year: 'numeric' });

    if (loadingData) {
        return (
            <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-12 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-[#001F3F] animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-xl md:rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">

            {/* Sidebar Info */}
            <div className="bg-[#001F3F] p-4 sm:p-6 md:p-8 text-white md:w-1/3 flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-serif font-bold mb-2">{t.booking.sidebar.title}</h3>
                    <p className="text-blue-200 text-sm mb-6">{t.booking.sidebar.subtitle}</p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm">
                            <CalendarIcon className="h-4 w-4 text-[#D4AF37]" />
                            <span>{selectedDate ? selectedDate.toLocaleDateString(language) : t.booking.sidebar.date_placeholder}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Clock className="h-4 w-4 text-[#D4AF37]" />
                            <span>{selectedTime || t.booking.sidebar.time_placeholder}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            {formData.is_online ? (
                                <><Video className="h-4 w-4 text-[#D4AF37]" /><span>{t.booking.sidebar.online}</span></>
                            ) : (
                                <><MapPin className="h-4 w-4 text-[#D4AF37]" /><span>{t.booking.sidebar.onsite}</span></>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mt-8 md:mt-0 text-xs text-blue-300">
                    {t.booking.sidebar.timezone}
                </div>
            </div>

            {/* Main Content */}
            <div className="p-4 sm:p-6 md:p-8 md:w-2/3">

                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-2xl font-bold text-[#001F3F] mb-6">{t.booking.step1.title}</h2>

                        {/* Calendar Grid */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-semibold text-lg text-gray-700">{monthName}</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                                        className="p-1 hover:bg-gray-100 rounded"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                                        className="p-1 hover:bg-gray-100 rounded"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-7 gap-1 text-center">
                                {t.booking.step1.days.map(day => (
                                    <div key={day} className="text-xs font-medium text-gray-400 uppercase py-2">{day}</div>
                                ))}
                                {getDaysInMonth().map((dayObj, i) => {
                                    const isSelected = selectedDate?.toDateString() === dayObj.date.toDateString();
                                    const isDisabled = !dayObj.isCurrentMonth || dayObj.date < new Date();

                                    return (
                                        <button
                                            key={i}
                                            disabled={isDisabled}
                                            onClick={() => handleDateSelect(dayObj.date)}
                                            className={`py-2 rounded-lg text-sm font-medium transition-all ${isSelected
                                                ? 'bg-[#001F3F] text-white shadow-lg scale-105'
                                                : isDisabled
                                                    ? 'text-gray-300 cursor-not-allowed'
                                                    : 'bg-gray-50 text-gray-700 hover:bg-[#D4AF37]/10 hover:text-[#001F3F]'
                                                }`}
                                        >
                                            {dayObj.date.getDate()}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Time Slots */}
                        {selectedDate && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                                {timeSlots.map(time => (
                                    <button
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        className={`py-2 px-3 sm:px-4 rounded-full text-sm border transition-all ${selectedTime === time
                                            ? 'border-[#D4AF37] bg-[#D4AF37] text-white'
                                            : 'border-gray-200 hover:border-[#001F3F] hover:text-[#001F3F]'
                                            }`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="mt-8 flex justify-end">
                            <button
                                disabled={!selectedDate || !selectedTime}
                                onClick={() => setStep(2)}
                                className="px-6 py-2 bg-[#001F3F] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#003366] transition-colors"
                            >
                                {t.booking.step1.next}
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <form onSubmit={handleBooking} className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                        <h2 className="text-2xl font-bold text-[#001F3F] mb-6">{t.booking.step2.title}</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.booking.step2.name}</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.booking.step2.email}</label>
                            <input
                                required
                                type="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.booking.step2.topic}</label>
                            <select
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none"
                                value={formData.appointmentTypeId}
                                onChange={e => setFormData({ ...formData, appointmentTypeId: e.target.value })}
                            >
                                {appointmentTypes.map((type: AppointmentType) => (
                                    <option key={type.id} value={type.id}>
                                        {language === 'fr' ? type.name_fr : language === 'ar' ? type.name_ar : type.name_en}
                                        {` - ${type.duration} min - ${type.price}€`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{t.booking.step2.meeting_type}</label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, is_online: true })}
                                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${formData.is_online
                                        ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <Video className="h-5 w-5 mx-auto mb-1" />
                                    <span className="text-sm font-medium">{t.booking.step2.online}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, is_online: false })}
                                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${!formData.is_online
                                        ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <MapPin className="h-5 w-5 mx-auto mb-1" />
                                    <span className="text-sm font-medium">{t.booking.step2.onsite}</span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t.booking.step2.notes}</label>
                            <textarea
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none"
                                value={formData.notes}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                placeholder={t.booking.step2.notes_placeholder}
                            />
                        </div>

                        {/* Price Display */}
                        {appointmentTypes.find((apt: AppointmentType) => apt.id === formData.appointmentTypeId)?.price && appointmentTypes.find((apt: AppointmentType) => apt.id === formData.appointmentTypeId)!.price > 0 && (
                            <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#001F3F]/10 p-4 rounded-xl border-2 border-[#D4AF37]/30">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">
                                            {language === 'ar' ? 'السعر الإجمالي' : language === 'fr' ? 'Prix Total' : 'Total Price'}
                                        </p>
                                        <p className="text-3xl font-bold text-[#001F3F]">
                                            {appointmentTypes.find((apt: AppointmentType) => apt.id === formData.appointmentTypeId)?.price}€
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">
                                            {language === 'ar' ? 'دفع آمن عبر' : language === 'fr' ? 'Paiement sécurisé via' : 'Secure payment via'}
                                        </p>
                                        <p className="text-sm font-bold text-[#635BFF]">Stripe</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between pt-4">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-gray-500 hover:text-[#001F3F]"
                            >
                                {t.booking.step2.back}
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C5A028] shadow-md transition-all disabled:opacity-70 disabled:cursor-wait flex items-center gap-2"
                            >
                                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                {isLoading
                                    ? t.booking.step2.processing
                                    : appointmentTypes.find((apt: AppointmentType) => apt.id === formData.appointmentTypeId)?.price && appointmentTypes.find((apt: AppointmentType) => apt.id === formData.appointmentTypeId)!.price > 0
                                        ? (language === 'ar' ? 'المتابعة للدفع' : language === 'fr' ? 'Continuer au paiement' : 'Continue to Payment')
                                        : t.booking.step2.confirm
                                }
                            </button>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <div className="flex flex-col items-center justify-center text-center h-full animate-in fade-in zoom-in duration-500 min-h-[400px]">
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-[#001F3F] mb-2">{t.booking.step3.title}</h3>
                        <p className="text-gray-600 mb-6">
                            {t.booking.step3.desc} <strong>{formData.email}</strong>.
                        </p>
                        <div className="p-4 bg-gray-50 rounded-lg text-sm text-left w-full mb-6">
                            <p><strong>{t.booking.step3.date_label}:</strong> {selectedDate?.toLocaleDateString(language)}</p>
                            <p><strong>{t.booking.step3.time_label}:</strong> {selectedTime} (CET)</p>
                            <p><strong>{t.booking.step3.topic_label}:</strong> {
                                appointmentTypes.find((apt: AppointmentType) => apt.id === formData.appointmentTypeId)?.[`name_${language}` as keyof AppointmentType]
                            }</p>
                            <p><strong>{t.booking.step3.type_label}:</strong> {formData.is_online ? t.booking.sidebar.online : t.booking.sidebar.onsite}</p>
                        </div>
                        <button
                            onClick={() => { setStep(1); setSelectedDate(null); setSelectedTime(null); }}
                            className="text-[#001F3F] font-medium hover:underline"
                        >
                            {t.booking.step3.book_another}
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
