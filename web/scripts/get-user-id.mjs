// Script to help get the current user's Firebase UID
// This will guide you to add your account to admin_users

console.log('═══════════════════════════════════════════════════════════');
console.log('           🔍 للحصول على Firebase User ID');
console.log('═══════════════════════════════════════════════════════════\n');

console.log('📋 الخطوات:\n');

console.log('1️⃣ افتح المتصفح واذهب إلى:');
console.log('   http://localhost:3000/profile\n');

console.log('2️⃣ اضغط F12 لفتح Developer Tools\n');

console.log('3️⃣ اذهب إلى تبويب Console\n');

console.log('4️⃣ الصق هذا الكود واضغط Enter:\n');
console.log('   ┌────────────────────────────────────────────┐');
console.log('   │ // Copy this code:                         │');
console.log('   │                                            │');
console.log('   │ (async () => {                            │');
console.log('   │   const auth = (await import(             │');
console.log('   │     "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js" │');
console.log('   │   )).getAuth();                           │');
console.log('   │   const user = auth.currentUser;          │');
console.log('   │   if (user) {                             │');
console.log('   │     console.log("════════════════════");  │');
console.log('   │     console.log("YOUR USER ID (UID):");   │');
console.log('   │     console.log(user.uid);                │');
console.log('   │     console.log("════════════════════");  │');
console.log('   │     console.log("Email:", user.email);    │');
console.log('   │     console.log("Name:", user.displayName); │');
console.log('   │   } else {                                │');
console.log('   │     console.log("No user logged in");     │');
console.log('   │   }                                       │');
console.log('   │ })();                                     │');
console.log('   └────────────────────────────────────────────┘\n');

console.log('   أو ببساطة استخدم:');
console.log('   ┌────────────────────────────────────────────┐');
console.log('   │ JSON.parse(localStorage.authUser).uid     │');
console.log('   └────────────────────────────────────────────┘\n');

console.log('5️⃣ انسخ الـ UID (مثل: k4sN2pQm7LXe9R1vB8...)\n');

console.log('6️⃣ افتح Supabase SQL Editor:');
console.log('   https://ldbsacdpkinbpcguvgai.supabase.co\n');

console.log('7️⃣ نفذ هذا SQL (بعد استبدال YOUR_UID و YOUR_EMAIL):\n');
console.log('   ┌────────────────────────────────────────────┐');
console.log('   │ INSERT INTO admin_users                    │');
console.log('   │ (user_id, email, role, permissions)        │');
console.log('   │ VALUES (                                   │');
console.log('   │   \'YOUR_UID\',                            │');
console.log('   │   \'YOUR_EMAIL\',                          │');
console.log('   │   \'super_admin\',                         │');
console.log('   │   \'{"all": true}\'::jsonb                │');
console.log('   │ );                                         │');
console.log('   └────────────────────────────────────────────┘\n');

console.log('8️⃣ بعد تنفيذ SQL، ارجع للموقع وسجل خروج ثم دخول مرة أخرى\n');

console.log('✅ الآن ستتمكن من الدخول إلى /admin\n');

console.log('═══════════════════════════════════════════════════════════\n');
