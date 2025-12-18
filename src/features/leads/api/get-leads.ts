import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { LeadWithPartner, LeadFilters } from '../types/lead.types';

export const getLeads = async (filters?: LeadFilters): Promise<LeadWithPartner[]> => {
  let query = supabase
    .from('leads')
    .select(`
      *,
      partner:partners (
        id,
        company_name,
        contact_name
      )
    `)
    .order('intro_date', { ascending: false });

  if (filters?.partner_id) {
    query = query.eq('partner_id', filters.partner_id);
  }

  if (filters?.direction) {
    query = query.eq('direction', filters.direction);
  }

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.date_from) {
    query = query.gte('intro_date', filters.date_from);
  }

  if (filters?.date_to) {
    query = query.lte('intro_date', filters.date_to);
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data || []) as LeadWithPartner[];
};

export const useLeads = (filters?: LeadFilters) => {
  return useQuery({
    queryKey: ['leads', filters],
    queryFn: () => getLeads(filters),
  });
};
