import type { PostgrestError } from '@supabase/supabase-js';
import type { Profile } from '../supabase';

const STORAGE_KEY = 'sadbhavi_profiles';

const getStoredProfiles = (): Record<string, Profile> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const saveProfile = (profile: Profile) => {
  const profiles = getStoredProfiles();
  profiles[profile.id] = profile;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
};

export const profileAPI = {
  async getProfile(userId: string): Promise<{ data: Profile | null; error: PostgrestError | null }> {
    const profiles = getStoredProfiles();
    const profile = profiles[userId];

    if (profile) {
      return { data: profile, error: null };
    }

    // specific mock for new user if not found
    const newProfile: Profile = {
      id: userId,
      email: '',
      full_name: 'New User',
      subscription_status: 'free',
      subscription_plan: 'free',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    saveProfile(newProfile);

    return { data: newProfile, error: null };
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<{ data: Profile | null; error: PostgrestError | null }> {
    const profiles = getStoredProfiles();
    const existing = profiles[userId];

    if (!existing) {
      return {
        data: null,
        error: {
          message: 'Profile not found',
          code: '404',
          details: '',
          hint: '',
          name: 'PostgrestError'
        }
      };
    }

    const updated = { ...existing, ...updates, updated_at: new Date().toISOString() };
    saveProfile(updated);

    return { data: updated, error: null };
  },
};
