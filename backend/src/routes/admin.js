const express = require('express');
const router = express.Router();

// hardcoded credentials
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'akkiibaghel2@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Mahendrasingh2@';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'sadbhavi-secret-admin-token-123';

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        return res.json({
            data: {
                token: ADMIN_TOKEN,
                user: { username: 'Admin', role: 'admin' }
            },
            error: null
        });
    }

    res.status(401).json({ data: null, error: { message: 'Invalid credentials' } });
});

module.exports = router;
