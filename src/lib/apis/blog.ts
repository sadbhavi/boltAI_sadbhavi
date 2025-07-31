import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import type { BlogCategory, BlogPost } from '../supabase';

export const blogAPI = {
  async getBlogCategories(): Promise<{ data: BlogCategory[] | null; error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .eq('is_active', true)
      .order('name');
    return { data, error };
  },

  async getBlogPosts(filters?: {
    category?: string;
    featured?: boolean;
    limit?: number;
  }): Promise<{ data: BlogPost[] | null; error: PostgrestError | null }> {
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(*)
      `)
      .eq('status', 'published');

    if (filters?.category) {
      query = query.eq('category.slug', filters.category);
    }
    if (filters?.featured !== undefined) {
      query = query.eq('is_featured', filters.featured);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    query = query.order('published_at', { ascending: false });

    const { data, error } = await query;
    return { data, error };
  },

  async getBlogPostBySlug(slug: string): Promise<{ data: BlogPost | null; error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(*)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();
    return { data, error };
  },

  async incrementViewCount(postId: string) {
    const { data, error } = await supabase.rpc('increment_view_count', {
      post_id: postId,
    });
    return { data, error } as { data: unknown; error: PostgrestError | null };
  },
};
