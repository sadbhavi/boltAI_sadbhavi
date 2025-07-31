import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import type { Profile } from '../supabase';

export const profileAPI = {
  async getProfile(userId: string): Promise<{ data: Profile | null; error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<{ data: Profile | null; error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },
};
