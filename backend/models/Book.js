// backend/models/Book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
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

  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must be at most 5'], 
    
  },

  coverImageUrl: {
    type: String,
    trim: true
  },
 
}, {
  timestamps: true
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;