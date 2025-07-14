import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import About from './components/About';
import Pricing from './components/Pricing';
import Blog from './components/Blog';
import Download from './components/Download';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <Hero />
      <Features />
      <About />
      <Pricing />
      <Blog />
      <Download />
      <Footer />
    </div>
  );
}

export default App;