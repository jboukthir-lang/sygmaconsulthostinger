'use client';

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle2, ChevronLeft, ChevronRight, Loader2, Video, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

interface Service {
    id: string;
    title_fr: string;
    title_ar: string;
    title_en: string;
    description_fr?: string;
    description_ar?: string;
    description_en?: string;
    duration_minutes: number;
    price: number;
    color?: string;
    image_url?: string;
    is_active: boolean;
    is_bookable: boolean;
}

interface CalendarSettings {
    id: string;
    slot_duration: number;
    max_advance_booking_days: number;
    min_advance_booking_hours: number;
    lunch_break_enabled: boolean;
    lunch_break_start: string | null;
    lunch_break_end: string | null;
    monday_enabled: boolean;
    tuesday_enabled: boolean;
    wednesday_enabled: boolean;
    thursday_enabled: boolean;
    friday_enabled: boolean;
    saturday_enabled: boolean;
    sunday_enabled: boolean;
    monday_start: string;
    monday_end: string;
    tuesday_start: string;
    tuesday_end: string;
    wednesday_start: string;
    wednesday_end: string;
    thursday_start: string;
    thursday_end: string;
    friday_start: string;
    friday_end: string;
    saturday_start: string;
    saturday_end: string;
    sunday_start: string;
    sunday_end: string;
}

interface BlockedDate {
    id: string;
    date: string;
    reason?: string;
}

