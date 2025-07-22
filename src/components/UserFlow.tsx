import React, { useState, useEffect } from 'react';
import { ArrowRight, Phone, MessageCircle, Heart, MapPin, Users, Shield, Headphones, Star, CheckCircle } from 'lucide-react';

interface UserFlowProps {
  onComplete: () => void;
}

const UserFlow: React.FC<UserFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const steps = [
    {
      id: 1,
      title: 'Call & Support',
      subtitle: '24/7 Help & Safety',
      icon: Headphones,
      color: 'from-blue-500 to-indigo-600',
      description: 'Your safety and support are our top priority'
    },
    {
      id: 2,
      title: 'Dating & Matches',
      subtitle: 'Find Your Perfect Match',
      icon: Heart,
      color: 'from-pink-500 to-rose-600',
      description: 'AI-powered matching with cultural preferences'
    },
    {
      id: 3,
      title: 'Nearby Profiles',
      subtitle: 'Discover Local Connections',
      icon: MapPin,
      color: 'from-green-500 to-emerald-600',
      description: 'Connect with people in your area'
    }
  ];

  const nextStep = () => {
    if (currentStep < 3) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      onComplete();
    }
  };

  const skipToEnd = () => {
    onComplete();
  };

  // Call & Support Page Content
  const CallSupportPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Headphones className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">24/7 Call & Support</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your safety and well-being matter to us. Get instant help whenever you need it.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Live Chat */}
          <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Live Chat Support</h3>
            <p className="text-gray-600 text-center mb-6">
              Connect with our support team instantly through secure chat
            </p>
            <button className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors">
              Start Chat
            </button>
          </div>

          {/* Emergency Helpline */}
          <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Phone className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Emergency Helpline</h3>
            <p className="text-gray-600 text-center mb-6">
              24/7 emergency support for urgent situations
            </p>
            <button className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors">
              Call Now: 1800-XXX-XXXX
            </button>
          </div>

          {/* Safety Resources */}
          <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Safety Resources</h3>
            <p className="text-gray-600 text-center mb-6">
              Access safety tips, guidelines, and educational content
            </p>
            <button className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors">
              View Resources
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl p-8 shadow-xl mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Why Choose Our Support?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span className="text-gray-700">Trained counselors and support staff</span>
            </div>
            <div className="flex items-center space-x-4">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span className="text-gray-700">Multilingual support in 8+ languages</span>
            </div>
            <div className="flex items-center space-x-4">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span className="text-gray-700">Complete privacy and confidentiality</span>
            </div>
            <div className="flex items-center space-x-4">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <span className="text-gray-700">WhatsApp integration for easy access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Dating Page Content
  const DatingPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Find Your Perfect Match</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered matching with deep cultural understanding and preferences
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* AI Matching */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">AI-Powered Matching</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Cultural compatibility analysis</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Religion and caste preferences</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Dietary preference matching</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Family values alignment</span>
              </li>
            </ul>
          </div>

          {/* Communication */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Safe Communication</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>In-app secure messaging</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Video call integration</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Bollywood-themed icebreakers</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Regional language support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Relationship Goals */}
        <div className="bg-white rounded-2xl p-8 shadow-xl mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">What Are You Looking For?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 border-2 border-pink-200 rounded-xl hover:border-pink-400 transition-colors cursor-pointer">
              <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4" />
              <h4 className="font-bold text-gray-800 mb-2">Marriage</h4>
              <p className="text-gray-600 text-sm">Looking for a life partner</p>
            </div>
            <div className="text-center p-6 border-2 border-blue-200 rounded-xl hover:border-blue-400 transition-colors cursor-pointer">
              <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h4 className="font-bold text-gray-800 mb-2">Friendship</h4>
              <p className="text-gray-600 text-sm">Building meaningful connections</p>
            </div>
            <div className="text-center p-6 border-2 border-green-200 rounded-xl hover:border-green-400 transition-colors cursor-pointer">
              <Star className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h4 className="font-bold text-gray-800 mb-2">Fun Dating</h4>
              <p className="text-gray-600 text-sm">Casual dating and fun</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Nearby Profiles Page Content
  const NearbyProfilesPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Discover Nearby Connections</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find compatible matches within 10-100km of your location
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Location Features */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Smart Location Matching</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Adjustable distance radius (10-100km)</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>City and neighborhood preferences</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Metro and transport connectivity</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Privacy-first location sharing</span>
              </li>
            </ul>
          </div>

          {/* Local Events */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Local Community</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Local events and meetups</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Cultural festivals and celebrations</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Group activities and interests</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Safe public meeting suggestions</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Distance Options */}
        <div className="bg-white rounded-2xl p-8 shadow-xl mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Choose Your Search Radius</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[10, 25, 50, 100].map((distance) => (
              <div key={distance} className="text-center p-4 border-2 border-green-200 rounded-xl hover:border-green-400 transition-colors cursor-pointer">
                <div className="text-2xl font-bold text-green-600 mb-2">{distance}km</div>
                <div className="text-gray-600 text-sm">Within {distance} kilometers</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const getCurrentPageContent = () => {
    switch (currentStep) {
      case 1:
        return <CallSupportPage />;
      case 2:
        return <DatingPage />;
      case 3:
        return <NearbyProfilesPage />;
      default:
        return <CallSupportPage />;
    }
  };

  return (
    <div className="relative">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Welcome to Your Journey</h2>
            <button
              onClick={skipToEnd}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Skip Tour
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    isActive ? `bg-gradient-to-r ${step.color} text-white` :
                    isCompleted ? 'bg-green-100 text-green-600' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm font-medium">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-gray-400 mx-2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`pt-32 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {getCurrentPageContent()}
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.description}
            </div>
            <button
              onClick={nextStep}
              className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-200 flex items-center space-x-2"
            >
              <span>{currentStep === 3 ? 'Get Started' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFlow;