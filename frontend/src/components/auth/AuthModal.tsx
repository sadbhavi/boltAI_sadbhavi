import React, { useState } from 'react';
import { X, Mail, Phone, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const { signIn, signUp, signInWithGoogle } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        const { error } = await signUp(
          loginMethod === 'email' ? formData.email : formData.phone,
          formData.password,
          formData.fullName
        );
        if (error) throw error;
      } else if (mode === 'login') {
        const { error } = await signIn(
          loginMethod === 'email' ? formData.email : formData.phone,
          formData.password
        );
        if (error) throw error;
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
      onClose();
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    }
  };

  const handleTrueCallerLogin = () => {
    // TrueCaller integration would go here
    console.log('TrueCaller login clicked');
  };

  const sendOTP = () => {
    // OTP sending logic would go here
    setOtpSent(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center text-stone-600 hover:text-stone-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-stone-800 mb-2">
            {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
          </h2>
          <p className="text-stone-600">
            {mode === 'login' ? 'Sign in to continue your wellness journey' : 
             mode === 'signup' ? 'Join millions finding inner peace' : 
             'Enter your details to reset password'}
          </p>
        </div>

        {/* Social Login Buttons */}
        {mode !== 'forgot' && (
          <div className="space-y-3 mb-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center space-x-3 bg-white border-2 border-stone-200 rounded-xl py-3 hover:border-stone-300 transition-colors"
            >
              <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="w-5 h-5" />
              <span className="font-medium text-stone-700">Continue with Google</span>
            </button>
            
            <button
              onClick={handleTrueCallerLogin}
              className="w-full flex items-center justify-center space-x-3 bg-blue-600 text-white rounded-xl py-3 hover:bg-blue-700 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span className="font-medium">Continue with TrueCaller</span>
            </button>
          </div>
        )}

        {/* Divider */}
        {mode !== 'forgot' && (
          <div className="flex items-center mb-6">
            <div className="flex-1 border-t border-stone-200"></div>
            <span className="px-4 text-sm text-stone-500">or</span>
            <div className="flex-1 border-t border-stone-200"></div>
          </div>
        )}

        {/* Login Method Toggle */}
        {mode !== 'forgot' && (
          <div className="flex bg-stone-100 rounded-lg p-1 mb-4">
            <button
              onClick={() => setLoginMethod('email')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md transition-colors ${
                loginMethod === 'email' ? 'bg-white shadow-sm' : ''
              }`}
            >
              <Mail className="w-4 h-4" />
              <span className="text-sm font-medium">Email</span>
            </button>
            <button
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md transition-colors ${
                loginMethod === 'phone' ? 'bg-white shadow-sm' : ''
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
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          {/* Email/Phone field */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              {loginMethod === 'email' ? 'Email Address' : 'Phone Number'}
            </label>
            <input
              type={loginMethod === 'email' ? 'email' : 'tel'}
              value={loginMethod === 'email' ? formData.email : formData.phone}
              onChange={(e) => setFormData({ 
                ...formData, 
                [loginMethod === 'email' ? 'email' : 'phone']: e.target.value 
              })}
              className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent"
              placeholder={loginMethod === 'email' ? 'Enter your email' : 'Enter your phone number'}
              required
            />
          </div>

          {/* OTP field for phone login */}
          {loginMethod === 'phone' && mode !== 'forgot' && (
            <div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  className="flex-1 px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                  placeholder="Enter OTP"
                  disabled={!otpSent}
                />
                <button
                  type="button"
                  onClick={sendOTP}
                  className="px-4 py-3 bg-forest-600 text-white rounded-xl hover:bg-forest-700 transition-colors"
                  disabled={!formData.phone || otpSent}
                >
                  {otpSent ? 'Sent' : 'Send OTP'}
                </button>
              </div>
            </div>
          )}

          {/* Password field */}
          {(loginMethod === 'email' || mode === 'forgot') && (
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent"
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
            </div>
          )}

          {/* Confirm Password for signup */}
          {mode === 'signup' && loginMethod === 'email' && (
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                placeholder="Confirm your password"
                required
              />
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest-600 text-white py-3 rounded-xl font-semibold hover:bg-forest-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Please wait...' : 
             mode === 'login' ? 'Sign In' : 
             mode === 'signup' ? 'Create Account' : 
             'Reset Password'}
          </button>
        </form>

        {/* Footer links */}
        <div className="text-center mt-6 space-y-2">
          {mode === 'login' && (
            <>
              <button
                onClick={() => setMode('forgot')}
                className="text-forest-600 hover:text-forest-700 text-sm"
              >
                Forgot Password?
              </button>
              <div className="text-stone-600 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => setMode('signup')}
                  className="text-forest-600 hover:text-forest-700 font-medium"
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
                className="text-forest-600 hover:text-forest-700 font-medium"
              >
                Sign In
              </button>
            </div>
          )}
          
          {mode === 'forgot' && (
            <button
              onClick={() => setMode('login')}
              className="text-forest-600 hover:text-forest-700 text-sm"
            >
              Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;