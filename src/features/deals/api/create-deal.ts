import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { CreateDealInput } from '../types/deal.types';

export const createDeal = async (input: CreateDealInput) => {
  const { data, error } = await supabase
    .from('deals')
    .insert([input])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create deal: ${error.message}`);
  }

  return data;
};

export const useCreateDeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
};
