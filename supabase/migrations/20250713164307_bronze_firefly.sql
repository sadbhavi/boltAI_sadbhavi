/*
  # Content Management Schema

  1. New Tables
    - `categories` - Content categories (meditation, sleep, breathing, etc.)
    - `content` - All meditation content, sleep stories, etc.
    - `user_progress` - Track user progress through content
    - `user_favorites` - User's favorite content

  2. Security
    - Enable RLS on all tables
    - Public read access for content and categories
    - Authenticated user access for progress and favorites
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text,
  color text DEFAULT '#6a8f54',
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  content_type text NOT NULL CHECK (content_type IN ('meditation', 'sleep_story', 'breathing', 'soundscape', 'masterclass')),
  category_id uuid REFERENCES categories(id),
  duration_minutes integer,
  difficulty_level text DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  audio_url text,
  image_url text,
  transcript text,
  is_premium boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  play_count integer DEFAULT 0,
  rating_average decimal(3,2) DEFAULT 0,
  rating_count integer DEFAULT 0,
  tags text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content_id uuid REFERENCES content(id) ON DELETE CASCADE,
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed_at timestamptz,
  last_position_seconds integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, content_id)
);

CREATE TABLE IF NOT EXISTS user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content_id uuid REFERENCES content(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, content_id)
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Categories policies (public read)
CREATE POLICY "Anyone can read categories"
  ON categories
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Content policies (public read for free content, authenticated for premium)
CREATE POLICY "Anyone can read free content"
  ON content
  FOR SELECT
  TO anon, authenticated
  USING (is_premium = false);

CREATE POLICY "Authenticated users can read premium content"
  ON content
  FOR SELECT
  TO authenticated
  USING (is_premium = true);

-- User progress policies
CREATE POLICY "Users can manage own progress"
  ON user_progress
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- User favorites policies
CREATE POLICY "Users can manage own favorites"
  ON user_favorites
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);