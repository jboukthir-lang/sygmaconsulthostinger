-- =============================================
-- SEED CONTENT FOR SYGMA CONSULT
-- Run this script in your Supabase SQL Editor
-- =============================================
-- 1. HERO SECTION CONTENT
-- Delete existing hero content to avoid duplicates
DELETE FROM homepage_sections
WHERE section_name = 'hero';
INSERT INTO homepage_sections (
        section_name,
        title_en,
        title_fr,
        title_ar,
        subtitle_en,
        subtitle_fr,
        subtitle_ar,
        badge_en,
        badge_fr,
        badge_ar,
        cta_text_en,
        cta_text_fr,
        cta_text_ar,
        cta_url,
        cta_secondary_text_en,
        cta_secondary_text_fr,
        cta_secondary_text_ar,
        cta_secondary_url,
        content_en,
        content_fr,
        content_ar,
        -- JSONB fields for highlights
        is_active
    )
VALUES (
        'hero',
        'Your Strategic Partner in',
        'Votre Partenaire Stratégique à',
        'شريكك الاستراتيجي في',
        'Bridging the gap between European markets and North African opportunities. We provide expert guidance in legal, financial, and strategic development.',
        'Combler le fossé entre les marchés européens et les opportunités nord-africaines. Nous offrons une expertise juridique, financière et stratégique.',
        'جسر التواصل بين الأسواق الأوروبية وفرص شمال أفريقيا. نقدم توجيهاً خبيراً في التطوير القانوني والمالي والاستراتيجي.',
        'Global Expertise',
        'Expertise Mondiale',
        'خبرة عالمية',
        'Book Consultation',
        'Réserver une Consultation',
        'احجز استشارة',
        '/booking',
        'Our Services',
        'Nos Services',
        'خدماتنا',
        '/services',
        '{"highlight1": "Paris", "highlight2": "Tunis"}',
        '{"highlight1": "Paris", "highlight2": "Tunis"}',
        '{"highlight1": "باريس", "highlight2": "تونس"}',
        true
    );
-- 2. HERO IMAGE
-- Set a professional active hero image
UPDATE hero_images
SET is_active = false;
-- Deactivate all first
INSERT INTO hero_images (image_url, is_active)
VALUES (
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
        true
    );
-- 3. BLOG POSTS (INSIGHTS)
-- Insert 3 high-quality articles
INSERT INTO posts (
        slug,
        title_en,
        title_fr,
        title_ar,
        excerpt_en,
        excerpt_fr,
        excerpt_ar,
        content_en,
        content_fr,
        content_ar,
        featured_image,
        author_name,
        category,
        published,
        reading_time,
        views,
        published_at
    )
