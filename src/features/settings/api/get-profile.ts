import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { UserProfile } from '../types/profile.types';

export const getProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    // If profile doesn't exist, return null (will be created on first update)
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }

  return data as UserProfile;
};

export const useProfile = (userId?: string) => {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getProfile(userId!),
    enabled: !!userId,
  });
};
