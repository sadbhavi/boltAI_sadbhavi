import React from 'react';
import { Smartphone, QrCode, Apple, Star } from 'lucide-react';

const Download = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-forest-600 via-forest-700 to-sage-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Start your journey to{' '}
                <span className="text-orange-300">
                  inner peace
                </span>
              </h2>
              
              <p className="text-xl text-forest-100 leading-relaxed">
                Download the Serenity app today and join millions who have transformed their mental wellness. Available on all devices with seamless sync across platforms.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <button className="bg-black text-white px-6 py-4 rounded-2xl flex items-center space-x-3 hover:bg-gray-900 transition-colors">
                <Apple className="w-8 h-8" />
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-lg font-semibold">App Store</div>
                </div>
              </button>
              
              <button className="bg-black text-white px-6 py-4 rounded-2xl flex items-center space-x-3 hover:bg-gray-900 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">GP</span>
                </div>
                <div className="text-left">
                  <div className="text-xs">Get it on</div>
                  <div className="text-lg font-semibold">Google Play</div>
                </div>
              </button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-forest-200">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-orange-300" />
                  ))}
                </div>
                <span>4.8/5 rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4" />
                <span>100M+ downloads</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-6">
                  <QrCode className="w-32 h-32 text-stone-800 mx-auto" />
                </div>
                <div className="text-stone-800 text-center">
                  <div className="font-semibold mb-2">Scan to Download</div>
                  <div className="text-sm text-stone-600">
                    Open your camera and point at this QR code
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-orange-400 rounded-full opacity-60 blur-xl"></div>
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-sage-400 rounded-full opacity-40 blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Download;