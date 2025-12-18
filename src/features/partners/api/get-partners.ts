import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Partner } from '../types/partner.types';

export const useGetPartners = () => {
  return useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('user_id', user.id)
        .order('company_name', { ascending: true });

      if (error) throw error;

      return data as Partner[];
    },
  });
};
