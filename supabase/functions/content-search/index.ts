import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

interface SearchRequest {
  query: string;
  contentType?: string;
  category?: string;
  difficulty?: string;
  duration?: { min?: number; max?: number };
  limit?: number;
  offset?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { 
      query, 
      contentType, 
      category, 
      difficulty, 
      duration, 
      limit = 20, 
      offset = 0 
    }: SearchRequest = await req.json();

    // Build the search query
    let dbQuery = supabaseClient
      .from('content')
      .select(`
        *,
        category:categories(*)
      `);

    // Text search across title, description, and tags
    if (query) {
      dbQuery = dbQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`);
    }

    // Filter by content type
    if (contentType) {
      dbQuery = dbQuery.eq('content_type', contentType);
    }

    // Filter by category
    if (category) {
      dbQuery = dbQuery.eq('category.slug', category);
    }

    // Filter by difficulty
    if (difficulty) {
      dbQuery = dbQuery.eq('difficulty_level', difficulty);
    }

    // Filter by duration
    if (duration) {
      if (duration.min) {
        dbQuery = dbQuery.gte('duration_minutes', duration.min);
      }
      if (duration.max) {
        dbQuery = dbQuery.lte('duration_minutes', duration.max);
      }
    }

    // Apply pagination
    dbQuery = dbQuery
      .range(offset, offset + limit - 1)
      .order('rating_average', { ascending: false });

    const { data: results, error, count } = await dbQuery;

    if (error) throw error;

    // Get total count for pagination
    let countQuery = supabaseClient
      .from('content')
      .select('*', { count: 'exact', head: true });

    if (query) {
      countQuery = countQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`);
    }
    if (contentType) {
      countQuery = countQuery.eq('content_type', contentType);
    }
    if (category) {
      countQuery = countQuery.eq('category.slug', category);
    }
    if (difficulty) {
      countQuery = countQuery.eq('difficulty_level', difficulty);
    }
    if (duration?.min) {
      countQuery = countQuery.gte('duration_minutes', duration.min);
    }
    if (duration?.max) {
      countQuery = countQuery.lte('duration_minutes', duration.max);
    }

    const { count: totalCount } = await countQuery;

    // Get search suggestions if no results
    let suggestions = [];
    if (!results?.length && query) {
      const { data: suggestionData } = await supabaseClient
        .from('content')
        .select('title, tags')
        .limit(10);

      // Simple suggestion algorithm based on partial matches
      suggestions = suggestionData
        ?.filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase().substring(0, 3)) ||
          item.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase().substring(0, 3)))
        )
        .map(item => item.title)
        .slice(0, 5) || [];
    }

    return new Response(
      JSON.stringify({
        results: results || [],
        pagination: {
          total: totalCount || 0,
          limit,
          offset,
          has_more: (totalCount || 0) > offset + limit,
        },
        suggestions,
        filters_applied: {
          query,
          content_type: contentType,
          category,
          difficulty,
          duration,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});