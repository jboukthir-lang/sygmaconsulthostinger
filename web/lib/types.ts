export interface InvoiceItem {
    description: string;
    quantity: number;
    unit_price: number;
    tax_rate: number; // Percentage (e.g., 20)
    total: number; // Calculated: qty * price
}

export interface Invoice {
    id: string;
    created_at: string;
    updated_at: string;
    type: 'quote' | 'invoice' | 'credit_note';
    status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'paid' | 'overdue' | 'cancelled';
    number: string;

    // Client
    client_name: string;
    client_email?: string;
    client_address?: string;
    client_siret?: string;

    // Financials
    currency: string;
    items: InvoiceItem[];
    total_excl_tax: number;
    total_tax: number;
    total_incl_tax: number;

    // Dates
    issue_date: string;
    due_date?: string;

    // Meta
    notes?: string;
    footer?: string;
}
