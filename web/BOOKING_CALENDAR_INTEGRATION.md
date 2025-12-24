# 📅 تكامل صفحة البوكينج مع الكالندر | Booking-Calendar Integration

## 🎯 **الهدف | Goal**

ربط صفحة البوكينج (`/booking`) بالكامل مع إعدادات صفحة الكالندر (`/admin/calendar`) والخدمات

---

## ✅ **ما يجب أن يحدث | What Should Happen**

### 1. **الإعدادات من `/admin/calendar`**
كل إعدادات البوكينج تأتي من جدول `calendar_settings`:
- ⏰ ساعات العمل (working_hours_start, working_hours_end)
- ☕ فترة الاستراحة (break_start, break_end)
- 📏 مدة كل فترة (slot_duration)
- 📅 أيام العمل (working_days: monday, tuesday, etc.)
- 📆 أقصى/أدنى مدة للحجز المسبق (max_advance_booking_days, min_advance_booking_hours)

### 2. **الخدمات من جدول `services`**
البوكينج يعرض الخدمات القابلة للحجز:
- فقط الخدمات حيث `is_bookable = true`
- فقط الخدمات النشطة `is_active = true`
- مع الصور إذا كانت موجودة (`image_url`)
- مع الأسعار (`price`)

### 3. **ربط الخدمات بأنواع المواعيد**
عندما يختار المستخدم خدمة، يعرض فقط أنواع المواعيد المرتبطة:
```sql
SELECT appointment_types.*
FROM appointment_types
INNER JOIN service_appointment_types
  ON appointment_types.id = service_appointment_types.appointment_type_id
WHERE service_appointment_types.service_id = :selected_service_id
  AND appointment_types.is_active = true
```

### 4. **التواريخ المحظورة من جدول `blocked_dates`**
البوكينج يتحقق من التواريخ المحظورة:
```sql
SELECT * FROM blocked_dates
WHERE date >= CURRENT_DATE
```

### 5. **الحفظ في Supabase (ليس JSON)**
```typescript
const { data, error } = await supabase
    .from('bookings')
    .insert([{
        name: formData.name,
        email: formData.email,
        service_id: selectedService.id,        // ✅ NEW
        appointment_type_id: selectedType.id,
        date: selectedDate,
        time: selectedTime,
        is_online: formData.is_online,
        notes: formData.notes,
        status: 'pending',
        price: selectedType.price,
        duration: selectedType.duration
    }]);
```

---

## 🔄 **سير العمل الكامل | Complete Workflow**

### الخطوة 1: اختيار الخدمة
```
User visits /booking
  ↓
Load services from database:
  SELECT * FROM services
  WHERE is_active = true
    AND is_bookable = true
  ORDER BY display_order
  ↓
Display services with images and prices
  ↓
User selects a service → NEXT
```

### الخطوة 2: اختيار نوع الاستشارة
```
Load appointment types for selected service:
  SELECT at.*
  FROM appointment_types at
  JOIN service_appointment_types sat
    ON at.id = sat.appointment_type_id
  WHERE sat.service_id = :selected_service_id
    AND at.is_active = true
  ↓
Display types with duration, price, online/onsite options
  ↓
User selects type → NEXT
```

### الخطوة 3: اختيار التاريخ والوقت
```
Load calendar_settings:
  SELECT * FROM calendar_settings LIMIT 1
  ↓
Load blocked_dates:
  SELECT * FROM blocked_dates
  WHERE date >= CURRENT_DATE
  ↓
Generate available dates:
  - Check if day is in working_days
  - Check if not in blocked_dates
  - Check min/max advance booking rules
  ↓
User selects date → Generate time slots
  ↓
Generate time slots:
  - Start from working_hours_start
  - End at working_hours_end
  - Increment by slot_duration
  - Skip break_start to break_end
  ↓
Load already booked slots for selected date:
  SELECT time FROM bookings
  WHERE date = :selected_date
    AND status != 'cancelled'
  ↓
Show available slots (exclude booked ones)
  ↓
User selects time → NEXT
```

### الخطوة 4: إدخال التفاصيل
```
Form fields:
  - Name (auto-fill if logged in)
  - Email (auto-fill if logged in)
  - Online/Onsite toggle
  - Notes (optional)
  ↓
User fills form → SUBMIT
```

### الخطوة 5: الحفظ والدفع
```
Save to Supabase:
  INSERT INTO bookings (...)
  VALUES (...)
  ↓
If price > 0:
  → Redirect to Stripe checkout
  → After payment: Update booking status
Else:
  → Show confirmation
  → Send confirmation email
```

---

## 📊 **جداول قاعدة البيانات المستخدمة | Database Tables Used**

### 1. `services`
```sql
id, title_*, description_*, icon, image_url,
price, is_active, is_bookable, display_order
```

