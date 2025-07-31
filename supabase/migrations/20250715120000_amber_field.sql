/*
  # Dating Settings Table

  Adds a new table to store user-specific dating preferences
  like privacy and notification options.
*/

-- Dating Settings Table
CREATE TABLE IF NOT EXISTS dating_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  profile_visibility boolean DEFAULT true,
  show_online_status boolean DEFAULT true,
  allow_messages boolean DEFAULT true,
  push_notifications boolean DEFAULT true,
  email_notifications boolean DEFAULT false,
  show_distance boolean DEFAULT true,
  auto_renew boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE dating_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage own settings" 
  ON dating_settings
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
