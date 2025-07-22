import React from 'react';
import { useState } from 'react';
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
import EmotionalSupport from './components/EmotionalSupport';
import AuthSystem from './components/auth/AuthSystem';
import UserFlow from './components/UserFlow';
import SurroundingListing from './components/SurroundingListing';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserFlow, setShowUserFlow] = useState(false);
  const [currentFlowStep, setCurrentFlowStep] = useState<'support' | 'dating' | 'nearby' | 'complete'>('support');

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
    setShowUserFlow(true);
    setCurrentFlowStep('support');
  };

  const handleUserFlowComplete = () => {
    setShowUserFlow(false);
    setCurrentFlowStep('complete');
  };

  // Show user flow after login
  if (isAuthenticated && showUserFlow) {
    return <UserFlow onComplete={handleUserFlowComplete} />;
  }

  // Show main app after user flow completion
  if (isAuthenticated && currentFlowStep === 'complete') {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        <section id="dating">
          <DatingApp />
        </section>
        <section id="emotional-support">
          <EmotionalSupport />
        </section>
        <section id="nearby">
          <SurroundingListing />
        </section>
        <Footer />
      </div>
    );
  }

  // Show homepage for non-authenticated users
  return (
    <div className="min-h-screen bg-stone-50">
      <Header onAuthClick={() => setShowAuthModal(true)} />
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
      <section id="emotional-support">
        <EmotionalSupport />
      </section>
      <Download />
      <Footer />
      
      <AuthSystem
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;