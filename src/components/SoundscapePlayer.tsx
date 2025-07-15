import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, Timer, Shuffle } from 'lucide-react';
import AudioPlayer from './AudioPlayer';

interface Soundscape {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  image: string;
  category: 'nature' | 'ambient' | 'white-noise' | 'binaural';
  duration?: number;
}

const SoundscapePlayer = () => {
  const [soundscapes] = useState<Soundscape[]>([
    {
      id: '1',
      title: 'Ocean Waves',
      description: 'Gentle waves lapping against the shore',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      image: 'https://images.pexels.com/photos/1496373/pexels-photo-1496373.jpeg',
      category: 'nature'
    },
    {
      id: '2',
      title: 'Forest Rain',
      description: 'Peaceful rainfall in a lush forest',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      image: 'https://images.pexels.com/photos/1031641/pexels-photo-1031641.jpeg',
      category: 'nature'
    },
    {
      id: '3',
      title: 'Mountain Stream',
      description: 'Babbling brook flowing through mountains',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      image: 'https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg',
      category: 'nature'
    },
    {
      id: '4',
      title: 'Tibetan Bowls',
      description: 'Resonant singing bowls for deep meditation',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      image: 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg',
      category: 'ambient'
    },
    {
      id: '5',
      title: 'White Noise',
      description: 'Pure white noise for focus and concentration',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg',
      category: 'white-noise'
    },
    {
      id: '6',
      title: 'Binaural Beats - Focus',
      description: '40Hz gamma waves for enhanced concentration',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg',
      category: 'binaural'
    }
  ]);

  const [selectedSoundscape, setSelectedSoundscape] = useState<Soundscape | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [timer, setTimer] = useState<number | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const categories = [
    { id: 'all', name: 'All Sounds', icon: Shuffle },
    { id: 'nature', name: 'Nature', icon: Play },
    { id: 'ambient', name: 'Ambient', icon: Volume2 },
    { id: 'white-noise', name: 'White Noise', icon: Timer },
    { id: 'binaural', name: 'Binaural', icon: Play }
  ];

  const filteredSoundscapes = activeCategory === 'all' 
    ? soundscapes 
    : soundscapes.filter(s => s.category === activeCategory);

  const handleTimerSet = (minutes: number) => {
    setTimer(minutes * 60);
    setIsTimerActive(true);
  };

  useEffect(() => {
    if (timer && isTimerActive && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => {
          if (prev && prev <= 1) {
            setIsTimerActive(false);
            setSelectedSoundscape(null);
            return null;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timer, isTimerActive]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className="py-20 bg-gradient-to-br from-sage-50 to-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
            Natural{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-600 to-sage-500">
              Soundscapes
            </span>
          </h2>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            Immerse yourself in calming natural sounds and ambient music designed to enhance focus, relaxation, and sleep.
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

        {/* Timer Controls */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center space-x-4">
              <Timer className="w-5 h-5 text-forest-600" />
              <span className="text-stone-700 font-medium">Sleep Timer:</span>
              <div className="flex space-x-2">
                {[15, 30, 60, 90].map((minutes) => (
                  <button
                    key={minutes}
                    onClick={() => handleTimerSet(minutes)}
                    className="px-3 py-1 bg-stone-100 hover:bg-forest-100 text-stone-700 rounded-lg text-sm transition-colors"
                  >
                    {minutes}m
                  </button>
                ))}
              </div>
              {timer && isTimerActive && (
                <div className="text-forest-600 font-mono font-bold">
                  {formatTimer(timer)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Soundscape Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredSoundscapes.map((soundscape) => (
            <div
              key={soundscape.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer"
              onClick={() => setSelectedSoundscape(soundscape)}
            >
              <div className="relative">
                <img
                  src={soundscape.image}
                  alt={soundscape.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Play className="w-12 h-12 text-white" />
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-forest-600 text-white px-3 py-1 rounded-full text-xs font-medium capitalize">
                    {soundscape.category.replace('-', ' ')}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-stone-800 mb-2 group-hover:text-forest-600 transition-colors">
                  {soundscape.title}
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  {soundscape.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Audio Player Modal */}
        {selectedSoundscape && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative">
              <button
                onClick={() => setSelectedSoundscape(null)}
                className="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center text-stone-600 hover:text-stone-800 z-10"
              >
                ×
              </button>
              <AudioPlayer
                audioUrl={selectedSoundscape.audioUrl}
                title={selectedSoundscape.title}
                artist="Serenity Soundscapes"
                image={selectedSoundscape.image}
                autoPlay={true}
                onEnded={() => setSelectedSoundscape(null)}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SoundscapePlayer;