const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    excerpt: {
        type: String,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    featured_image: {
        type: String
    },
    author_name: {
        type: String,
        default: 'Admin'
    },
    author_avatar: String,
    category_id: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    is_featured: {
        type: Boolean,
        default: false
    },
    view_count: {
        type: Number,
        default: 0
    },
    read_time_minutes: {
        type: Number,
        default: 5
    },
    tags: [String],
    published_at: Date,
    category: {
        id: String,
        name: String,
        slug: String,
        color: String,
        is_active: Boolean,
        created_at: Date
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Index for search
blogPostSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('BlogPost', blogPostSchema);
