import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Partner } from '../types/partner.types';

export const useGetPartner = (partnerId: string | undefined) => {
  return useQuery({
    queryKey: ['partners', partnerId],
    queryFn: async () => {
      if (!partnerId) {
        throw new Error('Partner ID is required');
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('id', partnerId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      return data as Partner;
    },
    enabled: !!partnerId,
  });
};
