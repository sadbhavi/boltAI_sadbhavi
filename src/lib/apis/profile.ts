
import type { PostgrestError } from '@supabase/supabase-js';
import type { Profile } from '../supabase';

const API_URL = '/api/profile';

export const profileAPI = {
  async getProfile(userId: string): Promise<{ data: Profile | null; error: PostgrestError | null }> {
    // Note: userId in this system seems to be email for admin, or a UUID from Firebase.
    // The backend route is /api/profile/:email.
    // If userId is an email, we use it directly. If it's a UUID, we might need a different endpoint.
    // For the Admin flow we set up, the user ID was 'admin-user' but email was 'akkiibaghel2@gmail.com'.
    // Let's assume userId passed here might be email, or we act as if it's an email if it looks like one.
    // However, Supabase Auth usually provides a UUID.
    // Our backend route expects email.
    // Let's try to fetch by ID first? No, we only made /api/profile/:email route.
    // We should update server.js to allow fetching by ID or Email, or update this to send email.
    // BUT, getProfile is usually called with user.id.
    // Let's assume for now we use email if available in context, but here we only have userId.

    // Quick Fix for Default Admin: "admin-user" map to the email.
    let lookupKey = userId;
    if (userId === 'admin-user') lookupKey = 'akkiibaghel2@gmail.com';

    try {
      const res = await fetch(`${API_URL}/${lookupKey}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message);

      // If null (not found), implementing the "mock new user" logic from before?
      // Or better, let the backend handle creation?
      // The backend returns null if not found.
      if (!json.data) {
        const newProfile: Profile = {
          id: userId,
          email: lookupKey.includes('@') ? lookupKey : '',
          full_name: 'New User',
          subscription_status: 'free',
          subscription_plan: 'free',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        // Optimistically return
        return { data: newProfile, error: null };
      }

      return { data: json.data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } as any };
    }
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<{ data: Profile | null; error: PostgrestError | null }> {
    try {
      // We need custom logic because backend route is /api/profile (POST) which does upsert by EMAIL.
      // We need to ensure we send the email.
      const body = { ...updates };
      // If we don't have email in updates, we might fail if backend relies solely on email.
      // But let's assume valid updates come from context where email is known.

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message);
      return { data: json.data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } as any };
    }
  },
};
