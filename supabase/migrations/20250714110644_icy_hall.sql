/*
  # Sample Audio Content Data

  1. Sample Data
    - Soundscapes (nature sounds, ambient music)
    - Sleep stories (narrated bedtime stories)
    - Breathing exercises (guided breathing)
    - Relaxation music (instrumental, binaural beats)

  2. Notes
    - Using placeholder audio URLs for development
    - Real implementation would use actual audio files
*/

-- Insert Soundscapes
INSERT INTO audio_content (title, description, audio_url, image_url, duration_seconds, category, type, is_premium, is_featured, tags) VALUES
('Ocean Waves', 'Gentle waves lapping against the shore for deep relaxation', 'https://www.soundjay.com/misc/sounds/ocean-wave-1.wav', 'https://images.pexels.com/photos/1496373/pexels-photo-1496373.jpeg', 3600, 'nature', 'soundscape', false, true, ARRAY['ocean', 'waves', 'nature', 'relaxation']),
('Forest Rain', 'Peaceful rainfall in a lush forest setting', 'https://www.soundjay.com/misc/sounds/rain-1.wav', 'https://images.pexels.com/photos/1031641/pexels-photo-1031641.jpeg', 2700, 'nature', 'soundscape', false, true, ARRAY['rain', 'forest', 'nature', 'sleep']),
('Mountain Stream', 'Babbling brook flowing through peaceful mountains', 'https://www.soundjay.com/misc/sounds/stream-1.wav', 'https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg', 3000, 'nature', 'soundscape', true, false, ARRAY['stream', 'water', 'mountains', 'focus']),
('Thunderstorm', 'Distant thunder with gentle rain for deep sleep', 'https://www.soundjay.com/misc/sounds/thunder-1.wav', 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg', 4200, 'nature', 'soundscape', true, false, ARRAY['thunder', 'storm', 'rain', 'sleep']),
('Crackling Fireplace', 'Warm fireplace sounds for cozy relaxation', 'https://www.soundjay.com/misc/sounds/fire-1.wav', 'https://images.pexels.com/photos/1749900/pexels-photo-1749900.jpeg', 3600, 'ambient', 'soundscape', false, false, ARRAY['fire', 'cozy', 'warmth', 'relaxation']),
('Tibetan Bowls', 'Resonant singing bowls for deep meditation', 'https://www.soundjay.com/misc/sounds/bell-1.wav', 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg', 1800, 'meditation', 'soundscape', true, true, ARRAY['tibetan', 'bowls', 'meditation', 'spiritual']),
('White Noise', 'Pure white noise for focus and concentration', 'https://www.soundjay.com/misc/sounds/white-noise-1.wav', 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg', 3600, 'focus', 'soundscape', false, false, ARRAY['white-noise', 'focus', 'concentration', 'study']),
('Binaural Beats - Focus', '40Hz gamma waves for enhanced concentration', 'https://www.soundjay.com/misc/sounds/binaural-1.wav', 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg', 1800, 'binaural', 'soundscape', true, false, ARRAY['binaural', 'focus', 'gamma', 'concentration']);

-- Insert Sleep Stories
INSERT INTO audio_content (title, description, audio_url, image_url, duration_seconds, category, type, is_premium, is_featured, tags) VALUES
('The Enchanted Forest', 'Journey through a magical forest where ancient trees whisper secrets of peace', 'https://www.soundjay.com/misc/sounds/story-1.wav', 'https://images.pexels.com/photos/1031641/pexels-photo-1031641.jpeg', 2700, 'fantasy', 'sleep_story', false, true, ARRAY['fantasy', 'forest', 'magic', 'peaceful']),
('Ocean Lullaby', 'Drift away on gentle waves as the ocean sings you to sleep', 'https://www.soundjay.com/misc/sounds/story-2.wav', 'https://images.pexels.com/photos/1496373/pexels-photo-1496373.jpeg', 2280, 'nature', 'sleep_story', true, true, ARRAY['ocean', 'lullaby', 'waves', 'sleep']),
('Mountain Cabin Retreat', 'Find solace in a cozy mountain cabin with crackling fire and gentle snowfall', 'https://www.soundjay.com/misc/sounds/story-3.wav', 'https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg', 3120, 'journey', 'sleep_story', true, false, ARRAY['cabin', 'mountains', 'cozy', 'winter']),
('The Secret Garden', 'Explore a hidden garden where every flower holds a story', 'https://www.soundjay.com/misc/sounds/story-4.wav', 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg', 2460, 'classic', 'sleep_story', false, false, ARRAY['garden', 'flowers', 'secret', 'peaceful']),
('Starlight Express', 'Board a mystical train traveling through the cosmos', 'https://www.soundjay.com/misc/sounds/story-5.wav', 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg', 2820, 'fantasy', 'sleep_story', true, true, ARRAY['space', 'train', 'stars', 'journey']),
('Countryside Memories', 'Relive peaceful childhood memories in quiet countryside', 'https://www.soundjay.com/misc/sounds/story-6.wav', 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg', 2100, 'journey', 'sleep_story', false, false, ARRAY['countryside', 'memories', 'childhood', 'nostalgia']);

-- Insert Breathing Exercises
INSERT INTO audio_content (title, description, audio_url, image_url, duration_seconds, category, type, is_premium, is_featured, tags) VALUES
('4-7-8 Breathing', 'Powerful technique for instant relaxation and better sleep', 'https://www.soundjay.com/misc/sounds/breathing-1.wav', 'https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg', 240, 'relaxation', 'breathing', false, true, ARRAY['4-7-8', 'relaxation', 'sleep', 'anxiety']),
('Box Breathing', 'Navy SEAL technique for focus and stress management', 'https://www.soundjay.com/misc/sounds/breathing-2.wav', 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg', 300, 'focus', 'breathing', false, true, ARRAY['box', 'focus', 'stress', 'navy-seal']),
('Wim Hof Method', 'Energizing breathwork for vitality and cold resistance', 'https://www.soundjay.com/misc/sounds/breathing-3.wav', 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg', 600, 'energy', 'breathing', true, false, ARRAY['wim-hof', 'energy', 'vitality', 'cold']),
('Coherent Breathing', 'Balanced breathing for heart rate variability', 'https://www.soundjay.com/misc/sounds/breathing-4.wav', 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg', 300, 'balance', 'breathing', true, false, ARRAY['coherent', 'balance', 'heart', 'hrv']),
('Alternate Nostril', 'Yogic breathing for balance and mental clarity', 'https://www.soundjay.com/misc/sounds/breathing-5.wav', 'https://images.pexels.com/photos/1496373/pexels-photo-1496373.jpeg', 480, 'yoga', 'breathing', true, false, ARRAY['yoga', 'nostril', 'balance', 'clarity']),
('Bellows Breath', 'Rapid breathing for energy and alertness', 'https://www.soundjay.com/misc/sounds/breathing-6.wav', 'https://images.pexels.com/photos/1031641/pexels-photo-1031641.jpeg', 180, 'energy', 'breathing', true, false, ARRAY['bellows', 'energy', 'alertness', 'rapid']);

-- Insert Relaxation Music
INSERT INTO audio_content (title, description, audio_url, image_url, duration_seconds, category, type, is_premium, is_featured, tags) VALUES
('Peaceful Piano', 'Gentle piano melodies for relaxation and focus', 'https://www.soundjay.com/misc/sounds/piano-1.wav', 'https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg', 1800, 'instrumental', 'music', false, true, ARRAY['piano', 'peaceful', 'instrumental', 'focus']),
('Ambient Strings', 'Ethereal string arrangements for deep relaxation', 'https://www.soundjay.com/misc/sounds/strings-1.wav', 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg', 2400, 'ambient', 'music', true, false, ARRAY['strings', 'ambient', 'ethereal', 'relaxation']),
('Nature Symphony', 'Orchestral music blended with natural sounds', 'https://www.soundjay.com/misc/sounds/orchestra-1.wav', 'https://images.pexels.com/photos/1031641/pexels-photo-1031641.jpeg', 2700, 'orchestral', 'music', true, true, ARRAY['orchestra', 'nature', 'symphony', 'blend']),
('Meditation Bells', 'Gentle bell sounds for mindfulness practice', 'https://www.soundjay.com/misc/sounds/meditation-1.wav', 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg', 1200, 'meditation', 'music', false, false, ARRAY['bells', 'meditation', 'mindfulness', 'gentle']),
('Binaural Sleep', 'Delta wave binaural beats for deep sleep', 'https://www.soundjay.com/misc/sounds/binaural-sleep-1.wav', 'https://images.pexels.com/photos/1496373/pexels-photo-1496373.jpeg', 3600, 'binaural', 'music', true, false, ARRAY['binaural', 'delta', 'sleep', 'deep']),
('Flute Sadbhavi', 'Calming flute melodies with nature backdrop', 'https://www.soundjay.com/misc/sounds/flute-1.wav', 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg', 1500, 'instrumental', 'music', false, false, ARRAY['flute', 'Sadbhavi', 'nature', 'calming']),
('Chakra Healing', 'Frequency-based music for chakra alignment', 'https://www.soundjay.com/misc/sounds/chakra-1.wav', 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg', 2100, 'healing', 'music', true, false, ARRAY['chakra', 'healing', 'frequency', 'alignment']),
('Celtic Dreams', 'Traditional Celtic melodies for peaceful sleep', 'https://www.soundjay.com/misc/sounds/celtic-1.wav', 'https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg', 1980, 'traditional', 'music', true, false, ARRAY['celtic', 'traditional', 'dreams', 'peaceful']);

-- Update play counts for some popular content
UPDATE audio_content SET play_count = 15420 WHERE title = 'Ocean Waves';
UPDATE audio_content SET play_count = 12350 WHERE title = 'Forest Rain';
UPDATE audio_content SET play_count = 9870 WHERE title = '4-7-8 Breathing';
UPDATE audio_content SET play_count = 8540 WHERE title = 'The Enchanted Forest';
UPDATE audio_content SET play_count = 7230 WHERE title = 'Peaceful Piano';
UPDATE audio_content SET play_count = 6890 WHERE title = 'Box Breathing';
UPDATE audio_content SET play_count = 5670 WHERE title = 'Tibetan Bowls';
UPDATE audio_content SET play_count = 4320 WHERE title = 'Ocean Lullaby';