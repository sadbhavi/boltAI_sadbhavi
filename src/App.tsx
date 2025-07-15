import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import SoundscapePlayer from './components/SoundscapePlayer';
import SleepStories from './components/SleepStories';
import BreathingExercises from './components/BreathingExercises';
import About from './components/About';
import Pricing from './components/Pricing';
import Blog from './components/Blog';
import Download from './components/Download';
import Footer from './components/Footer';
import DatingApp from './components/dating/DatingApp';

function App() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <Hero />
      <Features />
      <SoundscapePlayer />
      <SleepStories />
      <BreathingExercises />
      <About />
      <Pricing />
      <Blog />
      <section id="dating">
        <DatingApp />
      </section>
      <Download />
      <Footer />
    </div>
  );
}

export default App;