# 📋 خطة التكامل الشاملة | Comprehensive Integration Plan
**التاريخ | Date**: 2025-12-24
**الحالة | Status**: 🚧 قيد التنفيذ | In Progress

---

## ✅ **ما تم إنجازه | Completed**

### 1. **فحص شامل للنظام | System Audit**
- ✅ تحديد جميع الأنظمة المنفصلة
- ✅ العثور على البيانات المخزنة مؤقتاً (hardcoded)
- ✅ تحديد الجداول غير المتصلة

### 2. **تحسين جدول الخدمات | Services Table Enhancement**
- ✅ إضافة حقل `image_url` للصور
- ✅ إضافة حقل `price` للأسعار
- ✅ إضافة حقل `duration_minutes` للمدة
- ✅ إضافة حقل `is_bookable` لتحديد إذا كانت قابلة للحجز
- ✅ إضافة حقل `featured` للخدمات المميزة

### 3. **ربط الخدمات بأنواع المواعيد | Services ↔ Appointment Types**
- ✅ إنشاء جدول `service_appointment_types` (junction table)
- ✅ إضافة `service_id` لجدول `bookings`

### 4. **تحديث واجهة العرض | Frontend Update**
- ✅ تحديث `components/Services.tsx` للقراءة من قاعدة البيانات
- ✅ إضافة دعم عرض الصور
- ✅ إضافة دعم عرض الأسعار

---

## 🔄 **قيد التنفيذ | In Progress**

### 5. **تحديث صفحة إدارة الخدمات | Admin Services Page**
**الملف | File**: `app/admin/services/page.tsx`

**التغييرات المطلوبة:**
```typescript
interface Service {
    // الحقول الموجودة
    id: string;
    title_en: string;
    title_fr: string;
    title_ar: string;
    description_en: string;
    description_fr: string;
    description_ar: string;
    icon: string;
    href: string;
    color: string;
    is_active: boolean;
    display_order: number;

    // ✅ الحقول الجديدة | New Fields
    image_url?: string;          // رابط الصورة
    price?: number;              // السعر
    duration_minutes?: number;   // المدة بالدقائق
    is_bookable?: boolean;       // قابلة للحجز؟
    featured?: boolean;          // مميزة؟
}
```

**الإضافات للنموذج:**
1. حقل إدخال URL للصورة
2. حقل رقم للسعر
3. حقل رقم للمدة
4. checkbox لـ is_bookable
5. checkbox لـ featured

---

## 🚀 **التالي | Next Steps**

### 6. **إصلاح API الحجز | Fix Booking API**
**المشكلة**: يحفظ في ملف JSON بدلاً من Supabase
**الملف**: `app/api/booking/route.ts`

**التغيير المطلوب:**
```typescript
// ❌ الحالي | Current
import { saveBooking } from '@/lib/local-storage';
await saveBooking(bookingData);

// ✅ الجديد | New
import { supabase } from '@/lib/supabase';
const { data, error } = await supabase
    .from('bookings')
    .insert([bookingData]);
```

---

### 7. **تحديث BookingCalendar | Update BookingCalendar Component**
**الملف**: `components/BookingCalendar.tsx`

**التغييرات:**

#### A. إضافة اختيار الخدمة
```typescript
const [selectedService, setSelectedService] = useState<Service | null>(null);
const [services, setServices] = useState<Service[]>([]);

// Load services
useEffect(() => {
    async function loadServices() {
        const { data } = await supabase
            .from('services')
            .select('*')
            .eq('is_bookable', true)
            .eq('is_active', true);
        setServices(data || []);
    }
    loadServices();
}, []);
```

#### B. تحديث حمل فترات الوقت
```typescript
// ❌ الحالي | Current - من DEFAULT_TIME_SLOTS
const DEFAULT_TIME_SLOTS = ["09:00", "10:00", ...];

// ✅ الجديد | New - من calendar_settings
async function loadTimeSlots() {
    const { data } = await supabase
        .from('calendar_settings')
        .select('*')
        .single();

    // استخدام calendar_settings لتوليد الفترات
    generateSlotsFromSettings(data);
}
```

