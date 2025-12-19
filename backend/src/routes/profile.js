const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// Get Profile
router.get('/:email', async (req, res) => {
    try {
        const profile = await Profile.findOne({ email: req.params.email });
        if (!profile) {
            return res.json({ data: null, error: null });
        }
        res.json({ data: profile, error: null });
    } catch (error) {
        res.status(500).json({ data: null, error: { message: error.message } });
    }
});

// Create/Update Profile (Upsert)
router.post('/', async (req, res) => {
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

module.exports = router;
