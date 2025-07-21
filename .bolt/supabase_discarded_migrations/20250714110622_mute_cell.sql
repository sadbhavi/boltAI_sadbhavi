/*
  # Audio System Schema

  1. New Tables
    - `audio_content` - All audio content (soundscapes, sleep stories, breathing exercises, music)
    - `audio_sessions` - Track when users play audio content
    - `playlists` - User-created playlists
    - `playlist_items` - Items in playlists
    - `user_audio_stats` - User listening statistics

  2. Security
    - Enable RLS on all tables
    - Users can only access their own playlists and stats
    - Public read access for audio content
*/

-- Audio Content Table
CREATE TABLE IF NOT EXISTS audio_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  audio_url text NOT NULL,
  image_url text,
  duration_seconds integer DEFAULT 0,
  category text NOT NULL,
  type text NOT NULL CHECK (type IN ('soundscape', 'sleep_story', 'breathing', 'music')),
  is_premium boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  tags text[],
  play_count integer DEFAULT 0,
  rating_average decimal(3,2) DEFAULT 0,
  rating_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Audio Sessions Table (tracking plays)
CREATE TABLE IF NOT EXISTS audio_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  audio_id uuid REFERENCES audio_content(id) ON DELETE CASCADE,
  duration_seconds integer DEFAULT 0,
  completed boolean DEFAULT false,
  played_at timestamptz DEFAULT now()
);

-- Playlists Table
CREATE TABLE IF NOT EXISTS playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  image_url text,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Playlist Items Table
CREATE TABLE IF NOT EXISTS playlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id uuid REFERENCES playlists(id) ON DELETE CASCADE,
  audio_id uuid REFERENCES audio_content(id) ON DELETE CASCADE,
  sort_order integer DEFAULT 0,
  added_at timestamptz DEFAULT now(),
  UNIQUE(playlist_id, audio_id)
);

-- User Audio Statistics Table
CREATE TABLE IF NOT EXISTS user_audio_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  total_listening_time integer DEFAULT 0,
  favorite_category text,
  favorite_type text,
  sessions_count integer DEFAULT 0,
  last_listened_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE audio_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_audio_stats ENABLE ROW LEVEL SECURITY;

-- Audio Content Policies (public read)
CREATE POLICY "Anyone can read audio content"
  ON audio_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Audio Sessions Policies
CREATE POLICY "Users can manage own audio sessions"
  ON audio_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Playlists Policies
CREATE POLICY "Users can read own playlists"
  ON playlists
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can manage own playlists"
  ON playlists
  FOR INSERT, UPDATE, DELETE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Playlist Items Policies
CREATE POLICY "Users can read playlist items"
  ON playlist_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = playlist_items.playlist_id 
      AND (playlists.user_id = auth.uid() OR playlists.is_public = true)
    )
  );

CREATE POLICY "Users can manage own playlist items"
  ON playlist_items
  FOR INSERT, UPDATE, DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM playlists 
      WHERE playlists.id = playlist_items.playlist_id 
      AND playlists.user_id = auth.uid()
    )
  );

-- User Audio Stats Policies
CREATE POLICY "Users can read own audio stats"
  ON user_audio_stats
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own audio stats"
  ON user_audio_stats
  FOR INSERT, UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Functions
CREATE OR REPLACE FUNCTION increment_audio_play_count(audio_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE audio_content 
  SET play_count = play_count + 1,
      updated_at = now()
  WHERE id = audio_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update user stats when audio session is created
CREATE OR REPLACE FUNCTION update_user_audio_stats()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_audio_stats (user_id, sessions_count, total_listening_time, last_listened_at)
  VALUES (NEW.user_id, 1, COALESCE(NEW.duration_seconds, 0), NEW.played_at)
  ON CONFLICT (user_id) 
  DO UPDATE SET
    sessions_count = user_audio_stats.sessions_count + 1,
    total_listening_time = user_audio_stats.total_listening_time + COALESCE(NEW.duration_seconds, 0),
    last_listened_at = NEW.played_at,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_user_audio_stats_trigger
  AFTER INSERT ON audio_sessions
  FOR EACH ROW
  WHEN (NEW.user_id IS NOT NULL)
  EXECUTE FUNCTION update_user_audio_stats();