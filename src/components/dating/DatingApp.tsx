import React, { useState } from 'react';
import { Heart, MapPin, Filter, Star, MessageCircle, X, Check, Camera, Settings, ArrowLeft, ArrowRight } from 'lucide-react';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [matches, setMatches] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  
  const [allProfiles] = useState<Profile[]>([
    // Page 1 Profiles
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
    },
    // Page 2 Profiles
    {
      id: '4',
      name: 'Rahul Singh',
      age: 28,
      location: 'Delhi, NCR',
      images: [
        'https://images.pexels.com/photos/1031641/pexels-photo-1031641.jpeg'
      ],
      bio: 'Investment banker who enjoys weekend treks and exploring new cafes. Looking for someone ambitious yet grounded, who values work-life balance.',
      interests: ['Trekking', 'Finance', 'Coffee', 'Books', 'Travel'],
      profession: 'Investment Banker',
      education: 'MBA Finance',
      religion: 'Hindu',
      community: 'Rajput',
      languages: ['Hindi', 'English', 'Punjabi'],
      verified: true,
      distance: 15,
      compatibility: 87
    },
    {
      id: '5',
      name: 'Kavya Nair',
      age: 25,
      location: 'Kochi, Kerala',
      images: [
        'https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg'
      ],
      bio: 'Graphic designer with a passion for sustainable living and organic farming. Love creating art and exploring Kerala\'s beautiful backwaters.',
      interests: ['Design', 'Art', 'Sustainability', 'Farming', 'Nature'],
      profession: 'Graphic Designer',
      education: 'B.Des Visual Communication',
      religion: 'Hindu',
      community: 'Nair',
      languages: ['Malayalam', 'Hindi', 'English'],
      verified: true,
      distance: 22,
      compatibility: 91
    },
    {
      id: '6',
      name: 'Vikram Gupta',
      age: 31,
      location: 'Pune, Maharashtra',
      images: [
        'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg'
      ],
      bio: 'Startup founder in the tech space. Love innovation, mentoring young entrepreneurs, and playing chess. Seeking a partner who shares entrepreneurial spirit.',
      interests: ['Entrepreneurship', 'Technology', 'Chess', 'Mentoring', 'Innovation'],
      profession: 'Startup Founder',
      education: 'B.Tech + MBA',
      religion: 'Hindu',
      community: 'Agarwal',
      languages: ['Hindi', 'English', 'Marathi'],
      verified: true,
      distance: 18,
      compatibility: 89
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

  const profilesPerPage = 3;
  const totalPages = Math.ceil(allProfiles.length / profilesPerPage);
  const startIndex = (currentPage - 1) * profilesPerPage;
  const currentProfiles = allProfiles.slice(startIndex, startIndex + profilesPerPage);

  const handleLike = (profile: Profile) => {
    if (Math.random() > 0.3) { // 70% chance of match
      setMatches([...matches, profile]);
      alert(`It's a match with ${profile.name}! 🎉`);
    }
  };

  const handlePass = (profile: Profile) => {
    console.log('Passed on:', profile.name);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
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

  const ProfileModal = ({ profile }: { profile: Profile }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button
            onClick={() => setSelectedProfile(null)}
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>
          
          <img
            src={profile.images[0]}
            alt={profile.name}
            className="w-full h-64 object-cover rounded-t-2xl"
          />
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-stone-800">{profile.name}, {profile.age}</h2>
                <div className="flex items-center space-x-2 text-stone-600">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location} • {profile.distance}km away</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {profile.verified && (
                  <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                    <Check className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{profile.compatibility}%</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-stone-800 mb-2">About</h3>
              <p className="text-stone-600 leading-relaxed">{profile.bio}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="font-medium text-stone-800 mb-2">Details</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-stone-500">Profession:</span> {profile.profession}</div>
                  <div><span className="text-stone-500">Education:</span> {profile.education}</div>
                  <div><span className="text-stone-500">Religion:</span> {profile.religion}</div>
                  <div><span className="text-stone-500">Community:</span> {profile.community}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-stone-800 mb-2">Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((lang, index) => (
                    <span key={index} className="bg-stone-100 text-stone-700 px-2 py-1 rounded-full text-xs">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-stone-800 mb-2">Interests</h4>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <span key={index} className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  handlePass(profile);
                  setSelectedProfile(null);
                }}
                className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center hover:bg-stone-300 transition-colors"
              >
                <X className="w-6 h-6 text-stone-600" />
              </button>
              
              <button
                onClick={() => {
                  handleLike(profile);
                  setSelectedProfile(null);
                }}
                className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
              >
                <Heart className="w-8 h-8 fill-current" />
              </button>
              
              <button className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center hover:bg-blue-300 transition-colors">
                <Star className="w-6 h-6 text-blue-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-pink-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-stone-800 mb-2">Discover Your Perfect Match</h1>
          <p className="text-stone-600">Find meaningful connections with people who share your values</p>
        </div>

        {/* Profile Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {currentProfiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              onClick={() => setSelectedProfile(profile)}
            >
              {/* Image */}
              <div className="relative h-80">
                <img
                  src={profile.images[0]}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  {profile.verified && (
                    <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black bg-opacity-50 rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold">{profile.name}, {profile.age}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm">{profile.compatibility}%</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location} • {profile.distance}km away</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="p-6">
                <p className="text-stone-600 mb-4 line-clamp-2">{profile.bio}</p>
                
                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-stone-500">Profession:</span> {profile.profession}</div>
                    <div><span className="text-stone-500">Education:</span> {profile.education}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.slice(0, 3).map((interest, index) => (
                      <span key={index} className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs">
                        {interest}
                      </span>
                    ))}
                    {profile.interests.length > 3 && (
                      <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded-full text-xs">
                        +{profile.interests.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePass(profile);
                    }}
                    className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center hover:bg-stone-300 transition-colors"
                  >
                    <X className="w-6 h-6 text-stone-600" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(profile);
                    }}
                    className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    <Heart className="w-8 h-8 fill-current" />
                  </button>
                  
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center hover:bg-blue-300 transition-colors"
                  >
                    <Star className="w-6 h-6 text-blue-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-6">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="flex items-center space-x-2 px-6 py-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>
          
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-full font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-pink-500 text-white'
                    : 'bg-white text-stone-600 hover:bg-pink-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="flex items-center space-x-2 px-6 py-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Matches Counter */}
        {matches.length > 0 && (
          <div className="text-center mt-8">
            <div className="bg-white rounded-full px-6 py-3 inline-block shadow-md">
              <span className="text-pink-600 font-semibold">{matches.length} matches today!</span>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showFilters && <FilterModal />}
      {selectedProfile && <ProfileModal profile={selectedProfile} />}
    </div>
  );
};

export default DatingApp;