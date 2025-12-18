import type { Database } from '@/types/database.types';

export type Lead = Database['public']['Tables']['leads']['Row'];
export type LeadInsert = Database['public']['Tables']['leads']['Insert'];
export type LeadUpdate = Database['public']['Tables']['leads']['Update'];

export type StatusHistory = Database['public']['Tables']['status_history']['Row'];
export type StatusHistoryInsert = Database['public']['Tables']['status_history']['Insert'];

export type LeadDirection = 'made' | 'received';

export type LeadStatus = 'Engaged' | 'Booked Call' | 'Proposal Sent' | 'Closed';

export const LEAD_STATUSES: LeadStatus[] = [
  'Engaged',
  'Booked Call',
  'Proposal Sent',
  'Closed',
];

export const LEAD_DIRECTIONS: { value: LeadDirection; label: string }[] = [
  { value: 'made', label: 'Made (Sent)' },
  { value: 'received', label: 'Received' },
];

export interface LeadWithPartner extends Lead {
  partner?: {
    id: string;
    company_name: string;
    contact_name: string | null;
    email?: string | null;
    phone?: string | null;
    services?: string | null;
  };
}

export interface LeadFilters {
  partner_id?: string;
  direction?: LeadDirection;
  status?: LeadStatus;
  date_from?: string;
  date_to?: string;
}
