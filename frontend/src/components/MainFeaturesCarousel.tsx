import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, BookOpen, Star, Users, ArrowRight } from 'lucide-react';

const MainFeaturesCarousel: React.FC = () => {
    const features = [
        {
            id: 1,
            title: 'Help & Support',
            description: 'Immediate emotional support and professional guidance for your mental well-being.',
            icon: Heart,
            link: '/emotional-support',
            image: 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=800',
            color: 'bg-rose-50 text-rose-600',
            buttonColor: 'bg-rose-600 hover:bg-rose-700'
        },
        {
            id: 2,
            title: 'Wellness Journal',
            description: 'Expert articles, mindfulness tips, and inspiring stories to guide your journey.',
            icon: BookOpen,
            link: '/blog',
            image: 'https://images.pexels.com/photos/4056529/pexels-photo-4056529.jpeg?auto=compress&cs=tinysrgb&w=800',
            color: 'bg-emerald-50 text-emerald-600',
            buttonColor: 'bg-emerald-600 hover:bg-emerald-700'
        },
        {
            id: 3,
            title: 'Premium Plans',
            description: 'Unlock unlimited access to all meditations, sleep stories, and soundscapes.',
            icon: Star,
            link: '/pricing',
            image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=800',
            color: 'bg-amber-50 text-amber-600',
            buttonColor: 'bg-amber-600 hover:bg-amber-700'
        },
        {
            id: 4,
            title: 'Our Community',
            description: 'Join millions of others on the path to better mental health and happiness.',
            icon: Users,
            link: '/about',
            image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
            color: 'bg-blue-50 text-blue-600',
            buttonColor: 'bg-blue-600 hover:bg-blue-700'
        }
    ];

    return (
        <section className="py-12 bg-white border-b border-stone-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 font-serif">Explore Sadbhavi</h2>
                        <p className="text-stone-500 mt-2">Discover tools for your mind, body, and soul.</p>
                    </div>

                    {/* Desktop Navigation Hints (Optional) */}
                    <div className="hidden md:flex text-sm text-stone-400 font-medium">
                        Scroll to explore →
                    </div>
                </div>

                {/* Carousel Container */}
                <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.id}
                                className="min-w-[85vw] sm:min-w-[350px] md:min-w-[400px] snap-center first:pl-0 sm:first:pl-0"
                            >
                                <div className="group relative h-96 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                                    {/* Background Image */}
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                    {/* Content */}
                                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                        <div className={`w-12 h-12 rounded-full ${feature.color} flex items-center justify-center mb-4 backdrop-blur-sm bg-white/90`}>
                                            <Icon className="w-6 h-6" />
                                        </div>

                                        <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                                        <p className="text-white/80 mb-6 leading-relaxed">
                                            {feature.description}
                                        </p>

                                        <Link
                                            to={feature.link}
                                            className={`inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 ${feature.buttonColor}`}
                                        >
                                            <span>Explore</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>

                                    {/* Mobile Always Visible Button (Optional overlay for mobile if hover doesn't work well) */}
                                    <Link
                                        to={feature.link}
                                        className="absolute inset-0 z-10 md:hidden"
                                        aria-label={`Go to ${feature.title}`}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default MainFeaturesCarousel;
