import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth';
import { auth } from '@/lib/supabase';

export function useAuth() {
  const { user, session, setUser, setSession, clearAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state
    const {
      data: { subscription },
    } = auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setSession, setUser]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await auth.signIn(email, password);
    if (error) throw error;
    return data;
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await auth.signUp(email, password);
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await auth.signOut();
    if (error) throw error;
    clearAuth();
  };

  const resetPassword = async (email: string) => {
    const { error } = await auth.resetPassword(email);
    if (error) throw error;
  };

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
}
