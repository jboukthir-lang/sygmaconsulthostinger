# 📧 دليل إعداد نظام البريد الإلكتروني - Email Setup Guide

## 📋 نظرة عامة

يدعم المشروع **طريقتين** لإرسال البريد الإلكتروني:
1. **SMTP** (Gmail, Outlook, أي خادم SMTP)
2. **Resend API** (خدمة حديثة وسهلة)

---

## 🎯 الطريقة 1: إعداد SMTP (Gmail)

### **الخطوة 1: إنشاء App Password في Gmail**

#### أ. تفعيل التحقق بخطوتين:
1. اذهب إلى: https://myaccount.google.com/security
2. ابحث عن "2-Step Verification"
3. انقر "Get Started" واتبع التعليمات
4. أدخل رقم هاتفك وأكمل التفعيل

#### ب. إنشاء App Password:
1. بعد تفعيل التحقق بخطوتين، ارجع إلى: https://myaccount.google.com/security
2. ابحث عن "App passwords" (كلمات مرور التطبيقات)
3. انقر عليها
4. اختر:
   - **Select app:** Mail
   - **Select device:** Other (Custom name)
   - اكتب: "Sygma Consult Website"
5. انقر "Generate"
6. **انسخ الكود المكون من 16 حرف** (مثال: `abcd efgh ijkl mnop`)

⚠️ **مهم:** احفظ هذا الكود في مكان آمن، لن تتمكن من رؤيته مرة أخرى!

---

### **الخطوة 2: إضافة الإعدادات في `.env.local`**

افتح ملف `.env.local` في مجلد `web/` وأضف:

```env
# ============================================
# SMTP Configuration (Gmail)
# ============================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop

# Admin Email (لاستقبال الإشعارات)
ADMIN_EMAIL=admin@sygma-consult.com
```

**استبدل:**
- `your-email@gmail.com` → بريدك الإلكتروني في Gmail
- `abcd efgh ijkl mnop` → App Password الذي حصلت عليه
- `admin@sygma-consult.com` → البريد الذي سيستقبل إشعارات الحجوزات والرسائل

---

### **الخطوة 3: اختبار SMTP**

#### أ. أعد تشغيل المشروع:
```bash
cd web
npm run dev
```

#### ب. اختبر إرسال بريد:
1. اذهب إلى: http://localhost:3000/contact
2. املأ نموذج التواصل
3. اضغط "Send Message"
4. تحقق من:
   - ✅ البريد الوارد في `ADMIN_EMAIL` (إشعار بالرسالة الجديدة)
   - ✅ البريد الوارد للمرسل (رد تلقائي)

#### ج. اختبر الحجز:
1. اذهب إلى: http://localhost:3000/book
2. احجز موعد
3. تحقق من:
   - ✅ البريد الوارد للعميل (تأكيد الحجز)
   - ✅ البريد الوارد للإدارة (إشعار بحجز جديد)

---

## 🚀 الطريقة 2: إعداد Resend API (موصى به)

### **لماذا Resend؟**
- ✅ سهل الإعداد (5 دقائق)
- ✅ لا يحتاج App Password
- ✅ معدل إرسال أعلى (100 بريد/يوم مجاناً)
- ✅ تتبع حالة البريد (Delivered, Opened, Clicked)
- ✅ دعم فني ممتاز

---

### **الخطوة 1: إنشاء حساب Resend**

1. اذهب إلى: https://resend.com/signup
2. سجل حساب جديد (مجاني)
3. أكد بريدك الإلكتروني

---

### **الخطوة 2: الحصول على API Key**

1. بعد تسجيل الدخول، اذهب إلى: https://resend.com/api-keys
2. انقر "Create API Key"
3. اسم الـ Key: "Sygma Consult Production"
4. الصلاحيات: "Sending access"
5. انقر "Create"
6. **انسخ الـ API Key** (يبدأ بـ `re_...`)

⚠️ **مهم:** احفظ الـ API Key، لن تتمكن من رؤيته مرة أخرى!

---

