import React, { useState } from 'react';
import { Menu, X, Leaf, User, Heart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './auth/AuthModal';
import SubscriptionModal from './subscription/SubscriptionModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { user, signOut, isPremium } = useAuth();

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-sm border-b border-sage-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-forest-600 to-sage-500 rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-forest-800">Serenity</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-stone-600 hover:text-forest-600 transition-colors">Features</a>
              <a href="#about" className="text-stone-600 hover:text-forest-600 transition-colors">About</a>
              <a href="#pricing" className="text-stone-600 hover:text-forest-600 transition-colors">Pricing</a>
              <a href="#blog" className="text-stone-600 hover:text-forest-600 transition-colors">Blog</a>
              <a href="#dating" className="text-stone-600 hover:text-forest-600 transition-colors flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>Dating</span>
              </a>
              <a href="#emotional-support" className="text-stone-600 hover:text-forest-600 transition-colors">Support</a>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  {!isPremium && (
                    <button
                      onClick={() => setShowSubscriptionModal(true)}
                      className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-full hover:from-orange-600 hover:to-pink-600 transition-colors text-sm font-medium"
                    >
                      Upgrade to Premium
                    </button>
                  )}
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-stone-600" />
                    <span className="text-stone-700">{user.email?.split('@')[0]}</span>
                    {isPremium && <span className="bg-gold-100 text-gold-800 px-2 py-1 rounded-full text-xs">Premium</span>}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="text-stone-600 hover:text-forest-600 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button onClick={() => handleAuthClick('login')} className="text-stone-600 hover:text-forest-600 transition-colors">
                    Sign In
                  </button>
                  <button onClick={() => handleAuthClick('signup')} className="bg-forest-600 text-white px-4 py-2 rounded-full hover:bg-forest-700 transition-colors">
                    Get Started
                  </button>
                </div>
              )}
            </nav>

            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden border-t border-sage-200 py-4">
              <nav className="flex flex-col space-y-4">
                <a href="#features" className="text-stone-600 hover:text-forest-600 transition-colors">Features</a>
                <a href="#about" className="text-stone-600 hover:text-forest-600 transition-colors">About</a>
                <a href="#pricing" className="text-stone-600 hover:text-forest-600 transition-colors">Pricing</a>
                <a href="#blog" className="text-stone-600 hover:text-forest-600 transition-colors">Blog</a>
                <a href="#dating" className="text-stone-600 hover:text-forest-600 transition-colors flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>Dating</span>
                </a>
                <a href="#emotional-support" className="text-stone-600 hover:text-forest-600 transition-colors">Support</a>
                
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-stone-600" />
                      <span className="text-stone-700">{user.email?.split('@')[0]}</span>
                      {isPremium && <span className="bg-gold-100 text-gold-800 px-2 py-1 rounded-full text-xs">Premium</span>}
                    </div>
                    {!isPremium && (
                      <button
                        onClick={() => setShowSubscriptionModal(true)}
                        className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-full hover:from-orange-600 hover:to-pink-600 transition-colors w-fit"
                      >
                        Upgrade to Premium
                      </button>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="text-stone-600 hover:text-forest-600 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button onClick={() => handleAuthClick('login')} className="text-stone-600 hover:text-forest-600 transition-colors">
                      Sign In
                    </button>
                    <button onClick={() => handleAuthClick('signup')} className="bg-forest-600 text-white px-4 py-2 rounded-full hover:bg-forest-700 transition-colors w-fit">
                      Get Started
                    </button>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
      
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </>
  );
};

export default Header;