//server.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const menuRoutes = require('./Routes/routes');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); // Enable CORS for frontend interaction
app.use(express.json()); // Parse incoming JSON requests

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

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
