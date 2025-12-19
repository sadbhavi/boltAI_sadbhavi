import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../supabase';

export const authAPI = {
  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { data, error } as { data: unknown; error: PostgrestError | null };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error } as { data: unknown; error: PostgrestError | null };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error } as { error: PostgrestError | null };
  },

  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return { user, error } as { user: unknown; error: PostgrestError | null };
  },

  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error } as { data: unknown; error: PostgrestError | null };
  },
};
