import React from 'react';
import { Play, Download, Star } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-sage-50 via-stone-50 to-orange-50 py-12 md:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg')] bg-cover bg-center opacity-10"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-forest-600 font-medium">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-orange-400" />
                  ))}
                </div>
                <span>4.8/5 from 1.7M+ users</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-stone-800 leading-tight">
                Find your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-600 to-sage-500">
                  inner peace
                </span>
              </h1>

              <p className="text-xl text-stone-600 leading-relaxed">
                Join millions experiencing better sleep, lower stress, and enhanced mindfulness with our comprehensive meditation and wellness platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-forest-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-forest-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Start Free Trial</span>
              </button>

              <button className="border-2 border-forest-600 text-forest-600 px-8 py-4 rounded-full font-semibold hover:bg-forest-600 hover:text-white transition-all duration-200 flex items-center justify-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-stone-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Today only for you</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Call anytime</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg"
                alt="Peaceful meditation scene"
                className="rounded-3xl shadow-2xl w-full"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full opacity-80 blur-xl"></div>
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-sage-400 to-forest-500 rounded-full opacity-60 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;