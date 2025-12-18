require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Models
const BlogPost = require('./models/BlogPost');
const Profile = require('./models/Profile');

// Routes

// --- BLOG ROUTES ---

// Get all posts (with filters)
app.get('/api/blogs', async (req, res) => {
    try {
        const { status, category, search, limit, featured } = req.query;
        const query = {};

        if (status && status !== 'all') query.status = status;
        if (category) query['category.slug'] = category;
        if (featured !== undefined) query.is_featured = featured === 'true';
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        let postsQuery = BlogPost.find(query).sort({ published_at: -1, created_at: -1 });

        if (limit) postsQuery = postsQuery.limit(parseInt(limit));

        const posts = await postsQuery.exec();
        res.json({ data: posts, error: null });
    } catch (error) {
        res.status(500).json({ data: null, error: { message: error.message } });
    }
});

// Get single post by slug
app.get('/api/blogs/slug/:slug', async (req, res) => {
    try {
        const post = await BlogPost.findOne({ slug: req.params.slug });
        res.json({ data: post, error: null });
    } catch (error) {
        res.status(500).json({ data: null, error: { message: error.message } });
    }
});

// Get single post by ID
app.get('/api/blogs/:id', async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        res.json({ data: post, error: null });
    } catch (error) {
        res.status(500).json({ data: null, error: { message: error.message } });
    }
});

// Create post
app.post('/api/blogs', async (req, res) => {
    try {
        const newPost = new BlogPost(req.body);
        // Auto-populate category details if simple ID provided (Mock Logic enhancement)
        // In real app, we'd fetch category. For now, we trust frontend sends full object or we default.
        if (!newPost.category || !newPost.category.name) {
            newPost.category = {
                id: newPost.category_id || 'general',
                name: 'General',
                slug: 'general',
                color: 'bg-gray-100',
                is_active: true,
                created_at: new Date()
            };
        }

        if (newPost.status === 'published' && !newPost.published_at) {
            newPost.published_at = new Date();
        }

        const savedPost = await newPost.save();
        res.json({ data: savedPost, error: null });
    } catch (error) {
        res.status(400).json({ data: null, error: { message: error.message } });
    }
});

// Update post
app.put('/api/blogs/:id', async (req, res) => {
    try {
        const updates = req.body;
        if (updates.status === 'published' && !updates.published_at) {
            updates.published_at = new Date();
        }
        updates.updated_at = new Date();

        const updatedPost = await BlogPost.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );
        res.json({ data: updatedPost, error: null });
    } catch (error) {
        res.status(400).json({ data: null, error: { message: error.message } });
    }
});

// Delete post
app.delete('/api/blogs/:id', async (req, res) => {
    try {
        await BlogPost.findByIdAndDelete(req.params.id);
        res.json({ error: null });
    } catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
});

// Increment View Count
app.post('/api/blogs/:id/view', async (req, res) => {
    try {
        await BlogPost.findByIdAndUpdate(req.params.id, { $inc: { view_count: 1 } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// --- PROFILE ROUTES ---

// Get Profile
app.get('/api/profile/:email', async (req, res) => {
    try {
        const profile = await Profile.findOne({ email: req.params.email });
        if (!profile) {
            // Optional: Auto-create if not found (mimics upsert)
            // For now, return null so frontend knows to create
            return res.json({ data: null, error: null });
        }
        res.json({ data: profile, error: null });
    } catch (error) {
        res.status(500).json({ data: null, error: { message: error.message } });
    }
});

// Create/Update Profile (Upsert)
app.post('/api/profile', async (req, res) => {
    try {
        const { email, ...updates } = req.body;
        const profile = await Profile.findOneAndUpdate(
            { email },
            { ...updates, email },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json({ data: profile, error: null });
    } catch (error) {
        res.status(400).json({ data: null, error: { message: error.message } });
    }
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
