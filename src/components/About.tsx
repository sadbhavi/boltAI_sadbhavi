import React from 'react';
import { Award, Users, Globe, TrendingUp } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Users, number: '100M+', label: 'Global Users' },
    { icon: Globe, number: '50+', label: 'Countries' },
    { icon: Award, number: '4.8/5', label: 'App Rating' },
    { icon: TrendingUp, number: '98%', label: 'User Satisfaction' }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-sage-50 to-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-800">
                Making the world a{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-600 to-sage-500">
                  happier place
                </span>
              </h2>
              
              <p className="text-lg text-stone-600 leading-relaxed">
                Founded in 2012, we've dedicated ourselves to making mental wellness accessible to everyone. Our evidence-based approach combines ancient mindfulness practices with modern technology to help millions find peace in their daily lives.
              </p>
              
              <p className="text-lg text-stone-600 leading-relaxed">
                Through partnerships with leading psychologists and mindfulness experts, we've created a platform that doesn't just provide content, but builds lasting habits for mental fitness and emotional resilience.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center p-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-forest-600 to-sage-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-stone-800 mb-1">{stat.number}</div>
                    <div className="text-sm text-stone-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 grid grid-cols-2 gap-4">
              <img 
                src="https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg"
                alt="Team meditation"
                className="rounded-2xl shadow-lg col-span-2"
              />
              <img 
                src="https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg"
                alt="Peaceful environment"
                className="rounded-2xl shadow-lg"
              />
              <img 
                src="https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg"
                alt="Mindfulness practice"
                className="rounded-2xl shadow-lg"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full opacity-20 blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;