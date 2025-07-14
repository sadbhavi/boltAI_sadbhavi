import { useState, useEffect } from 'react';
import { contentAPI } from '../lib/api';
import type { Content, Category } from '../lib/supabase';

export function useContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [categoriesResult, contentResult] = await Promise.all([
        contentAPI.getCategories(),
        contentAPI.getContent({ limit: 50 }),
      ]);

      if (categoriesResult.error) throw categoriesResult.error;
      if (contentResult.error) throw contentResult.error;

      setCategories(categoriesResult.data || []);
      setContent(contentResult.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getContentByCategory = (categorySlug: string) => {
    return content.filter(item => item.category?.slug === categorySlug);
  };

  const getFeaturedContent = () => {
    return content.filter(item => item.is_featured);
  };

  const getFreeContent = () => {
    return content.filter(item => !item.is_premium);
  };

  const getPremiumContent = () => {
    return content.filter(item => item.is_premium);
  };

  const getContentByType = (type: string) => {
    return content.filter(item => item.content_type === type);
  };

  return {
    categories,
    content,
    loading,
    error,
    getContentByCategory,
    getFeaturedContent,
    getFreeContent,
    getPremiumContent,
    getContentByType,
    refetch: loadData,
  };
}