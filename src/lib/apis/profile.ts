
import type { PostgrestError } from '@supabase/supabase-js';
import type { Profile } from '../supabase';

const API_URL = '/api/profile';

export const profileAPI = {
  /**
   * Get user profile by email
   * @param email - The user's email address
   */
  async getProfile(email: string): Promise<{ data: Profile | null; error: PostgrestError | null }> {
    try {
      const res = await fetch(`${API_URL}/${encodeURIComponent(email)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message);

      // If null (not found), return a default profile for new users
      if (!json.data) {
        const newProfile: Profile = {
          id: email,
          email: email,
          full_name: '',
          subscription_status: 'free',
          subscription_plan: 'free',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return { data: newProfile, error: null };
      }

      return { data: json.data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } as any };
    }
  },

  /**
   * Update user profile (upsert by email)
   * @param _userId - Unused, kept for API compatibility
   * @param updates - Profile fields to update (must include email)
   */
  async updateProfile(_userId: string, updates: Partial<Profile>): Promise<{ data: Profile | null; error: PostgrestError | null }> {
    try {
      if (!updates.email) {
        throw new Error('Email is required for profile update');
      }

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message);
      return { data: json.data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } as any };
    }
  },
};
