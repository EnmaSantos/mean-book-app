MEAN Book Application
=====================

A full-stack application for managing a book collection using the MEAN stack (MongoDB, Express.js, Angular, Node.js).

Overview
--------

This application provides a user-friendly interface to manage books, allowing users to view, add, edit, and delete books from a database.

Technology Stack
----------------

-   **MongoDB**: Database for storing book information
-   **Express.js**: Backend API framework
-   **Angular**: Frontend framework (version 19.2.5)
-   **Node.js**: Runtime environment for the backend

Features
--------

-   Book listing with search and filter capabilities
-   Add new books to the collection
-   Edit existing book information
-   Delete books from the collection
-   Responsive design for various devices

Setup Instructions
------------------

### Prerequisites

-   Node.js and npm
-   MongoDB installation or connection string

### Backend Setup

1.  Navigate to the backend directory:

    cd backend

2.  Install dependencies:

    npm install

3.  Start the server:

    npm start

### Frontend Setup

1.  Navigate to the frontend directory:

    cd frontend

2.  Install dependencies:

    npm install

3.  Start the Angular development server:

    ng serve

4.  Access the application at `http://localhost:4200`

API Endpoints
-------------

The backend provides the following API endpoints:

-   `GET /api/books`: Retrieve all books
-   `GET /api/books/:id`: Retrieve a specific book