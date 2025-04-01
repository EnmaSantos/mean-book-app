// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; // Use environment port or 3000

// --- Middleware ---
// Enable All CORS Requests for development (adjust for production later)
app.use(cors());
// Parse JSON request bodies
app.use(express.json());

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