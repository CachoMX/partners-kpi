import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useDeletePartner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (partnerId: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', partnerId)
        .eq('user_id', user.id);

      if (error) throw error;

      return partnerId;
    },
    onSuccess: () => {
      // Invalidate partners list
      queryClient.invalidateQueries({ queryKey: ['partners'] });
    },
  });
};
