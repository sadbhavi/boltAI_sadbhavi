import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../supabase';

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
    return { data, error } as { data: unknown; error: PostgrestError | null };
  },

  async getUserStats(userId: string) {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();
    return { data, error } as { data: unknown; error: PostgrestError | null };
  },

  async updateUserStats(userId: string) {
    const { data, error } = await supabase.rpc('update_user_stats', {
      user_id: userId,
    });
    return { data, error } as { data: unknown; error: PostgrestError | null };
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
    return { data, error } as { data: unknown; error: PostgrestError | null };
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
    return { data, error } as { data: unknown; error: PostgrestError | null };
  },
};
