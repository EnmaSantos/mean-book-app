// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes'); // Add this line

const app = express();
const PORT = process.env.PORT || 3000; // Use environment port or 3000

// --- Middleware ---
// --- Middleware ---
// Enable All CORS Requests for development (adjust for production later)
app.use(cors());
// Parse JSON request bodies *BEFORE* routes that need it
app.use(express.json());

// --- API Routes ---
// Now mount the routes *AFTER* the body-parsing middleware
app.use('/api/books', bookRoutes);

// --- MongoDB Connection ---
// Replace with your actual MongoDB connection string!
const MONGO_URI = 'mongodb://localhost:27017/bookAppDb'; // Example local DB

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Basic Route ---
app.get('/', (req, res) => {
  res.send('Hello from MEAN Book App Backend!');
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});