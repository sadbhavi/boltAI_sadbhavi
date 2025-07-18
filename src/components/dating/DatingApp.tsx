import React, { useState } from 'react';
import { Heart, MapPin, Filter, Star, MessageCircle, X, Check, Camera, Settings, ArrowLeft, ArrowRight, Shield, Users, Globe, Award, Phone, Mail, Eye, EyeOff, Search, Zap, Crown, Gift } from 'lucide-react';

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
  relationshipGoal: 'fun' | 'friendship' | 'serious' | 'marriage' | 'open';
  dietaryPreference: 'vegetarian' | 'non-vegetarian' | 'vegan' | 'jain';
  smokingHabits: 'never' | 'occasionally' | 'regularly';
  drinkingHabits: 'never' | 'occasionally' | 'regularly';
  familyType: 'nuclear' | 'joint';
  horoscope?: {
    sign: string;
    manglik: boolean;
  };
  isOnline?: boolean;
  lastSeen?: string;
  premium?: boolean;
}

const DatingApp = () => {
  const [currentView, setCurrentView] = useState<'login' | 'onboarding' | 'profile-building' | 'main'>('main');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [matches, setMatches] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(45);
  const [viewMode, setViewMode] = useState<'grid' | 'cards'>('grid');
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  
  // Login/Signup form state
  const [loginData, setLoginData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    otp: '',
    loginMethod: 'email' as 'email' | 'phone'
  });

  // Profile building state
  const [profileData, setProfileData] = useState({
    relationshipGoal: 'serious' as 'fun' | 'friendship' | 'serious' | 'marriage' | 'open',
    bio: '',
    interests: [] as string[],
    religion: '',
    community: '',
    dietaryPreference: 'vegetarian' as 'vegetarian' | 'non-vegetarian' | 'vegan' | 'jain',
    smokingHabits: 'never' as 'never' | 'occasionally' | 'regularly',
    drinkingHabits: 'never' as 'never' | 'occasionally' | 'regularly',
    familyType: 'nuclear' as 'nuclear' | 'joint',
    horoscope: {
      sign: '',
      manglik: false
    },
    languages: [] as string[]
  });

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
      compatibility: 92,
      relationshipGoal: 'serious',
      dietaryPreference: 'vegetarian',
      smokingHabits: 'never',
      drinkingHabits: 'occasionally',
      familyType: 'nuclear',
      horoscope: {
        sign: 'Leo',
        manglik: false
      },
      isOnline: true,
      premium: true
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
      compatibility: 88,
      relationshipGoal: 'marriage',
      dietaryPreference: 'vegetarian',
      smokingHabits: 'never',
      drinkingHabits: 'never',
      familyType: 'joint',
      horoscope: {
        sign: 'Virgo',
        manglik: true
      },
      isOnline: false,
      lastSeen: '2 hours ago'
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
      compatibility: 95,
      relationshipGoal: 'marriage',
      dietaryPreference: 'vegetarian',
      smokingHabits: 'never',
      drinkingHabits: 'never',
      familyType: 'joint',
      isOnline: true
    },
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
      compatibility: 87,
      relationshipGoal: 'serious',
      dietaryPreference: 'non-vegetarian',
      smokingHabits: 'occasionally',
      drinkingHabits: 'regularly',
      familyType: 'nuclear',
      isOnline: false,
      lastSeen: '1 day ago',
      premium: true
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
      compatibility: 91,
      relationshipGoal: 'fun',
      dietaryPreference: 'vegetarian',
      smokingHabits: 'never',
      drinkingHabits: 'occasionally',
      familyType: 'nuclear',
      isOnline: true
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
      compatibility: 89,
      relationshipGoal: 'open',
      dietaryPreference: 'non-vegetarian',
      smokingHabits: 'never',
      drinkingHabits: 'occasionally',
      familyType: 'nuclear',
      isOnline: false,
      lastSeen: '5 hours ago'
    },
    // Additional profiles for more variety
    {
      id: '7',
      name: 'Ananya Iyer',
      age: 27,
      location: 'Chennai, Tamil Nadu',
      images: [
        'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg'
      ],
      bio: 'Classical singer and music teacher. Love Carnatic music, temple visits, and cooking traditional South Indian food. Looking for someone who appreciates culture.',
      interests: ['Music', 'Singing', 'Cooking', 'Spirituality', 'Teaching'],
      profession: 'Music Teacher',
      education: 'M.A. Music',
      religion: 'Hindu',
      community: 'Iyer',
      languages: ['Tamil', 'Hindi', 'English', 'Sanskrit'],
      verified: true,
      distance: 25,
      compatibility: 93,
      relationshipGoal: 'marriage',
      dietaryPreference: 'vegetarian',
      smokingHabits: 'never',
      drinkingHabits: 'never',
      familyType: 'joint',
      horoscope: {
        sign: 'Pisces',
        manglik: false
      },
      isOnline: true
    },
    {
      id: '8',
      name: 'Rohan Kapoor',
      age: 30,
      location: 'Gurgaon, Haryana',
      images: [
        'https://images.pexels.com/photos/1031641/pexels-photo-1031641.jpeg'
      ],
      bio: 'Digital marketing expert and travel blogger. Love exploring new places, trying street food, and meeting new people. Adventure seeker at heart!',
      interests: ['Travel', 'Blogging', 'Photography', 'Food', 'Adventure'],
      profession: 'Digital Marketer',
      education: 'B.Com + Digital Marketing',
      religion: 'Hindu',
      community: 'Kapoor',
      languages: ['Hindi', 'English', 'Punjabi'],
      verified: true,
      distance: 8,
      compatibility: 85,
      relationshipGoal: 'fun',
      dietaryPreference: 'non-vegetarian',
      smokingHabits: 'occasionally',
      drinkingHabits: 'regularly',
      familyType: 'nuclear',
      isOnline: false,
      lastSeen: '3 hours ago',
      premium: true
    },
    {
      id: '9',
      name: 'Meera Joshi',
      age: 23,
      location: 'Jaipur, Rajasthan',
      images: [
        'https://images.pexels.com/photos/1496373/pexels-photo-1496373.jpeg'
      ],
      bio: 'Fashion designer with a love for traditional Rajasthani crafts. Enjoy painting, horse riding, and exploring heritage sites. Family means everything to me.',
      interests: ['Fashion', 'Design', 'Painting', 'Horse Riding', 'Heritage'],
      profession: 'Fashion Designer',
      education: 'NIFT Fashion Design',
      religion: 'Hindu',
      community: 'Joshi',
      languages: ['Hindi', 'Rajasthani', 'English'],
      verified: true,
      distance: 35,
      compatibility: 90,
      relationshipGoal: 'serious',
      dietaryPreference: 'vegetarian',
      smokingHabits: 'never',
      drinkingHabits: 'occasionally',
      familyType: 'joint',
      isOnline: true
    },
    {
      id: '10',
      name: 'Aditya Menon',
      age: 32,
      location: 'Thiruvananthapuram, Kerala',
      images: [
        'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg'
      ],
      bio: 'Ayurvedic doctor passionate about holistic healing and yoga. Love nature, meditation, and helping people achieve wellness. Seeking a mindful partner.',
      interests: ['Ayurveda', 'Yoga', 'Meditation', 'Nature', 'Wellness'],
      profession: 'Ayurvedic Doctor',
      education: 'BAMS',
      religion: 'Hindu',
      community: 'Menon',
      languages: ['Malayalam', 'Hindi', 'English', 'Sanskrit'],
      verified: true,
      distance: 42,
      compatibility: 94,
      relationshipGoal: 'marriage',
      dietaryPreference: 'vegetarian',
      smokingHabits: 'never',
      drinkingHabits: 'never',
      familyType: 'joint',
      horoscope: {
        sign: 'Scorpio',
        manglik: false
      },
      isOnline: false,
      lastSeen: '1 hour ago'
    },
    {
      id: '11',
      name: 'Ishita Bansal',
      age: 26,
      location: 'Chandigarh, Punjab',
      images: [
        'https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg'
      ],
      bio: 'CA by profession, dancer by passion. Love Bhangra, Punjabi music, and family gatherings. Looking for someone who can match my energy and values.',
      interests: ['Dancing', 'Music', 'Finance', 'Family', 'Festivals'],
      profession: 'Chartered Accountant',
      education: 'CA',
      religion: 'Sikh',
      community: 'Bansal',
      languages: ['Punjabi', 'Hindi', 'English'],
      verified: true,
      distance: 28,
      compatibility: 86,
      relationshipGoal: 'marriage',
      dietaryPreference: 'vegetarian',
      smokingHabits: 'never',
      drinkingHabits: 'occasionally',
      familyType: 'joint',
      isOnline: true,
      premium: true
    },
    {
      id: '12',
      name: 'Karthik Raman',
      age: 29,
      location: 'Coimbatore, Tamil Nadu',
      images: [
        'https://images.pexels.com/photos/1031641/pexels-photo-1031641.jpeg'
      ],
      bio: 'Software architect and part-time photographer. Love capturing moments, exploring temples, and South Indian classical music. Seeking a cultured partner.',
      interests: ['Photography', 'Technology', 'Music', 'Temples', 'Culture'],
      profession: 'Software Architect',
      education: 'M.Tech Computer Science',
      religion: 'Hindu',
      community: 'Raman',
      languages: ['Tamil', 'Hindi', 'English'],
      verified: true,
      distance: 18,
      compatibility: 91,
      relationshipGoal: 'serious',
      dietaryPreference: 'vegetarian',
      smokingHabits: 'never',
      drinkingHabits: 'occasionally',
      familyType: 'nuclear',
      isOnline: false,
      lastSeen: '6 hours ago'
    }
  ]);

  const [filters, setFilters] = useState({
    ageRange: [22, 35],
    distance: 50,
    religion: '',
    community: '',
    education: '',
    profession: '',
    relationshipGoal: '',
    dietaryPreference: ''
  });

  const profilesPerPage = 6;
  const totalPages = Math.ceil(allProfiles.length / profilesPerPage);
  const startIndex = (currentPage - 1) * profilesPerPage;
  
  // Use filtered profiles if search is active, otherwise use all profiles
  const profilesToShow = searchQuery ? filteredProfiles : allProfiles;
  const currentProfiles = profilesToShow.slice(startIndex, startIndex + profilesPerPage);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = allProfiles.filter(profile =>
        profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.interests.some(interest => 
          interest.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        profile.religion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.community?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProfiles(filtered);
      setCurrentPage(1); // Reset to first page when searching
    } else {
      setFilteredProfiles([]);
    }
  }, [searchQuery, allProfiles]);

  const relationshipGoals = [
    { id: 'fun', name: 'Fun/Casual Dating', description: 'Light-hearted connections and casual dates' },
    { id: 'friendship', name: 'Friendship', description: 'Building platonic relationships' },
    { id: 'serious', name: 'Serious Relationship', description: 'Long-term commitment without immediate marriage' },
    { id: 'marriage', name: 'Marriage', description: 'Finding a life partner' },
    { id: 'open', name: 'Open to All', description: 'Flexible about relationship goals' }
  ];

  const availableInterests = [
    'Travel', 'Photography', 'Cooking', 'Reading', 'Music', 'Dancing', 'Fitness', 'Yoga',
    'Cricket', 'Football', 'Movies', 'Art', 'Technology', 'Volunteering', 'Nature',
    'Spirituality', 'Fashion', 'Gaming', 'Writing', 'Meditation'
  ];

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

  const handleLogin = () => {
    // Simulate login process
    setCurrentView('onboarding');
  };

  const handleSignup = () => {
    // Simulate signup process
    setCurrentView('profile-building');
  };

  const completeOnboarding = () => {
    setCurrentView('profile-building');
  };

  const completeProfileBuilding = () => {
    setCurrentView('main');
  };

  const toggleInterest = (interest: string) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  // Filter Modal
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
            <label className="block text-sm font-medium text-stone-700 mb-2">Relationship Goal</label>
            <select
              value={filters.relationshipGoal}
              onChange={(e) => setFilters({ ...filters, relationshipGoal: e.target.value })}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg"
            >
              <option value="">Any</option>
              <option value="fun">Fun/Casual</option>
              <option value="friendship">Friendship</option>
              <option value="serious">Serious Relationship</option>
              <option value="marriage">Marriage</option>
              <option value="open">Open to All</option>
            </select>
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
            <label className="block text-sm font-medium text-stone-700 mb-2">Dietary Preference</label>
            <select
              value={filters.dietaryPreference}
              onChange={(e) => setFilters({ ...filters, dietaryPreference: e.target.value })}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg"
            >
              <option value="">Any</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="non-vegetarian">Non-Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="jain">Jain</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setShowFilters(false)}
          className="w-full bg-pink-600 text-white py-3 rounded-xl font-semibold mt-6"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  // Profile Modal
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
                <div className="flex items-center space-x-2 mb-1">
                  <h2 className="text-2xl font-bold text-stone-800">{profile.name}, {profile.age}</h2>
                  {profile.isOnline && (
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-stone-600">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location} • {profile.distance}km away</span>
                </div>
                {!profile.isOnline && profile.lastSeen && (
                  <p className="text-sm text-stone-500">Last seen {profile.lastSeen}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {profile.verified && (
                  <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                    <Check className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                )}
                {profile.premium && (
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                    <Crown className="w-3 h-3" />
                    <span>Premium</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{profile.compatibility}%</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="w-4 h-4 text-pink-500" />
                <span className="text-sm font-medium text-stone-700 capitalize">Looking for: {profile.relationshipGoal}</span>
              </div>
              <p className="text-stone-600 leading-relaxed">{profile.bio}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-stone-800 mb-3">Personal Details</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-stone-500">Profession:</span> {profile.profession}</div>
                  <div><span className="text-stone-500">Education:</span> {profile.education}</div>
                  <div><span className="text-stone-500">Religion:</span> {profile.religion}</div>
                  <div><span className="text-stone-500">Community:</span> {profile.community}</div>
                  <div><span className="text-stone-500">Diet:</span> {profile.dietaryPreference}</div>
                  <div><span className="text-stone-500">Family:</span> {profile.familyType} family</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-stone-800 mb-3">Lifestyle</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-stone-500">Smoking:</span> {profile.smokingHabits}</div>
                  <div><span className="text-stone-500">Drinking:</span> {profile.drinkingHabits}</div>
                  {profile.horoscope && (
                    <>
                      <div><span className="text-stone-500">Sign:</span> {profile.horoscope.sign}</div>
                      <div><span className="text-stone-500">Manglik:</span> {profile.horoscope.manglik ? 'Yes' : 'No'}</div>
                    </>
                  )}
                </div>
                
                <h4 className="font-medium text-stone-800 mb-2 mt-4">Languages</h4>
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

  // Main Dating App Component
  const MainDatingApp = () => (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-pink-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-stone-800">ConnectIndia</span>
                <p className="text-xs text-stone-600">Find your perfect match</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-stone-100 rounded-full px-4 py-2">
                <Search className="w-4 h-4 text-stone-500" />
                <input
                  type="text"
                  placeholder="Search profiles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm"
                />
              </div>
              <button
                onClick={() => setShowFilters(true)}
                className="p-2 text-stone-600 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-colors"
              >
                <Filter className="w-6 h-6" />
              </button>
                onClick={() => setShowChat(true)}
              <button className="p-2 text-stone-600 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-colors relative">
                <MessageCircle className="w-6 h-6" />
                {matches.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {matches.length}
                  </span>
                )}
              </button>
              <button className="p-2 text-stone-600 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-colors">
                onClick={() => setShowSettings(true)}
                <Settings className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-stone-800 mb-2">
            Discover Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
              Perfect Match
            </span>
          </h1>
          <p className="text-stone-600 text-lg">Find meaningful connections with people who share your values and dreams</p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-full p-1 shadow-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  viewMode === 'grid' ? 'bg-pink-500 text-white' : 'text-stone-600'
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  viewMode === 'cards' ? 'bg-pink-500 text-white' : 'text-stone-600'
                }`}
              >
                Card View
              </button>
            </div>
            <div className="text-sm text-stone-600">
              Showing {startIndex + 1}-{Math.min(startIndex + profilesPerPage, profilesToShow.length)} of {profilesToShow.length} profiles
              {searchQuery && (
                <span className="ml-2 text-pink-600">
                  (filtered by "{searchQuery}")
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-stone-700">{matches.length} matches today</span>
          </div>
        </div>

        {/* Safety Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4 mb-8">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-800">Your Safety is Our Priority</h3>
              <p className="text-sm text-blue-600">All profiles are verified. Report any suspicious activity immediately.</p>
            </div>
          </div>
        </div>

        {/* Profile Cards Grid */}
        <div className={`grid gap-6 mb-8 ${
          viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'
        }`}>
          {currentProfiles.map((profile) => (
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
                
                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                  {profile.verified && (
                    <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>Verified</span>
                    </div>
                  )}
                  {profile.premium && (
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                      <Crown className="w-3 h-3" />
                      <span>Premium</span>
                    </div>
                  )}
                  <div className="bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-medium capitalize">
                    {profile.relationshipGoal}
                  </div>
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
                    <span>{profile.location} • {profile.distance}km away</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="bg-white/20 px-2 py-1 rounded-full">{profile.profession}</span>
                    <span className="bg-white/20 px-2 py-1 rounded-full">{profile.dietaryPreference}</span>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-6">
                <p className="text-stone-600 mb-4 line-clamp-2 leading-relaxed">{profile.bio}</p>
                
                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-stone-500">Education:</span> {profile.education}</div>
                    <div><span className="text-stone-500">Religion:</span> {profile.religion}</div>
                    <div><span className="text-stone-500">Community:</span> {profile.community}</div>
                    <div><span className="text-stone-500">Family:</span> {profile.familyType}</div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.slice(0, 4).map((interest, index) => (
                      <span key={index} className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs">
                        {interest}
                      </span>
                    ))}
                    {profile.interests.length > 4 && (
                      <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded-full text-xs">
                        +{profile.interests.length - 4} more
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
                    className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                  >
                    <Heart className="w-8 h-8 fill-current" />
                  </button>
                  
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center hover:bg-yellow-300 transition-colors"
                  >
                    <Gift className="w-6 h-6 text-yellow-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {profilesToShow.length > profilesPerPage && (
          <div className="flex justify-center items-center space-x-6 mb-8">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="flex items-center space-x-2 px-6 py-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>
          
          <div className="flex items-center space-x-2">
            {Array.from({ length: Math.ceil(profilesToShow.length / profilesPerPage) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-full font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                    : 'bg-white text-stone-600 hover:bg-pink-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={nextPage}
            disabled={currentPage === Math.ceil(profilesToShow.length / profilesPerPage)}
            className="flex items-center space-x-2 px-6 py-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <Users className="w-8 h-8 text-pink-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-stone-800">10M+</div>
            <div className="text-sm text-stone-600">Active Users</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <Heart className="w-8 h-8 text-pink-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-stone-800">2M+</div>
            <div className="text-sm text-stone-600">Matches Made</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <Award className="w-8 h-8 text-pink-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-stone-800">50K+</div>
            <div className="text-sm text-stone-600">Success Stories</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <Globe className="w-8 h-8 text-pink-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-stone-800">500+</div>
            <div className="text-sm text-stone-600">Cities</div>
          </div>
        </div>

        {/* Success Stories Section */}
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
          <h2 className="text-2xl font-bold text-center text-stone-800 mb-6">Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white fill-current" />
              </div>
              <h3 className="font-semibold text-stone-800 mb-2">Raj & Priya</h3>
              <p className="text-sm text-stone-600">"Found my soulmate through ConnectIndia. Our families are so happy!"</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white fill-current" />
              </div>
              <h3 className="font-semibold text-stone-800 mb-2">Arjun & Sneha</h3>
              <p className="text-sm text-stone-600">"Perfect match based on our cultural values and life goals."</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white fill-current" />
              </div>
              <h3 className="font-semibold text-stone-800 mb-2">Vikram & Kavya</h3>
              <p className="text-sm text-stone-600">"Started as friends, now planning our wedding. Thank you ConnectIndia!"</p>
            </div>
          </div>
        </div>

        {/* Matches Counter */}
        {matches.length > 0 && (
          <div className="text-center">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full px-8 py-4 inline-block shadow-lg">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span className="font-semibold text-lg">{matches.length} matches today! 🎉</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showFilters && <FilterModal />}
      {selectedProfile && <ProfileModal profile={selectedProfile} />}
      {showChat && <ChatModal />}
      {showSettings && <SettingsModal />}
    </div>
  );

  // Render based on current view
  return <MainDatingApp />;
};

export default DatingApp;