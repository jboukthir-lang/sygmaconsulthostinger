-- Insert default values for homepage content
UPDATE app_config
SET badge_en = 'Your Strategic Partner',
    badge_fr = 'Votre Partenaire Stratégique',
    badge_ar = 'شريكك الاستراتيجي',
    title_en = 'Strategic Consulting Between Paris & Tunis',
    title_fr = 'Conseil Stratégique Entre Paris & Tunis',
    title_ar = 'استشارات استراتيجية بين باريس وتونس',
    subtitle_en = 'Expert guidance for your business growth across France and Tunisia. We transform challenges into opportunities with tailored strategies.',
    subtitle_fr = 'Accompagnement expert pour la croissance de votre entreprise entre la France et la Tunisie. Nous transformons les défis en opportunités avec des stratégies sur mesure.',
    subtitle_ar = 'إرشادات خبيرة لنمو أعمالك عبر فرنسا وتونس. نحول التحديات إلى فرص باستراتيجيات مخصصة.',
    cta_text_en = 'Book Consultation',
    cta_text_fr = 'Réserver une Consultation',
    cta_text_ar = 'احجز استشارة',
    cta_url = '/book',
    cta_secondary_text_en = 'Our Services',
    cta_secondary_text_fr = 'Nos Services',
    cta_secondary_text_ar = 'خدماتنا',
    cta_secondary_url = '/services',
    hero_type = 'globe',
    hero_media_url = ''
WHERE key = 'main';
-- If no row exists, insert it
INSERT INTO app_config (
        key,
        badge_en,
        badge_fr,
        badge_ar,
        title_en,
        title_fr,
        title_ar,
        subtitle_en,
        subtitle_fr,
        subtitle_ar,
        cta_text_en,
        cta_text_fr,
        cta_text_ar,
        cta_url,
        cta_secondary_text_en,
        cta_secondary_text_fr,
        cta_secondary_text_ar,
        cta_secondary_url,
        hero_type
    )
SELECT 'main',
    'Your Strategic Partner',
    'Votre Partenaire Stratégique',
    'شريكك الاستراتيجي',
    'Strategic Consulting Between Paris & Tunis',
    'Conseil Stratégique Entre Paris & Tunis',
    'استشارات استراتيجية بين باريس وتونس',
    'Expert guidance for your business growth across France and Tunisia.',
    'Accompagnement expert pour la croissance de votre entreprise entre la France et la Tunisie.',
    'إرشادات خبيرة لنمو أعمالك عبر فرنسا وتونس.',
    'Book Consultation',
    'Réserver une Consultation',
    'احجز استشارة',
    '/book',
    'Our Services',
    'Nos Services',
    'خدماتنا',
    '/services',
    'globe'
WHERE NOT EXISTS (
        SELECT 1
        FROM app_config
        WHERE key = 'main'
    );