VALUES (
        'investing-in-tunisia-2025',
        'Why Tunisia is the Gateway to Africa in 2025',
        'Pourquoi la Tunisie est la porte de l''Afrique en 2025',
        'لماذا تونس هي بوابة أفريقيا في عام 2025',
        'An in-depth analysis of the new investment laws and why international companies are choosing Tunisia as their North African hub.',
        'Une analyse approfondie des nouvelles lois sur l''investissement et pourquoi les entreprises internationales choisissent la Tunisie comme hub nord-africain.',
        'تحليل متعمق لقوانين الاستثمار الجديدة ولماذا تختار الشركات الدولية تونس كمركز لها في شمال أفريقيا.',
        '<p>Tunisia is rapidly positioning itself as a strategic hub for international business, bridging Europe and Africa. With its proximity to the EU, skilled workforce, and competitive operational costs, it offers a unique value proposition.</p><h2>Key Advantages</h2><ul><li><strong>Strategic Location:</strong> Less than an hour flight from major European capitals.</li><li><strong>Skilled Talent:</strong> Tunisia produces over 65,000 graduates annually, with a strong focus on engineering and IT.</li><li><strong>Tax Incentives:</strong> The investment law provides significant tax breaks for export-oriented companies.</li></ul><p>At Sygma Consult, we help you navigate the legal landscape to establish your presence smoothly.</p>',
        '<p>La Tunisie se positionne rapidement comme un hub stratégique pour le commerce international, reliant l''Europe et l''Afrique. Avec sa proximité de l''UE, une main-d''œuvre qualifiée et des coûts opérationnels compétitifs, elle offre une proposition de valeur unique.</p><h2>Avantages Clés</h2><ul><li><strong>Emplacement Stratégique :</strong> À moins d''une heure de vol des grandes capitales européennes.</li><li><strong>Talents Qualifiés :</strong> La Tunisie produit plus de 65 000 diplômés par an, avec un fort accent sur l''ingénierie et l''IT.</li><li><strong>Incitations Fiscales :</strong> La loi sur l''investissement offre d''importants avantages fiscaux pour les entreprises orientées vers l''exportation.</li></ul><p>Chez Sygma Consult, nous vous aidons à naviguer dans le paysage juridique pour établir votre présence en douceur.</p>',
        '<p>تتمركز تونس بسرعة كمركز استراتيجي للأعمال الدولية، حيث تربط بين أوروبا وأفريقيا. بفضل قربها من الاتحاد الأوروبي، والقوى العاملة الماهرة، وتكاليف التشغيل التنافسية، فإنها تقدم قيمة فريدة.</p><h2>المزايا الرئيسية</h2><ul><li><strong>الموقع الاستراتيجي:</strong> أقل من ساعة طيران من العواصم الأوروبية الكبرى.</li><li><strong>المواهب الماهرة:</strong> تخرج تونس أكثر من 65000 خريج سنوياً، مع تركيز قوي على الهندسة وتكنولوجيا المعلومات.</li><li><strong>الحوافز الضريبية:</strong> يوفر قانون الاستثمار إعفاءات ضريبية كبيرة للشركات الموجهة للتصدير.</li></ul><p>في Sygma Consult، نساعدك على التنقل في المشهد القانوني لتأسيس وجودك بسلاسة.</p>',
        'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&q=80',
        'Sara Ben Ali',
        'Business',
        true,
        5,
        124,
        NOW()
    ),
    (
        'digital-transformation-trends',
        'Digital Transformation: A Necessity, Not a Luxury',
        'Transformation Digitale : Une Nécessité, Pas un Luxe',
        'التحول الرقمي: ضرورة وليست رفاهية',
        'How modern enterprises are leveraging AI and Cloud computing to reduce costs and improve customer experience.',
        'Comment les entreprises modernes exploitent l''IA et le Cloud pour réduire les coûts et améliorer l''expérience client.',
        'كيف تستفيد المؤسسات الحديثة من الذكاء الاصطناعي والحوسبة السحابية لخفض التكاليف وتحسين تجربة العملاء.',
        '<p>The digital landscape is evolving at a breakneck pace. Companies that fail to adapt risk becoming obsolete. Digital transformation is no longer just about adding technology; it''s about reimagining business processes.</p><h2>Trends to Watch</h2><ul><li><strong>AI Integration:</strong> Automating routine tasks to free up human creativity.</li><li><strong>Cloud Adoption:</strong> Moving from on-premise servers to flexible cloud solutions.</li><li><strong>Data Security:</strong> Protecting assets in an interconnected world.</li></ul>',
        '<p>Le paysage numérique évolue à une vitesse vertigineuse. Les entreprises qui ne s''adaptent pas risquent l''obsolescence. La transformation digitale ne consiste plus seulement à ajouter de la technologie ; il s''agit de réimaginer les processus d''affaires.</p><h2>Tendances à Surveiller</h2><ul><li><strong>Intégration de l''IA :</strong> Automatisation des tâches routinières pour libérer la créativité humaine.</li><li><strong>Adoption du Cloud :</strong> Passage des serveurs sur site vers des solutions cloud flexibles.</li><li><strong>Sécurité des Données :</strong> Protection des actifs dans un monde interconnecté.</li></ul>',
        '<p>المشهد الرقمي يتطور بسرعة مذهلة. الشركات التي تفشل في التكيف تخاطر بأن تصبح عفا عليها الزمن. التحول الرقمي لم يعد مجرد إضافة تكنولوجيا؛ إنه إعادة تصور لعمليات الأعمال.</p><h2>اتجاهات يجب مراقبتها</h2><ul><li><strong>دمج الذكاء الاصطناعي:</strong> أتمتة المهام الروتينية لتحرير الإبداع البشري.</li><li><strong>تبني السحابة:</strong> الانتقال من الخوادم المحلية إلى حلول سحابية مرنة.</li><li><strong>أمن البيانات:</strong> حماية الأصول في عالم مترابط.</li></ul>',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80',
        'James Wilson',
        'Technology',
        true,
        4,
        89,
        NOW() - INTERVAL '2 days'
    ),
    (
        'tax-compliance-france-tunisia',
        'Navigating Tax Compliance Between France and Tunisia',
        'Naviguer dans la Conformité Fiscale entre la France et la Tunisie',
        'التنقل في الامتثال الضريبي بين فرنسا وتونس',
        'Understanding the double taxation treaty and how to optimize your fiscal strategy across borders.',
        'Comprendre la convention de double imposition et comment optimiser votre stratégie fiscale transfrontalière.',
        'فهم معاهدة الازدواج الضريبي وكيفية تحسين استراتيجيتك المالية عبر الحدود.',
        '<p>Cross-border business brings immense opportunities but also complex tax challenges. The tax treaty between France and Tunisia is designed to prevent double taxation, but navigating it requires expertise.</p><h2>Key Considerations</h2><p>For companies operating in both jurisdictions, understanding "Permanent Establishment" rules is critical to determine where profits should be taxed.</p>',
        '<p>Les affaires transfrontalières apportent d''immenses opportunités mais aussi des défis fiscaux complexes. La convention fiscale entre la France et la Tunisie est conçue pour éviter la double imposition, mais la naviguer nécessite une expertise.</p><h2>Considérations Clés</h2><p>Pour les entreprises opérant dans les deux juridictions, comprendre les règles d''"Établissement Stable" est critique pour déterminer où les bénéfices doivent être imposés.</p>',
        '<p>الأعمال التجارية عبر الحدود تجلب فرصاً هائلة ولكن أيضاً تحديات ضريبية معقدة. تم تصميم المعاهدة الضريبية بين فرنسا وتونس لمنع الازدواج الضريبي، ولكن التنقل فيها يتطلب خبرة.</p><h2>اعتبارات رئيسية</h2><p>بالنسبة للشركات العاملة في كلا السلطتين القضائيتين، فإن فهم قواعد "المنشأة الدائمة" أمر بالغ الأهمية لتحديد أين يجب فرض الضرائب على الأرباح.</p>',
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80',
        'Amel Karoui',
        'Legal',
        true,
        7,
        210,
        NOW() - INTERVAL '5 days'
    );