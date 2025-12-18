import { createClient } from '@supabase/supabase-js';

// Types and Interfaces
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  subscription_status: 'free' | 'trial' | 'active' | 'cancelled' | 'expired';
  subscription_plan: 'free' | 'monthly' | 'annual' | 'family' | 'lifetime';
  trial_ends_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Content {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content_type: 'meditation' | 'sleep_story' | 'breathing' | 'soundscape' | 'masterclass';
  category_id: string;
  duration_minutes?: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  audio_url?: string;
  image_url?: string;
  transcript?: string;
  is_premium: boolean;
  is_featured: boolean;
  play_count: number;
  rating_average: number;
  rating_count: number;
  tags?: string[];
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  author_name: string;
  author_avatar?: string;
  category_id: string;
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  view_count: number;
  read_time_minutes: number;
  tags?: string[];
  published_at?: string;
  created_at: string;
  updated_at: string;
  category?: BlogCategory;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  is_active: boolean;
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price_monthly?: number;
  price_annual?: number;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
  trial_days: number;
  max_family_members: number;
  created_at: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  content_id: string;
  session_type: 'meditation' | 'sleep_story' | 'breathing' | 'soundscape';
  duration_seconds: number;
  completed: boolean;
  session_date: string;
  created_at: string;
}

export interface MoodTracking {
  id: string;
  user_id: string;
  mood_score: number;
  emotions?: string[];
  notes?: string;
  tracking_date: string;
  created_at: string;
}

export interface DatingMessage {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'emoji';
  is_read: boolean;
  created_at: string;
}

export interface DatingSetting {
  id: string;
  user_id: string;
  profile_visibility: boolean;
  show_online_status: boolean;
  allow_messages: boolean;
  push_notifications: boolean;
  email_notifications: boolean;
  show_distance: boolean;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
}

// Mock Data
const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: 'wellness', name: 'Wellness', slug: 'wellness', color: 'bg-green-100', is_active: true, created_at: new Date().toISOString() }
  },
  {
    id: '2',
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: 'meditation', name: 'Meditation', slug: 'meditation', color: 'bg-blue-100', is_active: true, created_at: new Date().toISOString() }
  },
  {
    id: '3',
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: 'beginners', name: 'Beginners', slug: 'beginners', color: 'bg-purple-100', is_active: true, created_at: new Date().toISOString() }
  },
  {
    id: '4',
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: 'sleep', name: 'Sleep', slug: 'sleep', color: 'bg-indigo-100', is_active: true, created_at: new Date().toISOString() }
  },
  {
    id: '5',
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: 'mental-health', name: 'Mental Health', slug: 'mental-health', color: 'bg-orange-100', is_active: true, created_at: new Date().toISOString() }
  },
  {
    id: '6',
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: 'journaling', name: 'Journaling', slug: 'journaling', color: 'bg-yellow-100', is_active: true, created_at: new Date().toISOString() }
  }
];

