/*
  # Insert Sample Dating Data

  Sample dating profiles and preferences for testing the dating app functionality.
*/

-- Insert sample dating profiles (assuming some users exist)
INSERT INTO dating_profiles (
  user_id, display_name, age, bio, images, location, profession, education, 
  religion, community, languages, interests, height, diet, marital_status
) VALUES
-- Sample profile 1
(
  (SELECT id FROM profiles LIMIT 1),
  'Priya Sharma',
  26,
  'Software engineer who loves yoga, traveling, and trying new cuisines. Looking for someone who shares similar values and enjoys meaningful conversations.',
  ARRAY['https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg', 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg'],
  'Mumbai, Maharashtra',
  'Software Engineer',
  'B.Tech Computer Science',
  'Hindu',
  'Brahmin',
  ARRAY['Hindi', 'English', 'Marathi'],
  ARRAY['Yoga', 'Travel', 'Photography', 'Cooking', 'Reading'],
  165,
  'vegetarian',
  'single'
);

-- Insert sample dating preferences
INSERT INTO dating_preferences (
  user_id, min_age, max_age, max_distance, preferred_religions, 
  preferred_diet, show_me
) VALUES
(
  (SELECT id FROM profiles LIMIT 1),
  24,
  32,
  25,
  ARRAY['Hindu', 'Sikh'],
  ARRAY['vegetarian'],
  'men'
);

-- Note: In a real application, you would have actual user IDs to work with
-- This is just sample data structure for demonstration