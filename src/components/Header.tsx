import React, { useState } from 'react';
import { Menu, X, Leaf } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
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
            <button className="bg-forest-600 text-white px-4 py-2 rounded-full hover:bg-forest-700 transition-colors">
              Get Started
            </button>
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
              <button className="bg-forest-600 text-white px-4 py-2 rounded-full hover:bg-forest-700 transition-colors w-fit">
                Get Started
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;