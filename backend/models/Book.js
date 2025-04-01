// backend/models/Book.js
const mongoose = require('mongoose');

// Define the structure (schema) for a Book document
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Title is mandatory
    trim: true      // Removes leading/trailing whitespace
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  genre: {
    type: String,
    trim: true
  },
  publicationYear: {
    type: Number
  },
  // We'll add rating and coverImageUrl later in Phase 2
  // createdAt will be added automatically by timestamps: true
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create the Mongoose model based on the schema
// 'Book' is the name we'll use in our code. Mongoose will typically create
// a collection named 'books' (pluralized, lowercase) in MongoDB.
const Book = mongoose.model('Book', bookSchema);

// Export the model so we can use it in other parts of our backend (like API routes)
module.exports = Book;