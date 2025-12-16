
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../../lib/apis/blog';
import type { BlogPost } from '../../lib/supabase';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import BackButton from '../common/BackButton';

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
        <div className="min-h-screen bg-stone-50">
            {/* Hero Section */}
            <div className="bg-white border-b border-stone-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-stone-800 mb-6 font-serif tracking-tight">
                        Wellness <span className="text-forest-600">Journal</span>
                    </h1>
                    <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Explore expert insights, mindfulness tips, and inspiring stories to guide your journey towards better mental health.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto relative group">
                        <div className="absolute inset-0 bg-forest-200 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search articles, topics..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 rounded-full border border-stone-200 bg-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-forest-500/50 focus:border-forest-500 shadow-sm transition-all duration-300 text-lg"
                            />
                            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-stone-400 w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                <BackButton to="/" label="Back to Home" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Categories */}
                <div className="flex justify-center flex-wrap gap-3 mb-16">
                    <button
                        onClick={() => setSelectedCategory(undefined)}
                        className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${!selectedCategory ? 'bg-forest-600 text-white shadow-md shadow-forest-200' : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'}`}
                    >
                        All Posts
                    </button>
                    {['Mindfulness', 'Sleep', 'Anxiety', 'Wellness'].map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${selectedCategory === category ? 'bg-forest-600 text-white shadow-md shadow-forest-200' : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Posts Grid */}
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="bg-white rounded-2xl h-[420px] animate-pulse shadow-sm border border-stone-100" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <div className="text-red-500 text-lg mb-2">Error loading posts</div>
                        <div className="text-stone-500">{error}</div>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-stone-400 text-lg">No articles found matching your search.</div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                to={`/blog/${post.slug}`}
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-forest-900/5 transition-all duration-500 border border-stone-100 flex flex-col h-full transform hover:-translate-y-1"
                            >
                                {/* Image Container */}
                                <div className="relative h-64 overflow-hidden">
                                    <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                    <img
                                        src={post.featured_image || 'https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg?auto=compress&cs=tinysrgb&w=800'}
                                        alt={post.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                                    />
                                    {post.category && (
                                        <div className="absolute top-4 left-4 z-20">
                                            <span className="bg-white/95 backdrop-blur-md text-forest-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border border-stone-100">
                                                {post.category.name}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="mb-4">
                                        <h2 className="text-2xl font-bold text-stone-800 mb-3 group-hover:text-forest-700 transition-colors leading-tight line-clamp-2 font-serif">
                                            {post.title}
                                        </h2>
                                        <p className="text-stone-600 line-clamp-3 text-base leading-relaxed">
                                            {post.excerpt || post.content.substring(0, 150) + '...'}
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-stone-100 flex items-center justify-between text-sm text-stone-500">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-forest-100 flex items-center justify-center text-forest-600">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium text-stone-700">{post.author_name}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>
                                                {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
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