export default function BookingCalendar() {
    const { t, language } = useLanguage();
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [step, setStep] = useState(0);
    const [services, setServices] = useState<Service[]>([]);
    const [timeSlots, setTimeSlots] = useState<string[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [calendarSettings, setCalendarSettings] = useState<CalendarSettings | null>(null);
    const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        name: user?.displayName || '',
        email: user?.email || '',
        serviceId: '',
        is_online: true,
        notes: ''
    });

    // Load services and calendar settings from database
    useEffect(() => {
        loadServices();
        loadCalendarSettings();
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

    // Generate time slots when date is selected and settings are loaded
    useEffect(() => {
        if (selectedDate && calendarSettings) {
            generateTimeSlots(selectedDate);
            loadBookedSlots(selectedDate);
        }
    }, [selectedDate, calendarSettings]);

    async function loadServices() {
        try {
            const response = await fetch('/api/services');
            if (!response.ok) throw new Error('Failed to fetch services');
            const data = await response.json();

            if (data && data.length > 0) {
                // Filter for bookable services only
                const bookableServices = data.filter((s: any) => s.is_bookable);
                setServices(bookableServices);
                // Don't auto-select service - let user choose in Step 0
                // if (bookableServices.length > 0) {
                //     setFormData(prev => ({ ...prev, serviceId: bookableServices[0].id }));
                // }
            }
        } catch (error) {
            console.error('Error loading services:', error);
            // Fallback to empty or handled by UI
        } finally {
            setLoadingData(false);
        }
    }

    async function loadCalendarSettings() {
        try {
            console.log('🔍 Loading calendar settings...');
            const response = await fetch('/api/calendar-settings');
            if (!response.ok) throw new Error('Failed to fetch settings');
            const data = await response.json();

            if (data.settings) {
                console.log('✅ Calendar settings loaded:', data.settings);
                setCalendarSettings(data.settings);
            }
            if (data.blockedDates) {
                setBlockedDates(data.blockedDates);
            }
        } catch (error) {
            console.error('❌ Error loading calendar settings:', error);
        }
    }

    // loadBlockedDates removed as it is combined with calendar-settings API

    // Helper to get local date string YYYY-MM-DD
    function getLocalDateString(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    async function loadBookedSlots(date: Date) {
        try {
            // Fix: Use local date string instead of ISO (which converts to UTC and might shift day)
            const dateStr = getLocalDateString(date);
            const { data, error } = await supabase
                .from('bookings')
                .select('time')
                .eq('date', dateStr)
                .neq('status', 'cancelled');

            if (error) throw error;
            if (data) {
                const slots = data.map(b => b.time);
                console.log(`✅ Found ${slots.length} booked slots for ${dateStr}`);
                setBookedSlots(slots);
            }
        } catch (error) {
            console.error('❌ Error loading booked slots:', error);
        }
    }

    function generateTimeSlots(date: Date) {
        setTimeSlots([]);
        if (!calendarSettings) {
            console.log('⚠️ Calendar settings not ready');
            return;
        }

        // Get day name
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = dayNames[date.getDay()];

        // Get start and end times for this specific day
        const startTimeKey = `${dayName}_start` as keyof CalendarSettings;
        const endTimeKey = `${dayName}_end` as keyof CalendarSettings;

        const workingStart = calendarSettings[startTimeKey] as string;
        const workingEnd = calendarSettings[endTimeKey] as string;

        if (!workingStart || !workingEnd) {
            console.log('⚠️ No working hours for', dayName);
            return;
        }

        const slots: string[] = [];
        const [startH, startM] = workingStart.split(':').map(Number);
        const [endH, endM] = workingEnd.split(':').map(Number);
        const duration = calendarSettings.slot_duration || 30;

        let currentH = startH;
        let currentM = startM;

        while (currentH < endH || (currentH === endH && currentM < endM)) {
            const timeString = `${String(currentH).padStart(2, '0')}:${String(currentM).padStart(2, '0')}`;

            // Check if time is in lunch break period
            let isBreakTime = false;
            if (calendarSettings.lunch_break_enabled && calendarSettings.lunch_break_start && calendarSettings.lunch_break_end) {
                const [breakStartH, breakStartM] = calendarSettings.lunch_break_start.split(':').map(Number);
                const [breakEndH, breakEndM] = calendarSettings.lunch_break_end.split(':').map(Number);

                const currentMinutes = currentH * 60 + currentM;
                const breakStartMinutes = breakStartH * 60 + breakStartM;
                const breakEndMinutes = breakEndH * 60 + breakEndM;

                if (currentMinutes >= breakStartMinutes && currentMinutes < breakEndMinutes) {
                    isBreakTime = true;
                }
            }

            if (!isBreakTime) {
                slots.push(timeString);
            }

            currentM += duration;
            if (currentM >= 60) {
                currentH += Math.floor(currentM / 60);
                currentM = currentM % 60;
            }
        }

        console.log(`✅ Generated ${slots.length} time slots for ${dayName}`);
        setTimeSlots(slots);
    }

    function isDateBlocked(date: Date): boolean {
        // Fix: Use local date string instead of ISO
        const dateStr = getLocalDateString(date);
        return blockedDates.some(bd => bd.date === dateStr);
    }

    function isWorkingDay(date: Date): boolean {
        if (!calendarSettings) return true;
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = dayNames[date.getDay()];
        const enabledKey = `${dayName}_enabled` as keyof CalendarSettings;
        return calendarSettings[enabledKey] as boolean;
    }

    function isDateAvailable(date: Date): boolean {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if date is in the past
        if (date < today) return false;

        // Check if it's a working day
        if (!isWorkingDay(date)) return false;

        // Check if date is blocked
        if (isDateBlocked(date)) return false;

        // Check max advance booking
        if (calendarSettings) {
            const maxDate = new Date();
            maxDate.setDate(maxDate.getDate() + calendarSettings.max_advance_booking_days);
            if (date > maxDate) return false;
        }

        return true;
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

            // Get selected service details
            const selectedService = services.find(s => s.id === formData.serviceId);
            const servicePrice = selectedService?.price || 0;

            const response = await fetch('/api/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    topic: language === 'fr'
                        ? selectedService?.title_fr
                        : language === 'ar'
                            ? selectedService?.title_ar
                            : selectedService?.title_en,
                    date: formattedDate,
                    time: selectedTime,
                    user_id: user?.uid || null,
                    duration: selectedService?.duration_minutes || 60,
                    service_id: formData.serviceId,
                    specialization: language === 'fr'
                        ? selectedService?.title_fr
                        : language === 'ar'
                            ? selectedService?.title_ar
                            : selectedService?.title_en,
                    is_online: formData.is_online,
                    notes: formData.notes,
                    price: servicePrice,
                    payment_status: servicePrice > 0 ? 'pending' : 'free'
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || errorData.error || 'Booking failed');
            }

            const result = await response.json();
            console.log('Booking created:', result);

            // If appointment has a price, redirect to Stripe checkout
            if (servicePrice > 0 && result.booking?.id) {
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
            <div className="bg-[#001F3F] p-4 sm:p-6 md:p-8 text-white md:w-1/3 flex flex-col justify-between order-2 md:order-1">
                <div>
                    <h3 className="text-xl font-serif font-bold mb-2 hidden md:block">{t.booking.sidebar.title}</h3>
                    <p className="text-blue-200 text-sm mb-6 hidden md:block">{t.booking.sidebar.subtitle}</p>
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
            <div className="p-4 sm:p-6 md:p-8 md:w-2/3 order-1 md:order-2">


                {/* Step 0: Service Selection */}
                {step === 0 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-2xl font-bold text-[#001F3F] mb-2">
                            {language === 'ar' ? 'اختر الخدمة' : language === 'fr' ? 'Choisissez votre service' : 'Choose Your Service'}
                        </h2>
                        <p className="text-gray-600 mb-6 text-sm">
                            {language === 'ar' ? 'اختر الخدمة التي تحتاجها من القائمة أدناه' : language === 'fr' ? 'Sélectionnez le service dont vous avez besoin dans la liste ci-dessous' : 'Select the service you need from the list below'}
                        </p>

                        {/* Services Grid */}
                        <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto pr-2">
                            {services.map((service) => {
                                const isSelected = selectedService?.id === service.id;
                                return (
                                    <button
                                        key={service.id}
                                        onClick={() => {
                                            setSelectedService(service);
                                            setFormData(prev => ({ ...prev, serviceId: service.id }));
                                        }}
                                        className={`group relative bg-white/80 backdrop-blur-xl border-2 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden text-left ${isSelected
                                            ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                                            : 'border-gray-200 hover:border-[#001F3F]/30'
                                            }`}
                                    >
                                        <div className="flex gap-4 p-4">
                                            {/* Service Image */}
                                            {service.image_url && (
                                                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={service.image_url}
                                                        alt={language === 'ar' ? service.title_ar : language === 'fr' ? service.title_fr : service.title_en}
                                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                            )}

                                            {/* Service Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold text-[#001F3F] mb-1 line-clamp-1">
                                                    {language === 'ar' ? service.title_ar : language === 'fr' ? service.title_fr : service.title_en}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                    {language === 'ar' ? service.description_ar : language === 'fr' ? service.description_fr : service.description_en}
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {service.duration_minutes} min
                                                    </span>
                                                    <span className="font-semibold text-[#D4AF37]">
                                                        {service.price > 0 ? `${service.price}€` : (language === 'ar' ? 'مجاني' : language === 'fr' ? 'Gratuit' : 'Free')}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Selection Indicator */}
                                            {isSelected && (
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#D4AF37] text-white flex-shrink-0">
                                                    <CheckCircle2 className="h-5 w-5" />
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Next Button */}
                        <div className="mt-6 flex justify-end">
                            <button
                                disabled={!selectedService}
                                onClick={() => setStep(1)}
                                className="px-6 py-2 bg-[#001F3F] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#003366] transition-colors"
                            >
                                {language === 'ar' ? 'التالي' : language === 'fr' ? 'Suivant' : 'Next'}
                            </button>
                        </div>
                    </div>
                )}

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
                                    const isDisabled = !dayObj.isCurrentMonth || !isDateAvailable(dayObj.date);

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
                                {timeSlots.length > 0 ? (
                                    timeSlots.map(time => {
                                        const isBooked = bookedSlots.includes(time);
                                        return (
                                            <button
                                                key={time}
                                                onClick={() => !isBooked && setSelectedTime(time)}
                                                disabled={isBooked}
                                                className={`py-3 px-4 rounded-full text-sm border transition-all ${selectedTime === time
                                                    ? 'border-[#D4AF37] bg-[#D4AF37] text-white'
                                                    : isBooked
                                                        ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                                                        : 'border-gray-200 hover:border-[#001F3F] hover:text-[#001F3F]'
                                                    }`}
                                            >
                                                {time}
                                            </button>
                                        );
                                    })
                                ) : (
                                    <div className="col-span-full text-center py-4 text-gray-500 text-sm">
                                        {language === 'ar' ? 'لا توجد مواعيد متاحة في هذا اليوم' : language === 'fr' ? 'Aucun créneau disponible ce jour-là' : 'No available slots on this day'}
                                    </div>
                                )}
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
                                value={formData.serviceId}
                                onChange={e => setFormData({ ...formData, serviceId: e.target.value })}
                            >
                                {services.map((service) => (
                                    <option key={service.id} value={service.id}>
                                        {language === 'fr' ? service.title_fr : language === 'ar' ? service.title_ar : service.title_en}
                                        {` - ${service.duration_minutes} min - ${service.price}€`}
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
                        {(services.find(s => s.id === formData.serviceId)?.price || 0) > 0 && (
                            <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#001F3F]/10 p-4 rounded-xl border-2 border-[#D4AF37]/30">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">
                                            {language === 'ar' ? 'السعر الإجمالي' : language === 'fr' ? 'Prix Total' : 'Total Price'}
                                        </p>
                                        <p className="text-3xl font-bold text-[#001F3F]">
                                            {services.find(s => s.id === formData.serviceId)?.price}€
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
                                    : (services.find(s => s.id === formData.serviceId)?.price || 0) > 0
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
                                services.find(s => s.id === formData.serviceId)?.[`title_${language}` as keyof Service]
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
