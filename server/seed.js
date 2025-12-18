require('dotenv').config();
const mongoose = require('mongoose');
const BlogPost = require('./models/BlogPost');

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB for Seeding'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    });

const MOCK_BLOG_POSTS = [
    {
        title: 'The Science of Mindfulness: How It Rewires Your Brain',
        slug: 'science-of-mindfulness',
        excerpt: 'Discover the neurological benefits of mindfulness and how regular practice can physically change your brain structure for the better.',
        content: `
      <h2>The Neuroplasticity of Peace</h2>
      <p>For decades, neuroscientists believed that the adult brain was fixed and unchangeable. However, the discovery of neuroplasticity has revolutionized our understanding of the human mind. Mindfulness meditation is one of the most powerful tools we have to harness this ability.</p>
      <p>Regular practice has been shown to increase the density of gray matter in the hippocampus, known for learning and memory, and in structures associated with self-awareness, compassion, and introspection.</p>
      <h3>Shrinking the Amygdala</h3>
      <p>Furthermore, research indicates that mindfulness can decrease the cell volume in the amygdala, which is responsible for fear, anxiety, and stress. This change correlates with a reduction in stress levels reported by participants.</p>
    `,
        featured_image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg',
        author_name: 'Dr. Abhishek Kumar',
        category_id: 'wellness',
        status: 'published',
        is_featured: true,
        view_count: 1250,
        read_time_minutes: 5,
        published_at: new Date().toISOString(),
        category: { id: 'wellness', name: 'Wellness', slug: 'wellness', color: 'bg-green-100', is_active: true, created_at: new Date().toISOString() }
    },
    {
        title: '5 Simple Breathing Exercises for Stress Relief',
        slug: '5-breathing-exercises',
        excerpt: 'Feeling overwhelmed? Try these five quick and effective breathing techniques to instantly calm your nervous system.',
        content: `
      <h2>1. Box Breathing</h2>
      <p>Used by Navy SEALs, this technique involves inhaling for 4 counts, holding for 4, exhaling for 4, and holding empty for 4.</p>
      <h2>2. 4-7-8 Breathing</h2>
      <p>Inhale quietly through the nose for 4 seconds, hold the breath for 7 seconds, and exhale forcefully through the mouth, pursing the lips and making a "whoosh" sound, for 8 seconds.</p>
      <h2>3. Alternate Nostril Breathing</h2>
      <p>A yoga practitioner's favorite, this involves blocking one nostril at a time to channel airflow and balance the brain's hemispheres.</p>
    `,
        featured_image: 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg',
        author_name: 'Dr. Bipin Kumar Yadav',
        category_id: 'meditation',
        status: 'published',
        is_featured: false,
        view_count: 890,
        read_time_minutes: 4,
        published_at: new Date(Date.now() - 86400000).toISOString(),
        category: { id: 'meditation', name: 'Meditation', slug: 'meditation', color: 'bg-blue-100', is_active: true, created_at: new Date().toISOString() }
    },
    {
        title: 'Building a Daily Meditation Habit: A Beginner\'s Guide',
        slug: 'daily-meditation-habit',
        excerpt: 'Starting is easy, but consistency is key. Learn practical strategies to make meditation a non-negotiable part of your daily routine.',
        content: `
      <p>Meditation is a practice, not a perfect. The goal isn't to empty your mind, but to become aware of it.</p>
      <h3>Start Small</h3>
      <p>Begin with just 2 minutes a day. It's better to meditate for 2 minutes every day than 30 minutes once a week.</p>
      <h3>Anchor Your Habit</h3>
      <p>Attach your new habit to an existing one. "After I brush my teeth, I will meditate for one minute."</p>
    `,
        featured_image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg',
        author_name: 'Dr. Paritosh Shukla',
        category_id: 'beginners',
        status: 'published',
        is_featured: true,
        view_count: 2100,
        read_time_minutes: 6,
        published_at: new Date(Date.now() - 172800000).toISOString(),
        category: { id: 'beginners', name: 'Beginners', slug: 'beginners', color: 'bg-purple-100', is_active: true, created_at: new Date().toISOString() }
    },
    {
        title: 'The Impact of Sleep on Mental Health',
        slug: 'sleep-and-mental-health',
        excerpt: 'Sleep is the foundation of mental wellness. Explore the deep connection between your sleep quality and your emotional stability.',
        content: `
      <p>We spend a third of our lives sleeping, yet we often neglect its importance. Sleep deprivation is linked to depression, anxiety, and increased stress reactivity.</p>
      <p>During REM sleep, our brain processes emotional information. Without sufficient REM sleep, our ability to regulate emotions is compromised.</p>
    `,
        featured_image: 'https://images.pexels.com/photos/1405773/pexels-photo-1405773.jpeg',
        author_name: 'Dr. Himanshu Gautam',
        category_id: 'sleep',
        status: 'published',
        is_featured: false,
        view_count: 1500,
        read_time_minutes: 5,
        published_at: new Date(Date.now() - 259200000).toISOString(),
        category: { id: 'sleep', name: 'Sleep', slug: 'sleep', color: 'bg-indigo-100', is_active: true, created_at: new Date().toISOString() }
    },
    {
        title: 'Navigating Anxiety in a Fast-Paced World',
        slug: 'navigating-anxiety',
        excerpt: 'Practical tips and grounded perspectives for maintaining inner peace amidst the chaos of modern life.',
        content: `
      <p>Anxiety is often a response to perceived threats. In our modern world, these threats are rarely physical but often psychological—deadlines, social pressure, and information overload.</p>
      <p>Grounding techniques, such as the 5-4-3-2-1 method, can bring you back to the present moment and alleviate acute anxiety symptoms.</p>
    `,
        featured_image: 'https://images.pexels.com/photos/1557223/pexels-photo-1557223.jpeg',
        author_name: 'Dr. Saurav Kumar',
        category_id: 'mental-health',
        status: 'published',
        is_featured: false,
        view_count: 3200,
        read_time_minutes: 7,
        published_at: new Date(Date.now() - 345600000).toISOString(),
        category: { id: 'mental-health', name: 'Mental Health', slug: 'mental-health', color: 'bg-orange-100', is_active: true, created_at: new Date().toISOString() }
    },
    {
        title: 'The Power of Gratitude Journaling',
        slug: 'gratitude-journaling',
        excerpt: 'How writing down three things you are grateful for every day can shift your mindset and improve your overall happiness.',
        content: `
      <p>Gratitude is more than just saying thank you. It is a mindset that shifts your focus from what you lack to what you have.</p>
      <p>Studies have shown that gratitude journaling can lower stress hormones, improve sleep quality, and foster greater empathy and resilience.</p>
    `,
        featured_image: 'https://images.pexels.com/photos/6663/desk-white-black-header.jpg',
        author_name: 'Dr. Pankaj Shakya',
        category_id: 'journaling',
        status: 'published',
        is_featured: false,
        view_count: 950,
        read_time_minutes: 3,
        published_at: new Date(Date.now() - 432000000).toISOString(),
        category: { id: 'journaling', name: 'Journaling', slug: 'journaling', color: 'bg-yellow-100', is_active: true, created_at: new Date().toISOString() }
    }
];

const seedDB = async () => {
    try {
        await BlogPost.deleteMany({});
        console.log('🗑️  Cleared existing BlogPosts');

        await BlogPost.insertMany(MOCK_BLOG_POSTS);
        console.log('🌱 Seeded BlogPosts successfully');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedDB();
