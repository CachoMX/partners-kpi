import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { StatusHistory } from '../types/lead.types';

export const getStatusHistory = async (leadId: string): Promise<StatusHistory[]> => {
  const { data, error } = await supabase
    .from('status_history')
    .select('*')
    .eq('lead_id', leadId)
    .order('changed_at', { ascending: false });

  if (error) throw error;

  return data || [];
};

export const useStatusHistory = (leadId: string) => {
  return useQuery({
    queryKey: ['status-history', leadId],
    queryFn: () => getStatusHistory(leadId),
    enabled: !!leadId,
  });
};