function createMockSupabaseClient() {
  let currentSession: any = null;

  // Initialize storage
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('mock_blog_posts');
    if (!stored) {
      localStorage.setItem('mock_blog_posts', JSON.stringify(MOCK_BLOG_POSTS));
    }
  }

  const getMockData = (table: string) => {
    if (typeof window === 'undefined') return [];
    if (table === 'blog_posts') {
      return JSON.parse(localStorage.getItem('mock_blog_posts') || '[]');
    }
    return [];
  };

  const saveMockData = (table: string, data: any[]) => {
    if (typeof window !== 'undefined' && table === 'blog_posts') {
      localStorage.setItem('mock_blog_posts', JSON.stringify(data));
    }
  };


  const createMockBuilderWithState = (table?: string) => {
    let internalState: any = {
      data: getMockData(table || ''),
      single: false,
    };

    const proxy = new Proxy({}, {
      get: (target, prop) => {
        if (prop === 'then') {
          return (resolve: any) => {
            let result = internalState.data;

            if (internalState.op === 'UPDATE' && internalState.updates && internalState.filterCol === 'id') {
              const allData = getMockData(table || '');
              const idToUpdate = internalState.filterVal;
              const updatedData = allData.map((item: any) =>
                item.id === idToUpdate ? { ...item, ...internalState.updates, updated_at: new Date().toISOString() } : item
              );
              saveMockData(table || '', updatedData);
              // Return the updated item
              result = updatedData.filter((item: any) => item.id === idToUpdate);
            }
            else if (internalState.op === 'DELETE' && internalState.filterCol === 'id') {
              const allData = getMockData(table || '');
              const idToDelete = internalState.filterVal;
              const updatedData = allData.filter((item: any) => item.id !== idToDelete);
              saveMockData(table || '', updatedData);
              result = null;
            }

            if (internalState.single && Array.isArray(result)) {
              result = result.length > 0 ? result[0] : null;
            }
            resolve({ data: result, error: null });
          }
        }

        if (prop === 'select') return () => proxy;

        if (prop === 'insert') return (newData: any) => {
          const allData = getMockData(table || '');
          const newItem = {
            ...newData,
            id: Math.random().toString(36).substr(2, 9),
            created_at: new Date().toISOString(),
            // Default category obj if needed for UI to not crash
            category: newData.status ? { name: 'Mindfulness', color: 'bg-green-100' } : undefined
          };
          const updated = [newItem, ...allData];
          saveMockData(table || '', updated);
          internalState.data = [newItem];
          internalState.single = true; // usually insert().select().single()
          return proxy;
        };

        if (prop === 'update') return (updates: any) => {
          internalState.op = 'UPDATE';
          internalState.updates = updates;
          return proxy;
        };

        if (prop === 'delete') return () => {
          internalState.op = 'DELETE';
          return proxy;
        };

        if (prop === 'eq') return (col: string, val: any) => {
          internalState.filterCol = col;
          internalState.filterVal = val;

          // For normal select, filter the data
          if (!internalState.op) {
            internalState.data = internalState.data.filter((item: any) => item[col] === val);
          }
          return proxy;
        };

        if (prop === 'single') return () => {
          internalState.single = true;
          return proxy;
        };

        // Re-implement others like order, limit, ilike similarly if needed, or largely ignore for update/delete
        if (prop === 'order') return (column: string, { ascending }: any = { ascending: true }) => {
          if (!internalState.op && Array.isArray(internalState.data)) {
            internalState.data.sort((a: any, b: any) => {
              if (a[column] < b[column]) return ascending ? -1 : 1;
              if (a[column] > b[column]) return ascending ? 1 : -1;
              return 0;
            });
          }
          return proxy;
        };

        if (prop === 'limit') return (count: number) => {
          if (!internalState.op && Array.isArray(internalState.data)) {
            internalState.data = internalState.data.slice(0, count);
          }
          return proxy;
        };

        if (prop === 'ilike') return (column: string, pattern: string) => {
          if (!internalState.op) {
            const searchTerm = pattern.replace(/%/g, '').toLowerCase();
            internalState.data = internalState.data.filter((item: any) =>
              item[column]?.toLowerCase().includes(searchTerm)
            );
          }
          return proxy;
        };

        return () => proxy;
      }
    });

    return proxy;
  };

  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: currentSession }, error: null }),
      getUser: () => Promise.resolve({ data: { user: currentSession?.user || null }, error: null }),
      signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      signInWithOAuth: () => Promise.resolve({ data: null, error: { message: 'Supabase OAuth not configured' } }),
      signInWithPassword: ({ email, password }: any) => {
        if (email === 'akkiibaghel2@gmail.com' && password === 'Mahendrasingh2@') {
          currentSession = {
            user: { id: 'admin-user', email: 'akkiibaghel2@gmail.com' },
            access_token: 'mock-token'
          };
          return Promise.resolve({ data: { session: currentSession, user: currentSession.user }, error: null });
        }
        return Promise.resolve({ data: null, error: { message: 'Invalid credentials' } });
      },
      signOut: () => {
        currentSession = null;
        return Promise.resolve({ error: null });
      },
      resetPasswordForEmail: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      onAuthStateChange: (callback: any) => {
        if (currentSession) {
          callback('SIGNED_IN', currentSession);
        }
        return { data: { subscription: { unsubscribe: () => { } } } };
      },
    },
    from: (table: string) => createMockBuilderWithState(table),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg' } }),
      })
    },
    rpc: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
  } as any;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Create a mock client if using placeholder values
const isPlaceholder = supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key';

export const supabase = isPlaceholder
  ? createMockSupabaseClient()
  : createClient(supabaseUrl, supabaseAnonKey);