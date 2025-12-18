import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { LeadUpdate, StatusHistoryInsert } from '../types/lead.types';

interface UpdateLeadParams {
  id: string;
  data: Omit<LeadUpdate, 'id' | 'user_id'>;
  previousStatus?: string;
}

export const updateLead = async ({
  id,
  data,
  previousStatus,
}: UpdateLeadParams): Promise<void> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('User not authenticated');

  const { error: updateError } = await supabase
    .from('leads')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (updateError) throw updateError;

  // If status changed, create a status history entry
  if (data.status && data.status !== previousStatus) {
    const statusHistory: Omit<StatusHistoryInsert, 'user_id'> = {
      lead_id: id,
      status: data.status,
      notes: null,
    };

    const { error: historyError } = await supabase
      .from('status_history')
      .insert({
        ...statusHistory,
        user_id: user.id,
      });

    if (historyError) throw historyError;
  }
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLead,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['status-history', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};
