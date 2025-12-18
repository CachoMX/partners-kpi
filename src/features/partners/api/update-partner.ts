import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { UpdatePartnerDTO } from '../types/partner.types';

export const useUpdatePartner = (partnerId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (partnerData: UpdatePartnerDTO) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('partners')
        .update({
          ...partnerData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', partnerId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      queryClient.invalidateQueries({ queryKey: ['partners', partnerId] });
    },
  });
};
