# 🚀 دليل رفع المشروع على Hostinger - خطوة بخطوة

## 📋 قبل البدء - قائمة التحقق

تأكد من توفر:
- ✅ حساب Hostinger نشط
- ✅ خطة Business أو أعلى (لدعم Node.js)
- ✅ الوصول إلى لوحة تحكم Hostinger
- ✅ قاعدة بيانات MySQL تم إنشاؤها

---

## الطريقة 1️⃣: الرفع عبر Git (الأسرع - موصى بها) ⚡

### الخطوة 1: ربط المشروع بـ GitHub

```bash
# إذا لم يكن مرتبط بعد
cd "c:\Users\utilisateur\Desktop\sygma consult"
git add .
git commit -m "Ready for Hostinger deployment"
git push origin main
```

### الخطوة 2: ربط Hostinger بـ GitHub

1. **افتح:** Hostinger Dashboard
2. **اذهب إلى:** Websites → Your Website
3. **اضغط على:** GitHub
4. **اربط حسابك** على GitHub
5. **اختر المستودع:** sygma-consult
6. **اختر الفرع:** main
7. **اختر المجلد:** web
8. **اضغط:** Deploy

### الخطوة 3: إعدادات البناء

في Hostinger، أدخل:

**Build Command:**
```bash
npm install && npm run build
```

**Output Directory:**
```
.next
```

**Install Command:**
```bash
npm install
```

**Node Version:**
```
18.x أو أحدث
```

---

## الطريقة 2️⃣: الرفع عبر File Manager

### الخطوة 1: ضغط المشروع

من مجلد `web`، اضغط الملفات التالية فقط:

```
✅ app/
✅ components/
✅ lib/
✅ public/
✅ context/
✅ data/
✅ scripts/
✅ middleware.ts
✅ next.config.js
✅ package.json
✅ package-lock.json
✅ tsconfig.json
✅ tailwind.config.ts
✅ postcss.config.mjs
✅ .eslintrc.json

❌ لا ترفع:
❌ node_modules/
❌ .next/
❌ .env.local
❌ .git/
```

### الخطوة 2: رفع الملفات

1. **افتح:** Hostinger → File Manager
2. **اذهب إلى:** `/public_html`
3. **ارفع** ملف ZIP
4. **استخرج** الملفات

### الخطوة 3: تثبيت Dependencies

افتح **SSH Terminal** في Hostinger:

```bash
cd /home/u611120010/public_html
npm install
npm run build
```

---

## الطريقة 3️⃣: الرفع عبر FTP (للملفات الكبيرة)

### الخطوة 1: الحصول على بيانات FTP

من Hostinger:
1. **اذهب إلى:** Files → FTP Accounts
2. **انسخ:**
   - Hostname: `ftp.sygmaconsult.com`
   - Username: `u611120010`
   - Password: `(احصل عليها من Hostinger)`
   - Port: `21`

### الخطوة 2: استخدام FileZilla

1. **افتح:** FileZilla
2. **أدخل بيانات FTP**
3. **اتصل**
4. **ارفع مجلد** `web` إلى `/public_html`

---

## 📝 الخطوة المهمة: إعداد متغيرات البيئة

### 1. افتح ملف ENV_COPY_PASTE.txt

اقرأ محتويات [ENV_COPY_PASTE.txt](ENV_COPY_PASTE.txt)

### 2. أضف المتغيرات في Hostinger

1. **افتح:** Hostinger Dashboard
2. **اذهب إلى:** Website → Advanced → Environment Variables
3. **أضف كل متغير:**

```env
NEXT_PUBLIC_URL=https://sygmaconsult.com
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_USER=u611120010_sygma
DB_PASSWORD=GZK446uj%
DB_NAME=u611120010_sygma
```

**وجميع المتغيرات الأخرى من الملف**

### 3. احفظ وأعد التشغيل

- اضغط **Save**
- اضغط **Restart Application**
- انتظر 2-3 دقائق

---

## 🗄️ إعداد قاعدة البيانات MySQL

### الخطوة 1: إنشاء القاعدة (إذا لم تكن موجودة)

