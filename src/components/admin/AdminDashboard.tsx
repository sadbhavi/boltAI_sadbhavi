import React, { useEffect, useState } from 'react';
import { FileText, Eye, TrendingUp, MousePointer, Activity } from 'lucide-react';
import { blogAPI } from '../../lib/apis/blog';
import { analyticsAPI, AnalyticsStats } from '../../lib/apis/analytics';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<{
    blog: {
      totalPosts: number;
      totalViews: number;
      publishedPosts: number;
      draftPosts: number;
    };
    analytics: AnalyticsStats | null;
  }>({
    blog: {
      totalPosts: 0,
      totalViews: 0,
      publishedPosts: 0,
      draftPosts: 0
    },
    analytics: null
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    // Determine stats from fetching all posts
    const { data } = await blogAPI.getBlogPosts({ status: 'all', limit: 1000 });
    const analyticsData = await analyticsAPI.getStats();

    if (data) {
      setStats({
        blog: {
          totalPosts: data.length,
          totalViews: data.reduce((acc, curr) => acc + (curr.view_count || 0), 0),
          publishedPosts: data.filter(p => p.status === 'published').length,
          draftPosts: data.filter(p => p.status === 'draft').length,
        },
        analytics: analyticsData
      });
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-stone-800">Dashboard Overview</h1>

      {/* Blog Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-stone-500 mb-1">Total Blog Posts</p>
          <h3 className="text-2xl font-bold text-stone-800">{stats.blog.totalPosts}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-stone-500 mb-1">Total Blog Views</p>
          <h3 className="text-2xl font-bold text-stone-800">{stats.blog.totalViews}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <MousePointer className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-green-500 text-sm font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              Live
            </span>
          </div>
          <p className="text-sm text-stone-500 mb-1">Total Page Views</p>
          <h3 className="text-2xl font-bold text-stone-800">
            {stats.analytics ? stats.analytics.pageViews.length : '-'}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-stone-500 mb-1">Total Events</p>
          <h3 className="text-2xl font-bold text-stone-800">
            {stats.analytics ? stats.analytics.events.length : '-'}
          </h3>
        </div>
      </div>

      {/* Analytics Tables */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex flex-col">
          <h3 className="text-lg font-semibold text-stone-700 mb-4">Top Pages</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-600">
              <thead className="text-xs uppercase bg-stone-50 text-stone-500">
                <tr>
                  <th className="px-4 py-2 rounded-tl-lg">Page Path</th>
                  <th className="px-4 py-2 rounded-tr-lg text-right">Views</th>
                </tr>
              </thead>
              <tbody>
                {stats.analytics?.topPages.map((page, idx) => (
                  <tr key={idx} className="border-b border-stone-50 hover:bg-stone-50">
                    <td className="px-4 py-2 font-medium text-stone-800">{page.path}</td>
                    <td className="px-4 py-2 text-right">{page.count}</td>
                  </tr>
                ))}
                {(!stats.analytics?.topPages.length) && (
                  <tr>
                    <td colSpan={2} className="px-4 py-8 text-center text-stone-400">No page data yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Features / Events */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex flex-col">
          <h3 className="text-lg font-semibold text-stone-700 mb-4">Top Features (Events)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-600">
              <thead className="text-xs uppercase bg-stone-50 text-stone-500">
                <tr>
                  <th className="px-4 py-2 rounded-tl-lg">Event Name</th>
                  <th className="px-4 py-2 rounded-tr-lg text-right">Count</th>
                </tr>
              </thead>
              <tbody>
                {stats.analytics?.topFeatures.map((feat, idx) => (
                  <tr key={idx} className="border-b border-stone-50 hover:bg-stone-50">
                    <td className="px-4 py-2 font-medium text-stone-800">{feat.event_name}</td>
                    <td className="px-4 py-2 text-right">{feat.count}</td>
                  </tr>
                ))}
                {(!stats.analytics?.topFeatures.length) && (
                  <tr>
                    <td colSpan={2} className="px-4 py-8 text-center text-stone-400">No event data yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Daily History Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex flex-col">
        <h3 className="text-lg font-semibold text-stone-700 mb-4">Daily History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-600">
            <thead className="text-xs uppercase bg-stone-50 text-stone-500">
              <tr>
                <th className="px-4 py-2 rounded-tl-lg">Date</th>
                <th className="px-4 py-2 text-right">Views</th>
                <th className="px-4 py-2 rounded-tr-lg text-right">Events/Clicks</th>
              </tr>
            </thead>
            <tbody>
              {stats.analytics?.dailyActivity.slice().reverse().map((day, idx) => (
                <tr key={idx} className="border-b border-stone-50 hover:bg-stone-50">
                  <td className="px-4 py-2 font-medium text-stone-800">{day.date}</td>
                  <td className="px-4 py-2 text-right">{day.views}</td>
                  <td className="px-4 py-2 text-right">{day.events}</td>
                </tr>
              ))}
              {(!stats.analytics?.dailyActivity.length) && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-stone-400">No history data yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Activity Chart Placeholder / Simple Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
        <h3 className="text-lg font-semibold text-stone-700 mb-6">Traffic Trends (All Time)</h3>
        {stats.analytics?.dailyActivity.length ? (
          <div className="flex items-end space-x-4 h-48 overflow-x-auto pb-4">
            {stats.analytics.dailyActivity.map((day, idx) => {
              // simple scaling: find max to normalize or just use fixed height heavily
              const max = Math.max(...stats.analytics!.dailyActivity.map(d => Math.max(d.views, d.events)));
              const viewH = max > 0 ? (day.views / max) * 100 : 0;
              // const evtH = max > 0 ? (day.events / max) * 100 : 0;

              return (
                <div key={idx} className="flex-1 flex flex-col justify-end items-center group">
                  <div className="w-full max-w-[40px] bg-blue-100 rounded-t-sm relative transition-all duration-300 hover:bg-blue-200" style={{ height: `${viewH}%`, minHeight: '4px' }}>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-xs px-2 py-1 rounded pointer-events-none whitespace-nowrap">
                      {day.views} Views
                    </div>
                  </div>
                  <span className="text-xs text-stone-400 mt-2 rotate-45 origin-left translate-y-2">{day.date.split('/')[0]}/{day.date.split('/')[1]}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-stone-400">
            Not enough data to display chart
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
