

// Mock Data for Services
const servicesData: Record<string, { title: string; subtitle: string; description: string; features: string[] }> = {
    "strategic": {
        title: "Market Development",
        subtitle: "Penetrate New Markets with Confidence",
        description: "Our 'Développement et Pénétration de Marché' service provides ambitious growth strategies for businesses looking to expand into France or North Africa. We analyze market dynamics, identify key opportunities, and create a roadmap for sustainable success.",
        features: ["Market Entry Strategy", "Competitive Analysis", "Growth Modeling", "Partnership Development"]
    },
    "financial-legal": {
        title: "Business & Tax",
        subtitle: "Affaires et Fiscalité",
        description: "We provide comprehensive support for M&A, tax compliance, and corporate restructuring. Our experts ensure your financial and tax strategies are optimized for both French and Tunisian jurisdictions.",
        features: ["Tax Optimization", "Labor Law Compliance", "Corporate Restructuring", "Contractual Audits"]
    },
    "visa": {
        title: "Visa Procedures",
        subtitle: "Facilitating Your Mobility",
        description: "We facilitate all procedures for obtaining visas, whether for professional or personal purposes. From document preparation to submission to competent authorities, we provide full accompaniment to ensure a smooth process.",
        features: ["Professional Visas (Passeport Talent)", "Personal & Family Visas", "Application Review & Submission", "Residency Permit Renewals"]
    },
    "corporate": {
        title: "Company Formalities",
        subtitle: "Administrative & Legal Management",
        description: "We manage the administrative and legal aspects of your company lifecycle. Whether you are incorporating a new entity, modifying statutes, or undergoing dissolution, we ensure full compliance with all administrative obligations.",
        features: ["Company Incorporation (SAS, SARL, SUARL)", "Statute Modification", "Legal Secretariat", "Liquidation & Dissolution"]
    },
    "hr-training": {
        title: "Coaching & Training",
        subtitle: "Developing Human Capital",
        description: "Dedicated to human resources development for individuals and companies. Our programs focus on skill enhancement, leadership coaching, and achieving professional goals.",
        features: ["Executive Coaching", "Team Leadership Workshops", "Soft Skills Training", "Career Development"]
    },
    "compliance": {
        title: "Compliance & Risk",
        subtitle: "Protecting Your Assets",
        description: "In an ever-changing regulatory environment, compliance is not optional. We help you build resilient systems that withstand scrutiny and protect your reputation.",
        features: ["GDPR Compliance", "Anti-Money Laundering (AML)", "Internal Audits", "Data Security Protocols"]
    },
    "digital": {
        title: "Digital Transformation",
        subtitle: "Future-Proofing Your Business",
        description: "Leverage the power of AI and modern technology. We guide you through the digital transition, ensuring your business stays competitive in the digital age.",
        features: ["AI Integration Strategy", "Cloud Migration", "Process Automation", "Digital Customer Experience"]
    },
    "real-estate": {
        title: "Real Estate Law",
        subtitle: "Droit Immobilier",
        description: "Comprehensive legal accompaniment for real estate transactions (buying/selling) and construction projects. We ensure your assets are protected and your projects proceed smoothly.",
        features: ["Property Acquisition Support", "Construction Contracts", "Lease Agreements", "Real Estate Litigation"]
    }
};

export function generateStaticParams() {
    return Object.keys(servicesData).map((slug) => ({ slug }));
}

import ServiceDetailView from "./ServiceDetailView";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const service = servicesData[slug];

    if (!service) {
        return {
            title: 'Service Not Found',
        }
    }

    return {
        title: `${service.title} | Sygma Consult`,
        description: service.description,
    }
}

export default async function ServicePage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    // We pass the slug to the Client Component which will handle looking up the translation
    return <ServiceDetailView slug={slug} />;
}
