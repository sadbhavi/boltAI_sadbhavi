import React, { useState } from 'react';
import { Play, Moon, Star, Clock, User } from 'lucide-react';
import AudioPlayer from './AudioPlayer';

interface SleepStory {
  id: string;
  title: string;
  narrator: string;
  description: string;
  duration: number;
  audioUrl: string;
  image: string;
  category: 'fantasy' | 'nature' | 'journey' | 'classic';
  isPremium: boolean;
}

const SleepStories = () => {
  const [sleepStories] = useState<SleepStory[]>([
    {
      id: '1',
      title: 'The Enchanted Forest',
      narrator: 'Sarah Chen',
      description: 'Journey through a magical forest where ancient trees whisper secrets of peace and tranquility.',
      duration: 45,
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      image: 'https://images.pexels.com/photos/1031641/pexels-photo-1031641.jpeg',
      category: 'fantasy',
      isPremium: false
    },
    {
      id: '2',
      title: 'Ocean Lullaby',
      narrator: 'Michael Rodriguez',
      description: 'Drift away on gentle waves as the ocean sings you to sleep with its eternal rhythm.',
      duration: 38,
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      image: 'https://images.pexels.com/photos/1496373/pexels-photo-1496373.jpeg',
      category: 'nature',
      isPremium: true
    },
    {
      id: '3',
      title: 'Mountain Cabin Retreat',
      narrator: 'Emily Watson',
      description: 'Find solace in a cozy mountain cabin where the crackling fire and gentle snowfall create perfect serenity.',
      duration: 52,
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      image: 'https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg',
      category: 'journey',
      isPremium: true
    },
    {
      id: '4',
      title: 'The Secret Garden',
      narrator: 'James Thompson',
      description: 'Explore a hidden garden where every flower holds a story and every breeze carries dreams.',
      duration: 41,
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      image: 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg',
      category: 'classic',
      isPremium: false
    },
    {
      id: '5',
      title: 'Starlight Express',
      narrator: 'Luna Martinez',
      description: 'Board a mystical train that travels through the cosmos, visiting peaceful planets and starlit meadows.',
      duration: 47,
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg',
      category: 'fantasy',
      isPremium: true
    },
    {
      id: '6',
      title: 'Countryside Memories',
      narrator: 'David Park',
      description: 'Relive peaceful childhood memories in a quiet countryside where time moves slowly and worries fade away.',
      duration: 35,
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg',
      category: 'journey',
      isPremium: false
    }
  ]);

  const [selectedStory, setSelectedStory] = useState<SleepStory | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Stories', icon: Moon },
    { id: 'fantasy', name: 'Fantasy', icon: Star },
    { id: 'nature', name: 'Nature', icon: Play },
    { id: 'journey', name: 'Journey', icon: Clock },
    { id: 'classic', name: 'Classic', icon: User }
  ];

  const filteredStories = activeCategory === 'all' 
    ? sleepStories 
    : sleepStories.filter(s => s.category === activeCategory);

  return (
    <section className="py-20 bg-gradient-to-br from-stone-50 to-sage-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
            Peaceful{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-600 to-sage-500">
              Sleep Stories
            </span>
          </h2>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            Drift into restful sleep with our collection of narrated bedtime stories, designed to calm your mind and ease you into peaceful dreams.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-forest-600 text-white shadow-lg'
                    : 'bg-white text-stone-600 hover:bg-stone-100'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Stories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer"
              onClick={() => setSelectedStory(story)}
            >
              <div className="relative">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Play className="w-12 h-12 text-white" />
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-forest-600 text-white px-3 py-1 rounded-full text-xs font-medium capitalize">
                    {story.category}
                  </span>
                </div>
                {story.isPremium && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Premium
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-stone-800 mb-2 group-hover:text-forest-600 transition-colors">
                  {story.title}
                </h3>
                <p className="text-stone-600 mb-4 leading-relaxed">
                  {story.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-stone-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{story.narrator}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{story.duration} min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Audio Player Modal */}
        {selectedStory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative">
              <button
                onClick={() => setSelectedStory(null)}
                className="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center text-stone-600 hover:text-stone-800 z-10"
              >
                ×
              </button>
              <AudioPlayer
                audioUrl={selectedStory.audioUrl}
                title={selectedStory.title}
                artist={selectedStory.narrator}
                image={selectedStory.image}
                autoPlay={true}
                onEnded={() => setSelectedStory(null)}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SleepStories;