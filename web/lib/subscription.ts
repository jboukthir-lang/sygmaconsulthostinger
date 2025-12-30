export interface SubscriptionPlan {
    id: string;
    name: string;
    display_name: string;
    price_monthly: number;
    price_yearly: number;
    description: string;
    max_clients: number | null;
    max_invoices: number | null;
    max_products: number | null;
    max_users: number | null;
    custom_branding: boolean;
    export_accounting: boolean;
    api_access: boolean;
    priority_support: boolean;
    is_active: boolean;
}

// Default plans as fallback
export function getDefaultPlans(): SubscriptionPlan[] {
    return [
        {
            id: '1',
            name: 'free',
            display_name: 'Gratuit',
            price_monthly: 0,
            price_yearly: 0,
            description: 'Parfait pour les freelances qui débutent',
            max_clients: 3,
            max_invoices: null,
            max_products: 10,
            max_users: 1,
            custom_branding: false,
            export_accounting: false,
            api_access: false,
            priority_support: false,
            is_active: true,
        },
        {
            id: '2',
            name: 'start',
            display_name: 'Start',
            price_monthly: 19,
            price_yearly: 228,
            description: 'Pour les petites entreprises en croissance',
            max_clients: null,
            max_invoices: null,
            max_products: null,
            max_users: 1,
            custom_branding: true,
            export_accounting: true,
            api_access: false,
            priority_support: true,
            is_active: true,
        },
        {
            id: '3',
            name: 'pro',
            display_name: 'Pro',
            price_monthly: 49,
            price_yearly: 588,
            description: 'Fonctionnalités avancées pour les agences',
            max_clients: null,
            max_invoices: null,
            max_products: null,
            max_users: 5,
            custom_branding: true,
            export_accounting: true,
            api_access: true,
            priority_support: true,
            is_active: true,
        },
        {
            id: '4',
            name: 'enterprise',
            display_name: 'Enterprise',
            price_monthly: 0,
            price_yearly: 0,
            description: 'Solution sur mesure pour les grandes structures',
            max_clients: null,
            max_invoices: null,
            max_products: null,
            max_users: null,
            custom_branding: true,
            export_accounting: true,
            api_access: true,
            priority_support: true,
            is_active: true,
        },
    ];
}

// Get all subscription plans
export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    try {
        // Return default plans (no database dependency)
        return getDefaultPlans();
    } catch (error) {
        console.error('Error fetching subscription plans:', error);
        return getDefaultPlans();
    }
}

// Get a specific plan by name
export async function getSubscriptionPlan(planName: string): Promise<SubscriptionPlan | null> {
    const plans = await getSubscriptionPlans();
    return plans.find(p => p.name === planName) || null;
}
