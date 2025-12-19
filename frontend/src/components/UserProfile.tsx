import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { User, Phone, Calendar, Mail, Shield, ArrowLeft, Edit2, Save, X, Loader2, Activity, TrendingUp, Award } from 'lucide-react';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { user, profile, loading, signOut, updateProfile, resetPassword } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editData, setEditData] = useState({
        full_name: '',
        phone: '',
        date_of_birth: ''
    });
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    React.useEffect(() => {
        if (profile) {
            setEditData({
                full_name: profile.full_name || '',
                phone: profile.phone || '',
                date_of_birth: profile.date_of_birth ? new Date(profile.date_of_birth).toISOString().split('T')[0] : ''
            });
        } else if (user?.displayName) {
            setEditData(prev => ({ ...prev, full_name: user.displayName || '' }));
        }
    }, [user, profile]);

    const handleUpdateProfile = async () => {
        if (!editData.full_name.trim()) {
            setMessage({ type: 'error', text: 'Please enter your full name' });
            return;
        }

        setIsSaving(true);
        setMessage(null);

        const { error } = await updateProfile({
            full_name: editData.full_name,
            phone: editData.phone,
            date_of_birth: editData.date_of_birth
        });

        setIsSaving(false);

        if (error) {
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } else {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
            // Clear message after 3 seconds
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleResetPassword = async () => {
        if (!user?.email) return;
        const { error } = await resetPassword(user.email);
        if (error) {
            setMessage({ type: 'error', text: 'Failed to send reset email' });
        } else {
            setMessage({ type: 'success', text: 'Password reset email sent! Check your inbox.' });
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-forest-50 via-white to-sage-50">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-forest-600 to-sage-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                        <div className="absolute inset-0 w-16 h-16 mx-auto bg-gradient-to-br from-forest-600 to-sage-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    </div>
                    <p className="text-stone-600 font-medium mt-4">Loading your profile...</p>
                </div>
            </div>
        );
    }

    // Not authenticated
    if (!user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-4 bg-gradient-to-br from-forest-50 via-white to-sage-50">
                <div className="text-center max-w-md">
                    <div className="relative mb-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-forest-600 to-sage-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                            <User className="w-12 h-12 text-white" />
                        </div>
                        <div className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-br from-forest-600 to-sage-500 rounded-full blur-2xl opacity-40"></div>
                    </div>
                    <h1 className="text-3xl font-bold text-stone-800 mb-3">Sign in Required</h1>
                    <p className="text-stone-600 mb-8 text-lg">Please sign in to view and manage your profile</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/login"
                            className="px-8 py-3 bg-gradient-to-r from-forest-600 to-sage-600 text-white rounded-xl font-medium hover:from-forest-700 hover:to-sage-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/signup"
                            className="px-8 py-3 border-2 border-forest-600 text-forest-600 rounded-xl font-medium hover:bg-forest-50 transition-all"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-forest-50 via-white to-sage-50 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-sage-200 to-forest-200 rounded-full blur-3xl opacity-20 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-forest-200 to-sage-200 rounded-full blur-3xl opacity-20 -z-10"></div>

            <div className="max-w-6xl mx-auto p-4 sm:p-8 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-stone-600 hover:text-forest-600 transition-all mb-8 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back</span>
                </button>

                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-forest-800 to-sage-700 bg-clip-text text-transparent mb-2">
                        My Profile
                    </h1>
                    <p className="text-stone-600 text-lg">Manage your personal information and preferences</p>
                </div>

                {/* Success/Error Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 shadow-lg animate-in slide-in-from-top duration-300 ${message.type === 'success' ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-2 border-green-200' : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-2 border-red-200'}`}>
                        {message.type === 'success' ? (
                            <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        )}
                        <span className="font-medium">{message.text}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Main Profile Card */}
                        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden transform transition-all hover:shadow-2xl">
                            {/* Profile Header with Gradient */}
                            <div className="relative bg-gradient-to-br from-forest-600 via-forest-500 to-sage-600 p-8 overflow-hidden">
                                {/* Decorative circles */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                                <div className="relative flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                                    <div className="relative group">
                                        <div className="w-28 h-28 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white/40 shadow-2xl group-hover:scale-105 transition-transform">
                                            {(profile?.full_name || user?.displayName || user?.email)?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <div className="absolute inset-0 bg-white/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h2 className="text-3xl font-bold text-white mb-2">{profile?.full_name || user?.displayName || 'User'}</h2>
                                        <p className="text-white/90 flex items-center justify-center md:justify-start space-x-2 mb-3">
                                            <Mail className="w-4 h-4" />
                                            <span>{user?.email}</span>
                                        </p>
                                        <div className="flex items-center justify-center md:justify-start gap-2">
                                            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg ${profile?.subscription_status === 'active' ? 'bg-gradient-to-r from-gold-400 to-gold-500 text-gold-900' : 'bg-white/25 text-white backdrop-blur-sm'}`}>
                                                {profile?.subscription_status === 'active' ? '✨ Premium Member' : 'Free Plan'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Details Section */}
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-stone-800 flex items-center space-x-2">
                                        <User className="w-5 h-5 text-forest-600" />
                                        <span>Profile Information</span>
                                    </h3>
                                    {!isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center space-x-2 px-4 py-2 text-forest-600 hover:bg-forest-50 rounded-xl font-medium transition-all border border-forest-200 hover:border-forest-400"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            <span>Edit Profile</span>
                                        </button>
                                    )}
                                </div>

                                {isEditing ? (
                                    <div className="space-y-5">
                                        <div className="group">
                                            <label className="flex items-center space-x-2 text-sm font-semibold text-stone-700 mb-2">
                                                <User className="w-4 h-4 text-forest-600" />
                                                <span>Full Name</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={editData.full_name}
                                                onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all group-hover:border-stone-300"
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                        <div className="group">
                                            <label className="flex items-center space-x-2 text-sm font-semibold text-stone-700 mb-2">
                                                <Phone className="w-4 h-4 text-forest-600" />
                                                <span>Phone Number</span>
                                            </label>
                                            <input
                                                type="tel"
                                                value={editData.phone}
                                                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all group-hover:border-stone-300"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                        <div className="group">
                                            <label className="flex items-center space-x-2 text-sm font-semibold text-stone-700 mb-2">
                                                <Calendar className="w-4 h-4 text-forest-600" />
                                                <span>Date of Birth</span>
                                            </label>
                                            <input
                                                type="date"
                                                value={editData.date_of_birth}
                                                onChange={(e) => setEditData({ ...editData, date_of_birth: e.target.value })}
                                                className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-forest-500 outline-none transition-all group-hover:border-stone-300"
                                            />
                                        </div>
                                        <div className="flex items-center space-x-3 pt-4">
                                            <button
                                                onClick={handleUpdateProfile}
                                                disabled={isSaving}
                                                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-forest-600 to-sage-600 text-white rounded-xl hover:from-forest-700 hover:to-sage-700 font-medium transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                                            >
                                                {isSaving ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        <span>Saving...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="w-4 h-4" />
                                                        <span>Save Changes</span>
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setMessage(null);
                                                    // Reset to original values
                                                    if (profile) {
                                                        setEditData({
                                                            full_name: profile.full_name || '',
                                                            phone: profile.phone || '',
                                                            date_of_birth: profile.date_of_birth ? new Date(profile.date_of_birth).toISOString().split('T')[0] : ''
                                                        });
                                                    }
                                                }}
                                                className="flex items-center space-x-2 px-6 py-3 text-stone-600 hover:bg-stone-100 rounded-xl font-medium transition-all border border-stone-200"
                                            >
                                                <X className="w-4 h-4" />
                                                <span>Cancel</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-stone-50 to-stone-100/50 rounded-xl hover:shadow-md transition-all group">
                                            <User className="w-5 h-5 text-forest-600 mt-0.5 group-hover:scale-110 transition-transform" />
                                            <div>
                                                <p className="text-xs text-stone-500 uppercase tracking-wide font-semibold">Full Name</p>
                                                <p className="text-stone-800 font-medium text-lg">{profile?.full_name || user?.displayName || 'Not set'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-stone-50 to-stone-100/50 rounded-xl hover:shadow-md transition-all group">
                                            <Phone className="w-5 h-5 text-forest-600 mt-0.5 group-hover:scale-110 transition-transform" />
                                            <div>
                                                <p className="text-xs text-stone-500 uppercase tracking-wide font-semibold">Phone Number</p>
                                                <p className="text-stone-800 font-medium text-lg">{profile?.phone || 'Not set'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-stone-50 to-stone-100/50 rounded-xl hover:shadow-md transition-all group">
                                            <Calendar className="w-5 h-5 text-forest-600 mt-0.5 group-hover:scale-110 transition-transform" />
                                            <div>
                                                <p className="text-xs text-stone-500 uppercase tracking-wide font-semibold">Date of Birth</p>
                                                <p className="text-stone-800 font-medium text-lg">
                                                    {profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not set'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Account Settings Card */}
                        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-8 transform transition-all hover:shadow-2xl">
                            <div className="flex items-center space-x-2 mb-6">
                                <Shield className="w-6 h-6 text-forest-600" />
                                <h3 className="text-xl font-bold text-stone-800">Account Settings</h3>
                            </div>
                            <div className="space-y-3">
                                {user?.providerData[0]?.providerId === 'password' && (
                                    <button
                                        onClick={handleResetPassword}
                                        className="w-full sm:w-auto px-5 py-3 text-stone-600 hover:bg-stone-50 rounded-xl transition-all text-left flex items-center space-x-2 border border-stone-200 hover:border-stone-300 group"
                                    >
                                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                        </svg>
                                        <span className="font-medium">Reset Password</span>
                                    </button>
                                )}
                                <button
                                    onClick={handleSignOut}
                                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-50 to-rose-50 text-red-600 hover:from-red-100 hover:to-rose-100 rounded-xl transition-all font-medium flex items-center space-x-2 border-2 border-red-200 hover:border-red-300 shadow-sm hover:shadow-md group"
                                >
                                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Stats & Quick Actions */}
                    <div className="space-y-6">
                        {/* Account Stats */}
                        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-6 transform transition-all hover:shadow-2xl">
                            <h3 className="text-lg font-bold text-stone-800 mb-4 flex items-center space-x-2">
                                <Activity className="w-5 h-5 text-forest-600" />
                                <span>Account Overview</span>
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl group hover:shadow-md transition-all">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Activity className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-stone-500 font-semibold">Member Since</p>
                                            <p className="text-stone-800 font-bold">
                                                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Recently'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl group hover:shadow-md transition-all">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <TrendingUp className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-stone-500 font-semibold">Status</p>
                                            <p className="text-stone-800 font-bold">
                                                {profile?.subscription_status === 'active' ? 'Premium' : 'Free'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl group hover:shadow-md transition-all">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Award className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-stone-500 font-semibold">Profile</p>
                                            <p className="text-stone-800 font-bold">
                                                {profile?.full_name && profile?.phone && profile?.date_of_birth ? 'Complete' : 'Incomplete'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gradient-to-br from-forest-600 to-sage-600 rounded-2xl shadow-xl p-6 text-white transform transition-all hover:shadow-2xl">
                            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Link
                                    to="/pricing"
                                    className="flex items-center space-x-3 p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all group"
                                >
                                    <div className="w-8 h-8 bg-white/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <TrendingUp className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium">View Plans</span>
                                </Link>
                                <Link
                                    to="/emotional-support"
                                    className="flex items-center space-x-3 p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all group"
                                >
                                    <div className="w-8 h-8 bg-white/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Activity className="w-4 h-4" />
                                    </div>
                                    <span className="font-medium">Get Support</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
