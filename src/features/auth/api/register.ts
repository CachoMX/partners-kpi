import { useMutation } from '@tanstack/react-query';
import { auth } from '@/lib/supabase';
import type { RegisterCredentials } from '../types/auth.types';

export const useRegister = () => {
  return useMutation({
    mutationFn: async ({ email, password }: RegisterCredentials) => {
      const { data, error } = await auth.signUp(email, password);
      if (error) throw error;
      return data;
    },
  });
};