#### C. حفظ service_id مع الحجز
```typescript
const bookingData = {
    ...otherData,
    service_id: selectedService?.id,         // ✅ إضافة
    appointment_type_id: selectedType.id,
    price: selectedType.price,
};
```

---

### 8. **ربط صفحة التقويم الإداري بالخدمات**
**الملف**: `app/admin/calendar/page.tsx`

**الإضافات:**
1. عرض الخدمة في كل موعد
2. فلترة حسب الخدمة
3. إحصائيات لكل خدمة

```typescript
// في دالة loadAppointments
const { data } = await supabase
    .from('appointments')
    .select(`
        *,
        appointment_types(*),
        services(*)              // ✅ إضافة ربط الخدمة
    `);
```

---

### 9. **توحيد نظام الفترات الزمنية | Unify Time Slots System**

**المشكلة**: 4 مصادر مختلفة للفترات!
1. ❌ `DEFAULT_TIME_SLOTS` - مخزنة مؤقتاً
2. ❌ `site_settings.available_time_slots` - JSON في الإعدادات
3. ❌ `time_slots` table - جدول غير مستخدم
4. ✅ `calendar_settings` table - المستخدم من صفحة appointments

**الحل**:
- استخدام `calendar_settings` فقط
- حذف `DEFAULT_TIME_SLOTS`
- حذف `site_settings.available_time_slots`
- ✅ KEEP `time_slots` table لمستقبلاً (فترات خاصة لكل خدمة)

---

### 10. **إضافة إدارة التواريخ المحظورة | Blocked Dates Management**

**إنشاء واجهة إدارية جديدة:**

**الملف الجديد**: `components/admin/calendar/BlockedDatesManager.tsx`

```typescript
// قراءة التواريخ المحظورة
const { data } = await supabase
    .from('blocked_dates')
    .select('*')
    .order('date');

// إضافة تاريخ محظور
await supabase
    .from('blocked_dates')
    .insert({
        date: selectedDate,
        reason: reason
    });
```

**إضافتها في**: `app/admin/calendar/page.tsx`

---

## 📊 **ملخص التكاملات المطلوبة | Integration Summary**

### الأولوية العالية | High Priority

| # | النظام | المشكلة | الحل | الحالة |
|---|--------|---------|------|---------|
| 1 | Services Display | بيانات ثابتة | ✅ القراءة من DB | ✅ تم |
| 2 | Booking API | يحفظ في JSON | تحويل لـ Supabase | 🔄 قريباً |
| 3 | Time Slots | 4 مصادر مختلفة | استخدام calendar_settings | 🔄 قريباً |
| 4 | Services ↔ Bookings | غير مربوطة | إضافة service_id | ✅ DB جاهز |

### الأولوية المتوسطة | Medium Priority

| # | النظام | المشكلة | الحل | الحالة |
|---|--------|---------|------|---------|
| 5 | Admin Services | حقول مفقودة | إضافة image/price | 🔄 قريباً |
| 6 | Blocked Dates | لا توجد واجهة | إنشاء مدير | 📋 مخطط |
| 7 | BookingCalendar | لا يعرض Services | إضافة اختيار الخدمة | 📋 مخطط |

---

## 🗂️ **بنية قاعدة البيانات النهائية | Final Database Structure**

