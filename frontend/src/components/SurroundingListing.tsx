import React, { useState, useEffect } from 'react';
import { MapPin, Filter, Heart, X, Check, Star, Users, Phone, MessageCircle, Shield, Navigation, Map } from 'lucide-react';

interface NearbyProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  distance: number;
  images: string[];
  bio: string;
  interests: string[];
  profession: string;
  education: string;
  religion?: string;
  community?: string;
  languages: string[];
  verified: boolean;
  compatibility: number;
  relationshipGoal: 'fun' | 'friendship' | 'serious' | 'marriage' | 'open';
  dietaryPreference: 'vegetarian' | 'non-vegetarian' | 'vegan' | 'jain';
  isOnline?: boolean;
  lastSeen?: string;
  premium?: boolean;
  coordinates?: { lat: number; lng: number };
}

const SurroundingListing = () => {
  const [profiles, setProfiles] = useState<NearbyProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<NearbyProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<NearbyProfile | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    maxDistance: 50,
    ageRange: [22, 35],
    religion: '',
    relationshipGoal: '',
    dietaryPreference: '',
    onlineOnly: false,
    verifiedOnly: false
  });

  // Sample nearby profiles data
  const sampleProfiles: NearbyProfile[] = [
    {
      id: '1',
      name: 'Priya Sharma',
      age: 26,
      location: 'Bandra, Mumbai',
      distance: 2.5,
      images: ['https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg'],
      bio: 'Software engineer who loves yoga, traveling, and trying new cuisines.',
      interests: ['Yoga', 'Travel', 'Photography', 'Cooking'],
      profession: 'Software Engineer',
      education: 'B.Tech Computer Science',
      religion: 'Hindu',
      community: 'Brahmin',
      languages: ['Hindi', 'English', 'Marathi'],
      verified: true,
      compatibility: 92,
      relationshipGoal: 'serious',
      dietaryPreference: 'vegetarian',
      isOnline: true,
      premium: true,
      coordinates: { lat: 19.0596, lng: 72.8295 }
    },
    {
      id: '2',
      name: 'Arjun Patel',
      age: 29,
      location: 'Koramangala, Bangalore',
      distance: 5.2,
      images: ['https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg'],
      bio: 'Marketing professional passionate about fitness and music.',
      interests: ['Fitness', 'Music', 'Cricket', 'Movies'],
      profession: 'Marketing Manager',
      education: 'MBA Marketing',
      religion: 'Hindu',
      community: 'Patel',
      languages: ['Gujarati', 'Hindi', 'English'],
      verified: true,
      compatibility: 88,
      relationshipGoal: 'marriage',
      dietaryPreference: 'vegetarian',
      isOnline: false,
      lastSeen: '2 hours ago',
      coordinates: { lat: 12.9352, lng: 77.6245 }
    },
    {
      id: '3',
      name: 'Sneha Reddy',
      age: 24,
      location: 'Jubilee Hills, Hyderabad',
      distance: 8.7,
      images: ['https://images.pexels.com/photos/1496373/pexels-photo-1496373.jpeg'],
      bio: 'Doctor by profession, dancer by passion.',
      interests: ['Classical Dance', 'Music', 'Medicine', 'Art'],
      profession: 'Doctor',
      education: 'MBBS',
      religion: 'Hindu',
      community: 'Reddy',
      languages: ['Telugu', 'Hindi', 'English'],
      verified: true,
      compatibility: 95,
      relationshipGoal: 'marriage',
      dietaryPreference: 'vegetarian',
      isOnline: true,
      coordinates: { lat: 17.4239, lng: 78.4738 }
    },
    {
      id: '4',
      name: 'Rahul Singh',
      age: 28,
      location: 'Connaught Place, Delhi',
      distance: 12.3,
      images: ['https://images.pexels.com/photos/1031641/pexels-photo-1031641.jpeg'],
      bio: 'Investment banker who enjoys weekend treks.',
      interests: ['Trekking', 'Finance', 'Coffee', 'Books'],
      profession: 'Investment Banker',
      education: 'MBA Finance',
      religion: 'Hindu',
      community: 'Rajput',
      languages: ['Hindi', 'English', 'Punjabi'],
      verified: true,
      compatibility: 87,
      relationshipGoal: 'serious',
      dietaryPreference: 'non-vegetarian',
      isOnline: false,
      lastSeen: '1 day ago',
      premium: true,
      coordinates: { lat: 28.6315, lng: 77.2167 }
    },
    {
      id: '5',
      name: 'Kavya Nair',
      age: 25,
      location: 'Marine Drive, Kochi',
      distance: 18.9,
      images: ['https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg'],
      bio: 'Graphic designer with a passion for sustainable living.',
      interests: ['Design', 'Art', 'Sustainability', 'Nature'],
      profession: 'Graphic Designer',
      education: 'B.Des Visual Communication',
      religion: 'Hindu',
      community: 'Nair',
      languages: ['Malayalam', 'Hindi', 'English'],
      verified: true,
      compatibility: 91,
      relationshipGoal: 'fun',
      dietaryPreference: 'vegetarian',
      isOnline: true,
      coordinates: { lat: 9.9312, lng: 76.2673 }
    },
    {
      id: '6',
      name: 'Vikram Gupta',
      age: 31,
      location: 'Hinjewadi, Pune',
      distance: 25.4,
      images: ['https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg'],
      bio: 'Startup founder in the tech space.',
      interests: ['Entrepreneurship', 'Technology', 'Chess', 'Innovation'],
      profession: 'Startup Founder',
      education: 'B.Tech + MBA',
      religion: 'Hindu',
      community: 'Agarwal',
      languages: ['Hindi', 'English', 'Marathi'],
      verified: true,
      compatibility: 89,
      relationshipGoal: 'open',
      dietaryPreference: 'non-vegetarian',
      isOnline: false,
      lastSeen: '5 hours ago',
      coordinates: { lat: 18.5912, lng: 73.7389 }
    }
  ];

  useEffect(() => {
    // Simulate loading profiles
    setLoading(true);
    setTimeout(() => {
      setProfiles(sampleProfiles);
      setFilteredProfiles(sampleProfiles);
      setLoading(false);
    }, 1500);

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Mumbai coordinates
          setUserLocation({ lat: 19.0760, lng: 72.8777 });
        }
      );
    }
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = profiles.filter(profile => {
      if (profile.distance > filters.maxDistance) return false;
      if (profile.age < filters.ageRange[0] || profile.age > filters.ageRange[1]) return false;
      if (filters.religion && profile.religion !== filters.religion) return false;
      if (filters.relationshipGoal && profile.relationshipGoal !== filters.relationshipGoal) return false;
      if (filters.dietaryPreference && profile.dietaryPreference !== filters.dietaryPreference) return false;
      if (filters.onlineOnly && !profile.isOnline) return false;
      if (filters.verifiedOnly && !profile.verified) return false;
      return true;
    });

    // Sort by distance
    filtered.sort((a, b) => a.distance - b.distance);
    setFilteredProfiles(filtered);
  }, [profiles, filters]);

  const handleLike = (profile: NearbyProfile) => {
    console.log('Liked:', profile.name);
    // Implement like functionality
  };

  const handleMessage = (profile: NearbyProfile) => {
    console.log('Message:', profile.name);
    // Implement messaging functionality
  };

  const resetFilters = () => {
    setFilters({
      maxDistance: 50,
      ageRange: [22, 35],
      religion: '',
      relationshipGoal: '',
      dietaryPreference: '',
      onlineOnly: false,
      verifiedOnly: false
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Finding nearby profiles...</h2>
          <p className="text-gray-600">Discovering compatible matches in your area</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-green-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Nearby Profiles</h1>
                <p className="text-sm text-gray-600">{filteredProfiles.length} matches found</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* View Toggle */}
              <div className="bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : ''
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'map' ? 'bg-white shadow-sm' : ''
                  }`}
                >
                  Map
                </button>
              </div>
              
              <button
                onClick={() => setShowFilters(true)}
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
              >
                <Filter className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Distance Indicator */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Navigation className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-800">Search Radius</h3>
                <p className="text-gray-600">Showing profiles within {filters.maxDistance}km</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {[10, 25, 50, 100].map((distance) => (
                <button
                  key={distance}
                  onClick={() => setFilters({ ...filters, maxDistance: distance })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filters.maxDistance === distance
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {distance}km
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Profiles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProfiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
              onClick={() => setSelectedProfile(profile)}
            >
              {/* Image */}
              <div className="relative h-80">
                <img
                  src={profile.images[0]}
                  alt={profile.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Online Status */}
                {profile.isOnline && (
                  <div className="absolute top-4 left-4">
                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span>Online</span>
                    </div>
                  </div>
                )}
                
                {/* Distance Badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-green-600" />
                    <span>{profile.distance}km away</span>
                  </div>
                </div>
                
                {/* Badges */}
                <div className="absolute bottom-4 left-4 flex space-x-2">
                  {profile.verified && (
                    <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>Verified</span>
                    </div>
                  )}
                  {profile.premium && (
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs">
                      Premium
                    </div>
                  )}
                </div>
                
                {/* Profile Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-bold">{profile.name}, {profile.age}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{profile.compatibility}%</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-sm mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="bg-white/20 px-2 py-1 rounded-full">{profile.profession}</span>
                    <span className="bg-white/20 px-2 py-1 rounded-full capitalize">{profile.relationshipGoal}</span>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-6">
                <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{profile.bio}</p>
                
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.slice(0, 3).map((interest, index) => (
                      <span key={index} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                        {interest}
                      </span>
                    ))}
                    {profile.interests.length > 3 && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
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
                      handleMessage(profile);
                    }}
                    className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center hover:bg-blue-300 transition-colors"
                  >
                    <MessageCircle className="w-6 h-6 text-blue-600" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(profile);
                    }}
                    className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                  >
                    <Heart className="w-8 h-8 fill-current" />
                  </button>
                  
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                  >
                    <Phone className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProfiles.length === 0 && (
          <div className="text-center py-16">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No profiles found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or increasing the search radius</p>
            <button
              onClick={resetFilters}
              className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distance: {filters.maxDistance}km
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={filters.maxDistance}
                  onChange={(e) => setFilters({ ...filters, maxDistance: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
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
                  <span className="text-sm text-gray-600">{filters.ageRange[0]} - {filters.ageRange[1]}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                <select
                  value={filters.religion}
                  onChange={(e) => setFilters({ ...filters, religion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="">Any</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Christian">Christian</option>
                  <option value="Sikh">Sikh</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Relationship Goal</label>
                <select
                  value={filters.relationshipGoal}
                  onChange={(e) => setFilters({ ...filters, relationshipGoal: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="">Any</option>
                  <option value="fun">Fun/Casual</option>
                  <option value="friendship">Friendship</option>
                  <option value="serious">Serious Relationship</option>
                  <option value="marriage">Marriage</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Preference</label>
                <select
                  value={filters.dietaryPreference}
                  onChange={(e) => setFilters({ ...filters, dietaryPreference: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="">Any</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="non-vegetarian">Non-Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="jain">Jain</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={filters.onlineOnly}
                    onChange={(e) => setFilters({ ...filters, onlineOnly: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Show only online users</span>
                </label>
                
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={filters.verifiedOnly}
                    onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Show only verified profiles</span>
                </label>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={resetFilters}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Detail Modal */}
      {selectedProfile && (
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
                src={selectedProfile.images[0]}
                alt={selectedProfile.name}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h2 className="text-2xl font-bold text-gray-800">{selectedProfile.name}, {selectedProfile.age}</h2>
                      {selectedProfile.isOnline && (
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedProfile.location} • {selectedProfile.distance}km away</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{selectedProfile.compatibility}%</span>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed mb-6">{selectedProfile.bio}</p>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Personal Details</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-gray-500">Profession:</span> {selectedProfile.profession}</div>
                      <div><span className="text-gray-500">Education:</span> {selectedProfile.education}</div>
                      <div><span className="text-gray-500">Religion:</span> {selectedProfile.religion}</div>
                      <div><span className="text-gray-500">Community:</span> {selectedProfile.community}</div>
                      <div><span className="text-gray-500">Diet:</span> {selectedProfile.dietaryPreference}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">Languages</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedProfile.languages.map((lang, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {lang}
                        </span>
                      ))}
                    </div>
                    
                    <h4 className="font-medium text-gray-800 mb-2">Looking for</h4>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm capitalize">
                      {selectedProfile.relationshipGoal}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-2">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfile.interests.map((interest, index) => (
                      <span key={index} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => handleMessage(selectedProfile)}
                    className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center hover:bg-blue-300 transition-colors"
                  >
                    <MessageCircle className="w-6 h-6 text-blue-600" />
                  </button>
                  
                  <button
                    onClick={() => handleLike(selectedProfile)}
                    className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    <Heart className="w-8 h-8 fill-current" />
                  </button>
                  
                  <button className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors">
                    <Phone className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurroundingListing;