import React, { useState } from 'react';
import { Heart, MapPin, Filter, Star, MessageCircle, X, Check, Camera, Settings, ArrowLeft, ArrowRight, Shield, Users, Globe, Award, Phone, Mail, Eye, EyeOff } from 'lucide-react';

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
}

const DatingApp = () => {
  const [currentView, setCurrentView] = useState<'login' | 'onboarding' | 'profile-building' | 'main'>('login');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [matches, setMatches] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(45);
  
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
      }
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
      }
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
      familyType: 'joint'
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
      compatibility: 87,
      relationshipGoal: 'serious',
      dietaryPreference: 'non-vegetarian',
      smokingHabits: 'occasionally',
      drinkingHabits: 'regularly',
      familyType: 'nuclear'
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
      familyType: 'nuclear'
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
      familyType: 'nuclear'
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

  const profilesPerPage = 3;
  const totalPages = Math.ceil(allProfiles.length / profilesPerPage);
  const startIndex = (currentPage - 1) * profilesPerPage;
  const currentProfiles = allProfiles.slice(startIndex, startIndex + profilesPerPage);

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

  // Login/Signup Component
  const LoginComponent = () => (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-stone-800 mb-2">ConnectIndia</h1>
          <p className="text-stone-600">Find your perfect match in India</p>
        </div>

        <div className="space-y-6">
          {/* Login Method Toggle */}
          <div className="flex bg-stone-100 rounded-lg p-1">
            <button
              onClick={() => setLoginData({...loginData, loginMethod: 'email'})}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md transition-colors ${
                loginData.loginMethod === 'email' ? 'bg-white shadow-sm' : ''
              }`}
            >
              <Mail className="w-4 h-4" />
              <span className="text-sm font-medium">Email</span>
            </button>
            <button
              onClick={() => setLoginData({...loginData, loginMethod: 'phone'})}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md transition-colors ${
                loginData.loginMethod === 'phone' ? 'bg-white shadow-sm' : ''
              }`}
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">Phone</span>
            </button>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-stone-200 rounded-xl py-3 hover:border-stone-300 transition-colors">
              <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
              <span className="font-medium text-stone-700">Continue with Google</span>
            </button>
            
            <button className="w-full flex items-center justify-center space-x-3 bg-blue-600 text-white rounded-xl py-3 hover:bg-blue-700 transition-colors">
              <Phone className="w-5 h-5" />
              <span className="font-medium">Continue with TrueCaller</span>
            </button>
          </div>

          <div className="flex items-center">
            <div className="flex-1 border-t border-stone-200"></div>
            <span className="px-4 text-sm text-stone-500">or</span>
            <div className="flex-1 border-t border-stone-200"></div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <input
              type={loginData.loginMethod === 'email' ? 'email' : 'tel'}
              placeholder={loginData.loginMethod === 'email' ? 'Enter your email' : 'Enter your phone number'}
              className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              value={loginData.loginMethod === 'email' ? loginData.email : loginData.phone}
              onChange={(e) => setLoginData({
                ...loginData,
                [loginData.loginMethod === 'email' ? 'email' : 'phone']: e.target.value
              })}
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="w-full px-4 py-3 pr-12 border border-stone-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-stone-500"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-colors"
          >
            Sign In
          </button>

          <div className="text-center">
            <span className="text-stone-600">Don't have an account? </span>
            <button
              onClick={() => setCurrentView('profile-building')}
              className="text-pink-600 hover:text-pink-700 font-medium"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Onboarding Component
  const OnboardingComponent = () => (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-stone-800 mb-4">Welcome to ConnectIndia!</h2>
          <p className="text-stone-600">Let's set up your preferences to find better matches</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-3">What are you looking for?</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {relationshipGoals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setProfileData({...profileData, relationshipGoal: goal.id as any})}
                  className={`p-4 border-2 rounded-xl text-left transition-colors ${
                    profileData.relationshipGoal === goal.id
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="font-semibold text-stone-800">{goal.name}</div>
                  <div className="text-sm text-stone-600 mt-1">{goal.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Age Range</label>
              <select className="w-full px-3 py-2 border border-stone-200 rounded-lg">
                <option>22-28</option>
                <option>25-32</option>
                <option>30-40</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Distance</label>
              <select className="w-full px-3 py-2 border border-stone-200 rounded-lg">
                <option>Within 25 km</option>
                <option>Within 50 km</option>
                <option>Within 100 km</option>
              </select>
            </div>
          </div>

          <button
            onClick={completeOnboarding}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-colors"
          >
            Continue to Profile Building
          </button>
        </div>
      </div>
    </div>
  );

  // Profile Building Component
  const ProfileBuildingComponent = () => (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-stone-800">Build Your Profile</h2>
              <div className="text-sm text-stone-600">
                {profileCompletion}% Complete
              </div>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-3">About You</label>
                <textarea
                  placeholder="Tell us about yourself, your hobbies, what makes you unique..."
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent h-32 resize-none"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-3">Interests</label>
                <div className="flex flex-wrap gap-2">
                  {availableInterests.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        profileData.interests.includes(interest)
                          ? 'bg-pink-500 text-white'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Religion</label>
                  <select 
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                    value={profileData.religion}
                    onChange={(e) => setProfileData({...profileData, religion: e.target.value})}
                  >
                    <option value="">Select Religion</option>
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
                    placeholder="e.g., Brahmin, Patel"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                    value={profileData.community}
                    onChange={(e) => setProfileData({...profileData, community: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-3">Lifestyle Preferences</label>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-stone-600 mb-1">Dietary Preference</label>
                    <select 
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm"
                      value={profileData.dietaryPreference}
                      onChange={(e) => setProfileData({...profileData, dietaryPreference: e.target.value as any})}
                    >
                      <option value="vegetarian">Vegetarian</option>
                      <option value="non-vegetarian">Non-Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="jain">Jain</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-stone-600 mb-1">Smoking Habits</label>
                    <select 
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm"
                      value={profileData.smokingHabits}
                      onChange={(e) => setProfileData({...profileData, smokingHabits: e.target.value as any})}
                    >
                      <option value="never">Never</option>
                      <option value="occasionally">Occasionally</option>
                      <option value="regularly">Regularly</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-stone-600 mb-1">Drinking Habits</label>
                    <select 
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm"
                      value={profileData.drinkingHabits}
                      onChange={(e) => setProfileData({...profileData, drinkingHabits: e.target.value as any})}
                    >
                      <option value="never">Never</option>
                      <option value="occasionally">Occasionally</option>
                      <option value="regularly">Regularly</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-3">Family & Cultural Details</label>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-stone-600 mb-1">Family Type</label>
                    <select 
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm"
                      value={profileData.familyType}
                      onChange={(e) => setProfileData({...profileData, familyType: e.target.value as any})}
                    >
                      <option value="nuclear">Nuclear Family</option>
                      <option value="joint">Joint Family</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-stone-600 mb-1">Horoscope Sign (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g., Leo, Virgo"
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm"
                      value={profileData.horoscope.sign}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        horoscope: {...profileData.horoscope, sign: e.target.value}
                      })}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="manglik"
                      checked={profileData.horoscope.manglik}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        horoscope: {...profileData.horoscope, manglik: e.target.checked}
                      })}
                      className="rounded border-stone-300"
                    />
                    <label htmlFor="manglik" className="text-sm text-stone-700">Manglik</label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-3">Photo Upload</label>
                <div className="border-2 border-dashed border-stone-300 rounded-xl p-8 text-center hover:border-pink-400 transition-colors cursor-pointer">
                  <Camera className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                  <p className="text-stone-600 mb-2">Upload your photos</p>
                  <p className="text-sm text-stone-500">Add up to 6 photos. First photo will be your main profile picture.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setCurrentView('onboarding')}
              className="px-6 py-3 border border-stone-300 text-stone-700 rounded-xl hover:bg-stone-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={completeProfileBuilding}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-colors"
            >
              Complete Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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
              <div className="flex items-center space-x-2 mb-2">
                <Heart className="w-4 h-4 text-pink-500" />
                <span className="text-sm font-medium text-stone-700">Looking for: {profile.relationshipGoal}</span>
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
              <button className="p-2 text-stone-600 hover:text-pink-600">
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
          <h1 className="text-3xl font-bold text-stone-800 mb-2">Discover Your Perfect Match</h1>
          <p className="text-stone-600">Find meaningful connections with people who share your values</p>
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
                <div className="absolute top-4 right-4 flex space-x-2">
                  {profile.verified && (
                    <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                      <Check className="w-3 h-3" />
                      <span>Verified</span>
                    </div>
                  )}
                  <div className="bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-medium">
                    {profile.relationshipGoal}
                  </div>
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
                    <div><span className="text-stone-500">Religion:</span> {profile.religion}</div>
                    <div><span className="text-stone-500">Diet:</span> {profile.dietaryPreference}</div>
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

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-12">
          <div className="bg-white rounded-2xl p-6 text-center">
            <Users className="w-8 h-8 text-pink-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-stone-800">10M+</div>
            <div className="text-sm text-stone-600">Active Users</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center">
            <Heart className="w-8 h-8 text-pink-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-stone-800">2M+</div>
            <div className="text-sm text-stone-600">Matches Made</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center">
            <Award className="w-8 h-8 text-pink-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-stone-800">50K+</div>
            <div className="text-sm text-stone-600">Success Stories</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center">
            <Globe className="w-8 h-8 text-pink-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-stone-800">500+</div>
            <div className="text-sm text-stone-600">Cities</div>
          </div>
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

  // Render based on current view
  if (currentView === 'login') {
    return <LoginComponent />;
  } else if (currentView === 'onboarding') {
    return <OnboardingComponent />;
  } else if (currentView === 'profile-building') {
    return <ProfileBuildingComponent />;
  } else {
    return <MainDatingApp />;
  }
};

export default DatingApp;