```
┌─────────────┐         ┌──────────────────────────┐         ┌─────────────────┐
│  services   │────┬────│ service_appointment_types│────┬────│ appointment_    │
│             │    │    │  (junction table)        │    │    │ types           │
│ - id        │    │    │ - service_id  ────────────────┘    │                 │
│ - title_*   │    │    │ - appointment_type_id ─────────────│ - id            │
│ - desc_*    │    │    │ - is_primary             │         │ - name_*        │
│ - icon      │    │    └──────────────────────────┘         │ - duration      │
│ - image_url │◄───┘                                         │ - price         │
│ - price     │         ┌─────────────┐                      └─────────────────┘
│ - is_active │         │  bookings   │                               ▲
└─────────────┘         │             │                               │
                        │ - id        │───────────────────────────────┘
                        │ - service_id│  (FK to appointment_types)
                        │ - app_type  │
                        │ - date/time │
                        └─────────────┘

        ┌──────────────────┐              ┌─────────────────┐
        │ calendar_settings│              │  blocked_dates  │
        │                  │              │                 │
        │ - working_hours  │              │ - date          │
        │ - lunch_break    │              │ - reason        │
        │ - slot_duration  │              └─────────────────┘
        └──────────────────┘
```

---

## 📝 **خطوات التنفيذ التفصيلية | Detailed Implementation Steps**

### المرحلة 1: التحديثات الأساسية (اليوم)
1. ✅ تحديث Services.tsx
2. 🔄 تحديث Admin Services Page
3. 🔄 إصلاح Booking API

### المرحلة 2: التكامل (غداً)
4. تحديث BookingCalendar
5. ربط Admin Calendar
6. توحيد Time Slots

### المرحلة 3: التحسينات (بعد غد)
7. إضافة Blocked Dates UI
8. اختبار شامل
9. رفع للإنتاج

---

## 🧪 **خطة الاختبار | Testing Plan**

### اختبار الخدمات
- [ ] الخدمات تظهر من DB في `/services`
- [ ] الصور تعرض بشكل صحيح
- [ ] الأسعار تظهر
- [ ] يمكن تعديل الخدمات في `/admin/services`

### اختبار الحجز
- [ ] يمكن اختيار خدمة في `/booking`
- [ ] الحجز يحفظ في Supabase (ليس JSON)
- [ ] service_id محفوظ مع الحجز
- [ ] الفترات الزمنية من calendar_settings

### اختبار التقويم الإداري
- [ ] المواعيد تعرض الخدمة
- [ ] يمكن فلترة حسب الخدمة
- [ ] الإحصائيات تعمل

---

## 📦 **الملفات المعدّلة | Modified Files**

### ✅ تم التعديل | Modified
1. ✅ `supabase/migrations/20250124_enhance_services_table.sql`
2. ✅ `components/Services.tsx`

### 🔄 قيد التعديل | In Progress
3. 🔄 `app/admin/services/page.tsx`

### 📋 سيتم التعديل | To Be Modified
4. `app/api/booking/route.ts`
5. `components/BookingCalendar.tsx`
6. `app/admin/calendar/page.tsx`
7. `components/admin/calendar/BlockedDatesManager.tsx` (جديد)

---

## 💡 **ملاحظات مهمة | Important Notes**

### الحقول الجديدة في services
```sql
ALTER TABLE services
ADD COLUMN image_url TEXT,           -- رابط الصورة
ADD COLUMN price DECIMAL(10,2),      -- السعر الافتراضي
ADD COLUMN duration_minutes INT,     -- المدة بالدقائق
ADD COLUMN is_bookable BOOLEAN,      -- قابلة للحجز؟
ADD COLUMN featured BOOLEAN;         -- مميزة؟
```

### الجدول الجديد
```sql
CREATE TABLE service_appointment_types (
    id UUID PRIMARY KEY,
    service_id UUID REFERENCES services(id),
    appointment_type_id UUID REFERENCES appointment_types(id),
    is_primary BOOLEAN
);
```

---

## 🎯 **الأهداف النهائية | Final Goals**

1. ✅ **كل الخدمات** تأتي من قاعدة البيانات
2. ✅ **كل الحجوزات** تحفظ في Supabase
3. ✅ **الفترات الزمنية** من calendar_settings فقط
4. ✅ **الخدمات مربوطة** بأنواع المواعيد
5. ✅ **التواريخ المحظورة** لها واجهة إدارية

---

**التوقيع | Signature**: Claude Sonnet 4.5
**التاريخ | Date**: 2025-12-24
