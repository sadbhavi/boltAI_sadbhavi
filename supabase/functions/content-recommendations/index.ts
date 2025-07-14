import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

interface RecommendationRequest {
  userId: string;
  contentType?: string;
  limit?: number;
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

    const { userId, contentType, limit = 10 }: RecommendationRequest = await req.json();

    // Get user's session history and preferences
    const { data: userSessions } = await supabaseClient
      .from('user_sessions')
      .select('content_id, session_type')
      .eq('user_id', userId)
      .eq('completed', true)
      .order('created_at', { ascending: false })
      .limit(50);

    const { data: userFavorites } = await supabaseClient
      .from('user_favorites')
      .select('content_id')
      .eq('user_id', userId);

    // Get user's mood patterns
    const { data: moodData } = await supabaseClient
      .from('mood_tracking')
      .select('mood_score, emotions')
      .eq('user_id', userId)
      .order('tracking_date', { ascending: false })
      .limit(7);

    // Calculate user preferences
    const sessionTypes = userSessions?.map(s => s.session_type) || [];
    const favoriteContentIds = userFavorites?.map(f => f.content_id) || [];
    const completedContentIds = userSessions?.map(s => s.content_id) || [];

    // Get content recommendations based on preferences
    let query = supabaseClient
      .from('content')
      .select(`
        *,
        category:categories(*)
      `)
      .not('id', 'in', `(${completedContentIds.join(',') || 'null'})`)
      .eq('is_premium', false); // For demo, only recommend free content

    if (contentType) {
      query = query.eq('content_type', contentType);
    }

    // Prioritize content types user has engaged with
    if (sessionTypes.length > 0) {
      const mostUsedType = sessionTypes.reduce((a, b, i, arr) =>
        arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
      );
      query = query.eq('content_type', mostUsedType);
    }

    const { data: recommendations, error } = await query
      .limit(limit)
      .order('rating_average', { ascending: false });

    if (error) throw error;

    // Add recommendation scores based on user data
    const scoredRecommendations = recommendations?.map(content => {
      let score = content.rating_average || 0;
      
      // Boost score for preferred content types
      if (sessionTypes.includes(content.content_type)) {
        score += 1;
      }
      
      // Boost score for featured content
      if (content.is_featured) {
        score += 0.5;
      }
      
      // Boost score based on difficulty level and user experience
      const userExperience = userSessions?.length || 0;
      if (userExperience < 5 && content.difficulty_level === 'beginner') {
        score += 0.5;
      } else if (userExperience >= 10 && content.difficulty_level === 'advanced') {
        score += 0.3;
      }

      return {
        ...content,
        recommendation_score: score,
      };
    });

    // Sort by recommendation score
    scoredRecommendations?.sort((a, b) => b.recommendation_score - a.recommendation_score);

    return new Response(
      JSON.stringify({
        recommendations: scoredRecommendations,
        user_preferences: {
          favorite_session_types: [...new Set(sessionTypes)],
          total_sessions: userSessions?.length || 0,
          average_mood: moodData?.length ? 
            moodData.reduce((sum, m) => sum + m.mood_score, 0) / moodData.length : null,
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