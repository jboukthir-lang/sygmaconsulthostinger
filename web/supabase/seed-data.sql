-- =============================================
-- SEED DATA FOR TESTING
-- Run this in Supabase SQL Editor to populate test data
-- =============================================

-- Clear existing test data (optional - uncomment if needed)
-- DELETE FROM bookings WHERE email LIKE '%@test.com';
-- DELETE FROM contacts WHERE email LIKE '%@test.com';
-- DELETE FROM user_profiles WHERE user_id = 'demo-user-id';
-- DELETE FROM notifications WHERE user_id = 'demo-user-id';

-- =============================================
-- BOOKINGS (Test Data)
-- =============================================
INSERT INTO bookings (name, email, topic, date, time, status, notes)
VALUES
  ('Ahmed Hassan', 'ahmed@test.com', 'Strategic Consulting', '2025-12-20', '10:00', 'pending', 'Interested in market expansion to Tunisia'),
  ('Sarah Martin', 'sarah@test.com', 'Legal & Fiscal', '2025-12-22', '14:00', 'confirmed', 'Tax optimization for French subsidiary'),
  ('Mohamed Ali', 'mohamed@test.com', 'Company Formation', '2025-12-18', '09:00', 'confirmed', 'Setting up SARL in France'),
  ('Emma Dubois', 'emma@test.com', 'Digital Transformation', '2025-12-15', '11:00', 'cancelled', 'Client cancelled - rescheduled'),
  ('Jean Lefebvre', 'jean@test.com', 'Strategic Consulting', '2025-12-25', '15:00', 'pending', 'Business partnership inquiry'),
  ('Fatima Zahra', 'fatima@test.com', 'Visa Procedures', '2025-12-28', '10:30', 'pending', 'Passeport Talent application'),
  ('Pierre Dubois', 'pierre@test.com', 'Real Estate Law', '2025-12-30', '16:00', 'confirmed', 'Property acquisition in Paris'),
  ('Amira Ben Salah', 'amira@test.com', 'Corporate Formalities', '2025-12-12', '13:00', 'cancelled', 'Completed via phone'),
  ('David Cohen', 'david@test.com', 'Compliance & Risk', '2026-01-05', '09:30', 'pending', 'GDPR compliance audit'),
  ('Leila Mansour', 'leila@test.com', 'Coaching & Training', '2026-01-10', '14:30', 'pending', 'Leadership development program');

-- =============================================
-- CONTACTS (Test Messages)
-- =============================================
INSERT INTO contacts (name, email, subject, message, status)
VALUES
  ('John Smith', 'john@test.com', 'General Inquiry',
   'Hello, I would like to know more about your visa services for entrepreneurs moving to France. What are the requirements?',
   'new'),

  ('Marie Claire', 'marie@test.com', 'Partnership',
   'Good afternoon, I represent a consulting firm in Belgium and I am interested in potential partnership opportunities with Sygma Consult.',
   'new'),

  ('Ali Ben Ahmed', 'ali@test.com', 'Careers',
   'Bonjour, I am a legal consultant with 5 years of experience looking for job opportunities at Sygma Consult. Could you please share information about open positions?',
   'read'),

  ('Sophie Laurent', 'sophie@test.com', 'General Inquiry',
   'I need assistance with company formation in Tunisia. What is the timeline and cost?',
   'new'),

  ('Omar Khalil', 'omar@test.com', 'General Inquiry',
   'Can you help with French tax optimization for my startup?',
   'read'),

  ('Isabella Romano', 'isabella@test.com', 'Partnership',
   'We are an Italian law firm interested in cross-border collaboration.',
   'replied');

-- =============================================
-- USER PROFILES (Test Users)
-- =============================================
INSERT INTO user_profiles (user_id, email, full_name, phone, company, country, language, preferences)
VALUES
  ('demo-user-id', 'demo@email.com', 'Demo User', '+33 6 12 34 56 78', 'Tech Solutions Corp', 'france', 'fr', '{"newsletter": true, "sms_reminders": true}'::jsonb),
  ('user-2', 'sarah@test.com', 'Sarah Martin', '+33 6 98 76 54 32', 'Martin & Associates', 'france', 'fr', '{}'::jsonb),
  ('user-3', 'ahmed@test.com', 'Ahmed Hassan', '+216 98 123 456', 'Hassan Consulting', 'tunisia', 'ar', '{}'::jsonb);

