// backend/routes/bookRoutes.js
const express = require('express');
const router = express.Router(); // Use Express's Router
const Book = require('../models/Book'); // Import the Book model

// --- CRUD Routes for /api/books ---

// CREATE a new Book (POST /api/books)
router.post('/', async (req, res) => {
  try {
    // req.body contains the data sent from the frontend (Angular)
    const newBook = new Book(req.body);
    const savedBook = await newBook.save(); // Save to MongoDB
    res.status(201).json(savedBook); // Respond with the created book and status 201 (Created)
  } catch (error) {
    res.status(400).json({ message: 'Error creating book', error: error.message }); // Handle errors
  }
});

// READ all Books (GET /api/books)
router.get('/', async (req, res) => {
  try {
    const books = await Book.find(); // Fetch all books from MongoDB
    res.status(200).json(books); // Respond with the list of books
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
});

// READ a single Book by ID (GET /api/books/:id)
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id); // Find by ID from URL parameter
    if (!book) {
      return res.status(404).json({ message: 'Book not found' }); // Handle not found
    }
    res.status(200).json(book); // Respond with the found book
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book', error: error.message });
  }
});

// UPDATE a Book by ID (PUT /api/books/:id)
router.put('/:id', async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id, // ID of the book to update
      req.body,     // New data for the book
      { new: true, runValidators: true } // Options: return the updated doc, run schema validators
    );
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(updatedBook); // Respond with the updated book
  } catch (error) {
    res.status(400).json({ message: 'Error updating book', error: error.message });
  }
});

// DELETE a Book by ID (DELETE /api/books/:id)
router.delete('/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id); // Find by ID and delete
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    // Successfully deleted, often respond with a success message or just status 204 (No Content)
    res.status(200).json({ message: 'Book deleted successfully', book: deletedBook });
    // Alternatively: res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
});


// Export the router so it can be used in server.js
module.exports = router;