### **الخطوة 3: إضافة Domain (اختياري لكن موصى به)**

#### لماذا؟
- بدون domain: البريد يُرسل من `onboarding@resend.dev`
- مع domain: البريد يُرسل من `contact@sygma-consult.com` (أكثر احترافية)

#### كيف؟
1. في Resend Dashboard، اذهب إلى: **Domains**
2. انقر "Add Domain"
3. أدخل: `sygma-consult.com`
4. انقر "Add"
5. ستظهر لك DNS Records (SPF, DKIM, DMARC)
6. أضف هذه الـ Records في إعدادات الـ DNS لدى مزود الاستضافة
7. انتظر 24-48 ساعة للتحقق

**مثال DNS Records:**
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all

Type: TXT
Name: resend._domainkey
Value: [القيمة من Resend Dashboard]

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@sygma-consult.com
```

---

### **الخطوة 4: إضافة الإعدادات في `.env.local`**

```env
# ============================================
# Resend API Configuration
# ============================================
RESEND_API_KEY=re_123456789abcdefghijklmnop

# Email Configuration
EMAIL_FROM=Sygma Consult <contact@sygma-consult.com>
ADMIN_EMAIL=admin@sygma-consult.com
```

**استبدل:**
- `re_123456789...` → الـ API Key من Resend
- `contact@sygma-consult.com` → بريدك (أو `onboarding@resend.dev` إذا لم تضف domain)
- `admin@sygma-consult.com` → البريد الذي سيستقبل الإشعارات

---

### **الخطوة 5: تحديث الكود لاستخدام Resend**

#### أ. إنشاء ملف جديد: `web/lib/resend-email.ts`

<create_file>
<path>web/lib/resend-email.ts</path>
<content>
import { resend, EMAIL_FROM } from './resend';
import type { Booking, Contact } from './supabase';
import { 
  bookingConfirmationEmail, 
  bookingNotificationEmail, 
  contactNotificationEmail, 
  contactAutoReplyEmail 
} from './email-templates';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@sygma-consult.com';

// Send booking confirmation email to client
export const sendBookingConfirmation = async (booking: Booking) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('Resend API key not configured. Emails will not be sent.');
    return null;
  }

  try {
    const emailTemplate = bookingConfirmationEmail(booking);

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: booking.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    if (error) {
      console.error('Failed to send booking confirmation email:', error);
      throw error;
    }

    console.log('Booking confirmation email sent:', data?.id);
    return data;
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error);
    throw error;
  }
};

// Send booking notification to admin
export const sendBookingNotification = async (booking: Booking) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('Resend API key not configured. Emails will not be sent.');
    return null;
  }

  try {
    const emailTemplate = bookingNotificationEmail(booking);

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: ADMIN_EMAIL,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    if (error) {
      console.error('Failed to send booking notification email:', error);
      throw error;
    }

    console.log('Booking notification email sent:', data?.id);
    return data;
  } catch (error) {
    console.error('Failed to send booking notification email:', error);
    throw error;
  }
};

// Send contact notification to admin
export const sendContactNotification = async (contact: Contact) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('Resend API key not configured. Emails will not be sent.');
    return null;
  }

  try {
    const emailTemplate = contactNotificationEmail(contact);

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: ADMIN_EMAIL,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    if (error) {
      console.error('Failed to send contact notification email:', error);
      throw error;
    }

    console.log('Contact notification email sent:', data?.id);
    return data;
  } catch (error) {
    console.error('Failed to send contact notification email:', error);
    throw error;
  }
};

// Send auto-reply to client after contact
export const sendContactAutoReply = async (contact: Contact) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('Resend API key not configured. Emails will not be sent.');
    return null;
  }

  try {
    const emailTemplate = contactAutoReplyEmail(contact);

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: contact.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    if (error) {
      console.error('Failed to send contact auto-reply email:', error);
      throw error;
    }

    console.log('Contact auto-reply email sent:', data?.id);
    return data;
  } catch (error) {
    console.error('Failed to send contact auto-reply email:', error);
    throw error;
  }
};
