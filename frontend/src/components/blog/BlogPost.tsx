
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogAPI } from '../../lib/apis/blog';
import type { BlogPost } from '../../lib/supabase';
import { Calendar, User, Clock, Share2 } from 'lucide-react';
import BackButton from '../common/BackButton';

const BlogPostPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (slug) fetchPost(slug);
    }, [slug]);

    const fetchPost = async (slug: string) => {
        setLoading(true);
        const { data, error } = await blogAPI.getBlogPostBySlug(slug);
        if (error) {
            setError(error.message);
        } else {
            setPost(data);
            // Increment view count
            if (data?.id) blogAPI.incrementViewCount(data.id);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-stone-50 pt-20 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600"></div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-stone-50 pt-20 text-center">
                <h2 className="text-2xl text-stone-800 mb-4">Post not found</h2>
                <Link to="/blog" className="text-forest-600 hover:underline">Back to Blog</Link>
            </div>
        );
    }

    return (
        <article className="min-h-screen bg-stone-50 pb-20">
            {/* Hero Image */}
            <div className="w-full h-[60vh] relative">
                <div className="absolute inset-0 bg-black/30 z-10" />
                <img
                    src={post.featured_image || 'https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg'}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full z-20 bg-gradient-to-t from-black/80 to-transparent pt-32 pb-10">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        {post.category && (
                            <span className="bg-forest-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 inline-block">
                                {post.category.name}
                            </span>
                        )}
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm md:text-base">
                            <div className="flex items-center space-x-2">
                                <User className="w-5 h-5" />
                                <span>{post.author_name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-5 h-5" />
                                <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Clock className="w-5 h-5" />
                                <span>{post.read_time_minutes} min read</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-10 relative z-30">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
                    {/* Back Link */}
                    <div className="mb-8 flex justify-between items-center">
                        <BackButton to="/blog" label="Back to Articles" />
                        <button className="text-stone-500 hover:text-forest-600 p-2 rounded-full hover:bg-stone-50 transition-colors">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div
                        className="prose prose-stone prose-lg max-w-none 
                        prose-headings:font-serif prose-headings:text-stone-800 
                        prose-a:text-forest-600 prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-2xl prose-img:shadow-lg"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-stone-100">
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map(tag => (
                                    <span key={tag} className="px-4 py-2 bg-stone-100 text-stone-600 rounded-full text-sm">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
};

export default BlogPostPage;
