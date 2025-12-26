require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Import routes
const healthRoutes = require('./routes/health');
const blogsRoutes = require('./routes/blogs');
const profileRoutes = require('./routes/profile');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to Database
connectDB();

// Routes
app.use('/api', healthRoutes);
app.use('/api/blogs', blogsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', require('./routes/admin'));

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
