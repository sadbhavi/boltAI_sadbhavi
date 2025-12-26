const simpleAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // Check if the header exists and has the Bearer format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: { message: 'Access denied. No token provided.' } });
    }

    const token = authHeader.split(' ')[1];

    // Verify the token (Simple check for our custom admin token)
    // In a real app, this should be an env variable and hopefully a JWT
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'sadbhavi-secret-admin-token-123';

    if (token !== ADMIN_TOKEN) {
        return res.status(403).json({ error: { message: 'Invalid token.' } });
    }

    next();
};

module.exports = simpleAuth;
