import React, { useState } from 'react';
import { Mail, ArrowRight, User, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const { signUp, signInWithGoogle } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password.length < 6) {
            setError('Password should be at least 6 characters');
            setLoading(false);
            return;
        }

        const { error } = await signUp(email, password, name);
        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate('/');
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        const { error } = await signInWithGoogle();
        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 to-sage-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-forest-600 p-8 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-forest-100">Join our community today</p>
                </div>

                <div className="p-8">
                    {/* Social Login */}
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center space-x-3 border-2 border-stone-200 rounded-xl py-3 mb-6 hover:bg-stone-50 hover:border-stone-300 transition-all duration-200 group"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                        <span className="font-medium text-stone-700 group-hover:text-stone-900">Sign up with Google</span>
                    </button>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-stone-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-stone-500">Or sign up with email</span>
                        </div>
                    </div>

                    {/* Form */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 pl-10 border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent outline-none transition-all"
                                    placeholder="John Doe"
                                    required
                                />
                                <User className="w-5 h-5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 pl-10 border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent outline-none transition-all"
                                    placeholder="name@example.com"
                                    required
                                />
                                <Mail className="w-5 h-5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 pl-10 border border-stone-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Create a password"
                                    required
                                />
                                <Lock className="w-5 h-5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-forest-600 text-white py-3 rounded-xl font-semibold hover:bg-forest-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
                            {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-stone-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-forest-600 font-medium hover:text-forest-700">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
