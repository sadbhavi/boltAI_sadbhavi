import React, { useState } from 'react';
import { Heart, MapPin, Filter, Star, MessageCircle, X, Check, Camera, Settings } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  images: string[];
  bio: string;
  interests: string[];
  profession: string;
  education: string;
  religion?: string;
  community?: string;
  languages: string[];
  verified: boolean;
  distance: number;
  compatibility: number;
}

const DatingApp = () => {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [matches, setMatches] = useState<Profile[]>([]);
  
  const [profiles] = useState<Profile[]>([
    {
      id: '1',
      name: 'Priya Sharma',
      age: 26,
      location: 'Mumbai, Maharashtra',
      images: [
        'https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg',
        'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg'
      ],
      bio: 'Software engineer who loves yoga, traveling, and trying new cuisines. Looking for someone who shares similar values and enjoys meaningful conversations.',
      interests: ['Yoga', 'Travel', 'Photography', 'Cooking', 'Reading'],
      profession: 'Software Engineer',
      education: 'B.Tech Computer Science',
      religion: 'Hindu',
      community: 'Brahmin',
      languages: ['Hindi', 'English', 'Marathi'],
      verified: true,
      distance: 5,
      compatibility: 92
    },
    {
      id: '2',
      name: 'Arjun Patel',
      age: 29,
      location: 'Bangalore, Karnataka',
      images: [
        'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg',
        'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg'
      ],
      bio: 'Marketing professional passionate about fitness, music, and social causes. Vegetarian lifestyle and family-oriented values are important to me.',
      interests: ['Fitness', 'Music', 'Volunteering', 'Cricket', 'Movies'],
      profession: 'Marketing Manager',
      education: 'MBA Marketing',
      religion: 'Hindu',
      community: 'Patel',
      languages: ['Gujarati', 'Hindi', 'English'],
      verified: true,
      distance: 12,
      compatibility: 88
    },
    {
      id: '3',
      name: 'Sneha Reddy',
      age: 24,
      location: 'Hyderabad, Telangana',
      images: [
        'https://images.pexels.com/photos/1496373/pexels-photo-1496373.jpeg'
      ],
      bio: 'Doctor by profession, dancer by passion. Love classical music, traditional arts, and spending time with family. Seeking a life partner who values culture and traditions.',
      interests: ['Classical Dance', 'Music', 'Medicine', 'Art', 'Family Time'],
      profession: 'Doctor',
      education: 'MBBS',
      religion: 'Hindu',
      community: 'Reddy',
      languages: ['Telugu', 'Hindi', 'English'],
      verified: true,
      distance: 8,
      compatibility: 95
    }
  ]);

  const [filters, setFilters] = useState({
    ageRange: [22, 35],
    distance: 50,
    religion: '',
    community: '',
    education: '',
    profession: ''
  });

  const currentProfile = profiles[currentProfileIndex];

  const handleLike = () => {
    if (Math.random() > 0.3) { // 70% chance of match
      setMatches([...matches, currentProfile]);
      alert(`It's a match with ${currentProfile.name}! 🎉`);
    }
    nextProfile();
  };

  const handlePass = () => {
    nextProfile();
  };

  const nextProfile = () => {
    if (currentProfileIndex < profiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1);
    } else {
      setCurrentProfileIndex(0); // Loop back to start
    }
  };

  const FilterModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-stone-800">Filters</h2>
          <button
            onClick={() => setShowFilters(false)}
            className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Age Range</label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="18"
                max="50"
                value={filters.ageRange[0]}
                onChange={(e) => setFilters({
                  ...filters,
                  ageRange: [parseInt(e.target.value), filters.ageRange[1]]
                })}
                className="flex-1"
              />
              <span className="text-sm text-stone-600">{filters.ageRange[0]} - {filters.ageRange[1]}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Distance (km)</label>
            <input
              type="range"
              min="1"
              max="100"
              value={filters.distance}
              onChange={(e) => setFilters({ ...filters, distance: parseInt(e.target.value) })}
              className="w-full"
            />
            <span className="text-sm text-stone-600">{filters.distance} km</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Religion</label>
            <select
              value={filters.religion}
              onChange={(e) => setFilters({ ...filters, religion: e.target.value })}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg"
            >
              <option value="">Any</option>
              <option value="Hindu">Hindu</option>
              <option value="Muslim">Muslim</option>
              <option value="Christian">Christian</option>
              <option value="Sikh">Sikh</option>
              <option value="Buddhist">Buddhist</option>
              <option value="Jain">Jain</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Community</label>
            <input
              type="text"
              value={filters.community}
              onChange={(e) => setFilters({ ...filters, community: e.target.value })}
              placeholder="e.g., Brahmin, Patel, Reddy"
              className="w-full px-3 py-2 border border-stone-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Education</label>
            <select
              value={filters.education}
              onChange={(e) => setFilters({ ...filters, education: e.target.value })}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg"
            >
              <option value="">Any</option>
              <option value="Graduate">Graduate</option>
              <option value="Post Graduate">Post Graduate</option>
              <option value="Professional">Professional Degree</option>
              <option value="Doctorate">Doctorate</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setShowFilters(false)}
          className="w-full bg-forest-600 text-white py-3 rounded-xl font-semibold mt-6"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-stone-800 mb-2">No more profiles</h2>
          <p className="text-stone-600">Check back later for new matches!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-pink-100 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-pink-500" />
              <span className="text-xl font-bold text-stone-800">ConnectIndia</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(true)}
                className="p-2 text-stone-600 hover:text-pink-600"
              >
                <Filter className="w-6 h-6" />
              </button>
              <button className="p-2 text-stone-600 hover:text-pink-600">
                <MessageCircle className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-6">
          {/* Image */}
          <div className="relative h-96">
            <img
              src={currentProfile.images[0]}
              alt={currentProfile.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              {currentProfile.verified && (
                <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                  <Check className="w-3 h-3" />
                  <span>Verified</span>
                </div>
              )}
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black bg-opacity-50 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold">{currentProfile.name}, {currentProfile.age}</h2>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm">{currentProfile.compatibility}%</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{currentProfile.location} • {currentProfile.distance}km away</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <div className="mb-4">
              <h3 className="font-semibold text-stone-800 mb-2">About</h3>
              <p className="text-stone-600 leading-relaxed">{currentProfile.bio}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-stone-800 mb-2">Details</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-stone-500">Profession:</span>
                  <div className="font-medium">{currentProfile.profession}</div>
                </div>
                <div>
                  <span className="text-stone-500">Education:</span>
                  <div className="font-medium">{currentProfile.education}</div>
                </div>
                <div>
                  <span className="text-stone-500">Religion:</span>
                  <div className="font-medium">{currentProfile.religion}</div>
                </div>
                <div>
                  <span className="text-stone-500">Community:</span>
                  <div className="font-medium">{currentProfile.community}</div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-stone-800 mb-2">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {currentProfile.languages.map((lang, index) => (
                  <span key={index} className="bg-stone-100 text-stone-700 px-3 py-1 rounded-full text-sm">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-stone-800 mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {currentProfile.interests.map((interest, index) => (
                  <span key={index} className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-6">
          <button
            onClick={handlePass}
            className="w-16 h-16 bg-white border-2 border-stone-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <X className="w-8 h-8 text-stone-500" />
          </button>
          
          <button
            onClick={handleLike}
            className="w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <Heart className="w-10 h-10 fill-current" />
          </button>
          
          <button className="w-16 h-16 bg-white border-2 border-blue-200 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105">
            <Star className="w-8 h-8 text-blue-500" />
          </button>
        </div>

        {/* Matches Counter */}
        {matches.length > 0 && (
          <div className="text-center mt-6">
            <div className="bg-white rounded-full px-4 py-2 inline-block shadow-md">
              <span className="text-pink-600 font-semibold">{matches.length} matches today!</span>
            </div>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilters && <FilterModal />}
    </div>
  );
};

export default DatingApp;