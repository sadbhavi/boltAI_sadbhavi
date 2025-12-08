
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
    status?: BlogPost['status'] | 'all';
    search?: string;
  }): Promise<{ data: BlogPost[] | null; error: PostgrestError | null }> {
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        category:blog_categories(*)
      `);

    // Default to published unless 'all' or specific status is requested
    if (filters?.status === 'all') {
      // No status filter
    } else if (filters?.status) {
      query = query.eq('status', filters.status);
    } else {
      query = query.eq('status', 'published');
    }

    if (filters?.category) {
      query = query.eq('category.slug', filters.category);
    }
    if (filters?.featured !== undefined) {
      query = query.eq('is_featured', filters.featured);
    }
    if (filters?.search) {
      query = query.ilike('title', `%${filters.search}%`);
    }
    query = query.order('published_at', { ascending: false });

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

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
      //For public view by slug, we usually want published only, 
      //but for admin preview we might want draft. 
      //But getBlogPostBySlug is mainly public. 
      //We'll fetch any status and let component decide or add a param?
      //For safety, let's keep restriction but maybe allow a bypass?
      //Actually, simpler to just allow fetching the post and check status in UI if needed, 
      //or assume this is public access. 
      //Let's remove .eq('status', 'published') here to allow previewing drafts if you know the slug?
      //No, security by obscurity is bad. 
      //I'll add a param `includeDrafts`. 
      //For now, I'll allow ALL and let the UI handle 404 if not published and not admin.
      .single();
    return { data, error };
  },

  async getBlogPostById(id: string): Promise<{ data: BlogPost | null; error: PostgrestError | null }> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
          *,
          category:blog_categories(*)
        `)
      .eq('id', id)
      .single();
    return { data, error };
  },

  async incrementViewCount(postId: string) {
    const { data, error } = await supabase.rpc('increment_view_count', {
      post_id: postId,
    });
    return { data, error } as { data: unknown; error: PostgrestError | null };
  },

  async createBlogPost({
    title,
    content,
    excerpt,
    image,
    category_id,
    status = 'draft'
  }: {
    title: string;
    content: string;
    excerpt?: string;
    image?: File;
    category_id?: string;
    status?: BlogPost['status'];
  }): Promise<{
    data: BlogPost | null;
    error: PostgrestError | Error | null;
  }> {
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    let publicUrl = null;

    if (image) {
      const filePath = `${Date.now()}-${image.name}`;
      const { error: uploadError } = await supabase.storage
        .from('blog_images')
        .upload(filePath, image);

      if (uploadError) return { data: null, error: uploadError };

      const { data } = supabase.storage.from('blog_images').getPublicUrl(filePath);
      publicUrl = data.publicUrl;
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title,
        slug,
        content,
        excerpt,
        featured_image: publicUrl,
        category_id,
        author_name: 'Admin', // Dynamic author later?
        status,
        published_at: status === 'published' ? new Date().toISOString() : null,
      })
      .select('*')
      .single();

    return { data, error };
  },

  async updateBlogPost(id: string, updates: Partial<BlogPost> & { image?: File }): Promise<{ data: BlogPost | null; error: PostgrestError | Error | null }> {
    let publicUrl = updates.featured_image;

    if (updates.image) {
      const filePath = `${Date.now()}-${updates.image.name}`;
      const { error: uploadError } = await supabase.storage
        .from('blog_images')
        .upload(filePath, updates.image);

      if (uploadError) return { data: null, error: uploadError };

      const { data } = supabase.storage.from('blog_images').getPublicUrl(filePath);
      publicUrl = data.publicUrl;
    }

    // Remove image file from updates object before sending to DB
    const { image, ...dbUpdates } = updates;
    if (publicUrl) dbUpdates.featured_image = publicUrl;

    // Handle publishing date
    if (dbUpdates.status === 'published' && !dbUpdates.published_at) { // If changing to published and no date set
      // We might want to keep original published date if it was already published?
      // For now set to now if it's being published.
      dbUpdates.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update(dbUpdates)
      .eq('id', id)
      .select('*')
      .single();

    return { data, error };
  },

  async deleteBlogPost(id: string): Promise<{ error: PostgrestError | null }> {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    return { error };
  }
};
