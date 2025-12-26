import type { PostgrestError } from '@supabase/supabase-js';
import type { BlogCategory, BlogPost } from '../supabase';

const API_URL = '/api/blogs';

const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const getHeaders = () => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('admin_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const blogAPI = {
  async getBlogCategories(): Promise<{ data: BlogCategory[] | null; error: PostgrestError | null }> {
    // Categories are currently hardcoded or fetched from a separate table.
    // Ideally we should have an API for this too.
    // For now, let's return the mock categories if the API is not ready, or Fetch from API if implemented.
    // Since we didn't implement Categories API in server.js, we'll return a static list or default.
    // Actually, let's mock it here or add it to server.js later.
    // For now returning static list to avoid breaking frontend.
    const categories: BlogCategory[] = [
      { id: 'wellness', name: 'Wellness', slug: 'wellness', color: 'bg-green-100', is_active: true, created_at: new Date().toISOString() },
      { id: 'meditation', name: 'Meditation', slug: 'meditation', color: 'bg-blue-100', is_active: true, created_at: new Date().toISOString() },
      { id: 'sleep', name: 'Sleep', slug: 'sleep', color: 'bg-indigo-100', is_active: true, created_at: new Date().toISOString() },
      { id: 'mental-health', name: 'Mental Health', slug: 'mental-health', color: 'bg-orange-100', is_active: true, created_at: new Date().toISOString() },
      { id: 'journaling', name: 'Journaling', slug: 'journaling', color: 'bg-yellow-100', is_active: true, created_at: new Date().toISOString() },
      { id: 'beginners', name: 'Beginners', slug: 'beginners', color: 'bg-purple-100', is_active: true, created_at: new Date().toISOString() }
    ];
    return { data: categories, error: null };
  },

  async getBlogPosts(filters?: {
    category?: string;
    featured?: boolean;
    limit?: number;
    status?: BlogPost['status'] | 'all';
    search?: string;
  }): Promise<{ data: BlogPost[] | null; error: PostgrestError | null }> {
    try {
      const params = new URLSearchParams();
      if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
      else if (!filters?.status) params.append('status', 'published'); // Default

      if (filters?.category) params.append('category', filters.category);
      if (filters?.featured !== undefined) params.append('featured', String(filters.featured));
      if (filters?.search) params.append('search', filters.search);
      if (filters?.limit) params.append('limit', String(filters.limit));

      const res = await fetch(`${API_URL}?${params.toString()}`);

      if (!res.ok) {
        const text = await res.text();
        console.error('API Error Response:', text);
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
      }

      const json = await res.json();
      return { data: json.data, error: null };
    } catch (error: any) {
      console.error('Fetch error:', error);
      return { data: null, error: { message: error.message } as any };
    }
  },

  async getBlogPostBySlug(slug: string): Promise<{ data: BlogPost | null; error: PostgrestError | null }> {
    try {
      const res = await fetch(`${API_URL}/slug/${slug}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch post');
      return { data: json.data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } as any };
    }
  },

  async getBlogPostById(id: string): Promise<{ data: BlogPost | null; error: PostgrestError | null }> {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || 'Failed to fetch post');
      return { data: json.data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } as any };
    }
  },

  async incrementViewCount(postId: string) {
    try {
      await fetch(`${API_URL}/${postId}/view`, { method: 'POST' });
      return { data: true, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } as any };
    }
  },

  async createBlogPost(postData: {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    image?: File;
    category_id?: string;
    status?: BlogPost['status'];
  }): Promise<{
    data: BlogPost | null;
    error: PostgrestError | Error | null;
  }> {
    try {
      let featured_image = undefined;
      if (postData.image) {
        featured_image = await readFileAsBase64(postData.image);
      }

      const body = {
        ...postData,
        featured_image,
        image: undefined
      };

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message);
      return { data: json.data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } as any };
    }
  },

  async updateBlogPost(id: string, updates: Partial<BlogPost> & { image?: File }): Promise<{ data: BlogPost | null; error: PostgrestError | Error | null }> {
    try {
      const { image, ...params } = updates;
      let featured_image = undefined;

      if (image) {
        featured_image = await readFileAsBase64(image);
      }

      const body = {
        ...params,
        ...(featured_image ? { featured_image } : {})
      };

      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(body)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message);
      return { data: json.data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } as any };
    }
  },

  async deleteBlogPost(id: string): Promise<{ error: PostgrestError | null }> {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message);
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message } as any };
    }
  }
};
