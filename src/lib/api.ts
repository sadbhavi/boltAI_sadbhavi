import { supabase } from './supabase';
import type { 
  Profile, 
  Content, 
  Category, 
  BlogPost, 
  BlogCategory, 
  SubscriptionPlan,
  UserSession,
  MoodTracking,
  DatingMessage,
  DatingSetting
} from './supabase';

// Auth API
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
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  },
};

// Profile API
export const profileAPI = {
  async getProfile(userId: string): Promise<{ data: Profile | null; error: any }> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },
};

// Content API
export const contentAPI = {
  async getCategories(): Promise<{ data: Category[] | null; error: any }> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    return { data, error };
  },

  async getContent(filters?: {
    category?: string;
    contentType?: string;
    featured?: boolean;
    premium?: boolean;
    limit?: number;
  }): Promise<{ data: Content[] | null; error: any }> {
    let query = supabase
      .from('content')
      .select(`
        *,
        category:categories(*)
      `);

    if (filters?.category) {
      query = query.eq('category.slug', filters.category);
    }
    if (filters?.contentType) {
      query = query.eq('content_type', filters.contentType);
    }
    if (filters?.featured !== undefined) {
      query = query.eq('is_featured', filters.featured);
    }
    if (filters?.premium !== undefined) {
      query = query.eq('is_premium', filters.premium);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    return { data, error };
  },

  async getContentBySlug(slug: string): Promise<{ data: Content | null; error: any }> {
    const { data, error } = await supabase
      .from('content')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('slug', slug)
      .single();
    return { data, error };
  },

  async incrementPlayCount(contentId: string) {
    const { data, error } = await supabase.rpc('increment_play_count', {
      content_id: contentId
    });
    return { data, error };
  },
};

// Blog API
export const blogAPI = {
  async getBlogCategories(): Promise<{ data: BlogCategory[] | null; error: any }> {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .eq('is_active', true)
      .order('name');
    return { data, error };
  },

  async getBlogPosts(filters?: {
    category?: string;
    featured?: boolean;
    limit?: number;
  }): Promise<{ data: BlogPost[] | null; error: any }> {
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(*)
      `)
      .eq('status', 'published');

    if (filters?.category) {
      query = query.eq('category.slug', filters.category);
    }
    if (filters?.featured !== undefined) {
      query = query.eq('is_featured', filters.featured);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    query = query.order('published_at', { ascending: false });

    const { data, error } = await query;
    return { data, error };
  },

  async getBlogPostBySlug(slug: string): Promise<{ data: BlogPost | null; error: any }> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(*)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();
    return { data, error };
  },

  async incrementViewCount(postId: string) {
    const { data, error } = await supabase.rpc('increment_view_count', {
      post_id: postId
    });
    return { data, error };
  },
};

// Subscription API
export const subscriptionAPI = {
  async getSubscriptionPlans(): Promise<{ data: SubscriptionPlan[] | null; error: any }> {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('price_monthly', { ascending: true, nullsFirst: true });
    return { data, error };
  },

  async getUserSubscription(userId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        plan:subscription_plans(*)
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();
    return { data, error };
  },

  async createSubscription(userId: string, planId: string, billingCycle: 'monthly' | 'annual') {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_id: planId,
        billing_cycle: billingCycle,
        status: 'trial',
        trial_start: new Date().toISOString(),
        trial_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();
    return { data, error };
  },
};

// User Progress API
export const progressAPI = {
  async getUserProgress(userId: string, contentId?: string) {
    let query = supabase
      .from('user_progress')
      .select(`
        *,
        content:content(*)
      `)
      .eq('user_id', userId);

    if (contentId) {
      query = query.eq('content_id', contentId).single();
    }

    const { data, error } = await query;
    return { data, error };
  },

  async updateProgress(userId: string, contentId: string, progressPercentage: number, lastPositionSeconds?: number) {
    const updates: any = {
      user_id: userId,
      content_id: contentId,
      progress_percentage: progressPercentage,
      updated_at: new Date().toISOString(),
    };

    if (lastPositionSeconds !== undefined) {
      updates.last_position_seconds = lastPositionSeconds;
    }

    if (progressPercentage >= 100) {
      updates.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('user_progress')
      .upsert(updates)
      .select()
      .single();
    return { data, error };
  },

  async getUserFavorites(userId: string) {
    const { data, error } = await supabase
      .from('user_favorites')
      .select(`
        *,
        content:content(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  async toggleFavorite(userId: string, contentId: string) {
    // Check if already favorited
    const { data: existing } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('content_id', contentId)
      .single();

    if (existing) {
      // Remove from favorites
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('id', existing.id);
      return { data: { favorited: false }, error };
    } else {
      // Add to favorites
      const { data, error } = await supabase
        .from('user_favorites')
        .insert({
          user_id: userId,
          content_id: contentId,
        })
        .select()
        .single();
      return { data: { favorited: true, ...data }, error };
    }
  },
};

// Analytics API
export const analyticsAPI = {
  async recordSession(userId: string, contentId: string, sessionType: string, durationSeconds: number, completed: boolean) {
    const { data, error } = await supabase
      .from('user_sessions')
      .insert({
        user_id: userId,
        content_id: contentId,
        session_type: sessionType,
        duration_seconds: durationSeconds,
        completed,
      })
      .select()
      .single();
    return { data, error };
  },

  async getUserStats(userId: string) {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();
    return { data, error };
  },

  async updateUserStats(userId: string) {
    // This would typically be handled by a database function or trigger
    const { data, error } = await supabase.rpc('update_user_stats', {
      user_id: userId
    });
    return { data, error };
  },

  async recordMood(userId: string, moodScore: number, emotions?: string[], notes?: string) {
    const { data, error } = await supabase
      .from('mood_tracking')
      .upsert({
        user_id: userId,
        mood_score: moodScore,
        emotions,
        notes,
        tracking_date: new Date().toISOString().split('T')[0],
      })
      .select()
      .single();
    return { data, error };
  },

  async getMoodHistory(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('mood_tracking')
      .select('*')
      .eq('user_id', userId)
      .gte('tracking_date', startDate.toISOString().split('T')[0])
      .order('tracking_date', { ascending: false });
    return { data, error };
  },
};

// Dating API
export const datingAPI = {
  async getMessages(matchId: string): Promise<{ data: DatingMessage[] | null; error: any }> {
    const { data, error } = await supabase
      .from('dating_messages')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true });
    return { data, error };
  },

  async sendMessage(
    matchId: string,
    senderId: string,
    content: string,
    messageType: 'text' | 'image' | 'emoji' = 'text'
  ): Promise<{ data: DatingMessage | null; error: any }> {
    const { data, error } = await supabase
      .from('dating_messages')
      .insert({ match_id: matchId, sender_id: senderId, content, message_type: messageType })
      .select()
      .single();
    return { data, error };
  },

  async markAsRead(messageId: string): Promise<{ data: DatingMessage | null; error: any }> {
    const { data, error } = await supabase
      .from('dating_messages')
      .update({ is_read: true })
      .eq('id', messageId)
      .select()
      .single();
    return { data, error };
  },

  async getSettings(userId: string): Promise<{ data: DatingSetting | null; error: any }> {
    const { data, error } = await supabase
      .from('dating_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    return { data, error };
  },

  async updateSettings(userId: string, updates: Partial<DatingSetting>): Promise<{ data: DatingSetting | null; error: any }> {
    const { data, error } = await supabase
      .from('dating_settings')
      .upsert({ ...updates, user_id: userId, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
      .select()
      .single();
    return { data, error };
  },
};