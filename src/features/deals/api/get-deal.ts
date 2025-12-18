import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Deal } from '../types/deal.types';

export const getDeal = async (id: string): Promise<Deal> => {
  const { data, error } = await supabase
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
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch deal: ${error.message}`);
  }

  return {
    ...data,
    commission_amount: (data.deal_value * data.commission_percent) / 100,
  };
};

export const useGetDeal = (id: string) => {
  return useQuery({
    queryKey: ['deal', id],
    queryFn: () => getDeal(id),
    enabled: !!id,
  });
};
