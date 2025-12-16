import React, { useState, useEffect } from 'react';
import { Mail, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    grecaptcha: any;
  }
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, resetPassword } = useAuth();
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Remove useEffect for reCAPTCHA - we will init lazily to avoid Strict Mode double-init issues

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved
        }
      });
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otpSent) {
      // Step 1: Send OTP
      if (!phoneNumber) {
        setError('Please enter a valid phone number');
        return;
      }

      setLoading(true);
      const formattedNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

      try {
        setupRecaptcha();
        const appVerifier = window.recaptchaVerifier;
        const confirmation = await signInWithPhoneNumber(auth, formattedNumber, appVerifier);

        // SMS sent. Prompt user to type the code from the message
        setConfirmationResult(confirmation);
        setOtpSent(true);
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        console.error('Error sending OTP:', err);
        // Log full error details for debugging
        console.log("Full Error Object:", JSON.stringify(err, null, 2));

        setError(err.message || 'Failed to send OTP. Please try again.');

        // Reset reCAPTCHA so user can try again
        if (window.recaptchaVerifier) {
          try {
            window.recaptchaVerifier.clear();
            // @ts-ignore
            window.recaptchaVerifier = null;
            // Remove the captcha DOM elements if they stick around (common firebase issue)
            const container = document.getElementById('recaptcha-container');
            if (container) container.innerHTML = '';
          } catch (e) {
            console.warn("Cleanup error", e);
          }
        }
      }
    } else {
      // Step 2: Verify OTP
      if (!otp || !confirmationResult) {
        setError('Please enter the OTP');
        return;
      }

      setLoading(true);
      try {
        // Sign in the user with the verification code
        const result = await confirmationResult.confirm(otp);
        const user = result.user;
        console.log('Phone login success:', user);

        // Success! Redirect to home
        navigate('/');
      } catch (err: any) {
        setLoading(false);
        console.error('Error verifying OTP:', err);
        setError('Invalid OTP. Please try again.');
        // Optional: Could reset UI logic here if needed
      }
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-sage-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-forest-600 p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-forest-100">Sign in to continue your journey</p>
        </div>

        <div className="p-8">
          {/* Tabs */}
          <div className="flex bg-stone-100 p-1 rounded-xl mb-8">
            <button
              onClick={() => { setActiveTab('email'); setError(''); }}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === 'email' ? 'bg-white text-forest-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'
                }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </button>
            <button
              onClick={() => { setActiveTab('phone'); setError(''); }}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === 'phone' ? 'bg-white text-forest-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'
                }`}
            >
              <Phone className="w-4 h-4" />
              <span>Mobile</span>
            </button>
          </div>

          {/* Social Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center space-x-3 border-2 border-stone-200 rounded-xl py-3 mb-6 hover:bg-stone-50 hover:border-stone-300 transition-all duration-200 group"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            <span className="font-medium text-stone-700 group-hover:text-stone-900">Continue with Google</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-stone-500">Or continue with</span>
            </div>
          </div>

          {/* Forms */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
              {error}
            </div>
          )}

          {activeTab === 'email' ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent outline-none transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-stone-700">Password</label>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!email) {
                        setError('Please enter your email address first');
                        return;
                      }
                      const { error } = await resetPassword(email);
                      if (error) setError('Failed to send reset email. Please check your email.');
                      else setError('Password reset email sent! Check your inbox.');
                    }}
                    className="text-sm text-forest-600 hover:text-forest-700 font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-forest-600 text-white py-3 rounded-xl font-semibold hover:bg-forest-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePhoneLogin} className="space-y-4">


              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Mobile Number</label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-stone-200 bg-stone-50 text-stone-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 px-4 py-3 border border-stone-200 rounded-r-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent outline-none transition-all"
                    placeholder="9876543210"
                    disabled={otpSent}
                    required
                  />
                </div>
              </div>

              {otpSent && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-medium text-stone-700 mb-1">OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent outline-none transition-all text-center tracking-widest text-lg"
                    placeholder="• • • • • •"
                    required
                  />
                  <div className="text-center mt-2">
                    <button type="button" onClick={() => { setOtpSent(false); setOtp(''); }} className="text-sm text-forest-600 hover:text-forest-700">
                      Change Number?
                    </button>
                    <button onClick={() => navigate('/signup')} className="text-forest-600 font-medium hover:text-forest-700 ml-4">
                      Top Up/Sign Up
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-forest-600 text-white py-3 rounded-xl font-semibold hover:bg-forest-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span>{loading ? 'Processing...' : (otpSent ? 'Verify OTP' : 'Send OTP')}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}
        </div>
        {/* Invisible reCAPTCHA container - always present for initialization */}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default LoginPage;