### 2. `appointment_types`
```sql
id, name_*, description_*, duration, price,
is_online_available, is_onsite_available, is_active
```

### 3. `service_appointment_types` (Junction)
```sql
id, service_id (FK → services),
appointment_type_id (FK → appointment_types),
is_primary
```

### 4. `calendar_settings`
```sql
working_hours_start, working_hours_end,
break_start, break_end, slot_duration,
working_days (ARRAY), max_advance_booking_days,
min_advance_booking_hours
```

### 5. `blocked_dates`
```sql
id, date, reason
```

### 6. `bookings`
```sql
id, name, email,
service_id (FK → services),          -- ✅ NEW
appointment_type_id (FK → appointment_types),
date, time, is_online, notes,
status, price, duration,
created_at, updated_at
```

---

## 🔧 **التغييرات المطلوبة في الكود | Required Code Changes**

### File: `components/BookingCalendar.tsx`

#### Change 1: Remove DEFAULT_TIME_SLOTS
```typescript
// ❌ DELETE THIS
const DEFAULT_TIME_SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

// ✅ USE THIS
const [timeSlots, setTimeSlots] = useState<string[]>([]);
```

#### Change 2: Load Calendar Settings
```typescript
async function loadCalendarSettings() {
    const { data } = await supabase
        .from('calendar_settings')
        .select('*')
        .single();

    if (data) {
        setCalendarSettings(data);
    }
}
```

#### Change 3: Load Services
```typescript
async function loadServices() {
    const { data } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .eq('is_bookable', true)
        .order('display_order');

    setServices(data || []);
}
```

#### Change 4: Load Appointment Types for Service
```typescript
async function loadAppointmentTypes(serviceId: string) {
    // Get linked appointment types
    const { data: links } = await supabase
        .from('service_appointment_types')
        .select('appointment_type_id')
        .eq('service_id', serviceId);

    if (links && links.length > 0) {
        const typeIds = links.map(l => l.appointment_type_id);

        const { data } = await supabase
            .from('appointment_types')
            .select('*')
            .in('id', typeIds)
            .eq('is_active', true);

        setAppointmentTypes(data || []);
    }
}
```

#### Change 5: Generate Time Slots from Settings
```typescript
function generateTimeSlots(date: Date, settings: CalendarSettings) {
    const slots: string[] = [];
    const [startH, startM] = settings.working_hours_start.split(':').map(Number);
    const [endH, endM] = settings.working_hours_end.split(':').map(Number);
    const duration = settings.slot_duration;

    let currentH = startH;
    let currentM = startM;

    while (currentH < endH || (currentH === endH && currentM < endM)) {
        const timeString = `${String(currentH).padStart(2, '0')}:${String(currentM).padStart(2, '0')}`;

        // Skip lunch break
        if (settings.break_start && settings.break_end) {
            // ... check if current time is in break
        }

        slots.push(timeString);

        currentM += duration;
        if (currentM >= 60) {
            currentH += Math.floor(currentM / 60);
            currentM = currentM % 60;
        }
    }

    return slots;
}
```

#### Change 6: Check Blocked Dates
```typescript
async function loadBlockedDates() {
    const { data } = await supabase
        .from('blocked_dates')
        .select('*')
        .gte('date', new Date().toISOString().split('T')[0]);

    setBlockedDates(data || []);
}

function isDateBlocked(date: Date): boolean {
    const dateStr = date.toISOString().split('T')[0];
    return blockedDates.some(bd => bd.date === dateStr);
}
```

#### Change 7: Check Working Days
```typescript
function isWorkingDay(date: Date, settings: CalendarSettings): boolean {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[date.getDay()];
    return settings.working_days.includes(dayName);
}
```

#### Change 8: Save to Supabase
```typescript
async function handleBooking() {
    const { data, error } = await supabase
        .from('bookings')
        .insert([{
            name: formData.name,
            email: formData.email,
            service_id: selectedService.id,           // ✅ NEW
            appointment_type_id: selectedType.id,
            date: selectedDate.toISOString().split('T')[0],
            time: selectedTime,
            is_online: formData.is_online,
            notes: formData.notes,
            status: 'pending',
            price: selectedType.price,
            duration: selectedType.duration
        }]);

    if (error) throw error;

    // Handle payment if needed
    if (selectedType.price > 0) {
        // Stripe checkout
    }
}
```

---

### File: `app/api/booking/route.ts`

#### ❌ DELETE: Local Storage Usage
```typescript
// DELETE THESE LINES
import { saveBooking } from '@/lib/local-storage';
const booking = await saveBooking(bookingData);
```

#### ✅ ADD: Supabase Usage
```typescript
import { supabase } from '@/lib/supabase';

const { data, error } = await supabase
    .from('bookings')
    .insert([bookingData])
    .select();

if (error) throw error;
```

---

## 🧪 **خطة الاختبار | Testing Plan**

