import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { useBlog } from '../hooks/useBlog';

const Blog = () => {
  const { posts, loading, error } = useBlog();

  if (loading) {
    return (
      <section id="blog" className="py-20 bg-gradient-to-br from-stone-50 to-sage-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">Loading blog posts...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="blog" className="py-20 bg-gradient-to-br from-stone-50 to-sage-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">
            Error loading blog posts: {error}
          </div>
        </div>
      </section>
    );
  }

  const displayPosts = posts.slice(0, 3);
  return (
    <section id="blog" className="py-20 bg-gradient-to-br from-stone-50 to-sage-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
            Wellness{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-600 to-sage-500">
              insights
            </span>
          </h2>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            Expert advice, research-backed tips, and practical guidance to support your mental wellness journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {displayPosts.map((post, index) => (
            <Link
              key={index}
              to={`/blog/${post.slug}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-forest-900/5 transition-all duration-500 border border-stone-100 flex flex-col h-full transform hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img
                  src={post.featured_image || 'https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg'}
                  alt={post.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4 z-20">
                  <span className="bg-white/95 backdrop-blur-md text-forest-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border border-stone-100">
                    {post.category?.name || 'Wellness'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-grow">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-stone-800 mb-3 group-hover:text-forest-700 transition-colors leading-tight line-clamp-2 font-serif">
                    {post.title}
                  </h3>
                  <p className="text-stone-600 line-clamp-3 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-auto pt-6 border-t border-stone-100 flex items-center justify-between text-sm text-stone-500">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-forest-500" />
                    <span className="font-medium text-stone-700">{post.author_name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.published_at || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link to="/blog" className="inline-block bg-forest-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-forest-700 transform hover:scale-105 transition-all duration-200">
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Blog;