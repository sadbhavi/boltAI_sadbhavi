
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../../lib/apis/blog';
import type { BlogPost } from '../../lib/supabase';
import { Edit, Trash2, Plus, Eye, CheckCircle, XCircle } from 'lucide-react';

const BlogPostsList: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        // Cast 'all' to any to bypass strict type check if needed, or update type definition
        const { data, error } = await blogAPI.getBlogPosts({ status: 'all' as any, limit: 50 });
        if (error) {
            setError(error.message);
        } else {
            setPosts(data || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            const { error } = await blogAPI.deleteBlogPost(id);
            if (error) {
                alert('Error deleting post: ' + error.message);
            } else {
                setPosts(posts.filter(p => p.id !== id));
            }
        }
    };

    if (loading) return <div className="p-8 text-center">Loading posts...</div>;

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-stone-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-stone-800">Blog Posts</h2>
                <Link
                    to="/admin/posts/new"
                    className="flex items-center space-x-2 bg-forest-600 text-white px-4 py-2 rounded-lg hover:bg-forest-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create Post</span>
                </Link>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600">{error}</div>}

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-stone-50 border-b border-stone-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-stone-600">Title</th>
                            <th className="px-6 py-4 font-semibold text-stone-600">Status</th>
                            <th className="px-6 py-4 font-semibold text-stone-600">Views</th>
                            <th className="px-6 py-4 font-semibold text-stone-600">Date</th>
                            <th className="px-6 py-4 font-semibold text-stone-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-stone-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-stone-800">{post.title}</div>
                                    <div className="text-xs text-stone-500">{post.slug}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${post.status === 'published'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {post.status === 'published' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                        <span className="capitalize">{post.status}</span>
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-stone-600">
                                    <div className="flex items-center space-x-1">
                                        <Eye className="w-4 h-4 text-stone-400" />
                                        <span>{post.view_count || 0}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-stone-600">
                                    {new Date(post.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-3">
                                        <Link
                                            to={`/admin/posts/${post.id}`}
                                            className="text-stone-500 hover:text-blue-600 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="text-stone-500 hover:text-red-600 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {posts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-stone-500">
                                    No posts found. Create your first one!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BlogPostsList;
