/*
  # Analytics and Tracking Schema

  1. New Tables
    - `user_sessions` - Track user meditation sessions
    - `mood_tracking` - Daily mood check-ins
    - `user_stats` - Aggregated user statistics

  2. Security
    - Enable RLS on all tables
    - Users can only access their own data
*/

CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content_id uuid REFERENCES content(id),
  session_type text NOT NULL CHECK (session_type IN ('meditation', 'sleep_story', 'breathing', 'soundscape')),
  duration_seconds integer NOT NULL,
  completed boolean DEFAULT false,
  session_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mood_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  mood_score integer CHECK (mood_score >= 1 AND mood_score <= 10),
  emotions text[],
  notes text,
  tracking_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, tracking_date)
);

CREATE TABLE IF NOT EXISTS user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  total_sessions integer DEFAULT 0,
  total_minutes integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  favorite_session_type text,
  last_session_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- User sessions policies
CREATE POLICY "Users can manage own sessions"
  ON user_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Mood tracking policies
CREATE POLICY "Users can manage own mood tracking"
  ON mood_tracking
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- User stats policies
CREATE POLICY "Users can read own stats"
  ON user_stats
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON user_stats
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);