import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

interface AnalyticsRequest {
  userId: string;
  timeframe?: 'week' | 'month' | 'year';
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

    const { userId, timeframe = 'month' }: AnalyticsRequest = await req.json();

    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    switch (timeframe) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // Get user sessions data
    const { data: sessions } = await supabaseClient
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    // Get mood tracking data
    const { data: moodData } = await supabaseClient
      .from('mood_tracking')
      .select('*')
      .eq('user_id', userId)
      .gte('tracking_date', startDate.toISOString().split('T')[0])
      .order('tracking_date', { ascending: true });

    // Get user stats
    const { data: userStats } = await supabaseClient
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Calculate analytics
    const totalSessions = sessions?.length || 0;
    const totalMinutes = sessions?.reduce((sum, s) => sum + Math.floor(s.duration_seconds / 60), 0) || 0;
    const completedSessions = sessions?.filter(s => s.completed).length || 0;
    const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

    // Session type breakdown
    const sessionTypeBreakdown = sessions?.reduce((acc, session) => {
      acc[session.session_type] = (acc[session.session_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    // Daily activity (for charts)
    const dailyActivity = sessions?.reduce((acc, session) => {
      const date = session.created_at.split('T')[0];
      if (!acc[date]) {
        acc[date] = { sessions: 0, minutes: 0 };
      }
      acc[date].sessions += 1;
      acc[date].minutes += Math.floor(session.duration_seconds / 60);
      return acc;
    }, {} as Record<string, { sessions: number; minutes: number }>) || {};

    // Mood trends
    const averageMood = moodData?.length ? 
      moodData.reduce((sum, m) => sum + m.mood_score, 0) / moodData.length : null;

    const moodTrend = moodData?.map(m => ({
      date: m.tracking_date,
      score: m.mood_score,
      emotions: m.emotions || [],
    })) || [];

    // Calculate streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    if (sessions?.length) {
      const sessionDates = [...new Set(sessions.map(s => s.session_date))].sort();
      const today = new Date().toISOString().split('T')[0];
      
      // Calculate current streak
      for (let i = sessionDates.length - 1; i >= 0; i--) {
        const date = new Date(sessionDates[i]);
        const expectedDate = new Date();
        expectedDate.setDate(expectedDate.getDate() - (sessionDates.length - 1 - i));
        
        if (date.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
          currentStreak++;
        } else {
          break;
        }
      }
      
      // Calculate longest streak
      for (const date of sessionDates) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      }
    }

    const analytics = {
      overview: {
        total_sessions: totalSessions,
        total_minutes: totalMinutes,
        completion_rate: Math.round(completionRate),
        current_streak: currentStreak,
        longest_streak: longestStreak,
        average_mood: averageMood ? Math.round(averageMood * 10) / 10 : null,
      },
      session_breakdown: sessionTypeBreakdown,
      daily_activity: Object.entries(dailyActivity).map(([date, data]) => ({
        date,
        ...data,
      })),
      mood_trend: moodTrend,
      achievements: [
        ...(totalSessions >= 1 ? [{ name: 'First Session', description: 'Completed your first meditation session' }] : []),
        ...(totalSessions >= 10 ? [{ name: 'Dedicated Practitioner', description: 'Completed 10 meditation sessions' }] : []),
        ...(totalSessions >= 50 ? [{ name: 'Mindfulness Master', description: 'Completed 50 meditation sessions' }] : []),
        ...(currentStreak >= 7 ? [{ name: 'Week Warrior', description: 'Maintained a 7-day streak' }] : []),
        ...(currentStreak >= 30 ? [{ name: 'Monthly Meditator', description: 'Maintained a 30-day streak' }] : []),
        ...(totalMinutes >= 60 ? [{ name: 'Hour of Peace', description: 'Meditated for over 1 hour total' }] : []),
        ...(totalMinutes >= 600 ? [{ name: 'Zen Zone', description: 'Meditated for over 10 hours total' }] : []),
      ],
      user_stats: userStats,
    };

    return new Response(
      JSON.stringify(analytics),
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