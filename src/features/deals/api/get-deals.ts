import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Deal, DealFilters } from '../types/deal.types';

export const getDeals = async (filters?: DealFilters): Promise<Deal[]> => {
  let query = supabase
    .from('deals')
    .select(`
      *,
      lead:leads(
        id,
        lead_name,
        lead_company,
        partner_id,
        partner:partners(
          id,
          company_name
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (filters?.lead_id) {
    query = query.eq('lead_id', filters.lead_id);
  }

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.tier) {
    query = query.eq('tier', filters.tier);
  }

  if (filters?.is_recurring !== undefined) {
    query = query.eq('is_recurring', filters.is_recurring);
  }

  if (filters?.partner_id) {
    query = query.eq('lead.partner_id', filters.partner_id);
  }

  if (filters?.date_from) {
    query = query.gte('close_date', filters.date_from);
  }

  if (filters?.date_to) {
    query = query.lte('close_date', filters.date_to);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch deals: ${error.message}`);
  }

  return (data || []).map((deal) => ({
    ...deal,
    commission_amount: (deal.deal_value * deal.commission_percent) / 100,
  }));
};

export const useDeals = (filters?: DealFilters) => {
  return useQuery({
    queryKey: ['deals', filters],
    queryFn: () => getDeals(filters),
  });
};
