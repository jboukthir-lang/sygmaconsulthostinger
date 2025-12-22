'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'fr' | 'ar';

type Translations = {
    nav: {
        home: string;
        services: string;
        about: string;
        insights: string;
        contact: string;
        book: string;
        signIn: string;
        signOut: string;
    };
    hero: {
        badge: string;
        title_start: string;
        paris: string;
        tunis: string;
        subtitle: string;
        cta_book: string;
        cta_services: string;
    };
    about: {
        title_start: string;
        europe: string;
        africa: string;
        description: string;
        points: string[];
        cta_more: string;
        paris: string;
        tunis: string;
        map_caption: string;
    };
    services: {
        title: string;
        subtitle: string;
        items: {
            strategic: { title: string; desc: string };
            financial: { title: string; desc: string };
            hr: { title: string; desc: string };
            compliance: { title: string; desc: string };
            digital: { title: string; desc: string };
            realestate: { title: string; desc: string };
            visa: { title: string; desc: string };
            corporate: { title: string; desc: string };
        };
    };
    contact: {
        title: string;
        address_paris: string;
        address_tunis: string;
        phone: string;
        email: string;
        form: {
            title: string;
            name: string;
            email: string;
            subject: string;
            message: string;
            submit: string;
            sending: string;
            success_title: string;
            success_desc: string;
            send_another: string;
            subjects: { general: string; partnership: string; careers: string };
        };
    };
    insights: {
        title: string;
        subtitle: string;
        read_more: string;
        all_posts: string;
        no_posts: string;
        min_read: string;
        articles: { category: string; title: string; summary: string; date: string }[];
    };
    booking: {
        page_title: string; // NEW
        page_subtitle: string; // NEW
        sidebar: {
            title: string; subtitle: string; date_placeholder: string; time_placeholder: string; timezone: string;
            online: string; onsite: string;
        };
        step1: { title: string; month: string; next: string; days: string[] };
        step2: {
            title: string; name: string; email: string; topic: string; back: string; confirm: string; processing: string;
            meeting_type: string; online: string; onsite: string; notes: string; notes_placeholder: string;
            topics: { strategic: string; legal: string; corporate: string; digital: string };
        };
        step3: { title: string; desc: string; date_label: string; time_label: string; topic_label: string; type_label: string; book_another: string };
    };
    footer: {
        desc: string;
        quick_links: string;
        expertise: string;
        contact: string;
        address_paris: string;
        address_tunis: string;
        rights: string;
        terms: string;
        legal: string;
        careers: string;
        privacy: string;
    };
    adminCalendar: {
        title: string;
        subtitle: string;
        tabs: { appointments: string; types: string; settings: string };
        appointments: {
            title: string;
            empty: string;
            table: { date: string; time: string; title: string; client: string; phone: string; type: string; status: string; actions: string };
            status: { pending: string; confirmed: string; cancelled: string; completed: string; no_show: string };
            actions: { confirm: string; cancel: string; complete: string };
        };
        types: {
            title: string;
            add_new: string;
            duration: string;
            price: string;
            active: string;
            inactive: string;
        };
        settings: {
            title: string;
            working_hours: { title: string; from: string; to: string };
            lunch_break: { title: string; enable: string };
            general: { title: string; slot_duration: string; max_days: string; min_hours: string; reminder_hours: string };
            email: { title: string; confirmation: string; reminder: string; approval: string };
            save: { button: string; saving: string };
        };
        messages: {
            load_error: string;
            save_success: string;
            save_error: string;
            status_updated: string;
            status_error: string;
            type_updated: string;
            type_error: string;
            loading: string;
        };
    };
    notFound: {
        title: string;
        desc: string;
        button: string;
    };
    loading: {
        text: string;
    };
    error: {
        title: string;
        desc: string;
        button: string;
    };
    servicesPage: {
        hero_title: string;
        hero_subtitle: string;
        cta_title: string;
        cta_desc: string;
        cta_button: string;
        cta_services: string;
    };
    serviceDetails: Record<string, {
        title: string;
        subtitle: string;
        description: string;
        features: string[];
    }>;
    login: {
        welcomeBack: string;
        signInDesc: string;
        emailLabel: string;
        passwordLabel: string;
        emailPlaceholder: string;
        passwordPlaceholder: string;
        forgotPassword: string;
        signInButton: string;
        orContinue: string;
        continueGoogle: string;
        noAccount: string;
        signUpLink: string;
        bySigningIn: string;
        termsService: string;
        and: string;
        privacyPolicy: string;
        needHelp: string;
        contactSupport: string;
        loading: string;
        redirecting: string;
        errorInvalidCredential: string;
        errorUserNotFound: string;
        errorWrongPassword: string;
        errorTooManyRequests: string;
        errorDefault: string;
        errorGoogleSignIn: string;
        tagline: string;
        description: string;
        feature1: string;
        feature2: string;
        feature3: string;
    };
    aboutPage: {
        hero_title: string;
        hero_subtitle: string;
        stats_years: string;
        stats_clients: string;
        stats_offices: string;
        stats_value: string;
        story_title: string;
        story_p1: string;
        story_p2: string;
        vision_title: string;
        vision_desc: string;
        client_title: string;
        client_desc: string;
        excellence_title: string;
        excellence_desc: string;
        offices_title: string;
        offices_subtitle: string;
    };
};

