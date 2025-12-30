//server.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const menuRoutes = require('./Routes/routes');
const app = express();
const port = process.env.PORT || 5000;

// CORS configuration for both development and production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'https://2k2bhq6d-5000.use.devtunnels.ms',
  // Add your Vercel domain(s) here once deployed
  // 'https://your-domain.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // Parse incoming JSON requests

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Root route - API status check
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'NGOMNA API Server is running',
    version: '1.0.0',
    endpoints: {
      menus: '/api/menus',
      links: '/api/links',
      pages: '/api/pages',
      sections: '/api/sections',
      text: '/api/text',
      images: '/api/images'
    }
  });
});

// Use routes
app.use(menuRoutes);

// Export the Express app for Vercel
module.exports = app;

// Start the server (only in local development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}
