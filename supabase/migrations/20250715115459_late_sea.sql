/*
  # Dating App Database Schema

  1. New Tables
    - `dating_profiles` - Extended user profiles for dating
    - `dating_preferences` - User matching preferences
    - `dating_matches` - Match records between users
    - `dating_messages` - Chat messages between matches
    - `dating_likes` - Like/pass actions
    - `dating_reports` - User reports for safety

  2. Security
    - Enable RLS on all dating tables
    - Add policies for user privacy and safety
*/

-- Dating Profiles Table
CREATE TABLE IF NOT EXISTS dating_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  age integer NOT NULL CHECK (age >= 18 AND age <= 100),
  bio text,
  images text[] DEFAULT '{}',
  location text,
  profession text,
  education text,
  religion text,
  community text,
  languages text[] DEFAULT '{}',
  interests text[] DEFAULT '{}',
  height integer, -- in cm
  body_type text,
  smoking text CHECK (smoking IN ('never', 'occasionally', 'regularly')),
  drinking text CHECK (drinking IN ('never', 'occasionally', 'regularly')),
  diet text CHECK (diet IN ('vegetarian', 'non-vegetarian', 'vegan', 'jain')),
  marital_status text CHECK (marital_status IN ('single', 'divorced', 'widowed')),
  has_children boolean DEFAULT false,
  wants_children boolean,
  is_active boolean DEFAULT true,
  is_verified boolean DEFAULT false,
  last_active timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Dating Preferences Table
CREATE TABLE IF NOT EXISTS dating_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  min_age integer DEFAULT 18,
  max_age integer DEFAULT 35,
  max_distance integer DEFAULT 50, -- in km
  preferred_religions text[] DEFAULT '{}',
  preferred_communities text[] DEFAULT '{}',
  preferred_education text[] DEFAULT '{}',
  preferred_diet text[] DEFAULT '{}',
  preferred_smoking text[] DEFAULT '{}',
  preferred_drinking text[] DEFAULT '{}',
  show_me text DEFAULT 'all' CHECK (show_me IN ('men', 'women', 'all')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Dating Likes Table
CREATE TABLE IF NOT EXISTS dating_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  liker_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  liked_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  is_like boolean NOT NULL, -- true for like, false for pass
  created_at timestamptz DEFAULT now(),
  UNIQUE(liker_id, liked_id)
);

-- Dating Matches Table
CREATE TABLE IF NOT EXISTS dating_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  matched_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  last_message_at timestamptz,
  CHECK (user1_id < user2_id), -- Ensure consistent ordering
  UNIQUE(user1_id, user2_id)
);

-- Dating Messages Table
CREATE TABLE IF NOT EXISTS dating_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES dating_matches(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'emoji')),
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Dating Reports Table
CREATE TABLE IF NOT EXISTS dating_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  reported_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  reason text NOT NULL CHECK (reason IN ('inappropriate_content', 'harassment', 'fake_profile', 'spam', 'other')),
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE dating_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dating_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE dating_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE dating_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE dating_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE dating_reports ENABLE ROW LEVEL SECURITY;

-- Dating Profiles Policies
CREATE POLICY "Users can read active dating profiles"
  ON dating_profiles
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Users can manage own dating profile"
  ON dating_profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Dating Preferences Policies
CREATE POLICY "Users can manage own preferences"
  ON dating_preferences
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Dating Likes Policies
CREATE POLICY "Users can manage own likes"
  ON dating_likes
  FOR ALL
  TO authenticated
  USING (auth.uid() = liker_id)
  WITH CHECK (auth.uid() = liker_id);

CREATE POLICY "Users can see likes they received"
  ON dating_likes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = liked_id);

-- Dating Matches Policies
CREATE POLICY "Users can see own matches"
  ON dating_matches
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "System can create matches"
  ON dating_matches
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own matches"
  ON dating_matches
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user1_id OR auth.uid() = user2_id)
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Dating Messages Policies
CREATE POLICY "Users can read messages from their matches"
  ON dating_messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM dating_matches 
      WHERE dating_matches.id = dating_messages.match_id 
      AND (dating_matches.user1_id = auth.uid() OR dating_matches.user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages to their matches"
  ON dating_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM dating_matches 
      WHERE dating_matches.id = dating_messages.match_id 
      AND (dating_matches.user1_id = auth.uid() OR dating_matches.user2_id = auth.uid())
    )
  );

-- Dating Reports Policies
CREATE POLICY "Users can create reports"
  ON dating_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can read own reports"
  ON dating_reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = reporter_id);

-- Functions
CREATE OR REPLACE FUNCTION create_dating_match(user1 uuid, user2 uuid)
RETURNS uuid AS $$
DECLARE
  match_id uuid;
  ordered_user1 uuid;
  ordered_user2 uuid;
BEGIN
  -- Ensure consistent ordering
  IF user1 < user2 THEN
    ordered_user1 := user1;
    ordered_user2 := user2;
  ELSE
    ordered_user1 := user2;
    ordered_user2 := user1;
  END IF;
  
  -- Check if both users liked each other
  IF EXISTS (
    SELECT 1 FROM dating_likes 
    WHERE liker_id = user1 AND liked_id = user2 AND is_like = true
  ) AND EXISTS (
    SELECT 1 FROM dating_likes 
    WHERE liker_id = user2 AND liked_id = user1 AND is_like = true
  ) THEN
    -- Create match
    INSERT INTO dating_matches (user1_id, user2_id)
    VALUES (ordered_user1, ordered_user2)
    ON CONFLICT (user1_id, user2_id) DO NOTHING
    RETURNING id INTO match_id;
    
    RETURN match_id;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create matches when mutual likes occur
CREATE OR REPLACE FUNCTION check_for_match()
RETURNS trigger AS $$
DECLARE
  match_id uuid;
BEGIN
  IF NEW.is_like = true THEN
    SELECT create_dating_match(NEW.liker_id, NEW.liked_id) INTO match_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER check_for_match_trigger
  AFTER INSERT ON dating_likes
  FOR EACH ROW
  EXECUTE FUNCTION check_for_match();

-- Update last_message_at when new message is sent
CREATE OR REPLACE FUNCTION update_match_last_message()
RETURNS trigger AS $$
BEGIN
  UPDATE dating_matches 
  SET last_message_at = NEW.created_at
  WHERE id = NEW.match_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_match_last_message_trigger
  AFTER INSERT ON dating_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_match_last_message();