export type DealStatus = 'pending' | 'won' | 'lost' | 'on_hold';

export type DealTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Deal {
  id: string;
  lead_id: string;
  deal_value: number;
  commission_percent: number;
  commission_amount?: number;
  is_recurring: boolean;
  recurring_frequency?: 'monthly' | 'quarterly' | 'annually';
  tier?: DealTier;
  status: DealStatus;
  close_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Relations
  lead?: {
    id: string;
    lead_name: string;
    lead_company?: string;
    partner_id: string;
    partner?: {
      id: string;
      company_name: string;
    };
  };
}

export interface CreateDealInput {
  lead_id: string;
  deal_value: number;
  commission_percent: number;
  is_recurring: boolean;
  recurring_frequency?: 'monthly' | 'quarterly' | 'annually';
  tier?: DealTier;
  status: DealStatus;
  close_date?: string;
  notes?: string;
}

export interface UpdateDealInput {
  deal_value?: number;
  commission_percent?: number;
  is_recurring?: boolean;
  recurring_frequency?: 'monthly' | 'quarterly' | 'annually';
  tier?: DealTier;
  status?: DealStatus;
  close_date?: string;
  notes?: string;
}

export interface DealFilters {
  lead_id?: string;
  partner_id?: string;
  status?: DealStatus;
  tier?: DealTier;
  is_recurring?: boolean;
  date_from?: string;
  date_to?: string;
}

export const DEAL_STATUSES: DealStatus[] = ['pending', 'won', 'lost', 'on_hold'];

export const DEAL_TIERS: DealTier[] = ['bronze', 'silver', 'gold', 'platinum'];

export const RECURRING_FREQUENCIES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually', label: 'Annually' },
] as const;
