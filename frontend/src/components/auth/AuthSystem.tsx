import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, Eye, EyeOff, Shield, Heart, Users, MapPin, MessageCircle, Headphones } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface AuthSystemProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  initialMode?: 'login' | 'signup';
}

interface LoginData {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  otp: string;
  loginMethod: 'email' | 'phone' | 'google';
  language: string;
}

const AuthSystem: React.FC<AuthSystemProps> = ({ isOpen, onClose, onLoginSuccess, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'otp'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    otp: '',
    loginMethod: 'email',
    language: 'en'
  });

  const { signIn, signUp, signInWithGoogle } = useAuth();

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' }
  ];

  // OTP Timer
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  // Rate limiting
  useEffect(() => {
    if (loginAttempts >= 5) {
      setIsBlocked(true);
      setTimeout(() => {
        setIsBlocked(false);
        setLoginAttempts(0);
      }, 300000); // 5 minutes block
    }
  }, [loginAttempts]);

  if (!isOpen) return null;

  const validatePassword = (password: string): boolean => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
  };

  const validatePhone = (phone: string): boolean => {
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    return indianPhoneRegex.test(phone);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
      onLoginSuccess();
      onClose();
    } catch (err) {
      setError('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async () => {
    if (!validatePhone(loginData.phone)) {
      setError('Please enter a valid Indian mobile number');
      return;
    }

    setLoading(true);
    try {
      // Simulate Twilio OTP sending
      await new Promise(resolve => setTimeout(resolve, 1500));
      setOtpSent(true);
      setOtpTimer(60);
      setError('');
      console.log('OTP sent to:', loginData.phone);
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (loginData.otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (loginData.otp === '123456') { // Demo OTP
        onLoginSuccess();
        onClose();
      } else {
        setError('Invalid OTP. Please try again.');
        setLoginAttempts(prev => prev + 1);
      }
    } catch (err) {
      setError('OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isBlocked) {
      setError('Too many failed attempts. Please try again in 5 minutes.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        // Validation
        if (!loginData.fullName.trim()) {
          throw new Error('Full name is required');
        }

        if (loginData.loginMethod === 'email') {
          if (!loginData.email || !loginData.password) {
            throw new Error('Email and password are required');
          }
          if (!validatePassword(loginData.password)) {
            throw new Error('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
          }
          if (loginData.password !== loginData.confirmPassword) {
            throw new Error('Passwords do not match');
          }
        }

        const { error } = await signUp(
          loginData.loginMethod === 'email' ? loginData.email : loginData.phone,
          loginData.password,
          loginData.fullName
        );

        if (error) throw error;

        if (loginData.loginMethod === 'phone') {
          setMode('otp');
          await sendOTP();
        } else {
          onLoginSuccess();
          onClose();
        }
      } else if (mode === 'login') {
        if (loginData.loginMethod === 'phone') {
          setMode('otp');
          await sendOTP();
        } else {
          const { error } = await signIn(loginData.email, loginData.password);
          if (error) {
            setLoginAttempts(prev => prev + 1);
            throw error;
          }
          onLoginSuccess();
          onClose();
        }
      } else if (mode === 'forgot') {
        // Simulate forgot password
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert('Password reset link sent to your email/phone');
        setMode('login');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Welcome Back! 🙏';
      case 'signup': return 'Join Our Community 💕';
      case 'forgot': return 'Reset Password 🔐';
      case 'otp': return 'Verify OTP 📱';
      default: return 'Welcome';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'login': return 'Sign in to find your perfect match';
      case 'signup': return 'Create your profile and start your journey';
      case 'forgot': return 'We\'ll help you reset your password';
      case 'otp': return `Enter the 6-digit code sent to ${loginData.phone}`;
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 relative max-h-[95vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center text-stone-600 hover:text-stone-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-stone-800 mb-2">{getTitle()}</h2>
          <p className="text-stone-600">{getSubtitle()}</p>
        </div>

        {/* Language Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-stone-700 mb-2">Preferred Language</label>
          <select
            value={loginData.language}
            onChange={(e) => setLoginData({ ...loginData, language: e.target.value })}
            className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.native} ({lang.name})
              </option>
            ))}
          </select>
        </div>

        {/* OTP Mode */}
        {mode === 'otp' && (
          <form onSubmit={(e) => { e.preventDefault(); verifyOTP(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Enter OTP</label>
              <input
                type="text"
                value={loginData.otp}
                onChange={(e) => setLoginData({ ...loginData, otp: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>

            {otpTimer > 0 ? (
              <p className="text-center text-stone-600">Resend OTP in {otpTimer}s</p>
            ) : (
              <button
                type="button"
                onClick={sendOTP}
                className="w-full text-pink-600 hover:text-pink-700 font-medium"
              >
                Resend OTP
              </button>
            )}

            <button
              type="submit"
              disabled={loading || loginData.otp.length !== 6}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}

        {/* Regular Forms */}
        {mode !== 'otp' && (
          <>
            {/* Social Login */}
            {(mode === 'login' || mode === 'signup') && (
              <div className="space-y-3 mb-6">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-stone-200 rounded-xl py-3 hover:border-stone-300 transition-colors disabled:opacity-50"
                >
                  <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
                  <span className="font-medium text-stone-700">Continue with Google</span>
                </button>
              </div>
            )}

            {/* Divider */}
            {(mode === 'login' || mode === 'signup') && (
              <div className="flex items-center mb-6">
                <div className="flex-1 border-t border-stone-200"></div>
                <span className="px-4 text-sm text-stone-500">or</span>
                <div className="flex-1 border-t border-stone-200"></div>
              </div>
            )}

            {/* Login Method Toggle */}
            {(mode === 'login' || mode === 'signup') && (
              <div className="flex bg-stone-100 rounded-lg p-1 mb-4">
                <button
                  type="button"
                  onClick={() => setLoginData({ ...loginData, loginMethod: 'email' })}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md transition-colors ${loginData.loginMethod === 'email' ? 'bg-white shadow-sm' : ''
                    }`}
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm font-medium">Email</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLoginData({ ...loginData, loginMethod: 'phone' })}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md transition-colors ${loginData.loginMethod === 'phone' ? 'bg-white shadow-sm' : ''
                    }`}
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-sm font-medium">Phone</span>
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name field for signup */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={loginData.fullName}
                    onChange={(e) => setLoginData({ ...loginData, fullName: e.target.value })}
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}

              {/* Email/Phone field */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  {loginData.loginMethod === 'email' ? 'Email Address' : 'Mobile Number'}
                </label>
                <div className="relative">
                  {loginData.loginMethod === 'phone' && (
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-600">+91</span>
                  )}
                  <input
                    type={loginData.loginMethod === 'email' ? 'email' : 'tel'}
                    value={loginData.loginMethod === 'email' ? loginData.email : loginData.phone}
                    onChange={(e) => setLoginData({
                      ...loginData,
                      [loginData.loginMethod === 'email' ? 'email' : 'phone']: e.target.value
                    })}
                    className={`w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent ${loginData.loginMethod === 'phone' ? 'pl-12' : ''
                      }`}
                    placeholder={loginData.loginMethod === 'email' ? 'Enter your email' : 'Enter 10-digit mobile number'}
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              {(loginData.loginMethod === 'email' || mode === 'forgot') && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="w-full px-4 py-3 pr-12 border border-stone-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-stone-500"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {mode === 'signup' && (
                    <div className="mt-2 text-xs text-stone-600">
                      Password must contain: 8+ characters, uppercase, lowercase, number, special character
                    </div>
                  )}
                </div>
              )}

              {/* Confirm Password for signup */}
              {mode === 'signup' && loginData.loginMethod === 'email' && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={loginData.confirmPassword}
                    onChange={(e) => setLoginData({ ...loginData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              )}

              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">{error}</div>
              )}

              {isBlocked && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg flex items-center justify-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Account temporarily locked due to multiple failed attempts</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || isBlocked}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'Please wait...' :
                  mode === 'login' ? 'Sign In' :
                    mode === 'signup' ? 'Create Account' :
                      'Reset Password'}
              </button>
            </form>
          </>
        )}

        {/* Footer links */}
        <div className="text-center mt-6 space-y-2">
          {mode === 'login' && (
            <>
              <button
                onClick={() => setMode('forgot')}
                className="text-pink-600 hover:text-pink-700 text-sm"
              >
                Forgot Password?
              </button>
              <div className="text-stone-600 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="text-pink-600 hover:text-pink-700 font-medium"
                >
                  Sign Up
                </button>
              </div>
            </>
          )}

          {mode === 'signup' && (
            <div className="text-stone-600 text-sm">
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-pink-600 hover:text-pink-700 font-medium"
              >
                Sign In
              </button>
            </div>
          )}

          {(mode === 'forgot' || mode === 'otp') && (
            <button
              onClick={() => setMode('login')}
              className="text-pink-600 hover:text-pink-700 text-sm"
            >
              Back to Sign In
            </button>
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <div className="flex items-center space-x-2 text-blue-800 text-sm">
            <Shield className="w-4 h-4" />
            <span className="font-medium">Your data is secure</span>
          </div>
          <p className="text-blue-700 text-xs mt-1">
            We use industry-standard encryption and never share your personal information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthSystem;