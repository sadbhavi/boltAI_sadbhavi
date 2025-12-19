import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import type { Category, Content } from '../supabase';

export const contentAPI = {
  async getCategories(): Promise<{ data: Category[] | null; error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    return { data, error };
  },

  async getContent(filters?: {
    category?: string;
    contentType?: string;
    featured?: boolean;
    premium?: boolean;
    limit?: number;
  }): Promise<{ data: Content[] | null; error: PostgrestError | null }> {
    let query = supabase
      .from('content')
      .select(`
        *,
        category:categories(*)
      `);

    if (filters?.category) {
      query = query.eq('category.slug', filters.category);
    }
    if (filters?.contentType) {
      query = query.eq('content_type', filters.contentType);
    }
    if (filters?.featured !== undefined) {
      query = query.eq('is_featured', filters.featured);
    }
    if (filters?.premium !== undefined) {
      query = query.eq('is_premium', filters.premium);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    return { data, error };
  },

  async getContentBySlug(slug: string): Promise<{ data: Content | null; error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('content')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('slug', slug)
      .single();
    return { data, error };
  },

  async incrementPlayCount(contentId: string) {
    const { data, error } = await supabase.rpc('increment_play_count', {
      content_id: contentId,
    });
    return { data, error } as { data: unknown; error: PostgrestError | null };
  },
};
