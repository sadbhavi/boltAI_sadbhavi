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
import DatingSection from './components/dating/DatingSection';
import EmotionalSupport from './components/EmotionalSupport';
import AuthSystem from './components/auth/AuthSystem';
import UserFlow from './components/UserFlow';
import SurroundingListing from './components/SurroundingListing';
import IndianChatAgent from './components/IndianChatAgent';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLogin from './components/admin/AdminLogin';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserFlow, setShowUserFlow] = useState(false);
  const [currentFlowStep, setCurrentFlowStep] = useState<'support' | 'dating' | 'nearby' | 'complete'>('support');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

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

  // Show admin dashboard
  if (isAdmin) {
    return <AdminDashboard />;
  }

  // Show user flow after login
  if (isAuthenticated && showUserFlow) {
    return <UserFlow onComplete={handleUserFlowComplete} />;
  }

  // Show main app after user flow completion
  if (isAuthenticated && currentFlowStep === 'complete') {
    return (
      <div className="min-h-screen bg-stone-50">
        <Header />
        {/* <section id="dating">
          <DatingSection />
        </section> */}
        <section id="emotional-support">
          <EmotionalSupport />
        </section>
        <section id="nearby">
          <SurroundingListing />
        </section>
        <section id="ai-agent">
          <IndianChatAgent />
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
      {/* <section id="dating">
        <DatingSection />
      </section> */}
      <section id="emotional-support">
        <EmotionalSupport />
      </section>
      <section id="ai-agent">
        <IndianChatAgent />
      </section>
      <SoundscapePlayer />
      <SleepStories />
      <Features />
      <BreathingExercises />
      <About />
      <Pricing />
      <Blog />
      <Download />
      <Footer />

        <button onClick={() => setShowAdminLogin(true)} className="fixed bottom-4 right-4 text-xs text-stone-500">Admin</button>

        {showAdminLogin && (
          <AdminLogin onSuccess={() => { setIsAdmin(true); setShowAdminLogin(false); }} onClose={() => setShowAdminLogin(false)} />
        )}

      
      <AuthSystem
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;
