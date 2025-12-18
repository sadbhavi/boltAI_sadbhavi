import React, { useState } from 'react';
import { Menu, X, Leaf } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import SubscriptionModal from './subscription/SubscriptionModal';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const { user, profile, signOut, isPremium } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setIsMenuOpen(false);

    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Effect to handle scroll after navigation from another page
  React.useEffect(() => {
    if (location.state && (location.state as any).scrollTo) {
      const sectionId = (location.state as any).scrollTo;
      const element = document.getElementById(sectionId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Small delay to ensure render
      }
      // Clear state to prevent scrolling on refresh (optional but good practice)
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const navLinks = [
    { name: 'Features', href: 'features', isRoute: true },
    { name: 'About', href: 'about', isRoute: true },
    { name: 'Pricing', href: 'pricing', isRoute: true },
    { name: 'Blog', href: 'blog', isRoute: true },
    { name: 'Support', href: 'emotional-support', isRoute: true },
  ];

  return (
    <>
      <header className="bg-white/95 backdrop-blur-sm border-b border-sage-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-forest-600 to-sage-500 rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-forest-800">Sadbhavi</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                link.isRoute ? (
                  <Link key={link.name} to={`/${link.href}`} className="text-stone-600 hover:text-forest-600 transition-colors">{link.name}</Link>
                ) : (
                  <a
                    key={link.name}
                    href={`#${link.href}`}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-stone-600 hover:text-forest-600 transition-colors"
                  >
                    {link.name}
                  </a>
                )
              ))}

              {user ? (
                <div className="flex items-center space-x-4">
                  <Link to="/profile" className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-stone-50 transition-all group">
                    <div className="w-9 h-9 bg-gradient-to-br from-forest-600 to-sage-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md group-hover:shadow-lg transition-shadow">
                      {(profile?.full_name || user?.displayName || user?.email)?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-stone-800 font-medium text-sm">{profile?.full_name || user?.displayName || user?.email?.split('@')[0]}</span>
                      {isPremium && <span className="bg-gradient-to-r from-gold-400 to-gold-500 text-gold-900 px-2 py-0.5 rounded-full text-xs font-medium">✨ Premium</span>}
                    </div>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-stone-600 hover:text-forest-600 transition-colors font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-stone-600 hover:text-forest-600 transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                  {/* Get Started button removed */}
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
            <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-sage-200 shadow-lg py-4 px-4 z-40 transition-all duration-300 ease-in-out">
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  link.isRoute ? (
                    <Link
                      key={link.name}
                      to={`/${link.href}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-stone-600 hover:text-forest-600 transition-colors py-2 border-b border-gray-100"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      key={link.name}
                      href={`#${link.href}`}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="text-stone-600 hover:text-forest-600 transition-colors py-2 border-b border-gray-100"
                    >
                      {link.name}
                    </a>
                  )
                ))}

                {user ? (
                  <div className="space-y-4 pt-2">
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 p-3 rounded-xl hover:bg-stone-50 transition-all"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-forest-600 to-sage-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                        {(profile?.full_name || user?.displayName || user?.email)?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-stone-800 font-medium">{profile?.full_name || user?.displayName || user?.email?.split('@')[0]}</span>
                        {isPremium && <span className="bg-gradient-to-r from-gold-400 to-gold-500 text-gold-900 px-2 py-0.5 rounded-full text-xs font-medium inline-block w-fit mt-1">✨ Premium</span>}
                      </div>
                    </Link>
                    <button
                      onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                      className="text-stone-600 hover:text-forest-600 transition-colors w-full text-left py-2 font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 pt-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-stone-600 hover:text-forest-600 transition-colors w-full text-left py-2 border-b border-gray-100"
                    >
                      Sign In
                    </Link>
                    {/* Get Started button removed */}
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Modals */}
      {/* <AuthSystem
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={() => {
          setShowAuthModal(false);
          window.location.href = '/onboarding';
        }}
        initialMode={authMode}
      /> */}

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </>
  );
};

export default Header;