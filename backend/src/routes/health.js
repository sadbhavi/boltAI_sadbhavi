const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
    const mongoose = require('mongoose');
    const health = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        environment: process.env.NODE_ENV || 'development'
    };
    res.status(200).json(health);
});

module.exports = router;
