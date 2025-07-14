import { useState, useEffect } from 'react';
import { audioAPI, playlistAPI, type AudioContent, type Playlist } from '../lib/audioApi';

export function useAudio() {
  const [soundscapes, setSoundscapes] = useState<AudioContent[]>([]);
  const [sleepStories, setSleepStories] = useState<AudioContent[]>([]);
  const [breathingExercises, setBreathingExercises] = useState<AudioContent[]>([]);
  const [relaxationMusic, setRelaxationMusic] = useState<AudioContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAudioContent();
  }, []);

  const loadAudioContent = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        soundscapesResult,
        sleepStoriesResult,
        breathingResult,
        musicResult
      ] = await Promise.all([
        audioAPI.getSoundscapes(),
        audioAPI.getSleepStories(),
        audioAPI.getBreathingExercises(),
        audioAPI.getRelaxationMusic()
      ]);

      if (soundscapesResult.error) throw soundscapesResult.error;
      if (sleepStoriesResult.error) throw sleepStoriesResult.error;
      if (breathingResult.error) throw breathingResult.error;
      if (musicResult.error) throw musicResult.error;

      setSoundscapes(soundscapesResult.data || []);
      setSleepStories(sleepStoriesResult.data || []);
      setBreathingExercises(breathingResult.data || []);
      setRelaxationMusic(musicResult.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const recordPlaySession = async (audioId: string, userId?: string, duration?: number) => {
    try {
      await audioAPI.recordPlaySession(audioId, userId, duration);
    } catch (err) {
      console.error('Error recording play session:', err);
    }
  };

  const searchAudio = async (query: string, filters?: { type?: string; category?: string }) => {
    try {
      const { data, error } = await audioAPI.searchAudio(query, filters);
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error searching audio:', err);
      return [];
    }
  };

  return {
    soundscapes,
    sleepStories,
    breathingExercises,
    relaxationMusic,
    loading,
    error,
    recordPlaySession,
    searchAudio,
    refetch: loadAudioContent,
  };
}

export function usePlaylist(userId?: string) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadPlaylists();
    }
  }, [userId]);

  const loadPlaylists = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await playlistAPI.getUserPlaylists(userId);
      if (error) throw error;

      setPlaylists(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createPlaylist = async (name: string, description?: string, isPublic: boolean = false) => {
    if (!userId) return null;

    try {
      const { data, error } = await playlistAPI.createPlaylist(userId, name, description, isPublic);
      if (error) throw error;

      await loadPlaylists(); // Refresh playlists
      return data;
    } catch (err) {
      console.error('Error creating playlist:', err);
      return null;
    }
  };

  const addToPlaylist = async (playlistId: string, audioId: string) => {
    try {
      const { error } = await playlistAPI.addToPlaylist(playlistId, audioId);
      if (error) throw error;

      await loadPlaylists(); // Refresh playlists
      return true;
    } catch (err) {
      console.error('Error adding to playlist:', err);
      return false;
    }
  };

  const removeFromPlaylist = async (playlistId: string, audioId: string) => {
    try {
      const { error } = await playlistAPI.removeFromPlaylist(playlistId, audioId);
      if (error) throw error;

      await loadPlaylists(); // Refresh playlists
      return true;
    } catch (err) {
      console.error('Error removing from playlist:', err);
      return false;
    }
  };

  return {
    playlists,
    loading,
    error,
    createPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    refetch: loadPlaylists,
  };
}