-- =============================================
-- NOTIFICATIONS (Test Notifications)
-- =============================================
INSERT INTO notifications (user_id, title, message, type, read, link)
VALUES
  ('demo-user-id', 'Booking Confirmed', 'Your consultation on December 20, 2025 at 10:00 AM has been confirmed.', 'booking', false, '/profile/bookings'),
  ('demo-user-id', 'Reminder: Upcoming Meeting', 'You have a consultation tomorrow at 10:00 AM with our strategic advisor.', 'reminder', false, '/profile/bookings'),
  ('demo-user-id', 'Document Analyzed', 'Your uploaded document "Contract_Final.pdf" has been successfully analyzed.', 'system', true, '/profile/documents'),
  ('demo-user-id', 'New Message from Admin', 'We have received your inquiry and will respond within 24 hours.', 'message', false, '/profile'),
  ('demo-user-id', 'Welcome to Sygma Consult', 'Thank you for creating your account. Explore our services and book your first consultation!', 'system', true, '/'),
  ('user-2', 'Booking Confirmed', 'Your consultation has been scheduled.', 'booking', false, '/profile/bookings'),
  ('user-3', 'Document Uploaded', 'Your visa application documents have been received.', 'system', true, '/profile/documents');

-- =============================================
-- DOCUMENTS (Test Documents - Metadata Only)
-- Note: Actual files need to be uploaded via the UI
-- =============================================
INSERT INTO documents (user_id, name, file_url, file_type, file_size, category, status, extracted_data)
VALUES
  ('demo-user-id', 'Business_Plan_2025.pdf', 'https://example.com/placeholder.pdf', 'application/pdf', 2457600, 'contract', 'analyzed',
   '{"company_name": "Tech Solutions Corp", "date": "2025-01-15", "amount": "€50,000"}'::jsonb),

  ('demo-user-id', 'Tax_Return_2024.pdf', 'https://example.com/placeholder.pdf', 'application/pdf', 1843200, 'invoice', 'analyzed',
   '{"fiscal_year": "2024", "revenue": "€250,000", "tax_paid": "€50,000"}'::jsonb),

  ('demo-user-id', 'Passport_Scan.jpg', 'https://example.com/placeholder.jpg', 'image/jpeg', 1024000, 'id', 'processing', null),

  ('user-2', 'Company_Statute.pdf', 'https://example.com/placeholder.pdf', 'application/pdf', 3145728, 'contract', 'analyzed',
   '{"company_type": "SARL", "capital": "€10,000"}'::jsonb);

-- =============================================
-- RECOMMENDATIONS (AI Recommendations)
-- =============================================
INSERT INTO recommendations (user_id, service_slug, reason, score, shown, clicked)
VALUES
  ('demo-user-id', 'financial-legal', 'Based on your recent company formation booking', 0.95, false, false),
  ('demo-user-id', 'compliance', 'Companies in your industry typically need compliance services', 0.87, true, false),
  ('demo-user-id', 'digital', 'You showed interest in digital transformation', 0.78, true, true),
  ('user-2', 'real-estate', 'Based on your location and profile', 0.82, true, false);

-- =============================================
-- ACTIVITY LOGS (Audit Trail)
-- =============================================
INSERT INTO activity_logs (user_id, action, entity_type, entity_id, metadata)
VALUES
  ('demo-user-id', 'profile.updated', 'user_profiles', (SELECT id FROM user_profiles WHERE user_id = 'demo-user-id'), '{"fields": ["phone", "company"]}'::jsonb),
  ('demo-user-id', 'document.uploaded', 'documents', (SELECT id FROM documents WHERE user_id = 'demo-user-id' LIMIT 1), '{"file_name": "Business_Plan_2025.pdf"}'::jsonb),
  ('demo-user-id', 'booking.created', 'bookings', (SELECT id FROM bookings WHERE email = 'demo@email.com' LIMIT 1), '{"date": "2025-12-20", "topic": "Strategic Consulting"}'::jsonb);

-- =============================================
-- ADMIN USERS (For Testing)
-- Replace 'YOUR_FIREBASE_USER_ID' with actual Firebase UID
-- =============================================
-- INSERT INTO admin_users (user_id, email, role, permissions)
-- VALUES
--   ('YOUR_FIREBASE_USER_ID', 'admin@sygma-consult.com', 'super_admin', '{"all": true}'::jsonb),
--   ('admin-2', 'moderator@sygma-consult.com', 'moderator', '{"bookings": true, "contacts": true}'::jsonb);

-- =============================================
-- VERIFICATION QUERIES
-- Run these to verify data was inserted correctly
-- =============================================

-- Check bookings
SELECT COUNT(*) as booking_count FROM bookings WHERE email LIKE '%@test.com';

-- Check contacts
SELECT COUNT(*) as contact_count FROM contacts WHERE email LIKE '%@test.com';

-- Check user profiles
SELECT COUNT(*) as profile_count FROM user_profiles WHERE user_id LIKE 'demo%' OR user_id LIKE 'user-%';

-- Check notifications
SELECT COUNT(*) as notification_count FROM notifications WHERE user_id = 'demo-user-id';

-- Check documents
SELECT COUNT(*) as document_count FROM documents WHERE user_id = 'demo-user-id';

-- =============================================
-- SUCCESS MESSAGE
-- =============================================
SELECT 'Test data inserted successfully! 🎉' as message;
SELECT 'Now go to http://localhost:3000/admin to test the dashboard' as next_step;