const translations: Record<Language, Translations> = {
    en: {
        nav: {
            home: 'Home',
            services: 'Services',
            about: 'About Us',
            insights: 'Insights',
            contact: 'Contact',
            book: 'Book Consultation',
            signIn: 'Sign In',
            signOut: 'Sign Out'
        },
        hero: {
            badge: 'Premium Consulting Services',
            title_start: 'Your Strategic Partner in',
            paris: 'Paris',
            tunis: 'Tunis',
            subtitle: 'Empowering businesses and individuals with world-class digital transformation, legal compliance, and strategic financial growth solutions.',
            cta_book: 'Book a Consultation',
            cta_services: 'Explore Services'
        },
        about: {
            title_start: 'Bridging Opportunities Between',
            europe: 'Europe',
            africa: 'Africa',
            description: 'At Sygma Consult, we are more than just consultants; we are your strategic partners in growth. With established presence in both Paris and Tunis, we possess the unique cultural and regulatory insights needed to bridge markets.',
            points: [
                "Deep expertise in French and North African regulations",
                "Multilingual team (English, French, Arabic)",
                "Proven track record in M&A and digital transformation",
                "Personalized approach to every client case"
            ],
            cta_more: 'Learn More About Us',
            paris: 'PARIS',
            tunis: 'TUNIS',
            map_caption: 'Two Strategic Locations. One Global Vision.'
        },
        services: {
            title: "Our Areas of Expertise",
            subtitle: "We provide specialized consulting solutions tailored to your unique business challenges across borders.",
            items: {
                strategic: { title: "Strategic Consulting", desc: "Navigate complex markets with our expert risk management and growth strategies." },
                financial: { title: "Business & Tax", desc: "Comprehensive support for M&A, tax compliance, and corporate restructuring." },
                hr: { title: "Coaching & Training", desc: "Talent acquisition and world-class leadership development programs." },
                compliance: { title: "Compliance & Risk", desc: "Ensure your operations meet strict regulatory standards while mitigating risks." },
                digital: { title: "Digital Transformation", desc: "Leverage AI and modern tech stacks to modernize your operations." },
                realestate: { title: "Real Estate Law", desc: "Expert legal guidance for property transactions and construction projects." },
                visa: { title: "Visa Procedures", desc: "Full support for professional and personal visa applications." },
                corporate: { title: "Company Formalities", desc: "Entity formation, statute modification, and legal compliance." }
            }
        },
        insights: {
            title: "Insights & News",
            subtitle: "Latest updates on law, business, and strategy.",
            read_more: "Read More",
            all_posts: "All Posts",
            no_posts: "No posts available yet",
            min_read: "min read",
            articles: [
                { category: "Legal", title: "New Visa Regulations 2025", summary: "Key updates for entrepreneurs and investors in France.", date: "Dec 10, 2025" },
                { category: "Business", title: "Tunisia: The Next Tech Hub", summary: "Why North Africa is attracting global startups.", date: "Dec 05, 2025" },
                { category: "Tax", title: "Optimizing Corporate Tax", summary: "Comparative guide for France vs Tunisia holding structures.", date: "Nov 28, 2025" }
            ]
        },
        contact: {
            title: "Get in Touch",
            address_paris: "Paris",
            address_tunis: "Tunis",
            phone: "Phone & WhatsApp",
            email: "Email",
            form: {
                title: "Send a Message",
                name: "Full Name",
                email: "Email Address",
                subject: "Subject",
                message: "Message",
                submit: "Send Message",
                sending: "Sending...",
                success_title: "Message Sent!",
                success_desc: "Thank you for contacting us. We will get back to you shortly.",
                send_another: "Send another message",
                subjects: { general: "General Inquiry", partnership: "Partnership", careers: "Careers" }
            },
        },
        booking: {
            page_title: "Schedule Your Consultation",
            page_subtitle: "Book a meeting with our expert consultants in Paris or Tunis. Choose a time that works for you, and we'll handle the rest.",
            sidebar: {
                title: "Consultation",
                subtitle: "Discovery Call (45 min)",
                date_placeholder: "Select a date",
                time_placeholder: "Select a time",
                timezone: "* Times are in CET (Paris/Tunis Time)",
                online: "Online",
                onsite: "On-site"
            },
            step1: { title: "Select a Date & Time", month: "December 2025", next: "Next", days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
            step2: {
                title: "Your Details", name: "Full Name", email: "Email Address", topic: "Consultation Topic", back: "Back", confirm: "Confirm Booking", processing: "Processing...",
                meeting_type: "Meeting Type", online: "Online", onsite: "On-site", notes: "Notes (optional)", notes_placeholder: "Any specific details you'd like to share...",
                topics: { strategic: "Strategic Consulting", legal: "Legal & Fiscal", corporate: "Company Formation", digital: "Digital Transformation" }
            },
            step3: { title: "Booking Confirmed!", desc: "A calendar invitation has been sent to", date_label: "Date", time_label: "Time", topic_label: "Topic", type_label: "Type", book_another: "Book Another Session" }
        },
        adminCalendar: {
            title: "Admin Calendar & Appointments",
            subtitle: "Manage appointments, types, and settings",
            tabs: { appointments: "Appointments", types: "Appointment Types", settings: "Settings" },
            appointments: {
                title: "Upcoming Appointments",
                empty: "No upcoming appointments found",
                table: { date: "Date", time: "Time", title: "Title", client: "Client", phone: "Phone", type: "Type", status: "Status", actions: "Actions" },
                status: { pending: "Pending", confirmed: "Confirmed", cancelled: "Cancelled", completed: "Completed", no_show: "No Show" },
                actions: { confirm: "Confirm", cancel: "Cancel", complete: "Complete" }
            },
            types: {
                title: "Appointment Types",
                add_new: "Add New Type",
                duration: "Duration",
                price: "Price",
                active: "Active",
                inactive: "Inactive"
            },
            settings: {
                title: "Calendar Settings",
                working_hours: { title: "Working Days & Hours", from: "from", to: "to" },
                lunch_break: { title: "Lunch Break", enable: "Enable lunch break" },
                general: { title: "General Settings", slot_duration: "Slot Duration (min)", max_days: "Max Advance Booking (days)", min_hours: "Min Advance Booking (hours)", reminder_hours: "Reminder (hours before)" },
                email: { title: "Email Settings", confirmation: "Send confirmation email", reminder: "Send reminder email", approval: "Require admin approval" },
                save: { button: "Save Settings", saving: "Saving..." }
            },
            messages: {
                load_error: "Error loading data",
                save_success: "Settings saved successfully",
                save_error: "Error saving settings",
                status_updated: "Appointment status updated",
                status_error: "Error updating appointment",
                type_updated: "Appointment type updated",
                type_error: "Error updating appointment type",
                loading: "Loading..."
            }
        },
        footer: {
            desc: "Your trusted strategic partner for digital transformation, legal compliance, and business growth in Paris and Tunis.",
            quick_links: "Quick Links",
            expertise: "Expertise",
            contact: "Contact Us",
            address_paris: "Paris",
            address_tunis: "Tunis",
            rights: "All rights reserved. Registered in France & Tunisia.",
            terms: "Terms of Service",
            legal: "Legal Notice",
            careers: "Careers",
            privacy: "Privacy Policy"
        },
        notFound: {
            title: "Page Not Found",
            desc: "We couldn't find the page you were looking for. It might have been removed or renamed.",
            button: "Return Home"
        },
        loading: { text: "LOADING" },
        error: {
            title: "Something went wrong!",
            desc: "We apologize for the inconvenience.",
            button: "Try again"
        },
        servicesPage: {
            hero_title: "Our Expertise",
            hero_subtitle: "Comprehensive consulting solutions tailored for international success.",
            cta_title: "Not sure what you need?",
            cta_desc: "Schedule a discovery call with our experts to discuss your specific situation. We'll help you identify the right path forward.",
            cta_button: "Book a Discovery Call",
            cta_services: "Other Services"
        },
        serviceDetails: {
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
        },
        login: {
            welcomeBack: "Welcome Back",
            signInDesc: "Sign in to access your account",
            emailLabel: "Email Address",
            passwordLabel: "Password",
            emailPlaceholder: "Enter your email",
            passwordPlaceholder: "Enter your password",
            forgotPassword: "Forgot password?",
            signInButton: "Sign In",
            orContinue: "Or continue with",
            continueGoogle: "Continue with Google",
            noAccount: "Don't have an account?",
            signUpLink: "Sign up",
            bySigningIn: "By signing in, you agree to our",
            termsService: "Terms of Service",
            and: "and",
            privacyPolicy: "Privacy Policy",
            needHelp: "Need help?",
            contactSupport: "Contact Support",
            loading: "Loading...",
            redirecting: "Redirecting...",
            errorInvalidCredential: "Invalid email or password",
            errorUserNotFound: "No account found with this email",
            errorWrongPassword: "Incorrect password",
            errorTooManyRequests: "Too many failed attempts. Please try again later.",
            errorDefault: "Failed to sign in. Please try again.",
            errorGoogleSignIn: "Failed to sign in with Google",
            tagline: "Your Strategic Partner for Business Success",
            description: "Access premium consulting services, manage your bookings, and track your documents all in one place.",
            feature1: "Expert legal and fiscal consulting",
            feature2: "Digital transformation solutions",
            feature3: "Trusted by businesses across borders"
        },
        aboutPage: {
            hero_title: "About Sygma Consult",
            hero_subtitle: "Bridging the gap between European standards and African opportunities since 2015.",
            stats_years: "Years Experience",
            stats_clients: "Clients Served",
            stats_offices: "Main Offices",
            stats_value: "Value Created",
            story_title: "Our Story",
            story_p1: "Sygma Consult was born from a vision to create a seamless business corridor between France and Tunisia. Recognizing the complexities that entrepreneurs face when operating across these two vibrant economies, we established a firm grounded in deep local expertise and international standards.",
            story_p2: "Today, we are proud to be the trusted partner for multinational corporations, SMEs, and visionary startups. Our dual presence in Paris and Tunis allows us to offer real-time, on-the-ground support that other firms cannot match.",
            vision_title: "Global Vision",
            vision_desc: "Thinking beyond borders to unlock international potential.",
            client_title: "Client Centric",
            client_desc: "Your success is the only metric that matters to us.",
            excellence_title: "Excellence",
            excellence_desc: "Delivering premium quality in every consultation.",
            offices_title: "Our Offices",
            offices_subtitle: "With strategic locations in Paris and Tunis, we provide comprehensive support across Europe and North Africa."
        }
    },
    fr: {
        nav: {
            home: 'Accueil',
            services: 'Services',
            about: 'À Propos',
            insights: 'Actualités',
            contact: 'Contact',
            book: 'Prendre Rendez-vous',
            signIn: 'Se connecter',
            signOut: 'Se déconnecter'
        },
        hero: {
            badge: 'Services de Conseil Premium',
            title_start: 'Votre Partenaire Stratégique à',
            paris: 'Paris',
            tunis: 'Tunis',
            subtitle: 'Accompagner les entreprises et les particuliers avec des solutions de transformation numérique, de conformité juridique et de croissance financière.',
            cta_book: 'Prendre Rendez-vous',
            cta_services: 'Nos Services'
        },
        about: {
            title_start: 'Créer des Opportunités entre',
            europe: 'l\'Europe',
            africa: 'l\'Afrique',
            description: 'Chez Sygma Consult, nous sommes plus que de simples consultants ; nous sommes vos partenaires stratégiques. Avec une présence établie à Paris et à Tunis, nous possédons les connaissances culturelles et réglementaires uniques pour relier les marchés.',
            points: [
                "Expertise approfondie des réglementations françaises et nord-africaines",
                "Équipe multilingue (Anglais, Français, Arabe)",
                "Expérience prouvée en fusions-acquisitions et transformation numérique",
                "Approche personnalisée pour chaque dossier client"
            ],
            cta_more: 'En Savoir Plus',
            paris: 'PARIS',
            tunis: 'TUNIS',
            map_caption: 'Deux Emplacements Stratégiques. Une Vision Globale.'
        },
        services: {
            title: "Nos Domaines d'Expertise",
            subtitle: "Nous fournissons des solutions de conseil spécialisées adaptées à vos défis commerciaux uniques.",
            items: {
                strategic: { title: "Conseil Stratégique", desc: "Naviguez sur des marchés complexes avec nos stratégies de gestion des risques." },
                financial: { title: "Affaires & Fiscalité", desc: "Support complet pour M&A, conformité fiscale et restructuration d'entreprise." },
                hr: { title: "Coaching & Formation", desc: "Acquisition de talents et programmes de développement du leadership." },
                compliance: { title: "Conformité & Risque", desc: "Assurez-vous que vos opérations respectent les normes réglementaires strictes." },
                digital: { title: "Transformation Numérique", desc: "Exploitez l'IA et les technologies modernes pour moderniser vos opérations." },
                realestate: { title: "Droit Immobilier", desc: "Conseil juridique expert pour les transactions immobilières et la construction." },
                visa: { title: "Procédures de Visa", desc: "Accompagnement complet pour les demandes de visas professionnels et personnels." },
                corporate: { title: "Formalités Société", desc: "Création d'entreprise, modification de statuts et conformité légale." }
            }
        },
        insights: {
            title: "Actualités & Insights",
            subtitle: "Dernières mises à jour sur le droit, les affaires et la stratégie.",
            read_more: "Lire la suite",
            all_posts: "Tous les Articles",
            no_posts: "Aucun article disponible pour le moment",
            min_read: "min de lecture",
            articles: [
                { category: "Juridique", title: "Nouvelles Réglementations Visa 2025", summary: "Mises à jour clés pour les entrepreneurs et investisseurs en France.", date: "10 Déc 2025" },
                { category: "Affaires", title: "Tunisie : Nouveau Hub Tech", summary: "Pourquoi l'Afrique du Nord attire les startups mondiales.", date: "05 Déc 2025" },
                { category: "Fiscalité", title: "Optimisation Fiscale", summary: "Guide comparatif des structures holding France vs Tunisie.", date: "28 Nov 2025" }
            ]
        },
        contact: {
            title: "Contactez-nous",
            address_paris: "Paris",
            address_tunis: "Tunis",
            phone: "Téléphone & WhatsApp",
            email: "Email",
            form: {
                title: "Envoyer un message",
                name: "Nom complet",
                email: "Adresse Email",
                subject: "Sujet",
                message: "Message",
                submit: "Envoyer",
                sending: "Envoi en cours...",
                success_title: "Message Envoyé!",
                success_desc: "Merci de nous avoir contactés. Nous vous répondrons sous peu.",
                send_another: "Envoyer un autre message",
                subjects: { general: "Demande générale", partnership: "Partenariat", careers: "Carrières" }
            },
        },
        booking: {
            page_title: "Planifiez votre consultation",
            page_subtitle: "Réservez un rendez-vous avec nos experts à Paris ou à Tunis. Choisissez le créneau qui vous convient, nous nous occupons du reste.",
            sidebar: {
                title: "Consultation",
                subtitle: "Appel Découverte (45 min)",
                date_placeholder: "Choisir une date",
                time_placeholder: "Choisir un horaire",
                timezone: "* Heure CET (Paris/Tunis)",
                online: "En ligne",
                onsite: "Sur place"
            },
            step1: { title: "Date & Heure", month: "Décembre 2025", next: "Suivant", days: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'] },
            step2: {
                title: "Vos Coordonnées", name: "Nom complet", email: "Adresse Email", topic: "Sujet de consultation", back: "Retour", confirm: "Confirmer", processing: "Traitement...",
                meeting_type: "Type de rendez-vous", online: "En ligne", onsite: "Sur place", notes: "Notes (facultatif)", notes_placeholder: "Tous détails spécifiques que vous aimeriez partager...",
                topics: { strategic: "Conseil Stratégique", legal: "Juridique & Fiscal", corporate: "Création Société", digital: "Transformation Numérique" }
            },
            step3: { title: "Réservation Confirmée!", desc: "Une invitation calendrier a été envoyée à", date_label: "Date", time_label: "Heure", topic_label: "Sujet", type_label: "Type", book_another: "Réserver une autre session" }
        },
        adminCalendar: {
            title: "Gestion du Calendrier & Rendez-vous",
            subtitle: "Gérer les rendez-vous, les types et les paramètres",
            tabs: { appointments: "Rendez-vous", types: "Types de RDV", settings: "Paramètres" },
            appointments: {
                title: "Rendez-vous à venir",
                empty: "Aucun rendez-vous trouvé",
                table: { date: "Date", time: "Heure", title: "Titre", client: "Client", phone: "Tél", type: "Type", status: "Statut", actions: "Actions" },
                status: { pending: "En attente", confirmed: "Confirmé", cancelled: "Annulé", completed: "Terminé", no_show: "Absent" },
                actions: { confirm: "Confirmer", cancel: "Annuler", complete: "Terminer" }
            },
            types: {
                title: "Types de Rendez-vous",
                add_new: "Ajouter un type",
                duration: "Durée",
                price: "Prix",
                active: "Actif",
                inactive: "Inactif"
            },
            settings: {
                title: "Paramètres du Calendrier",
                working_hours: { title: "Jours et Heures de Travail", from: "de", to: "à" },
                lunch_break: { title: "Pause Déjeuner", enable: "Activer la pause" },
                general: { title: "Paramètres Généraux", slot_duration: "Durée du créneau (min)", max_days: "Réservation max (jours)", min_hours: "Délai min (heures)", reminder_hours: "Rappel (heures avant)" },
                email: { title: "Paramètres Email", confirmation: "Envoyer email de confirmation", reminder: "Envoyer email de rappel", approval: "Nécessite approbation" },
                save: { button: "Enregistrer", saving: "Enregistrement..." }
            },
            messages: {
                load_error: "Erreur de chargement",
                save_success: "Paramètres enregistrés",
                save_error: "Erreur d'enregistrement",
                status_updated: "Statut mis à jour",
                status_error: "Erreur de mise à jour",
                type_updated: "Type mis à jour",
                type_error: "Erreur mise à jour type",
                loading: "Chargement..."
            }
        },
        footer: {
            desc: "Votre partenaire stratégique de confiance pour la transformation numérique et la croissance à Paris et Tunis.",
            quick_links: "Liens Rapides",
            expertise: "Expertise",
            contact: "Contactez-nous",
            address_paris: "Paris",
            address_tunis: "Tunis",
            rights: "Tous droits réservés. Enregistré en France et en Tunisie.",
            terms: "Conditions d'Utilisation",
            legal: "Mentions Légales",
            careers: "Carrières",
            privacy: "Politique de Confidentialité"
        },
        notFound: {
            title: "Page Introuvable",
            desc: "Nous n'avons pas pu trouver la page que vous recherchez. Elle a peut-être été supprimée ou renommée.",
            button: "Retour à l'Accueil"
        },
        loading: { text: "CHARGEMENT" },
        error: {
            title: "Une erreur est survenue !",
            desc: "Nous nous excusons pour le désagrément.",
            button: "Réessayer"
        },
        servicesPage: {
            hero_title: "Notre Expertise",
            hero_subtitle: "Des solutions de conseil complètes adaptées à votre réussite internationale.",
            cta_title: "Vous ne savez pas par où commencer ?",
            cta_desc: "Planifiez un appel de découverte avec nos experts pour discuter de votre situation spécifique. Nous vous aiderons à identifier la bonne voie à suivre.",
            cta_button: "Réserver un Appel Découverte",
            cta_services: "Autres Services"
        },
        serviceDetails: {
            "strategic": {
                title: "Développement de Marché",
                subtitle: "Pénétrez de Nouveaux Marchés avec Confiance",
                description: "Notre service 'Développement et Pénétration de Marché' fournit des stratégies de croissance ambitieuses pour les entreprises souhaitant s'implanter en France ou en Afrique du Nord. Nous analysons la dynamique du marché, identifions les opportunités clés et créons une feuille de route pour un succès durable.",
                features: ["Stratégie d'Entrée sur le Marché", "Analyse Concurrentielle", "Modélisation de la Croissance", "Développement de Partenariats"]
            },
            "financial-legal": {
                title: "Affaires & Fiscalité",
                subtitle: "Optimisation Fiscale et Juridique",
                description: "Nous fournissons un soutien complet pour les fusions-acquisitions, la conformité fiscale et la restructuration d'entreprise. Nos experts veillent à ce que vos stratégies financières et fiscales soient optimisées pour les juridictions françaises et tunisiennes.",
                features: ["Optimisation Fiscale", "Conformité Droit du Travail", "Restructuration d'Entreprise", "Audits Contractuels"]
            },
            "visa": {
                title: "Procédures Visa",
                subtitle: "Faciliter Votre Mobilité",
                description: "Nous facilitons toutes les démarches d'obtention de visas, que ce soit à titre professionnel ou personnel. De la préparation du dossier à sa soumission aux autorités compétentes, nous assurons un accompagnement complet pour garantir un processus fluide.",
                features: ["Visas Professionnels (Passeport Talent)", "Visas Personnels & Familiaux", "Revue & Soumission de Dossier", "Renouvellement de Titre de Séjour"]
            },
            "corporate": {
                title: "Formalités Entreprise",
                subtitle: "Gestion Administrative & Juridique",
                description: "Nous gérons les aspects administratifs et juridiques du cycle de vie de votre entreprise. Que vous créiez une nouvelle entité, modifiiez des statuts ou procédiez à une dissolution, nous assurons une conformité totale avec toutes les obligations administratives.",
                features: ["Création de Société (SAS, SARL, SUARL)", "Modification de Statuts", "Secrétariat Juridique", "Liquidation & Dissolution"]
            },
            "hr-training": {
                title: "Coaching & Formation",
                subtitle: "Développer le Capital Humain",
                description: "Dédié au développement des ressources humaines pour les particuliers et les entreprises. Nos programmes se concentrent sur l'amélioration des compétences, le coaching en leadership et l'atteinte des objectifs professionnels.",
                features: ["Coaching Exécutif", "Ateliers de Leadership d'Équipe", "Formation Soft Skills", "Développement de Carrière"]
            },
            "compliance": {
                title: "Conformité & Risque",
                subtitle: "Protéger Vos Actifs",
                description: "Dans un environnement réglementaire en constante évolution, la conformité n'est pas optionnelle. Nous vous aidons à bâtir des systèmes résilients qui résistent aux contrôles et protègent votre réputation.",
                features: ["Conformité RGPD", "Lutte Anti-Blanchiment (AML)", "Audits Internes", "Protocoles de Sécurité des Données"]
            },
            "digital": {
                title: "Transformation Numérique",
                subtitle: "Pérenniser Votre Entreprise",
                description: "Exploitez la puissance de l'IA et des technologies modernes. Nous vous guidons à travers la transition numérique, en veillant à ce que votre entreprise reste compétitive à l'ère du digital.",
                features: ["Stratégie d'Intégration IA", "Migration Cloud", "Automatisation des Processus", "Expérience Client Numérique"]
            },
            "real-estate": {
                title: "Droit Immobilier",
                subtitle: "Sécuriser Vos Investissements",
                description: "Accompagnement juridique complet pour les transactions immobilières (achat/vente) et les projets de construction. Nous veillons à ce que vos actifs soient protégés et que vos projets se déroulent sans encombre.",
                features: ["Support Acquisition Immobilière", "Contrats de Construction", "Baux Commerciaux", "Contentieux Immobilier"]
            }
        },
        login: {
            welcomeBack: "Bon Retour",
            signInDesc: "Connectez-vous pour accéder à votre compte",
            emailLabel: "Adresse e-mail",
            passwordLabel: "Mot de passe",
            emailPlaceholder: "Entrez votre adresse e-mail",
            passwordPlaceholder: "Entrez votre mot de passe",
            forgotPassword: "Mot de passe oublié ?",
            signInButton: "Se connecter",
            orContinue: "Ou continuer avec",
            continueGoogle: "Continuer avec Google",
            noAccount: "Vous n'avez pas de compte ?",
            signUpLink: "S'inscrire",
            bySigningIn: "En vous connectant, vous acceptez nos",
            termsService: "Conditions d'utilisation",
            and: "et",
            privacyPolicy: "Politique de confidentialité",
            needHelp: "Besoin d'aide ?",
            contactSupport: "Contacter le support",
            loading: "Chargement...",
            redirecting: "Redirection...",
            errorInvalidCredential: "E-mail ou mot de passe invalide",
            errorUserNotFound: "Aucun compte trouvé avec cet e-mail",
            errorWrongPassword: "Mot de passe incorrect",
            errorTooManyRequests: "Trop de tentatives échouées. Veuillez réessayer plus tard.",
            errorDefault: "Échec de la connexion. Veuillez réessayer.",
            errorGoogleSignIn: "Échec de la connexion avec Google",
            tagline: "Votre Partenaire Stratégique pour la Réussite",
            description: "Accédez à des services de conseil premium, gérez vos réservations et suivez vos documents en un seul endroit.",
            feature1: "Conseil juridique et fiscal expert",
            feature2: "Solutions de transformation numérique",
            feature3: "De confiance pour les entreprises au-delà des frontières"
        },
        aboutPage: {
            hero_title: "À Propos de Sygma Consult",
            hero_subtitle: "Combler le fossé entre les normes européennes et les opportunités africaines depuis 2015.",
            stats_years: "Années d'Expérience",
            stats_clients: "Clients Servis",
            stats_offices: "Bureaux Principaux",
            stats_value: "Valeur Créée",
            story_title: "Notre Histoire",
            story_p1: "Sygma Consult est né d'une vision visant à créer un corridor commercial transparent entre la France et la Tunisie. Conscients des complexités auxquelles sont confrontés les entrepreneurs opérant dans ces deux économies dynamiques, nous avons créé un cabinet fondé sur une expertise locale approfondie et des normes internationales.",
            story_p2: "Aujourd'hui, nous sommes fiers d'être le partenaire de confiance des multinationales, des PME et des startups visionnaires. Notre double présence à Paris et à Tunis nous permet d'offrir un soutien en temps réel et sur le terrain que d'autres cabinets ne peuvent égaler.",
            vision_title: "Vision Mondiale",
            vision_desc: "Penser au-delà des frontières pour débloquer le potentiel international.",
            client_title: "Centré sur le Client",
            client_desc: "Votre succès est le seul indicateur qui compte pour nous.",
            excellence_title: "Excellence",
            excellence_desc: "Offrir une qualité premium dans chaque consultation.",
            offices_title: "Nos Bureaux",
            offices_subtitle: "Avec des emplacements stratégiques à Paris et à Tunis, nous offrons un soutien complet à travers l'Europe et l'Afrique du Nord."
        }
    },
    ar: {
        nav: {
            home: 'الرئيسية',
            services: 'خدماتنا',
            about: 'من نحن',
            insights: 'أخبار ورؤى',
            contact: 'اتصل بنا',
            book: 'احجز استشارة',
            signIn: 'تسجيل الدخول',
            signOut: 'تسجيل الخروج'
        },
        hero: {
            badge: 'خدمات استشارية متميزة',
            title_start: 'شريكك الاستراتيجي في',
            paris: 'باريس',
            tunis: 'تونس',
            subtitle: 'تمكين الشركات والأفراد من خلال حلول التحول الرقمي، الامتثال القانوني، والنمو المالي الاستراتيجي.',
            cta_book: 'احجز موعد',
            cta_services: 'اكتشف خدماتنا'
        },
        about: {
            title_start: 'ربط الفرص بين',
            europe: 'أوروبا',
            africa: 'وأفريقيا',
            description: 'في سيجما كونسلت، نحن أكثر من مجرد مستشارين؛ نحن شركاؤك الاستراتيجيون في النمو. بفضل وجودنا في باريس وتونس، نمتلك رؤى ثقافية وتنظيمية فريدة لربط الأسواق.',
            points: [
                "خبرة عميقة في اللوائح الفرنسية وشمال أفريقيا",
                "فريق متعدد اللغات (الفرنسية، العربية، الإنجليزية)",
                "سجل حافل في عمليات الدمج والاستحواذ والتحول الرقمي",
                "نهج مخصص لكل حالة عميل"
            ],
            cta_more: 'اعرف المزيد عنا',
            paris: 'باريس',
            tunis: 'تونس',
            map_caption: 'موقعان استراتيجيان. رؤية عالمية واحدة.'
        },
        services: {
            title: "مجالات خبرتنا",
            subtitle: "نقدم حلولاً استشارية متخصصة مصممة لتحديات عملك الفريدة عبر الحدود.",
            items: {
                strategic: { title: "الاستشارات الاستراتيجية", desc: "تنقل في الأسواق المعقدة مع استراتيجيات إدارة المخاطر والنمو لدينا." },
                financial: { title: "الأعمال والضرائب", desc: "دعم شامل لعمليات الدمج والاستحواذ، والامتثال الضريبي، وإعادة هيكلة الشركات." },
                hr: { title: "التدريب والكوتشينغ", desc: "اكتساب المواهب وبرامج تطوير القيادة عالمية المستوى." },
                compliance: { title: "الامتثال والمخاطر", desc: "تأكد من أن عملياتك تفي بالمعايير التنظيمية الصارمة مع تخفيف المخاطر." },
                digital: { title: "التحول الرقمي", desc: "استفد من الذكاء الاصطناعي والتقنيات الحديثة لتحديث عملياتك." },
                realestate: { title: "القانون العقاري", desc: "توجيه قانوني خبير للمعاملات العقارية ومشاريع البناء." },
                visa: { title: "إجراءات التأشيرة", desc: "دعم كامل لطلبات التأشيرة المهنية والشخصية." },
                corporate: { title: "شكليات الشركات", desc: "تأسيس الكيانات، تعديل النظام الأساسي، والامتثال القانوني." }
            }

        },
        insights: {
            title: "أخبار ورؤى",
            subtitle: "آخر التحديثات حول القانون والأعمال والاستراتيجية.",
            read_more: "اقرأ المزيد",
            all_posts: "جميع المقالات",
            no_posts: "لا توجد مقالات متاحة حالياً",
            min_read: "دقيقة قراءة",
            articles: [
                { category: "قانوني", title: "لوائح التأشيرة الجديدة 2025", summary: "تحديثات رئيسية رواد الأعمال والمستثمرين الأجانب في فرنسا.", date: "10 ديسمبر 2025" },
                { category: "أعمال", title: "تونس: مركز التكنولوجيا القادم", summary: "لماذا تجذب شمال أفريقيا الشركات الناشئة العالمية.", date: "05 ديسمبر 2025" },
                { category: "ضرائب", title: "تحسين الضرائب على الشركات", summary: "دليل مقارن لهياكل الشركات القابضة بين فرنسا وتونس.", date: "28 نوفمبر 2025" }
            ]
        },
        contact: {
            title: "تواصل معنا",
            address_paris: "باريس",
            address_tunis: "تونس",
            phone: "الهاتف و واتساب",
            email: "البريد الإلكتروني",
            form: {
                title: "أرسل رسالة",
                name: "الاسم الكامل",
                email: "البريد الإلكتروني",
                subject: "الموضوع",
                message: "الرسالة",
                submit: "إرسال",
                sending: "جاري الإرسال...",
                success_title: "تم الإرسال!",
                success_desc: "شكراً لتواصلكم معنا. سنرد عليكم قريباً.",
                send_another: "إرسال رسالة أخرى",
                subjects: { general: "استفسار عام", partnership: "شراكة", careers: "توظيف" }
            },
        },
        booking: {
            page_title: "حدد موعد استشارتك",
            page_subtitle: "احجز موعدًا مع خبرائنا في باريس أو تونس. اختر الوقت الذي يناسبك، وسنتولى نحن الباقي.",
            sidebar: {
                title: "استشارة",
                subtitle: "مكالمة استكشافية (45 دقيقة)",
                date_placeholder: "اختر تاريخاً",
                time_placeholder: "اختر وقتاً",
                timezone: "* التوقيت بتوقيت وسط أوروبا (باريس/تونس)",
                online: "عبر الإنترنت",
                onsite: "في الموقع"
            },
            step1: { title: "التاريخ والوقت", month: "ديسمبر 2025", next: "التالي", days: ['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'] },
            step2: {
                title: "بياناتك", name: "الاسم الكامل", email: "البريد الإلكتروني", topic: "موضوع الاستشارة", back: "رجوع", confirm: "تأكيد الحجز", processing: "جاري المعالجة...",
                meeting_type: "نوع الاجتماع", online: "عبر الإنترنت", onsite: "في الموقع", notes: "ملاحظات (اختياري)", notes_placeholder: "أي تفاصيل محددة ترغب في مشاركتها...",
                topics: { strategic: "استشارات استراتيجية", legal: "قانوني وضريبي", corporate: "تأسيس شركات", digital: "تحول رقمي" }
            },
            step3: { title: "تم تأكيد الحجز!", desc: "تم إرسال دعوة التقويم إلى", date_label: "التاريخ", time_label: "الوقت", topic_label: "الموضوع", type_label: "النوع", book_another: "حجز جلسة أخرى" }
        },
        adminCalendar: {
            title: "إدارة التقويم والمواعيد",
            subtitle: "إدارة المواعيد، الأنواع، والإعدادات",
            tabs: { appointments: "المواعيد", types: "أنواع المواعيد", settings: "الإعدادات" },
            appointments: {
                title: "المواعيد القادمة",
                empty: "لا توجد مواعيد قادمة",
                table: { date: "التاريخ", time: "الوقت", title: "العنوان", client: "العميل", phone: "الهاتف", type: "النوع", status: "الحالة", actions: "الإجراءات" },
                status: { pending: "قيد الانتظار", confirmed: "مؤكد", cancelled: "ملغي", completed: "مكتمل", no_show: "لم يحضر" },
                actions: { confirm: "تأكيد", cancel: "إلغاء", complete: "مكتمل" }
            },
            types: {
                title: "أنواع المواعيد",
                add_new: "إضافة نوع جديد",
                duration: "المدة",
                price: "السعر",
                active: "مفعّل",
                inactive: "معطّل"
            },
            settings: {
                title: "إعدادات التقويم",
                working_hours: { title: "أيام وساعات العمل", from: "من", to: "إلى" },
                lunch_break: { title: "استراحة الغداء", enable: "تفعيل استراحة الغداء" },
                general: { title: "إعدادات عامة", slot_duration: "مدة الفترة (دقيقة)", max_days: "أقصى أيام للحجز", min_hours: "أدنى ساعات للحجز", reminder_hours: "التذكير (قبل ساعات)" },
                email: { title: "إعدادات البريد", confirmation: "إرسال بريد تأكيد", reminder: "إرسال بريد تذكير", approval: "يتطلب موافقة" },
                save: { button: "حفظ الإعدادات", saving: "جاري الحفظ..." }
            },
            messages: {
                load_error: "خطأ في تحميل البيانات",
                save_success: "تم حفظ الإعدادات بنجاح",
                save_error: "خطأ في حفظ الإعدادات",
                status_updated: "تم تحديث حالة الموعد",
                status_error: "خطأ في تحديث الموعد",
                type_updated: "تم تحديث نوع الموعد",
                type_error: "خطأ في تحديث نوع الموعد",
                loading: "جاري التحميل..."
            }
        },
        footer: {
            desc: "شريكك الاستراتيجي الموثوق للتحول الرقمي، الامتثال القانوني، ونمو الأعمال في باريس وتونس.",
            quick_links: "روابط سريعة",
            expertise: "الخبرات",
            contact: "اتصل بنا",
            address_paris: "باريس",
            address_tunis: "تونس",
            rights: "جميع الحقوق محفوظة. مسجلة فين فرنسا وتونس.",
            terms: "شروط الخدمة",
            legal: "إشعار قانوني",
            careers: "وظائف",
            privacy: "سياسة الخصوصية"
        },
        notFound: {
            title: "الصفحة غير موجودة",
            desc: "لم نتمكن من العثور على تلك الصفحة. ربما تم حذفها أو تغيير اسمها.",
            button: "العودة للرئيسية"
        },
        loading: { text: "جاري التحميل" },
        error: {
            title: "حدث خطأ ما!",
            desc: "نعتذر عن الإزعاج.",
            button: "حاول مرة أخرى"
        },
        servicesPage: {
            hero_title: "خبراتنا",
            hero_subtitle: "حلول استشارية شاملة مصممة للنجاح الدولي.",
            cta_title: "لست متأكداً مما تحتاجه؟",
            cta_desc: "احجز مكالمة استكشافية مع خبرائنا لمناقشة وضعك الخاص. سنساعدك في تحديد المسار الصحيح للمضي قدماً.",
            cta_button: "احجز مكالمة استكشافية",
            cta_services: "خدمات أخرى"
        },
        serviceDetails: {
            "strategic": {
                title: "تطوير السوق",
                subtitle: "ادخل أسواقاً جديدة بثقة",
                description: "تقدم خدمتنا 'تطوير واختراق السوق' استراتيجيات نمو طموحة للشركات التي تتطلع إلى التوسع في فرنسا أو شمال إفريقيا. نقوم بتحليل ديناميكيات السوق وتحديد الفرص الرئيسية وإنشاء خارطة طريق لتحقيق نجاح مستدام.",
                features: ["استراتيجية دخول السوق", "التحليل التنافسي", "نمذجة النمو", "تطوير الشراكات"]
            },
            "financial-legal": {
                title: "الأعمال والضرائب",
                subtitle: "الشؤون والضرائب",
                description: "نحن نقدم دعماً شاملاً لعمليات الدمج والاستحواذ والامتثال الضريبي وإعادة هيكلة الشركات. يضمن خبراؤنا تحسين استراتيجياتك المالية والضريبية لكل من الولايات القضائية الفرنسية والتونسية.",
                features: ["التحسين الضريبي", "الامتثال لقانون العمل", "إعادة هيكلة الشركات", "الرقابة التعاقدية"]
            },
            "visa": {
                title: "إجراءات التأشيرة",
                subtitle: "تسهيل تنقلك",
                description: "نحن نسهل جميع الإجراءات للحصول على التأشيرات، سواء لأغراض مهنية أو شخصية. من إعداد المستندات إلى تقديمها إلى السلطات المختصة، نقدم مرافقة كاملة لضمان عملية سلسة.",
                features: ["تأشيرات مهنية (جواز سفر المواهب)", "تأشيرات شخصية وعائلية", "مراجعة وتقديم الطلب", "تجديد تصريح الإقامة"]
            },
            "corporate": {
                title: "إجراءات الشركات",
                subtitle: "الإدارة الإدارية والقانونية",
                description: "نحن ندير الجوانب الإدارية والقانونية لدورة حياة شركتك. سواء كنت تؤسس كياناً جديداً، أو تعدل القوانين، أو تخضع للحل، فإننا نضمن الامتثال الكامل لجميع الالتزامات الإدارية.",
                features: ["تأسيس الشركات (SAS, SARL, SUARL)", "تعديل النظام الأساسي", "السكرتارية القانونية", "التصفية والحل"]
            },
            "hr-training": {
                title: "التدريب والكوتشينغ",
                subtitle: "تطوير رأس المال البشري",
                description: "مخصص لتنمية الموارد البشرية للأفراد والشركات. تركز برامجنا على تعزيز المهارات، والتوجيه القيادي، وتحقيق الأهداف المهنية.",
                features: ["التوجيه التنفيذي", "ورش عمل قيادة الفريق", "تدريب المهارات الشخصية", "التطوير الوظيفي"]
            },
            "compliance": {
                title: "الامتثال والمخاطر",
                subtitle: "حماية أصولك",
                description: "في بيئة تنظيمية متغيرة باستمرار، الامتثال ليس اختيارياً. نحن نساعدك على بناء أنظمة مرنة تصمد أمام التدقيق وتحمي سمعتك.",
                features: ["الامتثال لـ GDPR", "مكافحة غسيل الأموال (AML)", "المدقيق الداخلي", "بروتوكولات أمان البيانات"]
            },
            "digital": {
                title: "التحول الرقمي",
                subtitle: "تأمين مستقبل عملك",
                description: "استفد من قوة الذكاء الاصطناعي والتكنولوجيا الحديثة. نحن نرشدك خلال الانتقال الرقمي، مما يضمن بقاء عملك تنافسياً في العصر الرقمي.",
                features: ["استراتيجية تكامل الذكاء الاصطناعي", "الانتقال السحابي", "أتمتة العمليات", "تجربة العملاء الرقمية"]
            },
            "real-estate": {
                title: "القانون العقاري",
                subtitle: "قانون العقارات",
                description: "مرافقة قانونية شاملة للمعاملات العقارية (الشراء / البيع) ومشاريع البناء. نحن نضمن حماية أصولك وسير مشاريعك بسلاسة.",
                features: ["دعم الاستحواذ العقاري", "عقود البناء", "اتفاقيات الإيجار", "التقاضي العقاري"]
            }
        },
        login: {
            welcomeBack: "مرحباً بعودتك",
            signInDesc: "سجل الدخول للوصول إلى حسابك",
            emailLabel: "البريد الإلكتروني",
            passwordLabel: "كلمة المرور",
            emailPlaceholder: "أدخل بريدك الإلكتروني",
            passwordPlaceholder: "أدخل كلمة المرور",
            forgotPassword: "نسيت كلمة المرور؟",
            signInButton: "تسجيل الدخول",
            orContinue: "أو تابع باستخدام",
            continueGoogle: "متابعة باستخدام جوجل",
            noAccount: "ليس لديك حساب؟",
            signUpLink: "إنشاء حساب",
            bySigningIn: "بتسجيل الدخول، فإنك توافق على",
            termsService: "شروط الخدمة",
            and: "و",
            privacyPolicy: "سياسة الخصوصية",
            needHelp: "تحتاج مساعدة؟",
            contactSupport: "اتصل بالدعم",
            loading: "جاري التحميل...",
            redirecting: "جاري التحويل...",
            errorInvalidCredential: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
            errorUserNotFound: "لم يتم العثور على حساب بهذا البريد الإلكتروني",
            errorWrongPassword: "كلمة المرور غير صحيحة",
            errorTooManyRequests: "عدد كبير جداً من المحاولات الفاشلة. يرجى المحاولة لاحقاً.",
            errorDefault: "فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.",
            errorGoogleSignIn: "فشل تسجيل الدخول باستخدام جوجل",
            tagline: "شريكك الاستراتيجي لتحقيق النجاح",
            description: "الوصول إلى خدمات استشارية متميزة، إدارة حجوزاتك، وتتبع مستنداتك في مكان واحد.",
            feature1: "استشارات قانونية ومالية متخصصة",
            feature2: "حلول التحول الرقمي",
            feature3: "موثوق به من قبل الشركات عبر الحدود"
        },
        aboutPage: {
            hero_title: "عن سيجما كونسلت",
            hero_subtitle: "سد الفجوة بين المعايير الأوروبية والفرص الأفريقية منذ عام 2015.",
            stats_years: "سنوات الخبرة",
            stats_clients: "العملاء المخدومون",
            stats_offices: "المكاتب الرئيسية",
            stats_value: "القيمة المُنشأة",
            story_title: "قصتنا",
            story_p1: "ولدت سيجما كونسلت من رؤية لإنشاء ممر تجاري سلس بين فرنسا وتونس. إدراكاً للتعقيدات التي يواجهها رواد الأعمال عند العمل في هاتين الاقتصادين النابضين بالحياة، أنشأنا شركة مبنية على خبرة محلية عميقة ومعايير دولية.",
            story_p2: "اليوم، نفخر بكوننا الشريك الموثوق به للشركات متعددة الجنسيات والشركات الصغيرة والمتوسطة والشركات الناشئة ذات الرؤية الثاقبة. وجودنا المزدوج في باريس وتونس يسمح لنا بتقديم دعم فوري وميداني لا يمكن لشركات أخرى مضاهاته.",
            vision_title: "رؤية عالمية",
            vision_desc: "التفكير خارج الحدود لفتح الإمكانات الدولية.",
            client_title: "التركيز على العميل",
            client_desc: "نجاحك هو المقياس الوحيد الذي يهمنا.",
            excellence_title: "التميز",
            excellence_desc: "تقديم جودة متميزة في كل استشارة.",
            offices_title: "مكاتبنا",
            offices_subtitle: "مع مواقع استراتيجية في باريس وتونس، نقدم دعماً شاملاً عبر أوروبا وشمال إفريقيا."
        }
    }
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
    dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('fr');

    const value = {
        language,
        setLanguage,
        t: translations[language],
        dir: (language === 'ar' ? 'rtl' : 'ltr') as 'ltr' | 'rtl'
    };

    return (
        <LanguageContext.Provider value={value}>
            <div dir={value.dir} className={value.dir === 'rtl' ? 'font-sans-arabic' : ''}>
                {children}
            </div>
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
