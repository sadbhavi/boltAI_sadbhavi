import { supabase } from './supabase';

export interface AudioContent {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  imageUrl: string;
  duration: number;
  category: string;
  type: 'soundscape' | 'sleep_story' | 'breathing' | 'music';
  isPremium: boolean;
  tags: string[];
  playCount: number;
  rating: number;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  audioItems: AudioContent[];
  duration: number;
  isPublic: boolean;
}

// Audio Content API
export const audioAPI = {
  // Get all audio content with filters
  async getAudioContent(filters?: {
    type?: string;
    category?: string;
    isPremium?: boolean;
    limit?: number;
  }): Promise<{ data: AudioContent[] | null; error: any }> {
    let query = supabase
      .from('audio_content')
      .select('*');

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.isPremium !== undefined) {
      query = query.eq('is_premium', filters.isPremium);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    return { data, error };
  },

  // Get soundscapes
  async getSoundscapes(): Promise<{ data: AudioContent[] | null; error: any }> {
    return this.getAudioContent({ type: 'soundscape' });
  },

  // Get sleep stories
  async getSleepStories(): Promise<{ data: AudioContent[] | null; error: any }> {
    return this.getAudioContent({ type: 'sleep_story' });
  },

  // Get breathing exercises
  async getBreathingExercises(): Promise<{ data: AudioContent[] | null; error: any }> {
    return this.getAudioContent({ type: 'breathing' });
  },

  // Get relaxation music
  async getRelaxationMusic(): Promise<{ data: AudioContent[] | null; error: any }> {
    return this.getAudioContent({ type: 'music' });
  },

  // Record play session
  async recordPlaySession(audioId: string, userId?: string, duration?: number) {
    const sessionData: any = {
      audio_id: audioId,
      played_at: new Date().toISOString(),
    };

    if (userId) {
      sessionData.user_id = userId;
    }
    if (duration) {
      sessionData.duration_seconds = duration;
    }

    const { data, error } = await supabase
      .from('audio_sessions')
      .insert(sessionData);

    // Update play count
    await supabase.rpc('increment_audio_play_count', { audio_id: audioId });

    return { data, error };
  },

  // Get user's listening history
  async getListeningHistory(userId: string, limit: number = 20) {
    const { data, error } = await supabase
      .from('audio_sessions')
      .select(`
        *,
        audio_content:audio_content(*)
      `)
      .eq('user_id', userId)
      .order('played_at', { ascending: false })
      .limit(limit);

    return { data, error };
  },

  // Search audio content
  async searchAudio(query: string, filters?: {
    type?: string;
    category?: string;
  }) {
    let dbQuery = supabase
      .from('audio_content')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`);

    if (filters?.type) {
      dbQuery = dbQuery.eq('type', filters.type);
    }
    if (filters?.category) {
      dbQuery = dbQuery.eq('category', filters.category);
    }

    const { data, error } = await dbQuery
      .order('play_count', { ascending: false })
      .limit(50);

    return { data, error };
  }
};

// Playlist API
export const playlistAPI = {
  // Get user playlists
  async getUserPlaylists(userId: string) {
    const { data, error } = await supabase
      .from('playlists')
      .select(`
        *,
        playlist_items:playlist_items(
          *,
          audio_content:audio_content(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  // Create playlist
  async createPlaylist(userId: string, name: string, description?: string, isPublic: boolean = false) {
    const { data, error } = await supabase
      .from('playlists')
      .insert({
        user_id: userId,
        name,
        description,
        is_public: isPublic,
      })
      .select()
      .single();

    return { data, error };
  },

  // Add item to playlist
  async addToPlaylist(playlistId: string, audioId: string) {
    const { data, error } = await supabase
      .from('playlist_items')
      .insert({
        playlist_id: playlistId,
        audio_id: audioId,
      });

    return { data, error };
  },

  // Remove item from playlist
  async removeFromPlaylist(playlistId: string, audioId: string) {
    const { data, error } = await supabase
      .from('playlist_items')
      .delete()
      .eq('playlist_id', playlistId)
      .eq('audio_id', audioId);

    return { data, error };
  },

  // Get public playlists
  async getPublicPlaylists(limit: number = 20) {
    const { data, error } = await supabase
      .from('playlists')
      .select(`
        *,
        playlist_items:playlist_items(
          *,
          audio_content:audio_content(*)
        )
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    return { data, error };
  }
};

// Audio Analytics API
export const audioAnalyticsAPI = {
  // Get popular content
  async getPopularContent(type?: string, limit: number = 10) {
    let query = supabase
      .from('audio_content')
      .select('*');

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query
      .order('play_count', { ascending: false })
      .limit(limit);

    return { data, error };
  },

  // Get user listening stats
  async getUserListeningStats(userId: string) {
    const { data, error } = await supabase
      .from('user_audio_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    return { data, error };
  },

  // Get trending content
  async getTrendingContent(days: number = 7, limit: number = 10) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('audio_sessions')
      .select(`
        audio_id,
        audio_content:audio_content(*),
        count:count()
      `)
      .gte('played_at', startDate.toISOString())
      .group('audio_id')
      .order('count', { ascending: false })
      .limit(limit);

    return { data, error };
  }
};