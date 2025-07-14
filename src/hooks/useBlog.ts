import { useState, useEffect } from 'react';
import { blogAPI } from '../lib/api';
import type { BlogPost, BlogCategory } from '../lib/supabase';

export function useBlog() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [categoriesResult, postsResult] = await Promise.all([
        blogAPI.getBlogCategories(),
        blogAPI.getBlogPosts({ limit: 20 }),
      ]);

      if (categoriesResult.error) throw categoriesResult.error;
      if (postsResult.error) throw postsResult.error;

      setCategories(categoriesResult.data || []);
      setPosts(postsResult.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getFeaturedPosts = () => {
    return posts.filter(post => post.is_featured);
  };

  const getPostsByCategory = (categorySlug: string) => {
    return posts.filter(post => post.category?.slug === categorySlug);
  };

  const getRecentPosts = (limit: number = 5) => {
    return posts
      .sort((a, b) => new Date(b.published_at || '').getTime() - new Date(a.published_at || '').getTime())
      .slice(0, limit);
  };

  return {
    categories,
    posts,
    loading,
    error,
    getFeaturedPosts,
    getPostsByCategory,
    getRecentPosts,
    refetch: loadData,
  };
}