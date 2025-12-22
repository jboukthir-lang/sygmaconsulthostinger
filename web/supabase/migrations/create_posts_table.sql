-- Create posts table for blog/insights functionality
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title_en TEXT NOT NULL,
    title_fr TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt_en TEXT NOT NULL,
    excerpt_fr TEXT NOT NULL,
    excerpt_ar TEXT NOT NULL,
    content_en TEXT NOT NULL,
    content_fr TEXT NOT NULL,
    content_ar TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id),
    author_name TEXT NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    featured_image TEXT,
    published BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0,
    reading_time INTEGER DEFAULT 5,
    seo_title_en TEXT,
    seo_title_fr TEXT,
    seo_title_ar TEXT,
    seo_description_en TEXT,
    seo_description_fr TEXT,
    seo_description_ar TEXT,
    seo_keywords TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE
);

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);

-- Create index on published and published_at for listing published posts
CREATE INDEX IF NOT EXISTS idx_posts_published ON public.posts(published, published_at DESC);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category);

-- Create index on author_id
CREATE INDEX IF NOT EXISTS idx_posts_author ON public.posts(author_id);

-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read published posts
CREATE POLICY "Enable read access for published posts"
ON public.posts FOR SELECT
TO public
USING (published = true);

-- Policy: Authenticated users can read all posts (for admin)
CREATE POLICY "Enable read access for authenticated users"
ON public.posts FOR SELECT
TO authenticated
USING (true);

-- Policy: Authenticated users can insert posts
CREATE POLICY "Enable insert for authenticated users"
ON public.posts FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Authenticated users can update posts
CREATE POLICY "Enable update for authenticated users"
ON public.posts FOR UPDATE
TO authenticated
USING (true);

-- Policy: Authenticated users can delete posts
CREATE POLICY "Enable delete for authenticated users"
ON public.posts FOR DELETE
TO authenticated
USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample post for testing
INSERT INTO public.posts (
    title_en, title_fr, title_ar,
    slug,
    excerpt_en, excerpt_fr, excerpt_ar,
    content_en, content_fr, content_ar,
    author_name,
    category,
    tags,
    published,
    seo_title_en, seo_title_fr, seo_title_ar,
    seo_description_en, seo_description_fr, seo_description_ar,
    seo_keywords,
    published_at
) VALUES (
    'Digital Transformation: A Strategic Imperative for Modern Businesses',
    'Transformation Numérique : Un Impératif Stratégique pour les Entreprises Modernes',
    'التحول الرقمي: ضرورة استراتيجية للشركات الحديثة',
    'digital-transformation-strategic-imperative',
    'Discover how digital transformation is reshaping the business landscape and why companies must adapt to stay competitive in today''s fast-paced market.',
    'Découvrez comment la transformation numérique remodèle le paysage commercial et pourquoi les entreprises doivent s''adapter pour rester compétitives sur le marché actuel en évolution rapide.',
    'اكتشف كيف يعيد التحول الرقمي تشكيل مشهد الأعمال ولماذا يجب على الشركات التكيف للبقاء تنافسية في سوق اليوم سريع التطور.',
    '<h2>The Digital Revolution is Here</h2><p>In today''s rapidly evolving business environment, digital transformation has emerged as a critical success factor. Organizations that embrace digital technologies and reimagine their processes are gaining significant competitive advantages.</p><h2>Key Benefits of Digital Transformation</h2><ul><li>Enhanced operational efficiency through automation</li><li>Improved customer experience with personalized services</li><li>Data-driven decision making with advanced analytics</li><li>Increased agility and faster time to market</li></ul><h2>Getting Started</h2><p>At Sygma Consult, we help businesses navigate their digital transformation journey with tailored strategies and expert guidance. Contact us to learn how we can accelerate your digital evolution.</p>',
    '<h2>La Révolution Numérique est Là</h2><p>Dans l''environnement commercial en évolution rapide d''aujourd''hui, la transformation numérique est devenue un facteur de succès critique. Les organisations qui adoptent les technologies numériques et réinventent leurs processus gagnent des avantages concurrentiels significatifs.</p><h2>Principaux Avantages de la Transformation Numérique</h2><ul><li>Efficacité opérationnelle améliorée grâce à l''automatisation</li><li>Expérience client améliorée avec des services personnalisés</li><li>Prise de décision basée sur les données avec analyses avancées</li><li>Agilité accrue et délai de mise sur le marché plus rapide</li></ul><h2>Pour Commencer</h2><p>Chez Sygma Consult, nous aidons les entreprises à naviguer dans leur parcours de transformation numérique avec des stratégies sur mesure et des conseils d''experts. Contactez-nous pour découvrir comment nous pouvons accélérer votre évolution numérique.</p>',
    '<h2>الثورة الرقمية هنا</h2><p>في بيئة الأعمال سريعة التطور اليوم، أصبح التحول الرقمي عامل نجاح حاسم. المنظمات التي تتبنى التقنيات الرقمية وتعيد تصور عملياتها تكتسب مزايا تنافسية كبيرة.</p><h2>الفوائد الرئيسية للتحول الرقمي</h2><ul><li>كفاءة تشغيلية محسّنة من خلال الأتمتة</li><li>تجربة عميل محسّنة مع خدمات مخصصة</li><li>اتخاذ قرارات مبنية على البيانات مع تحليلات متقدمة</li><li>مرونة متزايدة ووقت أسرع للوصول إلى السوق</li></ul><h2>البدء</h2><p>في سيجما كونسلت، نساعد الشركات على التنقل في رحلة التحول الرقمي الخاصة بهم باستراتيجيات مخصصة وتوجيهات خبراء. اتصل بنا لمعرفة كيف يمكننا تسريع تطورك الرقمي.</p>',
    'Sygma Consult Team',
    'Digital Transformation',
    ARRAY['digital', 'transformation', 'business', 'technology', 'strategy'],
    true,
    'Digital Transformation Guide 2025 | Sygma Consult',
    'Guide de la Transformation Numérique 2025 | Sygma Consult',
    'دليل التحول الرقمي 2025 | سيجما كونسلت',
    'Complete guide to digital transformation for businesses. Learn strategies, benefits, and implementation steps from expert consultants.',
    'Guide complet de la transformation numérique pour les entreprises. Découvrez les stratégies, avantages et étapes de mise en œuvre par des consultants experts.',
    'دليل شامل للتحول الرقمي للشركات. تعلم الاستراتيجيات والفوائد وخطوات التنفيذ من الاستشاريين الخبراء.',
    ARRAY['digital transformation', 'business technology', 'digital strategy', 'innovation', 'automation', 'AI'],
    TIMEZONE('utc'::text, NOW())
);

COMMENT ON TABLE public.posts IS 'Blog posts and insights with multilingual support and SEO optimization';
