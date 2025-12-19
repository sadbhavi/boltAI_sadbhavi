import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Phone, Heart, Shield, Clock, User, Send, Mic, MicOff, PhoneCall, Calendar, Star, CheckCircle, Users, Globe, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAnalytics } from '../lib/contexts/AnalyticsContext';
import SubscriptionModal from './subscription/SubscriptionModal';
import { sendMessageToOpenAI, ChatMessage } from '../lib/apis/openai';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support' | 'bot';
  timestamp: Date;
  type: 'text' | 'system';
}

interface CallSession {
  id: string;
  status: 'connecting' | 'connected' | 'ended';
  duration: number;
  startTime: Date;
}

const EmotionalSupport = () => {
  const [showChat, setShowChat] = useState(false);
  const [showCallInterface, setShowCallInterface] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [isOnline] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userContext, setUserContext] = useState('');
  const [callSession, setCallSession] = useState<CallSession | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [supportRating, setSupportRating] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [messageCount, setMessageCount] = useState(() => {
    try {
      const stored = localStorage.getItem('messageCount');
      if (!stored) return 0;

      // Check reset timer on load
      const lastReset = localStorage.getItem('lastReset');
      const now = Date.now();
      const RESET_PERIOD = 12 * 60 * 60 * 1000; // 12 hours

      if (!lastReset || (now - parseInt(lastReset, 10)) > RESET_PERIOD) {
        // Reset if time passed or no timestamp
        localStorage.setItem('lastReset', now.toString());
        localStorage.setItem('messageCount', '0');
        return 0;
      }

      return parseInt(stored, 10);
    } catch (e) {
      // console.warn('Storage access restricted:', e);
      return 0;
    }
  });

  const { isPremium } = useAuth();
  const { trackEvent } = useAnalytics();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Persist usage info
  useEffect(() => {
    try {
      localStorage.setItem('messageCount', messageCount.toString());
      if (!localStorage.getItem('lastReset')) {
        localStorage.setItem('lastReset', Date.now().toString());
      }
    } catch (e) {
      // Ignore storage errors
    }
  }, [messageCount]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize chat with welcome message
  useEffect(() => {
    if (showChat && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        text: "Namaste! 🙏 Main Sadbhavi hoon, aapki dost. Aap kaise feel kar rahe ho aaj? Koi bhi baat ho, main yahan sunne ke liye hoon. Feel free to share - Hindi ya English, jo comfortable ho! 💛",
        sender: 'support',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages([welcomeMessage]);
      // Add the welcome message to history as model response
      setChatHistory([{
        role: 'model',
        parts: [{ text: welcomeMessage.text }]
      }]);
    }
  }, [showChat, messages.length]);

  // Simulate call timer
  useEffect(() => {
    if (callSession?.status === 'connected') {
      const timer = setInterval(() => {
        setCallSession(prev =>
          prev
            ? {
              ...prev,
              duration: prev.duration + 1,
            }
            : null,
        );
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [callSession?.status]);

  useEffect(() => {
    if (!isPremium && callSession?.status === 'connected' && callSession.duration >= 600) {
      alert('Free call limit reached. Please subscribe to continue.');
      endCall();
      setShowSubscriptionModal(true);
    }
  }, [callSession?.duration, callSession?.status, isPremium]);

  const startChat = () => {
    trackEvent('start_chat', 'support', 'click');
    setShowChat(true);
    if (chatInputRef.current) {
      chatInputRef.current.focus();
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    if (!isPremium) {
      // Check for reset before enforcing
      const lastReset = localStorage.getItem('lastReset');
      const now = Date.now();
      const RESET_PERIOD = 12 * 60 * 60 * 1000;

      if (lastReset && (now - parseInt(lastReset, 10)) > RESET_PERIOD) {
        // Time to reset
        setMessageCount(0);
        localStorage.setItem('messageCount', '0');
        localStorage.setItem('lastReset', now.toString());
      } else if (messageCount >= 30) {
        alert("You've reached your free message limit (30 messages). Please try again in 12 hours or upgrade to Premium for unlimited chat.");
        setShowSubscriptionModal(true);
        return;
      }
    }

    const userMessageText = newMessage.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userMessageText,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setMessageCount((c) => c + 1);
    setIsTyping(true);

    try {
      // Call OpenAI API with conversation history
      const response = await sendMessageToOpenAI(userMessageText, chatHistory);

      if (response.success) {
        const supportMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.message,
          sender: 'support',
          timestamp: new Date(),
          type: 'text'
        };

        setMessages(prev => [...prev, supportMessage]);

        // Update conversation history
        setChatHistory(prev => [
          ...prev,
          { role: 'user', parts: [{ text: userMessageText }] },
          { role: 'model', parts: [{ text: response.message }] }
        ]);
      } else {
        // Fallback response if API fails
        const fallbackMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "I'm sorry, I'm having trouble connecting right now. Lekin main yahan hoon aapke liye. Please try again in a moment, ya phir aap mujhe batao kya hua? 💛",
          sender: 'support',
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, fallbackMessage]);
      }
    } catch (error) {

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Kuch technical issue aa gaya hai. But don't worry, main yahan hoon. Thoda wait karo aur phir se try karo. 🙏",
        sender: 'support',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const startAudioCall = () => {
    trackEvent('start_call', 'support', 'click', 'phone');
    if (typeof window !== 'undefined') {
      window.location.href = 'tel:6387153863';
    }
  };

  const endCall = () => {
    setCallSession(prev => prev ? { ...prev, status: 'ended' } : null);
    setShowCallInterface(false);
    setShowFeedback(true);
  };

  const scheduleCall = () => {
    if (selectedDate && selectedTime) {
      alert(`Call scheduled for ${selectedDate} at ${selectedTime}. You'll receive a confirmation email shortly.`);
      setShowScheduler(false);
      setSelectedDate('');
      setSelectedTime('');
    }
  };

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const submitFeedback = () => {
    alert('Thank you for your feedback! Your rating helps us improve our support services.');
    setShowFeedback(false);
    setSupportRating(0);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-sage-50 via-stone-50 to-orange-50 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-forest-500 to-forest-600 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Emotional{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-600 to-sage-500">
              Support
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Feeling overwhelmed or need someone to talk to? You're not alone. Connect with our compassionate support team through chat or audio call for emotional guidance and a listening ear.
          </p>
        </div>

        {/* Availability Status */}
        <div className="flex justify-center mb-12">
          <div className={`flex items-center space-x-3 px-6 py-3 rounded-full ${isOnline ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
            }`}>
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-orange-500'} animate-pulse`}></div>
            <span className="font-medium">
              {isOnline ? 'Available for Support' : 'Currently Offline - Schedule a Call'}
            </span>
          </div>
        </div>

        {/* Main Support Options */}
        <div className="grid md:grid-cols-5 gap-8 mb-16 items-start">
          {/* Chat Support - Primary Focus */}
          <div className="md:col-span-3 bg-white rounded-3xl p-8 shadow-2xl border-2 border-forest-500 relative transform hover:scale-[1.02] transition-all duration-300">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-forest-600 to-sage-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center space-x-2 shadow-lg">
                <Star className="w-4 h-4 fill-current" />
                <span>MOST RECOMMENDED</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center mb-8 mt-4">
              <div className="w-24 h-24 bg-gradient-to-br from-forest-500 to-forest-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                <MessageCircle className="w-12 h-12 text-white" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-3xl font-bold text-gray-800 mb-2">Chat Support</h3>
                <p className="text-lg text-gray-600">
                  Instant, anonymous, and available 24/7. Our most popular way to get immediate emotional guidance.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center space-x-3 bg-sage-50 p-4 rounded-2xl">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Clock className="w-5 h-5 text-forest-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Instant Response</p>
                  <p className="text-xs text-gray-500">&lt; 30 seconds wait</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-sage-50 p-4 rounded-2xl">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Shield className="w-5 h-5 text-forest-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">100% Private</p>
                  <p className="text-xs text-gray-500">Fully anonymous & secure</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-sage-50 p-4 rounded-2xl">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Globe className="w-5 h-5 text-forest-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Multilingual</p>
                  <p className="text-xs text-gray-500">Hindi, English & more</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-sage-50 p-4 rounded-2xl">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Heart className="w-5 h-5 text-forest-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Empathetic AI</p>
                  <p className="text-xs text-gray-500">Trained for active listening</p>
                </div>
              </div>
            </div>

            <button
              onClick={startChat}
              disabled={!isOnline}
              className="w-full bg-forest-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-forest-700 transform hover:scale-[1.01] transition-all duration-200 shadow-xl flex items-center justify-center space-x-3 disabled:opacity-50"
            >
              <MessageCircle className="w-6 h-6" />
              <span>{isOnline ? 'Start Chatting Now' : 'Chat Currently Offline'}</span>
            </button>
          </div>

          {/* Audio Call Support - Secondary */}
          <div className="md:col-span-2 bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-sage-100 flex flex-col h-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-sage-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Voice Support</h3>
              <p className="text-gray-600 text-sm">
                Speak directly with our counselors for a more personal touch.
              </p>
            </div>

            <div className="space-y-4 mb-8 flex-1">
              <div className="flex items-center space-x-3 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-sage-500 shrink-0" />
                <span>One-on-one sessions</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-sage-500 shrink-0" />
                <span>Professional counselors</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-sage-500 shrink-0" />
                <span>Schedule at your comfort</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={startAudioCall}
                disabled={!isOnline}
                className="w-full bg-sage-100 text-sage-700 py-4 rounded-xl font-semibold hover:bg-sage-200 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <PhoneCall className="w-5 h-5" />
                <span>{isOnline ? 'Call Now' : 'Currently Offline'}</span>
              </button>
              <button
                onClick={() => setShowScheduler(true)}
                className="w-full border-2 border-sage-200 text-sage-600 py-4 rounded-xl font-semibold hover:bg-white transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Schedule a Call</span>
              </button>
            </div>
          </div>
        </div>

        {/* Why Chat Support? */}
        <div className="bg-stone-800 rounded-3xl p-8 md:p-12 shadow-2xl mb-16 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-forest-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-sage-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">Why our users prefer Chat Support?</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-forest-500/20 rounded-xl flex items-center justify-center shrink-0 border border-forest-500/30">
                    <Shield className="w-6 h-6 text-forest-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-1">Total Anonymity</h4>
                    <p className="text-stone-400">Feel free to share your deepest thoughts without any judgment or reveal of identity.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-sage-500/20 rounded-xl flex items-center justify-center shrink-0 border border-sage-500/30">
                    <Clock className="w-6 h-6 text-sage-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-1">No Waiting Time</h4>
                    <p className="text-stone-400">Get instant relief. No need to wait for a counselor to be free on a call.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center shrink-0 border border-orange-500/30">
                    <Users className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-1">Comfort Zone</h4>
                    <p className="text-stone-400">Expression through writing can often be more therapeutic and easier than speaking.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
              <div className="text-center mb-8">
                <Star className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <p className="text-2xl font-bold text-white italic">"Chatting with Sadbhavi felt like talking to a friend who truly listens without any hurry."</p>
                <p className="text-stone-400 mt-4">— Rahul, 24 years</p>
              </div>
              <button
                onClick={startChat}
                className="w-full bg-forest-500 text-white py-4 rounded-xl font-bold hover:bg-forest-600 transition-all flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>Try Chat Support Now</span>
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Existing Privacy & Security as secondary */}
        <div className="bg-white rounded-3xl p-8 shadow-lg mb-16 border border-sage-50">
          <div className="text-center mb-8">
            <Shield className="w-10 h-10 text-forest-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Safe & Encrypted</h3>
            <p className="text-gray-600">Your privacy is our priority. Every message is end-to-end encrypted.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-forest-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">End-to-End Encryption</h4>
              <p className="text-sm text-gray-600">All messages and calls are encrypted to protect your privacy.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Anonymous Option</h4>
              <p className="text-sm text-gray-600">Choose to remain anonymous during your support session.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-sage-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">24/7 Availability</h4>
              <p className="text-sm text-gray-600">Support is available around the clock when you need it most.</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <Users className="w-8 h-8 text-forest-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">10K+</div>
            <div className="text-sm text-gray-600">People Helped</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <MessageCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">50K+</div>
            <div className="text-sm text-gray-600">Support Sessions</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">4.9/5</div>
            <div className="text-sm text-gray-600">User Rating</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <Globe className="w-8 h-8 text-sage-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">24/7</div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
        </div>

        {/* Emotional Intelligence Tips */}
        <div className="bg-gradient-to-r from-forest-600 to-sage-600 rounded-3xl p-8 text-white mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Emotional Intelligence Tips</h3>
            <p className="text-blue-100">Simple strategies to help you manage emotions and build resilience</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h4 className="font-semibold mb-3">Practice Mindfulness</h4>
              <p className="text-sm text-blue-100">Take a few minutes each day to focus on your breathing and be present in the moment.</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h4 className="font-semibold mb-3">Name Your Emotions</h4>
              <p className="text-sm text-blue-100">Identify and label what you're feeling. This simple act can help reduce emotional intensity.</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h4 className="font-semibold mb-3">Reach Out</h4>
              <p className="text-sm text-blue-100">Don't hesitate to connect with others. Sharing your feelings can provide relief and perspective.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-forest-500 to-sage-600 text-white p-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Sadbhavi 💛</h3>
                    <p className="text-sm text-blue-100">Aapki dost, hamesha yahan 🙏</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                      }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                    <span className="text-sm text-gray-600">Sadbhavi is typing...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-3">
                <input
                  ref={chatInputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !isTyping && sendMessage()}
                  placeholder="Apni baat share karo... (Hindi ya English)"
                  disabled={isTyping}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={sendMessage}
                  disabled={isTyping || !newMessage.trim()}
                  className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call Interface Modal */}
      {showCallInterface && callSession && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 text-center max-w-md w-full mx-4">
            <div className="mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Support Counselor</h3>
              <p className="text-gray-600">
                {callSession.status === 'connecting' ? 'Connecting...' :
                  callSession.status === 'connected' ? 'Connected' : 'Call Ended'}
              </p>
            </div>

            {callSession.status === 'connected' && (
              <div className="mb-6">
                <div className="text-2xl font-bold text-gray-800 mb-2">
                  {formatCallDuration(callSession.duration)}
                </div>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isMuted ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
                      }`}
                  >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={endCall}
              className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto hover:bg-red-600 transition-colors"
            >
              <PhoneCall className="w-8 h-8" />
            </button>
          </div>
        </div>
      )}

      {/* Call Scheduler Modal */}
      {/* {showScheduler && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <Calendar className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Schedule a Call</h3>
              <p className="text-gray-600">Choose a convenient time for your support session</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brief context (optional)</label>
                <textarea
                  value={userContext}
                  onChange={(e) => setUserContext(e.target.value)}
                  placeholder="Help us prepare by sharing what you'd like to discuss..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowScheduler(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={scheduleCall}
                disabled={!selectedDate || !selectedTime}
                className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Schedule Call
              </button>
            </div>
          </div>
        </div>
      )} */}

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <Star className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Rate Your Experience</h3>
              <p className="text-gray-600">Your feedback helps us improve our support services</p>
            </div>

            <div className="flex justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setSupportRating(star)}
                  className={`w-8 h-8 ${star <= supportRating ? 'text-yellow-500' : 'text-gray-300'
                    } hover:text-yellow-500 transition-colors`}
                >
                  <Star className="w-full h-full fill-current" />
                </button>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowFeedback(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={submitFeedback}
                disabled={supportRating === 0}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />
    </section>
  );
};

export default EmotionalSupport;