### Test 1: Calendar Settings Integration
- [ ] تغيير ساعات العمل في `/admin/calendar`
- [ ] التحقق من ظهورها في `/booking`
- [ ] تغيير أيام العمل
- [ ] التحقق من تعطيل الأيام المناسبة

### Test 2: Services Display
- [ ] إضافة خدمة جديدة في `/admin/services`
- [ ] جعلها `is_bookable = true`
- [ ] التحقق من ظهورها في `/booking`
- [ ] إضافة صورة والتحقق من عرضها

### Test 3: Service-Appointment Link
- [ ] ربط خدمة بنوع موعد في جدول `service_appointment_types`
- [ ] اختيار الخدمة في `/booking`
- [ ] التحقق من ظهور الأنواع المرتبطة فقط

### Test 4: Blocked Dates
- [ ] إضافة تاريخ محظور في جدول `blocked_dates`
- [ ] التحقق من عدم إمكانية اختياره في `/booking`

### Test 5: Time Slot Generation
- [ ] تعيين slot_duration = 30
- [ ] التحقق من فترات 30 دقيقة
- [ ] تعيين فترة استراحة 12:00-13:00
- [ ] التحقق من عدم ظهور فترات الاستراحة

### Test 6: Booking Save
- [ ] إنشاء حجز جديد
- [ ] التحقق من حفظه في جدول `bookings`
- [ ] التحقق من وجود `service_id`
- [ ] التحقق من عدم الحفظ في ملف JSON

---

## 📋 **قائمة المهام | Task Checklist**

### Phase 1: Database ✅ (DONE)
- [x] Add image_url, price to services
- [x] Create service_appointment_types junction table
- [x] Add service_id to bookings

### Phase 2: BookingCalendar Component 🔄 (IN PROGRESS)
- [ ] Remove DEFAULT_TIME_SLOTS
- [ ] Add loadCalendarSettings()
- [ ] Add loadServices()
- [ ] Add loadAppointmentTypes()
- [ ] Add generateTimeSlots() from settings
- [ ] Add loadBlockedDates()
- [ ] Add isWorkingDay() check
- [ ] Update handleBooking() to save in Supabase

### Phase 3: Booking API 📋 (PENDING)
- [ ] Remove local-storage dependency
- [ ] Use Supabase client
- [ ] Update to save service_id

### Phase 4: Admin Calendar 📋 (PENDING)
- [ ] Show service name in appointments list
- [ ] Add filter by service
- [ ] Add statistics per service

### Phase 5: Testing 📋 (PENDING)
- [ ] All 6 tests above

---

## 🎨 **واجهة المستخدم المحسّنة | Enhanced UI Flow**

### Step 1: Select Service (NEW!)
```
┌─────────────────────────────────────────┐
│  Choose Your Service                    │
│                                         │
│  [Image]  Visa Services         €150   │
│           Expert visa assistance        │
│                                         │
│  [Image]  Corporate Services    €200   │
│           Business setup help           │
│                                         │
│  [Image]  Legal Advisory        €180   │
│           Legal compliance              │
└─────────────────────────────────────────┘
```

### Step 2: Select Consultation Type
```
┌─────────────────────────────────────────┐
│  ← Back                                 │
│  Choose Consultation Type               │
│                                         │
│  ● Strategic Consultation    €200      │
│    60 min | 🖥️ Online | 📍 On-site    │
│    Deep strategic planning              │
│                                         │
│  ● Quick Consultation       €100       │
│    30 min | 🖥️ Online only             │
│    Fast advice session                  │
└─────────────────────────────────────────┘
```

### Step 3: Select Date & Time
```
┌─────────────────────────────────────────┐
│  ← Back                                 │
│  Pick Date & Time                       │
│                                         │
│  December 2024                          │
│  Mo Tu We Th Fr Sa Su                   │
│   1  2  3  4  5  6  7                   │
│   8  9 10 11 12 13 14                   │
│  15 16 17 ⬤18 19 20 21    ← Selected   │
│                                         │
│  Available Times:                       │
│  [09:00] [10:00] [11:00]                │
│  -- Lunch Break --                      │
│  [14:00] [15:00] [16:00]                │
│  [Booked] ← Not available               │
└─────────────────────────────────────────┘
```

---

## 🔗 **الملفات المرتبطة | Related Files**

1. `components/BookingCalendar.tsx` - المكوّن الرئيسي
2. `app/api/booking/route.ts` - API للحفظ
3. `components/admin/calendar/CalendarSettings.tsx` - الإعدادات
4. `app/admin/calendar/page.tsx` - صفحة الكالندر الإداري
5. `supabase/migrations/20250124_enhance_services_table.sql` - Migration

---

**Created**: 2025-12-24
**Status**: 🚧 In Progress
**Next**: Update BookingCalendar.tsx component
