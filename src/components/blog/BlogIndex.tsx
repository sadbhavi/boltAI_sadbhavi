
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../../lib/apis/blog';
import type { BlogPost } from '../../lib/supabase';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';

const BlogIndex: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

    useEffect(() => {
        fetchPosts();
    }, [searchTerm, selectedCategory]);

    const fetchPosts = async () => {
        setLoading(true);
        const { data, error } = await blogAPI.getBlogPosts({
            search: searchTerm,
            category: selectedCategory,
            status: 'published'
        });
        if (error) {
            setError(error.message);
        } else {
            setPosts(data || []);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-stone-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-stone-800 mb-6 font-serif">
                        Wellness Journal
                    </h1>
                    <p className="text-xl text-stone-600 max-w-2xl mx-auto mb-10">
                        Discover insights, tips, and stories to support your mental wellness journey.
                    </p>

                    {/* Search */}
                    <div className="max-w-xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-full border border-stone-200 focus:ring-2 focus:ring-forest-500 focus:border-transparent outline-none shadow-sm"
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
                    </div>
                </div>

                {/* Categories (Placeholder for now, can fetch categories later) */}
                {/* <div className="flex justify-center flex-wrap gap-4 mb-12">
           <button className="px-4 py-2 rounded-full bg-forest-600 text-white">All</button>
           <button className="px-4 py-2 rounded-full bg-white text-stone-600 hover:bg-stone-100">Mindfulness</button>
           <button className="px-4 py-2 rounded-full bg-white text-stone-600 hover:bg-stone-100">Sleep</button>
        </div> */}

                {/* Posts Grid */}
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="bg-white rounded-2xl h-96 animate-pulse shadow-sm" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center text-red-600">{error}</div>
                ) : posts.length === 0 ? (
                    <div className="text-center text-stone-600">No posts found.</div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                to={`/blog/${post.slug}`}
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={post.featured_image || 'https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg?auto=compress&cs=tinysrgb&w=800'}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {post.category && (
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/90 backdrop-blur-sm text-forest-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                                {post.category.name}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-stone-800 mb-3 group-hover:text-forest-600 transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>
                                    <p className="text-stone-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                                        {post.excerpt || post.content.substring(0, 150) + '...'}
                                    </p>

                                    <div className="flex items-center justify-between text-xs text-stone-500 mt-auto border-t border-stone-100 pt-4">
                                        <div className="flex items-center space-x-2">
                                            <User className="w-3 h-3" />
                                            <span>{post.author_name}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-3 h-3" />
                                            <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogIndex;
