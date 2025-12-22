# دليل مزامنة المستخدمين | User Sync Guide

## 🔴 المشكلة الحالية | Current Problem

المستخدمون موجودون في Firebase Authentication لكن لا يظهرون في لوحة الإدارة (Supabase user_profiles).

Users exist in Firebase Authentication but don't appear in the admin panel (Supabase user_profiles).

---

## ✅ الحل | Solution

تم إصلاح الكود في `AuthContext.tsx` - المستخدمون الجدد سيعملون بشكل صحيح.
لكن المستخدمين الحاليين يحتاجون للمزامنة يدوياً.

The code in `AuthContext.tsx` is now fixed - new users will work correctly.
But existing users need to be synced manually.

---

## 📋 خطوات المزامنة اليدوية | Manual Sync Steps

### الخطوة 1️⃣: تنزيل Firebase Service Account Key

1. اذهب إلى:
   ```
   https://console.firebase.google.com/project/sygmaconsult/settings/serviceaccounts/adminsdk
   ```

2. سجل الدخول بحساب: `jboukthir@gmail.com`

3. اضغط على **"Generate new private key"** (إنشاء مفتاح خاص جديد)

4. سيتم تنزيل ملف JSON

5. **أعد تسمية الملف** إلى: `serviceAccountKey.json`

6. **ضع الملف** في المجلد: `web/`
   ```
   c:\Users\utilisateur\Desktop\sygma consult\web\serviceAccountKey.json
   ```

---

### الخطوة 2️⃣: تشغيل سكريبت المزامنة

بعد وضع ملف `serviceAccountKey.json` في المجلد `web/`:

```bash
cd "c:\Users\utilisateur\Desktop\sygma consult\web"
node scripts/manual-sync-users.mjs
```

---

## 🎯 ماذا سيحدث | What Will Happen

السكريبت سوف:
1. يقرأ جميع المستخدمين من Firebase Authentication
2. ينشئ ملف شخصي لكل مستخدم في Supabase `user_profiles`
3. يرسل إشعار ترحيب لكل مستخدم
4. يعرض تقرير عن النتائج

The script will:
1. Read all users from Firebase Authentication
2. Create a profile for each user in Supabase `user_profiles`
3. Send a welcome notification to each user
4. Display a report of the results

---

## 📊 النتيجة المتوقعة | Expected Output

```
═══════════════════════════════════════════════════════
  Sygma Consult - Manual User Sync
═══════════════════════════════════════════════════════

🔍 Fetching users from Firebase Authentication...

✅ Found 5 users in Firebase

📝 Processing user: user1@example.com
   ✅ Successfully synced to Supabase
   📬 Welcome notification sent

📝 Processing user: user2@example.com
   ✅ Successfully synced to Supabase
   📬 Welcome notification sent

...

═══════════════════════════════════════════════════════
  Sync Complete!
═══════════════════════════════════════════════════════

✅ Successfully synced: 5 users
⏭️  Skipped (already exist): 0 users
❌ Errors: 0 users
```

---

## ⚠️ ملاحظات مهمة | Important Notes

### الأمان | Security

⚠️ **لا ترفع ملف `serviceAccountKey.json` إلى GitHub!**
   - الملف يحتوي على مفاتيح سرية
   - الملف مضاف بالفعل إلى `.gitignore`

⚠️ **DO NOT upload `serviceAccountKey.json` to GitHub!**
   - The file contains secret keys
   - The file is already added to `.gitignore`

### بعد المزامنة | After Sync

بعد تشغيل السكريبت بنجاح:
1. المستخدمون سيظهرون في `/admin/users`
2. يمكنك حذف ملف `serviceAccountKey.json` للأمان
3. المستخدمون الجدد سيعملون تلقائياً (بفضل الإصلاح في AuthContext.tsx)

After running the script successfully:
1. Users will appear in `/admin/users`
2. You can delete `serviceAccountKey.json` for security
3. New users will work automatically (thanks to the fix in AuthContext.tsx)

---

## ❌ حل المشاكل | Troubleshooting

### الخطأ: "serviceAccountKey.json not found"

تأكد أن الملف موجود في المسار الصحيح:
```
web/serviceAccountKey.json
```

### الخطأ: "Permission denied"

تأكد أن لديك صلاحيات المسؤول (Admin) في Firebase Console.

### الخطأ: "RLS policy violation"

تحقق من سياسات Row Level Security في Supabase.

---

## 🔄 الحل البديل | Alternative Solution

إذا لم تستطع تشغيل السكريبت، يمكنك:

1. **طلب من المستخدمين تسجيل الدخول مرة أخرى**
   - عند تسجيل الدخول، AuthContext.tsx الجديد سيزامن تلقائياً

2. **انتظار المستخدمين الجدد**
   - المستخدمون الجدد سيعملون بشكل صحيح مباشرة

If you can't run the script, you can:

1. **Ask users to log in again**
   - On login, the new AuthContext.tsx will sync automatically

2. **Wait for new users**
   - New users will work correctly immediately

---

## 📞 الدعم | Support

إذا واجهت أي مشاكل:
- البريد الإلكتروني: contact@sygma-consult.com
- GitHub Issues: https://github.com/jboukthir-lang/sygmaconsult/issues

---

**تم الإنشاء**: 2024-12-18
**الحالة**: جاهز للتنفيذ | Ready to execute
