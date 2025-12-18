const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    full_name: {
        type: String,
        trim: true
    },
    avatar_url: String,
    subscription_status: {
        type: String,
        enum: ['free', 'trial', 'active', 'cancelled', 'expired'],
        default: 'free'
    },
    subscription_plan: {
        type: String,
        enum: ['free', 'monthly', 'annual', 'family', 'lifetime'],
        default: 'free'
    },
    trial_ends_at: Date,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Profile', profileSchema);
