// Dashboard types

export interface DashboardFilters {
  date_from?: string;
  date_to?: string;
}

export interface DashboardStats {
  totalPartners: number;
  totalLeads: number;
  leadsMade: number;
  leadsReceived: number;
  statusBreakdown: {
    engaged: number;
    bookedCall: number;
    proposalSent: number;
    closed: number;
  };
}

export interface TopPartner {
  id: string;
  company_name: string;
  intro_count: number;
}

export interface RecentLead {
  id: string;
  lead_name: string;
  lead_company: string | null;
  status: string;
  direction: 'made' | 'received';
  intro_date: string;
  created_at: string;
  partner: {
    id: string;
    company_name: string;
  };
}
