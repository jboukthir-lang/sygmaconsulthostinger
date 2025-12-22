-- Insert default data for homepage_sections table
-- This SQL file adds default content for Hero and About sections in all three languages (EN, FR, AR)

-- Insert Hero Section Data
INSERT INTO public.homepage_sections (
    section_name,
    title_en, title_fr, title_ar,
    subtitle_en, subtitle_fr, subtitle_ar,
    badge_en, badge_fr, badge_ar,
    cta_text_en, cta_text_fr, cta_text_ar,
    cta_url,
    cta_secondary_text_en, cta_secondary_text_fr, cta_secondary_text_ar,
    cta_secondary_url,
    content_en, content_fr, content_ar
) VALUES (
    'hero',
    -- Titles
    'Your Business Growth Partner between',
    'Votre Partenaire de Croissance entre',
    'شريككم في النمو بين',
    -- Subtitles
    'Expert consulting services to help your business thrive across European and African markets. Strategic guidance, digital transformation, and sustainable growth solutions.',
    'Services de conseil experts pour aider votre entreprise à prospérer sur les marchés européens et africains. Guidance stratégique, transformation digitale et solutions de croissance durable.',
    'خدمات استشارية متخصصة لمساعدة أعمالكم على النمو في الأسواق الأوروبية والأفريقية. إرشاد استراتيجي، تحول رقمي وحلول نمو مستدام.',
    -- Badges
    '🌟 Premium Consulting',
    '🌟 Conseil Premium',
    '🌟 استشارات متميزة',
    -- Primary CTA
    'Book Consultation',
    'Réserver une Consultation',
    'احجز استشارة',
    '/book',
    -- Secondary CTA
    'Our Services',
    'Nos Services',
    'خدماتنا',
    '/services',
    -- Content (JSON)
    '{"highlight1": "Paris", "highlight2": "Tunis"}'::jsonb,
    '{"highlight1": "Paris", "highlight2": "Tunis"}'::jsonb,
    '{"highlight1": "باريس", "highlight2": "تونس"}'::jsonb
) ON CONFLICT (section_name) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_fr = EXCLUDED.title_fr,
    title_ar = EXCLUDED.title_ar,
    subtitle_en = EXCLUDED.subtitle_en,
    subtitle_fr = EXCLUDED.subtitle_fr,
    subtitle_ar = EXCLUDED.subtitle_ar,
    badge_en = EXCLUDED.badge_en,
    badge_fr = EXCLUDED.badge_fr,
    badge_ar = EXCLUDED.badge_ar,
    cta_text_en = EXCLUDED.cta_text_en,
    cta_text_fr = EXCLUDED.cta_text_fr,
    cta_text_ar = EXCLUDED.cta_text_ar,
    cta_url = EXCLUDED.cta_url,
    cta_secondary_text_en = EXCLUDED.cta_secondary_text_en,
    cta_secondary_text_fr = EXCLUDED.cta_secondary_text_fr,
    cta_secondary_text_ar = EXCLUDED.cta_secondary_text_ar,
    cta_secondary_url = EXCLUDED.cta_secondary_url,
    content_en = EXCLUDED.content_en,
    content_fr = EXCLUDED.content_fr,
    content_ar = EXCLUDED.content_ar;

-- Insert About Section Data
INSERT INTO public.homepage_sections (
    section_name,
    title_en, title_fr, title_ar,
    description_en, description_fr, description_ar,
    cta_text_en, cta_text_fr, cta_text_ar,
    cta_url,
    content_en, content_fr, content_ar
) VALUES (
    'about',
    -- Titles
    'Connecting Business Success across',
    'Connecter le Succès Commercial entre',
    'ربط نجاح الأعمال عبر',
    -- Descriptions
    'SYGMA CONSULT bridges the gap between European and African markets, offering strategic consulting services that drive sustainable growth. Our expertise spans digital transformation, market entry strategies, and cross-cultural business development.',
    'SYGMA CONSULT comble le fossé entre les marchés européens et africains, offrant des services de conseil stratégique qui favorisent une croissance durable. Notre expertise couvre la transformation numérique, les stratégies d''entrée sur le marché et le développement commercial interculturel.',
    'تربط SYGMA CONSULT بين الأسواق الأوروبية والأفريقية، وتقدم خدمات استشارية استراتيجية تدفع النمو المستدام. تمتد خبرتنا من التحول الرقمي إلى استراتيجيات دخول السوق وتطوير الأعمال عبر الثقافات.',
    -- CTA
    'Learn More',
    'En Savoir Plus',
    'اعرف المزيد',
    '/about',
    -- Content (JSON with highlights, points, locations, map caption)
    jsonb_build_object(
        'highlight1', 'Europe',
        'highlight2', 'Africa',
        'location1', 'Paris',
        'location2', 'Tunis',
        'map_caption', 'Two strategic offices connecting continents',
        'points', ARRAY[
            'Strategic Market Analysis',
            'Digital Transformation Solutions',
            'Cross-Border Business Development',
            'Regulatory & Compliance Support'
        ]
    ),
    jsonb_build_object(
        'highlight1', 'Europe',
        'highlight2', 'Afrique',
        'location1', 'Paris',
        'location2', 'Tunis',
        'map_caption', 'Deux bureaux stratégiques reliant les continents',
        'points', ARRAY[
            'Analyse Stratégique du Marché',
            'Solutions de Transformation Digitale',
            'Développement Commercial Transfrontalier',
            'Support Réglementaire et Conformité'
        ]
    ),
    jsonb_build_object(
        'highlight1', 'أوروبا',
        'highlight2', 'أفريقيا',
        'location1', 'باريس',
        'location2', 'تونس',
        'map_caption', 'مكتبان استراتيجيان يربطان القارات',
        'points', ARRAY[
            'تحليل السوق الاستراتيجي',
            'حلول التحول الرقمي',
            'تطوير الأعمال عبر الحدود',
            'الدعم التنظيمي والامتثال'
        ]
    )
) ON CONFLICT (section_name) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_fr = EXCLUDED.title_fr,
    title_ar = EXCLUDED.title_ar,
    description_en = EXCLUDED.description_en,
    description_fr = EXCLUDED.description_fr,
    description_ar = EXCLUDED.description_ar,
    cta_text_en = EXCLUDED.cta_text_en,
    cta_text_fr = EXCLUDED.cta_text_fr,
    cta_text_ar = EXCLUDED.cta_text_ar,
    cta_url = EXCLUDED.cta_url,
    content_en = EXCLUDED.content_en,
    content_fr = EXCLUDED.content_fr,
    content_ar = EXCLUDED.content_ar;

-- Verify the data was inserted
SELECT section_name, title_en, title_fr, title_ar FROM public.homepage_sections;
