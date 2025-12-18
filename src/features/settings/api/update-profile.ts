import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { UpdateProfileInput } from '../types/profile.types';

export const updateProfile = async (userId: string, input: UpdateProfileInput) => {
  // First, check if profile exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single();

  if (!existingProfile) {
    // Create profile if it doesn't exist
    const { data, error } = await supabase
      .from('profiles')
      .insert({ id: userId, ...input })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Update existing profile
  const { data, error } = await supabase
    .from('profiles')
    .update(input)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, input }: { userId: string; input: UpdateProfileInput }) =>
      updateProfile(userId, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['profile', variables.userId] });
    },
  });
};
