import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Create a mock client if using placeholder values
const isPlaceholder = supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key';

export const supabase = isPlaceholder 
  ? createMockSupabaseClient() 
  : createClient(supabaseUrl, supabaseAnonKey);

function createMockSupabaseClient() {
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
      resetPasswordForEmail: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
          order: () => Promise.resolve({ data: [], error: null }),
          limit: () => Promise.resolve({ data: [], error: null }),
        }),
        order: () => Promise.resolve({ data: [], error: null }),
        limit: () => Promise.resolve({ data: [], error: null }),
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
          }),
        }),
      }),
      upsert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
    }),
    rpc: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
  } as any;
}

// Types
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  subscription_status: 'free' | 'trial' | 'active' | 'cancelled' | 'expired';
  subscription_plan: 'free' | 'monthly' | 'annual' | 'family' | 'lifetime';
  trial_ends_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Content {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content_type: 'meditation' | 'sleep_story' | 'breathing' | 'soundscape' | 'masterclass';
  category_id: string;
  duration_minutes?: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  audio_url?: string;
  image_url?: string;
  transcript?: string;
  is_premium: boolean;
  is_featured: boolean;
  play_count: number;
  rating_average: number;
  rating_count: number;
  tags?: string[];
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  author_name: string;
  author_avatar?: string;
  category_id: string;
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  view_count: number;
  read_time_minutes: number;
  tags?: string[];
  published_at?: string;
  created_at: string;
  updated_at: string;
  category?: BlogCategory;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  is_active: boolean;
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price_monthly?: number;
  price_annual?: number;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
  trial_days: number;
  max_family_members: number;
  created_at: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  content_id: string;
  session_type: 'meditation' | 'sleep_story' | 'breathing' | 'soundscape';
  duration_seconds: number;
  completed: boolean;
  session_date: string;
  created_at: string;
}

export interface MoodTracking {
  id: string;
  user_id: string;
  mood_score: number;
  emotions?: string[];
  notes?: string;
  tracking_date: string;
  created_at: string;
}

export interface DatingMessage {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'emoji';
  is_read: boolean;
  created_at: string;
}

export interface DatingSetting {
  id: string;
  user_id: string;
  profile_visibility: boolean;
  show_online_status: boolean;
  allow_messages: boolean;
  push_notifications: boolean;
  email_notifications: boolean;
  show_distance: boolean;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
}