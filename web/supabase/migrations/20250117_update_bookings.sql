-- إضافة حقول جديدة لجدول الحجوزات
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS duration INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS appointment_type VARCHAR(50) DEFAULT 'consultation',
ADD COLUMN IF NOT EXISTS specialization VARCHAR(100),
ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS meeting_link VARCHAR(500),
ADD COLUMN IF NOT EXISTS location VARCHAR(500),
ADD COLUMN IF NOT EXISTS consultant_name VARCHAR(200),
ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS notes_admin TEXT;

-- إضافة تعليقات للحقول
COMMENT ON COLUMN bookings.duration IS 'مدة الموعد بالدقائق (افتراضي 30 دقيقة)';
COMMENT ON COLUMN bookings.appointment_type IS 'نوع الموعد: consultation, meeting, training, etc';
COMMENT ON COLUMN bookings.specialization IS 'تخصص الاستشارة';
COMMENT ON COLUMN bookings.is_online IS 'هل الموعد أونلاين أم حضوري';
COMMENT ON COLUMN bookings.meeting_link IS 'رابط الاجتماع الأونلاين';
COMMENT ON COLUMN bookings.location IS 'موقع الاجتماع الحضوري';
COMMENT ON COLUMN bookings.consultant_name IS 'اسم المستشار المسؤول';
COMMENT ON COLUMN bookings.price IS 'سعر الاستشارة';
COMMENT ON COLUMN bookings.payment_status IS 'حالة الدفع: pending, paid, refunded';
COMMENT ON COLUMN bookings.notes_admin IS 'ملاحظات الأدمن على الحجز';

-- إنشاء جدول لأنواع الاستشارات
CREATE TABLE IF NOT EXISTS consultation_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_fr VARCHAR(200) NOT NULL,
  name_ar VARCHAR(200) NOT NULL,
  name_en VARCHAR(200) NOT NULL,
  description_fr TEXT,
  description_ar TEXT,
  description_en TEXT,
  duration INTEGER DEFAULT 30,
  price DECIMAL(10, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_online_available BOOLEAN DEFAULT true,
  is_onsite_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- إنشاء جدول للمستشارين
CREATE TABLE IF NOT EXISTS consultants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  specializations TEXT[],
  bio_fr TEXT,
  bio_ar TEXT,
  bio_en TEXT,
  photo_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  hourly_rate DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- إنشاء جدول لإعدادات الموقع
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(100) NOT NULL UNIQUE,
  value_text TEXT,
  value_json JSONB,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- إضافة بعض الإعدادات الافتراضية
INSERT INTO site_settings (key, value_text, description) VALUES
('logo_url', '/images/logo.png', 'رابط لوجو الموقع'),
('company_name', 'Sygma Consult', 'اسم الشركة'),
('admin_email', 'admin@sygmaconsult.com', 'البريد الإلكتروني للإشعارات'),
('default_appointment_duration', '30', 'المدة الافتراضية للموعد بالدقائق')
ON CONFLICT (key) DO NOTHING;

-- إضافة بعض أنواع الاستشارات الافتراضية
INSERT INTO consultation_types (name_fr, name_ar, name_en, description_fr, description_ar, description_en, duration, price) VALUES
('Consultation Stratégique', 'استشارة استراتيجية', 'Strategic Consultation', 'Consultation pour la stratégie d''entreprise', 'استشارة حول استراتيجية الأعمال', 'Business strategy consultation', 60, 150.00),
('Consultation Financière', 'استشارة مالية', 'Financial Consultation', 'Conseil en gestion financière', 'استشارة في الإدارة المالية', 'Financial management advice', 45, 120.00),
('Consultation RH', 'استشارة موارد بشرية', 'HR Consultation', 'Gestion des ressources humaines', 'إدارة الموارد البشرية', 'Human resources management', 45, 100.00),
('Consultation Juridique', 'استشارة قانونية', 'Legal Consultation', 'Conformité et aspects juridiques', 'الامتثال والجوانب القانونية', 'Compliance and legal aspects', 60, 180.00)
ON CONFLICT DO NOTHING;

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_is_online ON bookings(is_online);
CREATE INDEX IF NOT EXISTS idx_consultation_types_active ON consultation_types(is_active);
CREATE INDEX IF NOT EXISTS idx_consultants_active ON consultants(is_active);

-- تحديث timestamp تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إضافة triggers للتحديث التلقائي
DROP TRIGGER IF EXISTS update_consultation_types_updated_at ON consultation_types;
CREATE TRIGGER update_consultation_types_updated_at BEFORE UPDATE ON consultation_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_consultants_updated_at ON consultants;
CREATE TRIGGER update_consultants_updated_at BEFORE UPDATE ON consultants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- إضافة RLS policies
ALTER TABLE consultation_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultants ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- السماح بالقراءة للجميع
CREATE POLICY "Allow read access to consultation_types" ON consultation_types FOR SELECT USING (is_active = true);
CREATE POLICY "Allow read access to active consultants" ON consultants FOR SELECT USING (is_active = true);

-- السماح للأدمن بكل العمليات
CREATE POLICY "Allow admin full access to consultation_types" ON consultation_types FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE user_id::text = (auth.uid())::text)
);

CREATE POLICY "Allow admin full access to consultants" ON consultants FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE user_id::text = (auth.uid())::text)
);

CREATE POLICY "Allow admin full access to site_settings" ON site_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_users WHERE user_id::text = (auth.uid())::text)
);
