import { supabase } from '../supabase';

export interface AnalyticsStats {
  pageViews: any[];
  events: any[];
  topPages: { path: string; count: number }[];
  topFeatures: { event_name: string; count: number }[];
  dailyActivity: { date: string; views: number; events: number }[];
}

export const analyticsAPI = {
  getStats: async (): Promise<AnalyticsStats> => {
    // This is a basic client-side aggregation.
    // For large datasets, this should be moved to a Postgres View or RPC function.

    // Fetch Page Views
    const { data: pageViews } = await supabase
      .from('analytics_page_views')
      .select('*')
      .order('created_at', { ascending: false });

    // Fetch Events
    const { data: events } = await supabase
      .from('analytics_events')
      .select('*')
      .order('created_at', { ascending: false });

    const views = pageViews || [];
    const evts = events || [];

    // Aggregations
    const topPagesMap = views.reduce((acc: any, curr: any) => {
      acc[curr.path] = (acc[curr.path] || 0) + 1;
      return acc;
    }, {});

    const topPages = Object.entries(topPagesMap)
      .map(([path, count]) => ({ path, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topFeaturesMap = evts.reduce((acc: any, curr: any) => {
      const key = curr.event_name; // or curr.label if you want more granulariy
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const topFeatures = Object.entries(topFeaturesMap)
      .map(([event_name, count]) => ({ event_name, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Daily Activity (Last 7 days)
    const dailyMap: any = {};
    const processDate = (dateStr: string, type: 'views' | 'events') => {
      const date = new Date(dateStr).toLocaleDateString();
      if (!dailyMap[date]) dailyMap[date] = { date, views: 0, events: 0 };
      dailyMap[date][type]++;
    };

    views.forEach((v: any) => processDate(v.created_at, 'views'));
    evts.forEach((e: any) => processDate(e.created_at, 'events'));

    const dailyActivity = Object.values(dailyMap).sort((a: any, b: any) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ) as { date: string; views: number; events: number }[];

    return {
      pageViews: views,
      events: evts,
      topPages,
      topFeatures,
      dailyActivity
    };
  }
};
