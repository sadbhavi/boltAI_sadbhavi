import React from 'react';
import { Brain, Moon, Wind, Headphones, Heart, Users } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: 'Guided Meditations',
      description: 'Expert-led sessions for stress, anxiety, focus, and personal growth with programs ranging from beginner to advanced.',
      image: 'https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg'
    },
    {
      icon: Moon,
      title: 'Sleep Stories',
      description: 'Over 500 narrated bedtime stories designed to help you drift off into peaceful, restorative sleep.',
      image: 'https://images.pexels.com/photos/1031641/pexels-photo-1031641.jpeg'
    },
    {
      icon: Wind,
      title: 'Breathing Exercises',
      description: 'Science-backed breathing techniques for immediate stress relief, anxiety management, and emotional regulation.',
      image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg'
    },
    {
      icon: Headphones,
      title: 'Soundscapes',
      description: 'Immersive nature sounds, ambient music, and calming audio environments for focus and relaxation.',
      image: 'https://images.pexels.com/photos/1496373/pexels-photo-1496373.jpeg'
    },
    {
      icon: Heart,
      title: 'Mindfulness Programs',
      description: '7, 14, and 21-day structured programs to build lasting mindfulness habits and emotional resilience.',
      image: 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Connect with millions of users on their wellness journey through our supportive community platform.',
      image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
            Everything you need for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-600 to-sage-500">
              mental wellness
            </span>
          </h2>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            Discover a comprehensive suite of tools designed to reduce stress, improve sleep, and enhance your overall well-being.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="group bg-stone-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative mb-6">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <IconComponent className="w-6 h-6 text-forest-600" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-stone-800 mb-3 group-hover:text-forest-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;