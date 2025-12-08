import React from 'react';
import { Leaf, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const footerSections = [
    {
      title: 'Product',
      links: ['Features', 'Pricing', 'Download App', 'Free Trial', 'Premium']
    },
    {
      title: 'Resources',
      links: ['Blog', 'Help Center', 'Community', 'Research', 'Press Kit']
    },
    {
      title: 'Company',
      links: ['About Us', 'Careers', 'Partners', 'Contact', 'Press']
    },
    {
      title: 'Legal',
      links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR', 'Licenses']
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#' },
    { icon: Twitter, href: 'https://x.com/sad_bhavi' },
    { icon: Instagram, href: 'https://www.instagram.com/sad_bhavi/' },
    { icon: Youtube, href: 'https://www.youtube.com/@sadbhavi' }
  ];

  return (
    <footer className="bg-stone-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-6 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-forest-600 to-sage-500 rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold">Sadbhavi</span>
            </div>

            <p className="text-stone-400 leading-relaxed">
              Making the world a happier and healthier place through mindfulness, meditation, and mental wellness practices.
            </p>

            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center hover:bg-forest-600 transition-colors"
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-lg font-semibold">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href="#"
                      className="text-stone-400 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-stone-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-stone-400 text-sm">
              © 2025 Sadbhavi. All rights reserved.
            </div>

            <div className="flex items-center space-x-6 text-sm text-stone-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;