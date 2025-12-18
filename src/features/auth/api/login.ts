import { useMutation } from '@tanstack/react-query';
import { auth } from '@/lib/supabase';
import type { LoginCredentials } from '../types/auth.types';

export const useLogin = () => {
  return useMutation({
    mutationFn: async ({ email, password }: LoginCredentials) => {
      const { data, error } = await auth.signIn(email, password);
      if (error) throw error;
      return data;
    },
  });
};
