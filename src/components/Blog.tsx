import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User } from 'lucide-react';
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
            <article key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="relative">
                <img
                  src={post.featured_image || 'https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg'}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-forest-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {post.category?.name || 'Wellness'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-stone-800 mb-3 group-hover:text-forest-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-stone-600 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-stone-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{post.author_name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.published_at || '').toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <Link to={`/blog/${post.slug}`} className="mt-4 flex items-center space-x-2 text-forest-600 hover:text-forest-700 font-medium group-hover:translate-x-2 transition-transform inline-flex">
                  <span>Read More</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
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