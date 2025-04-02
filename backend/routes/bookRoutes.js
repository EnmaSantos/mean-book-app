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

// READ all Books (GET /api/books) - MODIFIED FOR SEARCH, FILTER, SORT & PAGINATION
router.get('/', async (req, res) => {
  try {
    // --- Pagination Parameters ---
    // Use '+' to convert query params to numbers, provide defaults
    const pageIndex = req.query.pageIndex ? +req.query.pageIndex : 0; // 0-based index
    const pageSize = req.query.pageSize ? +req.query.pageSize : 10; // Default page size
    console.log(`Pagination: pageIndex=${pageIndex}, pageSize=${pageSize}`);

    // --- Build Filter/Search Query (as before) ---
    let query = {};
    if (req.query.search && typeof req.query.search === 'string' && req.query.search.trim() !== '') {
      const searchTerm = req.query.search.trim();
      const regex = new RegExp(searchTerm, 'i');
      query.$or = [ { title: { $regex: regex } }, { author: { $regex: regex } } ];
      console.log(`Searching books. Current query:`, JSON.stringify(query));
    }
    
    if (req.query.genre && typeof req.query.genre === 'string' && req.query.genre.trim() !== '') {
      const genreFilter = req.query.genre.trim();
      query.genre = genreFilter;
      console.log(`Filtering by genre: "${genreFilter}". Current query:`, JSON.stringify(query));
    }
    
    console.log('Filter/Search Query:', JSON.stringify(query));

    // --- Build Sort Options (as before) ---
    let sortOptions = { createdAt: -1 }; // Default sort
    if (req.query.sortBy && typeof req.query.sortBy === 'string') {
      const sortBy = req.query.sortBy;
      const sortOrder = (req.query.sortOrder === 'desc' ? -1 : 1);
      sortOptions = { [sortBy]: sortOrder };
      console.log(`Sorting by: ${sortBy}, Order: ${sortOrder === -1 ? 'desc' : 'asc'}`);
    } else {
      console.log('Applying default sort (newest first)');
    }
    
    console.log('Sort Options:', JSON.stringify(sortOptions));

    // --- Execute Queries ---
    // 1. Get TOTAL COUNT matching the query (before pagination)
    const totalCount = await Book.countDocuments(query);
    console.log(`Total matching documents: ${totalCount}`);

    // 2. Get the BOOKS for the CURRENT PAGE matching the query
    const books = await Book.find(query)
                            .sort(sortOptions)
                            .skip(pageIndex * pageSize) // Skip documents for previous pages
                            .limit(pageSize);          // Limit results to page size

    // --- Send Response ---
    // Respond with an object containing books for the page and the total count
    res.status(200).json({
      books: books,         // Array of books for the current page
      totalCount: totalCount // Total number of books matching query
    });

  } catch (error) {
    console.error('Error fetching books:', error);
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