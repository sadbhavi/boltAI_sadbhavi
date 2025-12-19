const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');

// Get all posts (with filters)
router.get('/', async (req, res) => {
    try {
        const { status, category, search, limit, featured } = req.query;
        const query = {};

        if (status && status !== 'all') query.status = status;
        if (category) {
            // Match by category name (case-insensitive)
            query['category.name'] = { $regex: new RegExp(`^${category}$`, 'i') };
        }
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
router.get('/slug/:slug', async (req, res) => {
    try {
        const post = await BlogPost.findOne({ slug: req.params.slug });
        res.json({ data: post, error: null });
    } catch (error) {
        res.status(500).json({ data: null, error: { message: error.message } });
    }
});

// Get single post by ID
router.get('/:id', async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        res.json({ data: post, error: null });
    } catch (error) {
        res.status(500).json({ data: null, error: { message: error.message } });
    }
});

// Create post
router.post('/', async (req, res) => {
    try {
        const newPost = new BlogPost(req.body);

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
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
    try {
        await BlogPost.findByIdAndDelete(req.params.id);
        res.json({ error: null });
    } catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
});

// Increment View Count
router.post('/:id/view', async (req, res) => {
    try {
        await BlogPost.findByIdAndUpdate(req.params.id, { $inc: { view_count: 1 } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
