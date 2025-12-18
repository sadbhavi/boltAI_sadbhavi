import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Profile: React.FC = () => {
    const { user, profile, signOut, updateProfile, resetPassword } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
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
        if (!editData.full_name.trim()) return;

        const { error } = await updateProfile({
            full_name: editData.full_name,
            phone: editData.phone,
            date_of_birth: editData.date_of_birth
        });

        if (error) {
            setMessage({ type: 'error', text: 'Failed to update profile' });
        } else {
            setMessage({ type: 'success', text: 'Profile updated successfully' });
            setIsEditing(false);
        }
    };

    const handleResetPassword = async () => {
        if (!user?.email) return;
        const { error } = await resetPassword(user.email);
        if (error) {
            setMessage({ type: 'error', text: 'Failed to send reset email' });
        } else {
            setMessage({ type: 'success', text: 'Password reset email sent!' });
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-forest-800">My Profile</h1>
            </div>

            {message && (
                <div className={`mb-4 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-8">
                    <div className="w-24 h-24 bg-forest-100 rounded-full flex items-center justify-center text-forest-600 text-3xl font-bold">
                        {user?.email?.[0].toUpperCase() || 'U'}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        {isEditing ? (
                            <div className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={editData.full_name}
                                        onChange={(e) => setEditData({ ...editData, full_name: e.target.value })}
                                        className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-forest-500 outline-none"
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={editData.phone}
                                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                        className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-forest-500 outline-none"
                                        placeholder="Phone Number"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={editData.date_of_birth}
                                        onChange={(e) => setEditData({ ...editData, date_of_birth: e.target.value })}
                                        className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-forest-500 outline-none"
                                    />
                                </div>
                                <div className="flex items-center space-x-2 pt-2">
                                    <button onClick={handleUpdateProfile} className="px-4 py-2 bg-forest-600 text-white rounded-lg hover:bg-forest-700 font-medium">Save Changes</button>
                                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-stone-500 hover:text-stone-700 font-medium">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-center md:justify-start space-x-2">
                                    <h2 className="text-2xl font-semibold text-stone-800">{profile?.full_name || user?.displayName || 'User'}</h2>
                                    <button onClick={() => setIsEditing(true)} className="text-forest-600 hover:text-forest-700 text-sm font-medium">
                                        Edit Profile
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-stone-600">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium text-stone-400 text-sm italic">Phone:</span>
                                        <span>{profile?.phone || 'Not set'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium text-stone-400 text-sm italic">DOB:</span>
                                        <span>{profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : 'Not set'}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <p className="text-stone-500 mt-2">{user?.email}</p>
                        <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                            <span className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-sm">
                                {profile?.subscription_status === 'active' ? 'Premium Member' : 'Free Plan'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="border-t border-stone-100 pt-6 space-y-4">
                    <div>
                        <h3 className="text-lg font-medium text-stone-800 mb-2">Account Settings</h3>
                        <div className="space-y-3">
                            {user?.providerData[0]?.providerId === 'password' && (
                                <button
                                    onClick={handleResetPassword}
                                    className="w-full sm:w-auto px-4 py-2 text-stone-600 hover:bg-stone-50 rounded-lg transition-colors text-left"
                                >
                                    Reset Password
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={() => signOut()}
                            className="w-full sm:w-auto px-6 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors font-medium"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
