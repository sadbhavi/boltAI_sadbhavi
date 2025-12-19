import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import type { DatingMessage, DatingSetting } from '../supabase';

export const datingAPI = {
  async getMessages(matchId: string): Promise<{ data: DatingMessage[] | null; error: PostgrestError | null }> {
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
    messageType: 'text' | 'image' | 'emoji' = 'text',
  ): Promise<{ data: DatingMessage | null; error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('dating_messages')
      .insert({ match_id: matchId, sender_id: senderId, content, message_type: messageType })
      .select()
      .single();
    return { data, error };
  },

  async markAsRead(messageId: string): Promise<{ data: DatingMessage | null; error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('dating_messages')
      .update({ is_read: true })
      .eq('id', messageId)
      .select()
      .single();
    return { data, error };
  },

  async getSettings(userId: string): Promise<{ data: DatingSetting | null; error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('dating_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    return { data, error };
  },

  async updateSettings(userId: string, updates: Partial<DatingSetting>): Promise<{ data: DatingSetting | null; error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('dating_settings')
      .upsert({ ...updates, user_id: userId, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
      .select()
      .single();
    return { data, error };
  },
};
