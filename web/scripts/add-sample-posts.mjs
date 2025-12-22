import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
const envPath = join(__dirname, '..', '.env.local');
let supabaseUrl, supabaseServiceKey;

try {
  const envContent = readFileSync(envPath, 'utf-8');
  const envVars = {};
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });
  supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
  supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;
} catch (error) {
  console.error('Error reading .env.local file:', error.message);
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const samplePosts = [
  {
    title_en: 'Understanding Corporate Governance in France and Tunisia',
    title_fr: 'Comprendre la Gouvernance d\'Entreprise en France et en Tunisie',
    title_ar: 'فهم حوكمة الشركات في فرنسا وتونس',
    slug: 'corporate-governance-france-tunisia',
    excerpt_en: 'Explore the key principles of corporate governance and how they apply to businesses operating in France and Tunisia.',
    excerpt_fr: 'Découvrez les principes clés de la gouvernance d\'entreprise et comment ils s\'appliquent aux entreprises opérant en France et en Tunisie.',
    excerpt_ar: 'استكشف المبادئ الأساسية لحوكمة الشركات وكيفية تطبيقها على الشركات العاملة في فرنسا وتونس.',
    content_en: '<h2>Introduction to Corporate Governance</h2><p>Corporate governance refers to the system of rules, practices, and processes by which a company is directed and controlled. In today\'s global business environment, strong governance is essential for building investor confidence and ensuring sustainable growth.</p><h2>Key Principles</h2><ul><li><strong>Transparency:</strong> Clear communication with stakeholders about company operations and financial performance</li><li><strong>Accountability:</strong> Board members and executives must be accountable for their decisions</li><li><strong>Fairness:</strong> Equal treatment of all shareholders, including minority stakeholders</li><li><strong>Responsibility:</strong> Corporate responsibility towards employees, communities, and the environment</li></ul><h2>France vs Tunisia: Key Differences</h2><p>While both countries follow international standards, there are notable differences in implementation. French companies operate under strict EU regulations, while Tunisian companies are transitioning to more modern governance frameworks.</p><h2>Our Expertise</h2><p>At Sygma Consult, we help businesses navigate these complex frameworks with offices in both Paris and Tunis, providing tailored governance solutions.</p>',
    content_fr: '<h2>Introduction à la Gouvernance d\'Entreprise</h2><p>La gouvernance d\'entreprise fait référence au système de règles, de pratiques et de processus par lesquels une entreprise est dirigée et contrôlée. Dans l\'environnement commercial mondial d\'aujourd\'hui, une gouvernance solide est essentielle pour renforcer la confiance des investisseurs et assurer une croissance durable.</p><h2>Principes Clés</h2><ul><li><strong>Transparence:</strong> Communication claire avec les parties prenantes sur les opérations et la performance financière</li><li><strong>Responsabilité:</strong> Les membres du conseil et les dirigeants doivent être responsables de leurs décisions</li><li><strong>Équité:</strong> Traitement égal de tous les actionnaires, y compris les minoritaires</li><li><strong>Responsabilité sociale:</strong> Responsabilité envers les employés, les communautés et l\'environnement</li></ul><h2>France vs Tunisie: Différences Clés</h2><p>Bien que les deux pays suivent les normes internationales, il existe des différences notables dans la mise en œuvre. Les entreprises françaises opèrent sous des réglementations strictes de l\'UE, tandis que les entreprises tunisiennes adoptent des cadres de gouvernance plus modernes.</p><h2>Notre Expertise</h2><p>Chez Sygma Consult, nous aidons les entreprises à naviguer dans ces cadres complexes avec des bureaux à Paris et Tunis, en fournissant des solutions de gouvernance sur mesure.</p>',
    content_ar: '<h2>مقدمة عن حوكمة الشركات</h2><p>تشير حوكمة الشركات إلى نظام القواعد والممارسات والعمليات التي يتم من خلالها توجيه الشركة والسيطرة عليها. في بيئة الأعمال العالمية اليوم، تعتبر الحوكمة القوية ضرورية لبناء ثقة المستثمرين وضمان النمو المستدام.</p><h2>المبادئ الأساسية</h2><ul><li><strong>الشفافية:</strong> التواصل الواضح مع أصحاب المصلحة حول عمليات الشركة والأداء المالي</li><li><strong>المساءلة:</strong> يجب أن يكون أعضاء مجلس الإدارة والمديرون التنفيذيون مسؤولين عن قراراتهم</li><li><strong>العدالة:</strong> معاملة متساوية لجميع المساهمين، بما في ذلك أصحاب الأسهم الأقلية</li><li><strong>المسؤولية:</strong> المسؤولية تجاه الموظفين والمجتمعات والبيئة</li></ul><h2>فرنسا مقابل تونس: الاختلافات الرئيسية</h2><p>بينما يتبع كلا البلدين المعايير الدولية، هناك اختلافات ملحوظة في التنفيذ. تعمل الشركات الفرنسية بموجب لوائح الاتحاد الأوروبي الصارمة، بينما تنتقل الشركات التونسية إلى أطر حوكمة أكثر حداثة.</p><h2>خبرتنا</h2><p>في سيجما كونسلت، نساعد الشركات على التنقل في هذه الأطر المعقدة مع مكاتب في باريس وتونس، ونقدم حلول حوكمة مخصصة.</p>',
    author_name: 'Sygma Consult Team',
    category: 'Corporate Law',
    tags: ['corporate governance', 'business law', 'compliance', 'france', 'tunisia'],
    published: true,
    reading_time: 8,
    seo_title_en: 'Corporate Governance Guide: France & Tunisia | Sygma Consult',
    seo_title_fr: 'Guide de Gouvernance d\'Entreprise: France & Tunisie | Sygma Consult',
    seo_title_ar: 'دليل حوكمة الشركات: فرنسا وتونس | سيجما كونسلت',
    seo_description_en: 'Learn about corporate governance principles and practices in France and Tunisia. Expert legal guidance from Sygma Consult.',
    seo_description_fr: 'Découvrez les principes et pratiques de gouvernance d\'entreprise en France et en Tunisie. Conseils juridiques experts de Sygma Consult.',
    seo_description_ar: 'تعرف على مبادئ وممارسات حوكمة الشركات في فرنسا وتونس. إرشادات قانونية متخصصة من سيجما كونسلت.',
    seo_keywords: ['corporate governance', 'business law', 'france', 'tunisia', 'legal compliance', 'corporate structure'],
    published_at: new Date().toISOString(),
  },
  {
    title_en: '2025 Tax Planning Strategies for International Businesses',
    title_fr: 'Stratégies de Planification Fiscale 2025 pour les Entreprises Internationales',
    title_ar: 'استراتيجيات التخطيط الضريبي 2025 للشركات الدولية',
    slug: 'tax-planning-strategies-2025',
    excerpt_en: 'Discover effective tax planning strategies to optimize your international business operations in 2025.',
    excerpt_fr: 'Découvrez des stratégies efficaces de planification fiscale pour optimiser vos opérations commerciales internationales en 2025.',
    excerpt_ar: 'اكتشف استراتيجيات التخطيط الضريبي الفعالة لتحسين عمليات أعمالك الدولية في 2025.',
    content_en: '<h2>The Changing Tax Landscape</h2><p>As we enter 2025, the international tax environment continues to evolve rapidly. New regulations, digital taxation frameworks, and global cooperation initiatives are reshaping how multinational companies approach tax planning.</p><h2>Key Strategies for 2025</h2><h3>1. Transfer Pricing Optimization</h3><p>Ensure your transfer pricing policies comply with OECD guidelines while maximizing efficiency. Proper documentation is crucial to avoid penalties.</p><h3>2. Digital Services Tax (DST)</h3><p>Many jurisdictions now impose DST on digital services. Understanding where and how these taxes apply is essential for tech companies and e-commerce businesses.</p><h3>3. Tax Treaty Benefits</h3><p>Leverage bilateral tax treaties between France, Tunisia, and other countries to reduce withholding taxes and avoid double taxation.</p><h3>4. R&D Tax Credits</h3><p>Both France and Tunisia offer attractive R&D tax incentives. Proper structuring can significantly reduce your effective tax rate.</p><h2>Cross-Border Considerations</h2><p>Operating between France and Tunisia requires careful planning to ensure compliance with both jurisdictions while optimizing tax efficiency.</p><h2>How We Can Help</h2><p>Sygma Consult offers comprehensive tax planning services tailored to your international business needs. Contact us for a consultation.</p>',
    content_fr: '<h2>Le Paysage Fiscal en Évolution</h2><p>En entrant dans 2025, l\'environnement fiscal international continue d\'évoluer rapidement. De nouvelles réglementations, des cadres de taxation numérique et des initiatives de coopération mondiale redéfinissent la façon dont les entreprises multinationales abordent la planification fiscale.</p><h2>Stratégies Clés pour 2025</h2><h3>1. Optimisation des Prix de Transfert</h3><p>Assurez-vous que vos politiques de prix de transfert respectent les directives de l\'OCDE tout en maximisant l\'efficacité. Une documentation appropriée est cruciale pour éviter les pénalités.</p><h3>2. Taxe sur les Services Numériques (DST)</h3><p>De nombreuses juridictions imposent désormais la DST sur les services numériques. Comprendre où et comment ces taxes s\'appliquent est essentiel pour les entreprises technologiques et de commerce électronique.</p><h3>3. Avantages des Conventions Fiscales</h3><p>Tirez parti des conventions fiscales bilatérales entre la France, la Tunisie et d\'autres pays pour réduire les retenues à la source et éviter la double imposition.</p><h3>4. Crédits d\'Impôt R&D</h3><p>La France et la Tunisie offrent toutes deux des incitations fiscales attractives pour la R&D. Une structuration appropriée peut réduire considérablement votre taux d\'imposition effectif.</p><h2>Considérations Transfrontalières</h2><p>Opérer entre la France et la Tunisie nécessite une planification minutieuse pour garantir la conformité avec les deux juridictions tout en optimisant l\'efficacité fiscale.</p><h2>Comment Nous Pouvons Vous Aider</h2><p>Sygma Consult offre des services complets de planification fiscale adaptés à vos besoins commerciaux internationaux. Contactez-nous pour une consultation.</p>',
    content_ar: '<h2>المشهد الضريبي المتغير</h2><p>مع دخولنا عام 2025، تستمر البيئة الضريبية الدولية في التطور بسرعة. اللوائح الجديدة وأطر الضرائب الرقمية ومبادرات التعاون العالمي تعيد تشكيل كيفية تعامل الشركات متعددة الجنسيات مع التخطيط الضريبي.</p><h2>الاستراتيجيات الرئيسية لعام 2025</h2><h3>1. تحسين تسعير التحويل</h3><p>تأكد من أن سياسات تسعير التحويل الخاصة بك تتوافق مع إرشادات منظمة التعاون الاقتصادي والتنمية مع تعظيم الكفاءة. التوثيق المناسب أمر بالغ الأهمية لتجنب الغرامات.</p><h3>2. ضريبة الخدمات الرقمية</h3><p>تفرض العديد من الولايات القضائية الآن ضريبة على الخدمات الرقمية. فهم أين وكيف تنطبق هذه الضرائب أمر ضروري لشركات التكنولوجيا والتجارة الإلكترونية.</p><h3>3. مزايا المعاهدات الضريبية</h3><p>استفد من المعاهدات الضريبية الثنائية بين فرنسا وتونس ودول أخرى لتقليل ضرائب الاستقطاع وتجنب الازدواج الضريبي.</p><h3>4. الحوافز الضريبية للبحث والتطوير</h3><p>تقدم كل من فرنسا وتونس حوافز ضريبية جذابة للبحث والتطوير. الهيكلة المناسبة يمكن أن تقلل بشكل كبير من معدل الضريبة الفعلي الخاص بك.</p><h2>الاعتبارات عبر الحدود</h2><p>العمل بين فرنسا وتونس يتطلب تخطيطًا دقيقًا لضمان الامتثال لكلا الولايتين القضائيتين مع تحسين الكفاءة الضريبية.</p><h2>كيف يمكننا المساعدة</h2><p>تقدم سيجما كونسلت خدمات شاملة للتخطيط الضريبي مصممة خصيصًا لاحتياجات أعمالك الدولية. اتصل بنا للحصول على استشارة.</p>',
    author_name: 'Marie Dubois',
    category: 'Tax & Finance',
    tags: ['tax planning', 'international tax', 'business strategy', 'finance', '2025'],
    published: true,
    reading_time: 10,
    seo_title_en: 'Tax Planning Strategies 2025: International Business Guide',
    seo_title_fr: 'Stratégies de Planification Fiscale 2025: Guide des Entreprises Internationales',
    seo_title_ar: 'استراتيجيات التخطيط الضريبي 2025: دليل الأعمال الدولية',
    seo_description_en: 'Expert tax planning strategies for international businesses in 2025. Optimize your tax efficiency with Sygma Consult.',
    seo_description_fr: 'Stratégies expertes de planification fiscale pour les entreprises internationales en 2025. Optimisez votre efficacité fiscale avec Sygma Consult.',
    seo_description_ar: 'استراتيجيات التخطيط الضريبي المتخصصة للشركات الدولية في 2025. حسّن كفاءتك الضريبية مع سيجما كونسلت.',
    seo_keywords: ['tax planning', 'international tax', 'cross-border taxation', 'tax optimization', 'business tax'],
    published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title_en: 'Foreign Investment Opportunities in Tunisia: A Complete Guide',
    title_fr: 'Opportunités d\'Investissement Étranger en Tunisie: Un Guide Complet',
    title_ar: 'فرص الاستثمار الأجنبي في تونس: دليل شامل',
    slug: 'foreign-investment-tunisia-guide',
    excerpt_en: 'Tunisia offers attractive opportunities for foreign investors. Learn about the legal framework, incentives, and key sectors.',
    excerpt_fr: 'La Tunisie offre des opportunités attractives pour les investisseurs étrangers. Découvrez le cadre juridique, les incitations et les secteurs clés.',
    excerpt_ar: 'تقدم تونس فرصًا جذابة للمستثمرين الأجانب. تعرف على الإطار القانوني والحوافز والقطاعات الرئيسية.',
    content_en: '<h2>Why Invest in Tunisia?</h2><p>Tunisia stands as a strategic gateway between Europe and Africa, offering numerous advantages for foreign investors:</p><ul><li>Strategic geographic location</li><li>Competitive labor costs</li><li>Free trade agreements with EU, Arab countries, and Africa</li><li>Modern infrastructure</li><li>Skilled workforce</li></ul><h2>Legal Framework</h2><p>The Tunisian Investment Law (Law 2016-71) provides a comprehensive framework for foreign investment, offering equal treatment to foreign and domestic investors.</p><h2>Key Sectors</h2><h3>Manufacturing</h3><p>Tunisia has a strong manufacturing base, particularly in automotive, aerospace, and electronics sectors.</p><h3>Tourism & Real Estate</h3><p>The tourism sector offers significant opportunities, with government incentives for hotel development and infrastructure.</p><h3>Technology & Innovation</h3><p>Tunisia is emerging as a tech hub with a growing startup ecosystem and IT talent pool.</p><h3>Renewable Energy</h3><p>With ambitious renewable energy targets, Tunisia offers attractive opportunities in solar and wind power.</p><h2>Investment Incentives</h2><ul><li>Tax exemptions for certain sectors</li><li>Financial grants and subsidies</li><li>Free trade zones</li><li>Simplified administrative procedures</li></ul><h2>How We Assist Investors</h2><p>Sygma Consult provides end-to-end support for foreign investors, from initial feasibility studies to company registration and ongoing compliance. Our team in Tunis offers local expertise combined with international standards.</p>',
    content_fr: '<h2>Pourquoi Investir en Tunisie?</h2><p>La Tunisie se présente comme une passerelle stratégique entre l\'Europe et l\'Afrique, offrant de nombreux avantages pour les investisseurs étrangers:</p><ul><li>Situation géographique stratégique</li><li>Coûts de main-d\'œuvre compétitifs</li><li>Accords de libre-échange avec l\'UE, les pays arabes et l\'Afrique</li><li>Infrastructure moderne</li><li>Main-d\'œuvre qualifiée</li></ul><h2>Cadre Juridique</h2><p>La Loi tunisienne sur l\'investissement (Loi 2016-71) fournit un cadre complet pour l\'investissement étranger, offrant un traitement égal aux investisseurs étrangers et nationaux.</p><h2>Secteurs Clés</h2><h3>Fabrication</h3><p>La Tunisie dispose d\'une solide base de fabrication, en particulier dans les secteurs automobile, aérospatial et électronique.</p><h3>Tourisme & Immobilier</h3><p>Le secteur du tourisme offre des opportunités importantes, avec des incitations gouvernementales pour le développement hôtelier et les infrastructures.</p><h3>Technologie & Innovation</h3><p>La Tunisie émerge comme un hub technologique avec un écosystème de startups en croissance et un vivier de talents IT.</p><h3>Énergie Renouvelable</h3><p>Avec des objectifs ambitieux en matière d\'énergies renouvelables, la Tunisie offre des opportunités attractives dans l\'énergie solaire et éolienne.</p><h2>Incitations à l\'Investissement</h2><ul><li>Exonérations fiscales pour certains secteurs</li><li>Subventions et aides financières</li><li>Zones franches</li><li>Procédures administratives simplifiées</li></ul><h2>Comment Nous Aidons les Investisseurs</h2><p>Sygma Consult fournit un soutien complet aux investisseurs étrangers, des études de faisabilité initiales à l\'enregistrement de la société et à la conformité continue. Notre équipe à Tunis offre une expertise locale combinée à des normes internationales.</p>',
    content_ar: '<h2>لماذا الاستثمار في تونس؟</h2><p>تقف تونس كبوابة استراتيجية بين أوروبا وأفريقيا، وتقدم العديد من المزايا للمستثمرين الأجانب:</p><ul><li>موقع جغرافي استراتيجي</li><li>تكاليف عمالة تنافسية</li><li>اتفاقيات تجارة حرة مع الاتحاد الأوروبي والدول العربية وأفريقيا</li><li>بنية تحتية حديثة</li><li>قوى عاملة ماهرة</li></ul><h2>الإطار القانوني</h2><p>يوفر قانون الاستثمار التونسي (القانون 2016-71) إطارًا شاملاً للاستثمار الأجنبي، ويوفر معاملة متساوية للمستثمرين الأجانب والمحليين.</p><h2>القطاعات الرئيسية</h2><h3>التصنيع</h3><p>تمتلك تونس قاعدة تصنيع قوية، خاصة في قطاعات السيارات والفضاء الجوي والإلكترونيات.</p><h3>السياحة والعقارات</h3><p>يقدم قطاع السياحة فرصًا كبيرة، مع حوافز حكومية لتطوير الفنادق والبنية التحتية.</p><h3>التكنولوجيا والابتكار</h3><p>تظهر تونس كمركز تقني مع نظام بيئي متنامي للشركات الناشئة ومجموعة من المواهب في مجال تكنولوجيا المعلومات.</p><h3>الطاقة المتجددة</h3><p>مع أهداف طموحة للطاقة المتجددة، تقدم تونس فرصًا جذابة في الطاقة الشمسية وطاقة الرياح.</p><h2>حوافز الاستثمار</h2><ul><li>إعفاءات ضريبية لقطاعات معينة</li><li>منح وإعانات مالية</li><li>مناطق حرة</li><li>إجراءات إدارية مبسطة</li></ul><h2>كيف نساعد المستثمرين</h2><p>تقدم سيجما كونسلت دعمًا شاملاً للمستثمرين الأجانب، من دراسات الجدوى الأولية إلى تسجيل الشركة والامتثال المستمر. يقدم فريقنا في تونس خبرة محلية مع معايير دولية.</p>',
    author_name: 'Ahmed Ben Ali',
    category: 'Investment Law',
    tags: ['tunisia', 'foreign investment', 'business opportunities', 'legal framework', 'investment incentives'],
    published: true,
    reading_time: 12,
    seo_title_en: 'Foreign Investment in Tunisia 2025: Complete Guide',
    seo_title_fr: 'Investissement Étranger en Tunisie 2025: Guide Complet',
    seo_title_ar: 'الاستثمار الأجنبي في تونس 2025: دليل شامل',
    seo_description_en: 'Complete guide to foreign investment in Tunisia. Learn about opportunities, legal framework, and incentives.',
    seo_description_fr: 'Guide complet de l\'investissement étranger en Tunisie. Découvrez les opportunités, le cadre juridique et les incitations.',
    seo_description_ar: 'دليل شامل للاستثمار الأجنبي في تونس. تعرف على الفرص والإطار القانوني والحوافز.',
    seo_keywords: ['tunisia investment', 'foreign direct investment', 'business in tunisia', 'investment law', 'tunisia opportunities'],
    published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title_en: 'Legal Considerations for E-Commerce Businesses in Europe',
    title_fr: 'Considérations Juridiques pour les Entreprises de Commerce Électronique en Europe',
    title_ar: 'الاعتبارات القانونية لشركات التجارة الإلكترونية في أوروبا',
    slug: 'legal-ecommerce-europe',
    excerpt_en: 'Navigate the complex legal landscape of e-commerce in Europe with our comprehensive guide to compliance and best practices.',
    excerpt_fr: 'Naviguez dans le paysage juridique complexe du commerce électronique en Europe avec notre guide complet de conformité et de meilleures pratiques.',
    excerpt_ar: 'تنقل في المشهد القانوني المعقد للتجارة الإلكترونية في أوروبا مع دليلنا الشامل للامتثال وأفضل الممارسات.',
    content_en: '<h2>The E-Commerce Legal Framework</h2><p>Operating an e-commerce business in Europe requires compliance with multiple regulations spanning consumer protection, data privacy, and digital services.</p><h2>Key Regulations to Know</h2><h3>GDPR Compliance</h3><p>The General Data Protection Regulation is crucial for any business handling EU customer data. Key requirements include:</p><ul><li>Explicit consent for data collection</li><li>Right to access and deletion</li><li>Data breach notification</li><li>Privacy by design</li></ul><h3>Consumer Rights Directive</h3><p>EU consumers have strong protections including:</p><ul><li>14-day cooling-off period</li><li>Clear information requirements</li><li>Right to refund</li><li>Product liability</li></ul><h3>Digital Services Act (DSA)</h3><p>The new DSA imposes additional obligations on online platforms, particularly regarding content moderation and transparency.</p><h2>Cross-Border Selling</h2><p>Selling across EU borders requires understanding VAT rules, payment regulations, and country-specific requirements.</p><h2>Terms & Conditions</h2><p>Your website must include legally compliant terms and conditions covering payment, delivery, returns, and dispute resolution.</p><h2>Payment Processing</h2><p>PSD2 regulations govern payment services in the EU, requiring strong customer authentication and secure processing.</p><h2>Get Expert Legal Support</h2><p>Sygma Consult helps e-commerce businesses ensure full compliance with European regulations. Contact us for tailored legal solutions.</p>',
    content_fr: '<h2>Le Cadre Juridique du Commerce Électronique</h2><p>Exploiter une entreprise de commerce électronique en Europe nécessite le respect de multiples réglementations couvrant la protection des consommateurs, la confidentialité des données et les services numériques.</p><h2>Réglementations Clés à Connaître</h2><h3>Conformité RGPD</h3><p>Le Règlement Général sur la Protection des Données est crucial pour toute entreprise traitant des données de clients de l\'UE. Les exigences clés incluent:</p><ul><li>Consentement explicite pour la collecte de données</li><li>Droit d\'accès et de suppression</li><li>Notification de violation de données</li><li>Confidentialité dès la conception</li></ul><h3>Directive sur les Droits des Consommateurs</h3><p>Les consommateurs de l\'UE bénéficient de protections solides incluant:</p><ul><li>Période de réflexion de 14 jours</li><li>Exigences d\'information claires</li><li>Droit au remboursement</li><li>Responsabilité du produit</li></ul><h3>Loi sur les Services Numériques (DSA)</h3><p>La nouvelle DSA impose des obligations supplémentaires aux plateformes en ligne, notamment concernant la modération de contenu et la transparence.</p><h2>Vente Transfrontalière</h2><p>Vendre à travers les frontières de l\'UE nécessite de comprendre les règles de TVA, les réglementations de paiement et les exigences spécifiques à chaque pays.</p><h2>Conditions Générales</h2><p>Votre site web doit inclure des conditions générales conformes à la loi couvrant le paiement, la livraison, les retours et la résolution des litiges.</p><h2>Traitement des Paiements</h2><p>Les réglementations PSD2 régissent les services de paiement dans l\'UE, nécessitant une authentification forte du client et un traitement sécurisé.</p><h2>Obtenez un Support Juridique Expert</h2><p>Sygma Consult aide les entreprises de commerce électronique à assurer une conformité totale avec les réglementations européennes. Contactez-nous pour des solutions juridiques sur mesure.</p>',
    content_ar: '<h2>الإطار القانوني للتجارة الإلكترونية</h2><p>تشغيل أعمال التجارة الإلكترونية في أوروبا يتطلب الامتثال للعديد من اللوائح التي تغطي حماية المستهلك وخصوصية البيانات والخدمات الرقمية.</p><h2>اللوائح الرئيسية التي يجب معرفتها</h2><h3>الامتثال للائحة العامة لحماية البيانات</h3><p>اللائحة العامة لحماية البيانات أمر بالغ الأهمية لأي شركة تتعامل مع بيانات عملاء الاتحاد الأوروبي. المتطلبات الرئيسية تشمل:</p><ul><li>موافقة صريحة على جمع البيانات</li><li>الحق في الوصول والحذف</li><li>إشعار انتهاك البيانات</li><li>الخصوصية حسب التصميم</li></ul><h3>توجيه حقوق المستهلك</h3><p>يتمتع مستهلكو الاتحاد الأوروبي بحمايات قوية تشمل:</p><ul><li>فترة تهدئة لمدة 14 يومًا</li><li>متطلبات معلومات واضحة</li><li>الحق في استرداد الأموال</li><li>مسؤولية المنتج</li></ul><h3>قانون الخدمات الرقمية</h3><p>يفرض قانون الخدمات الرقمية الجديد التزامات إضافية على المنصات عبر الإنترنت، خاصة فيما يتعلق بإدارة المحتوى والشفافية.</p><h2>البيع عبر الحدود</h2><p>البيع عبر حدود الاتحاد الأوروبي يتطلب فهم قواعد ضريبة القيمة المضافة ولوائح الدفع والمتطلبات الخاصة بكل دولة.</p><h2>الشروط والأحكام</h2><p>يجب أن يتضمن موقعك الإلكتروني شروطًا وأحكامًا متوافقة قانونيًا تغطي الدفع والتسليم والإرجاع وحل النزاعات.</p><h2>معالجة الدفع</h2><p>تنظم لوائح PSD2 خدمات الدفع في الاتحاد الأوروبي، وتتطلب مصادقة قوية للعميل ومعالجة آمنة.</p><h2>احصل على دعم قانوني متخصص</h2><p>تساعد سيجما كونسلت شركات التجارة الإلكترونية على ضمان الامتثال الكامل للوائح الأوروبية. اتصل بنا للحصول على حلول قانونية مخصصة.</p>',
    author_name: 'Sophie Martin',
    category: 'Digital Business',
    tags: ['e-commerce', 'european law', 'gdpr', 'digital services', 'consumer rights'],
    published: true,
    reading_time: 9,
    seo_title_en: 'E-Commerce Legal Guide Europe 2025 | Compliance & Best Practices',
    seo_title_fr: 'Guide Juridique E-Commerce Europe 2025 | Conformité & Meilleures Pratiques',
    seo_title_ar: 'دليل قانوني للتجارة الإلكترونية أوروبا 2025 | الامتثال وأفضل الممارسات',
    seo_description_en: 'Comprehensive legal guide for e-commerce businesses in Europe. GDPR, consumer rights, and compliance made simple.',
    seo_description_fr: 'Guide juridique complet pour les entreprises de commerce électronique en Europe. RGPD, droits des consommateurs et conformité simplifiés.',
    seo_description_ar: 'دليل قانوني شامل لشركات التجارة الإلكترونية في أوروبا. اللائحة العامة لحماية البيانات وحقوق المستهلك والامتثال المبسط.',
    seo_keywords: ['e-commerce law', 'gdpr compliance', 'european business', 'digital services act', 'consumer protection'],
    published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

async function addSamplePosts() {
  console.log('🚀 Starting to add sample posts...\n');

  for (const post of samplePosts) {
    try {
      console.log(`📝 Adding: ${post.title_en}...`);

      // Check if post already exists
      const { data: existing } = await supabase
        .from('posts')
        .select('id')
        .eq('slug', post.slug)
        .single();

      if (existing) {
        console.log(`⏭️  Post "${post.slug}" already exists. Skipping...\n`);
        continue;
      }

      const { data, error } = await supabase
        .from('posts')
        .insert([post])
        .select();

      if (error) {
        console.error(`❌ Error adding post "${post.slug}":`, error.message);
      } else {
        console.log(`✅ Successfully added post: ${post.title_en}`);
        console.log(`   Slug: ${post.slug}`);
        console.log(`   Category: ${post.category}\n`);
      }
    } catch (error) {
      console.error(`❌ Unexpected error adding post "${post.slug}":`, error);
    }
  }

  // Get final count
  const { count } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true });

  console.log(`\n✨ Done! Total posts in database: ${count}`);
}

addSamplePosts();
