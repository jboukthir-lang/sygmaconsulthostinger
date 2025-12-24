<?php
// ====================================
// MySQL Connection Test - PHP Version
// ====================================
// Access this file at: https://sygmaconsult.com/test-db.php

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>اختبار الاتصال بقاعدة البيانات</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            direction: rtl;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            padding: 30px;
        }
        h1 {
            color: #667eea;
            text-align: center;
            margin-bottom: 30px;
        }
        .test-item {
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            border-left: 4px solid #ccc;
        }
        .success {
            background: #d4edda;
            border-color: #28a745;
            color: #155724;
        }
        .error {
            background: #f8d7da;
            border-color: #dc3545;
            color: #721c24;
        }
        .info {
            background: #d1ecf1;
            border-color: #17a2b8;
            color: #0c5460;
        }
        .warning {
            background: #fff3cd;
            border-color: #ffc107;
            color: #856404;
        }
        code {
            background: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        th, td {
            padding: 10px;
            text-align: right;
            border: 1px solid #ddd;
        }
        th {
            background: #667eea;
            color: white;
        }
        .emoji {
            font-size: 1.2em;
            margin-left: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 اختبار الاتصال بقاعدة بيانات MySQL</h1>

<?php
// Database configuration
$host = 'localhost';
$port = 3306;
$username = 'u611120010_sygma';
$password = 'GZK446uj%';
$database = 'u611120010_sygma';

echo '<div class="test-item info">';
echo '<strong>إعدادات الاتصال:</strong><br>';
echo 'المضيف: <code>' . htmlspecialchars($host) . '</code><br>';
echo 'المنفذ: <code>' . htmlspecialchars($port) . '</code><br>';
echo 'اسم المستخدم: <code>' . htmlspecialchars($username) . '</code><br>';
echo 'قاعدة البيانات: <code>' . htmlspecialchars($database) . '</code><br>';
echo 'كلمة المرور: <code>***' . substr($password, -2) . '</code>';
echo '</div>';

// Test connection
try {
    $dsn = "mysql:host=$host;port=$port;dbname=$database;charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    echo '<div class="test-item info">';
    echo '<span class="emoji">📡</span> جاري محاولة الاتصال...';
    echo '</div>';

    $pdo = new PDO($dsn, $username, $password, $options);

    echo '<div class="test-item success">';
    echo '<span class="emoji">✅</span> <strong>تم الاتصال بنجاح!</strong>';
    echo '</div>';

    // Test query
    echo '<div class="test-item info">';
    echo '<span class="emoji">🔍</span> تشغيل استعلام تجريبي: <code>SELECT 1 as test</code>';
    echo '</div>';

    $stmt = $pdo->query('SELECT 1 as test');
    $result = $stmt->fetch();

    echo '<div class="test-item success">';
    echo '<span class="emoji">✅</span> نتيجة الاستعلام: ' . json_encode($result);
    echo '</div>';

    // Get MySQL version
    $stmt = $pdo->query('SELECT VERSION() as version');
    $version = $stmt->fetch();

    echo '<div class="test-item success">';
    echo '<span class="emoji">ℹ️</span> إصدار MySQL: <code>' . htmlspecialchars($version['version']) . '</code>';
    echo '</div>';

    // List all tables
    echo '<div class="test-item info">';
    echo '<span class="emoji">📋</span> جاري فحص الجداول الموجودة...';
    echo '</div>';

    $stmt = $pdo->query('SHOW TABLES');
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

    if (count($tables) > 0) {
        echo '<div class="test-item success">';
        echo '<span class="emoji">✅</span> تم العثور على ' . count($tables) . ' جدول/جداول:';
        echo '<table>';
        echo '<tr><th>#</th><th>اسم الجدول</th></tr>';
        foreach ($tables as $index => $table) {
            echo '<tr><td>' . ($index + 1) . '</td><td><code>' . htmlspecialchars($table) . '</code></td></tr>';
        }
        echo '</table>';
        echo '</div>';
    } else {
        echo '<div class="test-item warning">';
        echo '<span class="emoji">⚠️</span> لم يتم العثور على أي جداول في قاعدة البيانات!<br>';
        echo 'يجب عليك استيراد ملفات SQL لإنشاء الجداول.';
        echo '</div>';
    }

    // Check for specific tables
    $requiredTables = ['users', 'bookings', 'services', 'blog_posts', 'contacts'];
    echo '<div class="test-item info">';
    echo '<span class="emoji">🔍</span> التحقق من الجداول المطلوبة:';
    echo '<table>';
    echo '<tr><th>الجدول</th><th>الحالة</th></tr>';
    foreach ($requiredTables as $tableName) {
        $exists = in_array($tableName, $tables);
        $status = $exists
            ? '<span style="color: green;">✅ موجود</span>'
            : '<span style="color: red;">❌ مفقود</span>';
        echo '<tr><td><code>' . htmlspecialchars($tableName) . '</code></td><td>' . $status . '</td></tr>';
    }
    echo '</table>';
    echo '</div>';

    echo '<div class="test-item success">';
    echo '<span class="emoji">🎉</span> <strong>نجحت جميع الاختبارات! قاعدة البيانات جاهزة للاستخدام.</strong>';
    echo '</div>';

} catch (PDOException $e) {
    echo '<div class="test-item error">';
    echo '<span class="emoji">❌</span> <strong>فشل الاتصال!</strong><br>';
    echo '<strong>رمز الخطأ:</strong> <code>' . htmlspecialchars($e->getCode()) . '</code><br>';
    echo '<strong>رسالة الخطأ:</strong> <code>' . htmlspecialchars($e->getMessage()) . '</code>';
    echo '</div>';

    echo '<div class="test-item warning">';
    echo '<span class="emoji">🔧</span> <strong>خطوات حل المشكلة:</strong><br><br>';

    if (strpos($e->getMessage(), 'Access denied') !== false) {
        echo '❌ <strong>تم رفض الوصول</strong> - تحقق من اسم المستخدم وكلمة المرور<br>';
        echo '→ اذهب إلى: Hostinger → Databases → MySQL<br>';
        echo '→ تحقق من المستخدم: <code>u611120010_sygma</code><br>';
        echo '→ أعد تعيين كلمة المرور إذا لزم الأمر<br>';
    } elseif (strpos($e->getMessage(), 'Connection refused') !== false) {
        echo '❌ <strong>تم رفض الاتصال</strong> - خدمة MySQL قد تكون متوقفة<br>';
        echo '→ اتصل بدعم Hostinger<br>';
    } elseif (strpos($e->getMessage(), 'Unknown database') !== false) {
        echo '❌ <strong>قاعدة البيانات غير موجودة</strong><br>';
        echo '→ أنشئ قاعدة بيانات باسم: <code>u611120010_sygma</code><br>';
    } else {
        echo '→ خطأ غير متوقع، راجع السجلات أعلاه<br>';
    }
    echo '</div>';
}
?>

        <div class="test-item info" style="margin-top: 30px; text-align: center;">
            <small>
                <strong>ملاحظة أمنية:</strong> احذف هذا الملف بعد الانتهاء من الاختبار!<br>
                <code>rm public/test-db.php</code>
            </small>
        </div>
    </div>
</body>
</html>
