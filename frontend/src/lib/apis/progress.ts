import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../supabase';

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
    return { data, error } as { data: unknown; error: PostgrestError | null };
  },

  async updateProgress(
    userId: string,
    contentId: string,
    progressPercentage: number,
    lastPositionSeconds?: number,
  ) {
    const updates: Record<string, unknown> = {
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
    return { data, error } as { data: unknown; error: PostgrestError | null };
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
    return { data, error } as { data: unknown; error: PostgrestError | null };
  },

  async toggleFavorite(userId: string, contentId: string) {
    const { data: existing } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('content_id', contentId)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('id', existing.id);
      return { data: { favorited: false }, error } as { data: unknown; error: PostgrestError | null };
    }
    const { data, error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: userId,
        content_id: contentId,
      })
      .select()
      .single();
    return { data: { favorited: true, ...data }, error } as { data: unknown; error: PostgrestError | null };
  },
};
