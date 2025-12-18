import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { LeadWithPartner } from '../types/lead.types';

export const getLead = async (id: string): Promise<LeadWithPartner> => {
  const { data, error } = await supabase
    .from('leads')
    .select(`
      *,
      partner:partners (
        id,
        company_name,
        contact_name,
        email,
        phone,
        services
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) throw new Error('Lead not found');

  return data as LeadWithPartner;
};

export const useLead = (id: string) => {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: () => getLead(id),
    enabled: !!id,
  });
};