1. **افتح:** Hostinger → Databases → MySQL
2. **أنشئ قاعدة بيانات:**
   - Name: `u611120010_sygma`
   - User: `u611120010_sygma`
   - Password: `GZK446uj%`
3. **أعط المستخدم جميع الصلاحيات**

### الخطوة 2: استيراد الجداول

1. **افتح:** phpMyAdmin
2. **اختر القاعدة:** `u611120010_sygma`
3. **اضغط:** Import
4. **ارفع الملفات بالترتيب:**

```sql
1. APPLY_THIS_SQL.sql
2. FIX_BOOKINGS_FINAL.sql
3. CREATE_CALENDAR_SYSTEM.sql
4. APPLY_SITE_SETTINGS_SQL.sql
```

من المجلد الرئيسي: `c:\Users\utilisateur\Desktop\sygma consult\`

---

## ✅ اختبار المشروع بعد الرفع

### 1. اختبار قاعدة البيانات

**افتح المتصفح:**
```
https://sygmaconsult.com/api/health/db
```

**يجب أن ترى:**
```json
{
  "status": "success",
  "message": "Database connection successful",
  "database": "u611120010_sygma",
  "host": "localhost",
  "bookings_table_exists": true
}
```

### 2. اختبار الصفحة الرئيسية

```
https://sygmaconsult.com
```

يجب أن تظهر الصفحة بدون أخطاء.

### 3. اختبار لوحة الإدارة

```
https://sygmaconsult.com/admin
```

### 4. اختبار تسجيل الدخول

```
https://sygmaconsult.com/login
```

---

## 🔧 حل المشاكل الشائعة

### المشكلة 1: 500 Internal Server Error

**الأسباب:**
- متغيرات البيئة غير مضافة
- خطأ في البناء

**الحل:**
1. تحقق من logs في Hostinger
2. تأكد من إضافة جميع متغيرات البيئة
3. أعد بناء المشروع: `npm run build`

### المشكلة 2: Database connection failed

**الحل:**
1. تحقق من `DB_HOST=localhost` (وليس 127.0.0.1)
2. تحقق من صحة Username/Password
3. تأكد من وجود قاعدة البيانات

### المشكلة 3: Application not starting

**الحل:**
1. تحقق من Node.js version (18+)
2. احذف مجلد `.next` وأعد البناء
3. تحقق من `package.json`

### المشكلة 4: Static files 404

**الحل:**
1. تحقق من `next.config.js`
2. تأكد من رفع مجلد `public/`
3. امسح الكاش في Hostinger

---

## 📊 سكريبت رفع سريع (للخبراء)

إذا كنت تستخدم Git + SSH:

```bash
# 1. بناء المشروع محلياً
cd "c:\Users\utilisateur\Desktop\sygma consult\web"
npm run build

# 2. رفع على Git
cd ..
git add .
git commit -m "Deploy to Hostinger"
git push origin main

# 3. على خادم Hostinger عبر SSH
ssh u611120010@sygmaconsult.com
cd /home/u611120010/public_html
git pull origin main
cd web
npm install
npm run build
pm2 restart all
```

---

## 🎯 Checklist النهائي

قبل إطلاق الموقع، تأكد من:

- [ ] ✅ جميع الملفات مرفوعة
- [ ] ✅ متغيرات البيئة مضافة
- [ ] ✅ قاعدة البيانات تعمل
- [ ] ✅ الصفحة الرئيسية تعمل
- [ ] ✅ تسجيل الدخول يعمل
- [ ] ✅ لوحة الإدارة تعمل
- [ ] ✅ Stripe payments تعمل
- [ ] ✅ إرسال الإيميلات يعمل
- [ ] ✅ Google OAuth يعمل
- [ ] ✅ حجز المواعيد يعمل

---

## 📞 الدعم

إذا واجهت مشاكل:

1. **افحص Logs:**
   - Hostinger → Website → Logs

2. **اتصل بدعم Hostinger:**
   - Live Chat متاح 24/7

3. **استخدم ملف الاختبار:**
   - ارفع `public/test-db.php`
   - افتح: `https://sygmaconsult.com/test-db.php`

---

**آخر تحديث:** 24 ديسمبر 2025
**الحالة:** ✅ جاهز للرفع الآن
