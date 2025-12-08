import React, { useEffect, useState } from 'react';
import { FileText, Eye, TrendingUp } from 'lucide-react';
import { blogAPI } from '../../lib/apis/blog';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    publishedPosts: 0,
    draftPosts: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    // Determine stats from fetching all posts for now (simple approach)
    // Ideally we'd have a specific RPC for stats
    const { data } = await blogAPI.getBlogPosts({ status: 'all', limit: 1000 });
    if (data) {
      setStats({
        totalPosts: data.length,
        totalViews: data.reduce((acc, curr) => acc + (curr.view_count || 0), 0),
        publishedPosts: data.filter(p => p.status === 'published').length,
        draftPosts: data.filter(p => p.status === 'draft').length,
      });
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-stone-800">Dashboard Overview</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-green-500 text-sm font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12%
            </span>
          </div>
          <p className="text-sm text-stone-500 mb-1">Total Posts</p>
          <h3 className="text-2xl font-bold text-stone-800">{stats.totalPosts}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-green-500 text-sm font-medium flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +24%
            </span>
          </div>
          <p className="text-sm text-stone-500 mb-1">Total Views</p>
          <h3 className="text-2xl font-bold text-stone-800">{stats.totalViews}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-stone-500 mb-1">Published</p>
          <h3 className="text-2xl font-bold text-stone-800">{stats.publishedPosts}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-stone-500 mb-1">Drafts</p>
          <h3 className="text-2xl font-bold text-stone-800">{stats.draftPosts}</h3>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 h-64 flex flex-col justify-center items-center text-stone-400">
          <p>Chart Placeholder (Views over time)</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 h-64 flex flex-col justify-center items-center text-stone-400">
          <p>Recent Activity</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
