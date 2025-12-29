-- 1. Add new columns for Subtitles and Features (arrays of strings)
ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS subtitle_en TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS subtitle_fr TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS subtitle_ar TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS features_en TEXT [] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS features_fr TEXT [] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS features_ar TEXT [] DEFAULT '{}';
-- 2. Seed Data (Migrating from hardcoded file to DB)
-- Visa Procedures
UPDATE public.services
SET subtitle_en = 'Facilitating Your Mobility',
    subtitle_fr = 'Faciliter Votre Mobilité',
    subtitle_ar = 'تسهيل تنقلك',
    features_en = ARRAY ['Professional Visas (Talent Passport)', 'Personal & Family Visas', 'Application Review & Submission', 'Residency Permit Renewals'],
    features_fr = ARRAY ['Visas Professionnels (Passeport Talent)', 'Visas Personnels & Familiaux', 'Revue & Soumission de Dossier', 'Renouvellement de Titre de Séjour'],
    features_ar = ARRAY ['التأشيرات المهنية (جواز الموهبة)', 'التأشيرات الشخصية والعائلية', 'مراجعة وتقديم الطلبات', 'تجديد تصاريح الإقامة']
WHERE href LIKE '%/visa%';
-- Corporate
UPDATE public.services
SET subtitle_en = 'Administrative & Legal Management',
    subtitle_fr = 'Gestion Administrative & Juridique',
    subtitle_ar = 'الإدارة الإدارية والقانونية',
    features_en = ARRAY ['Company Incorporation', 'Statute Modification', 'Legal Secretariat', 'Liquidation & Dissolution'],
    features_fr = ARRAY ['Création de Société (SAS, SARL...)', 'Modification des Statuts', 'Secrétariat Juridique', 'Liquidation & Dissolution'],
    features_ar = ARRAY ['تأسيس الشركات', 'تعديل النظام الأساسي', 'السكرتارية القانونية', 'التصفية والحل']
WHERE href LIKE '%/corporate%';
-- Strategic (Market Development)
UPDATE public.services
SET subtitle_en = 'Penetrate New Markets with Confidence',
    subtitle_fr = 'Pénétrez de Nouveaux Marchés avec Confiance',
    subtitle_ar = 'ادخل أسواقاً جديدة بثقة',
    features_en = ARRAY ['Market Entry Strategy', 'Competitive Analysis', 'Growth Modeling', 'Partnership Development'],
    features_fr = ARRAY ['Stratégie d''entrée sur le marché', 'Analyse concurrentielle', 'Modélisation de la croissance', 'Développement de partenariats'],
    features_ar = ARRAY ['استراتيجية دخول السوق', 'تحليل المنافسين', 'نمذجة النمو', 'تطوير الشراكات']
WHERE href LIKE '%/strategic%';
-- Financial & Legal (Business & Tax)
UPDATE public.services
SET subtitle_en = 'Optimization and Compliance',
    subtitle_fr = 'Optimisation et Conformité',
    subtitle_ar = 'التحسين والامتثال',
    features_en = ARRAY ['Tax Optimization', 'Labor Law Compliance', 'Corporate Restructuring', 'Contractual Audits'],
    features_fr = ARRAY ['Optimisation Fiscale', 'Conformité Droit du Travail', 'Restructuration d''Entreprise', 'Audits Contractuels'],
    features_ar = ARRAY ['التحسين الضريبي', 'الامتثال لقانون العمل', 'إعادة هيكلة الشركات', 'التدقيق التعاقدي']
WHERE href LIKE '%/financial-legal%';
-- HR & Training
UPDATE public.services
SET subtitle_en = 'Developing Human Capital',
    subtitle_fr = 'Développer le Capital Humain',
    subtitle_ar = 'تطوير رأس المال البشري',
    features_en = ARRAY ['Executive Coaching', 'Team Leadership Workshops', 'Soft Skills Training', 'Career Development'],
    features_fr = ARRAY ['Coaching Exécutif', 'Ateliers de Leadership', 'Soft Skills', 'Développement de Carrière'],
    features_ar = ARRAY ['التوجيه التنفيذي', 'ورش عمل القيادة', 'المهارات الشخصية', 'التطوير الوظيفي']
WHERE href LIKE '%/hr-training%';
-- Compliance
UPDATE public.services
SET subtitle_en = 'Navigating Regulations',
    subtitle_fr = 'Naviguer dans les Réglementations',
    subtitle_ar = 'التنقل في اللوائح',
    features_en = ARRAY ['Regulatory Audits', 'Risk Management', 'Policy Development', 'Training for Compliance'],
    features_fr = ARRAY ['Audits Réglementaires', 'Gestion des Risques', 'Développement de Politiques', 'Formation à la Conformité'],
    features_ar = ARRAY ['التدقيق التنظيمي', 'إدارة المخاطر', 'تطوير السياسات', 'التدريب على الامتثال']
WHERE href LIKE '%/compliance%';
-- 3. Update Policies to ensure these new columns are writable (existing policy covers whole table, so we are good, but good to double check)
-- No changes needed if policy is "FOR ALL TO anon USING (true)"