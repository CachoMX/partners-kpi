import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { DashboardStats, TopPartner, RecentLead, DashboardFilters } from '../types/dashboard.types';

// Fetch dashboard statistics
const getDashboardStats = async (filters?: DashboardFilters): Promise<DashboardStats> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  // Fetch total partners count
  const { count: totalPartners, error: partnersError } = await supabase
    .from('partners')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (partnersError) throw partnersError;

  // Fetch all leads to calculate stats with date filtering
  let leadsQuery = supabase
    .from('leads')
    .select('direction, status, intro_date')
    .eq('user_id', user.id);

  if (filters?.date_from) {
    leadsQuery = leadsQuery.gte('intro_date', filters.date_from);
  }

  if (filters?.date_to) {
    leadsQuery = leadsQuery.lte('intro_date', filters.date_to);
  }

  const { data: leads, error: leadsError } = await leadsQuery;

  if (leadsError) throw leadsError;

  // Calculate lead statistics
  const totalLeads = leads?.length || 0;
  const leadsMade =
    leads?.filter((l: { direction: string }) => l.direction === 'made').length || 0;
  const leadsReceived =
    leads?.filter((l: { direction: string }) => l.direction === 'received').length || 0;

  // Calculate status breakdown
  const statusBreakdown = {
    engaged: leads?.filter((l: { status: string }) => l.status === 'Engaged').length || 0,
    bookedCall: leads?.filter((l: { status: string }) => l.status === 'Booked Call').length || 0,
    proposalSent:
      leads?.filter((l: { status: string }) => l.status === 'Proposal Sent').length || 0,
    closed: leads?.filter((l: { status: string }) => l.status === 'Closed').length || 0,
  };

  return {
    totalPartners: totalPartners || 0,
    totalLeads,
    leadsMade,
    leadsReceived,
    statusBreakdown,
  };
};

// Fetch top partners by intro count
const getTopPartners = async (filters?: DashboardFilters): Promise<TopPartner[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  // Fetch all leads with partner data and date filtering
  let leadsQuery = supabase
    .from('leads')
    .select('partner_id, intro_date')
    .eq('user_id', user.id);

  if (filters?.date_from) {
    leadsQuery = leadsQuery.gte('intro_date', filters.date_from);
  }

  if (filters?.date_to) {
    leadsQuery = leadsQuery.lte('intro_date', filters.date_to);
  }

  const { data: leads, error: leadsError } = await leadsQuery;

  if (leadsError) throw leadsError;

  // Count intros per partner
  const partnerCounts = new Map<string, number>();
  leads?.forEach((lead: { partner_id: string }) => {
    const count = partnerCounts.get(lead.partner_id) || 0;
    partnerCounts.set(lead.partner_id, count + 1);
  });

  // Get partner details
  const partnerIds = Array.from(partnerCounts.keys());
  if (partnerIds.length === 0) {
    return [];
  }

  const { data: partners, error: partnersError } = await supabase
    .from('partners')
    .select('id, company_name')
    .in('id', partnerIds);

  if (partnersError) throw partnersError;

  // Combine partner data with counts
  const topPartners: TopPartner[] = (partners || [])
    .map((partner: { id: string; company_name: string }) => ({
      id: partner.id,
      company_name: partner.company_name,
      intro_count: partnerCounts.get(partner.id) || 0,
    }))
    .sort((a, b) => b.intro_count - a.intro_count)
    .slice(0, 10);

  return topPartners;
};

// Fetch recent leads
const getRecentLeads = async (filters?: DashboardFilters): Promise<RecentLead[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  let leadsQuery = supabase
    .from('leads')
    .select(`
      id,
      lead_name,
      lead_company,
      status,
      direction,
      intro_date,
      created_at,
      partner:partners (
        id,
        company_name
      )
    `)
    .eq('user_id', user.id);

  if (filters?.date_from) {
    leadsQuery = leadsQuery.gte('intro_date', filters.date_from);
  }

  if (filters?.date_to) {
    leadsQuery = leadsQuery.lte('intro_date', filters.date_to);
  }

  const { data, error } = await leadsQuery
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) throw error;

  return (data || []) as RecentLead[];
};

// React Query hooks
export const useGetDashboardStats = (filters?: DashboardFilters) => {
  return useQuery({
    queryKey: ['dashboard', 'stats', filters],
    queryFn: () => getDashboardStats(filters),
  });
};

export const useGetTopPartners = (filters?: DashboardFilters) => {
  return useQuery({
    queryKey: ['dashboard', 'top-partners', filters],
    queryFn: () => getTopPartners(filters),
  });
};

export const useGetRecentLeads = (filters?: DashboardFilters) => {
  return useQuery({
    queryKey: ['dashboard', 'recent-leads', filters],
    queryFn: () => getRecentLeads(filters),
  });
};
