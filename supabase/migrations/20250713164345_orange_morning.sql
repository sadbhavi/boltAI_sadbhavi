/*
  # Sample Data for Development

  1. Sample Data
    - Subscription plans
    - Content categories
    - Sample content
    - Blog categories and posts

  2. Notes
    - This data is for development and testing purposes
*/

-- Insert subscription plans
INSERT INTO subscription_plans (name, slug, description, price_monthly, price_annual, features, is_popular, trial_days, max_family_members) VALUES
('Free', 'free', 'Perfect for beginners to explore mindfulness', 0, 0, ARRAY['Limited meditation sessions', 'Basic breathing exercises', 'One sleep story', 'Mood tracking', 'Community access'], false, 0, 1),
('Monthly', 'monthly', 'Full access to all premium content', 14.99, null, ARRAY['Unlimited meditations', '500+ sleep stories', 'All breathing exercises', 'Masterclasses', 'Advanced progress tracking', 'Offline downloads', 'Premium support'], true, 14, 1),
('Annual', 'annual', 'Best value - save 61% with annual billing', null, 69.99, ARRAY['Everything in Monthly', 'Priority customer support', 'Early access to new features', 'Family sharing (up to 6 members)', 'Exclusive content', 'Annual progress reports'], false, 14, 6),
('Lifetime', 'lifetime', 'One-time payment for lifetime access', null, 399.99, ARRAY['Everything in Annual', 'Lifetime updates', 'VIP community access', 'Personal meditation coach', 'Custom content recommendations'], false, 14, 6);

-- Insert content categories
INSERT INTO categories (name, slug, description, icon, color) VALUES
('Meditation', 'meditation', 'Guided meditations for all levels', 'Brain', '#2d5016'),
('Sleep Stories', 'sleep', 'Narrated stories to help you fall asleep', 'Moon', '#4c5a41'),
('Breathing', 'breathing', 'Breathing exercises for stress relief', 'Wind', '#6a8f54'),
('Soundscapes', 'soundscapes', 'Ambient sounds for focus and relaxation', 'Headphones', '#8aab77'),
('Mindfulness', 'mindfulness', 'Daily mindfulness practices', 'Heart', '#9caf88'),
('Masterclasses', 'masterclasses', 'Expert-led courses on wellness topics', 'Users', '#b2c9a4');

-- Insert sample content
INSERT INTO content (title, slug, description, content_type, category_id, duration_minutes, difficulty_level, image_url, is_premium, is_featured, tags) VALUES
('Daily Calm', 'daily-calm', 'Start your day with intention and mindfulness', 'meditation', (SELECT id FROM categories WHERE slug = 'meditation'), 10, 'beginner', 'https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg', false, true, ARRAY['daily', 'morning', 'mindfulness']),
('Sleep Story: Forest Rain', 'forest-rain-sleep', 'Drift off to the soothing sounds of rain in an ancient forest', 'sleep_story', (SELECT id FROM categories WHERE slug = 'sleep'), 45, 'beginner', 'https://images.pexels.com/photos/1031641/pexels-photo-1031641.jpeg', true, true, ARRAY['nature', 'rain', 'forest']),
('4-7-8 Breathing', '4-7-8-breathing', 'A powerful breathing technique for instant relaxation', 'breathing', (SELECT id FROM categories WHERE slug = 'breathing'), 5, 'beginner', 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg', false, false, ARRAY['stress-relief', 'anxiety', 'quick']),
('Ocean Waves', 'ocean-waves', 'Calming ocean sounds for focus and relaxation', 'soundscape', (SELECT id FROM categories WHERE slug = 'soundscapes'), 60, 'beginner', 'https://images.pexels.com/photos/1496373/pexels-photo-1496373.jpeg', true, false, ARRAY['ocean', 'nature', 'focus']),
('Body Scan Meditation', 'body-scan', 'Release tension and connect with your body', 'meditation', (SELECT id FROM categories WHERE slug = 'meditation'), 20, 'intermediate', 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg', true, false, ARRAY['relaxation', 'body-awareness', 'tension-relief']),
('Mindful Walking', 'mindful-walking', 'Transform your daily walk into a meditation practice', 'meditation', (SELECT id FROM categories WHERE slug = 'mindfulness'), 15, 'beginner', 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg', true, false, ARRAY['walking', 'outdoor', 'movement']);

-- Insert blog categories
INSERT INTO blog_categories (name, slug, description, color) VALUES
('Research', 'research', 'Latest scientific findings on meditation and wellness', '#2d5016'),
('Practice', 'practice', 'Practical tips and techniques for daily wellness', '#6a8f54'),
('Sleep', 'sleep', 'Everything about better sleep and rest', '#4c5a41'),
('Mindfulness', 'mindfulness', 'Living mindfully in everyday life', '#8aab77');

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, featured_image, author_name, author_avatar, category_id, status, is_featured, read_time_minutes, tags, published_at) VALUES
('The Science Behind Mindfulness: How Meditation Rewires Your Brain', 'science-behind-mindfulness', 'Discover the latest neuroscience research showing how regular meditation practice can literally reshape your brain structure and improve cognitive function.', 'Meditation has been practiced for thousands of years, but only recently have we begun to understand the profound neurological changes it creates in our brains...', 'https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg', 'Dr. Sarah Chen', 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg', (SELECT id FROM blog_categories WHERE slug = 'research'), 'published', true, 8, ARRAY['neuroscience', 'brain', 'research'], now() - interval '3 days'),
('7 Breathing Techniques for Instant Stress Relief', 'breathing-techniques-stress-relief', 'Learn powerful breathing exercises that can help you manage anxiety and stress in just a few minutes, backed by scientific research.', 'When stress hits, your breath is one of the most powerful tools you have to regain control. Here are seven evidence-based breathing techniques...', 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg', 'Michael Rodriguez', 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg', (SELECT id FROM blog_categories WHERE slug = 'practice'), 'published', false, 6, ARRAY['breathing', 'stress', 'anxiety'], now() - interval '5 days'),
('Creating the Perfect Sleep Environment for Better Rest', 'perfect-sleep-environment', 'Transform your bedroom into a sanctuary for restorative sleep with these evidence-based tips for optimal sleep hygiene.', 'Your sleep environment plays a crucial role in the quality of your rest. From temperature to lighting, every detail matters...', 'https://images.pexels.com/photos/1031641/pexels-photo-1031641.jpeg', 'Dr. Emily Watson', 'https://images.pexels.com/photos/1496373/pexels-photo-1496373.jpeg', (SELECT id FROM blog_categories WHERE slug = 'sleep'), 'published', false, 7, ARRAY['sleep', 'environment', 'hygiene'], now() - interval '7 days');