// src/app/services/book.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; // Import HttpClient
import { Observable } from 'rxjs'; // Import Observable

// (Optional but recommended) Define an interface for the Book object
// This should match the structure of your backend Book model
export interface Book {
  _id?: string;
  title: string;
  author: string;
  genre?: string;
  publicationYear?: number;
  rating?: number; // <-- ADD THIS LINE (make it optional with ?)
  coverImageUrl?: string; // Optional field for cover image URL
  createdAt?: Date;
  updatedAt?: Date;
}


@Injectable({
  providedIn: 'root'
})
export class BookService {
  // Define the base URL of your backend API
  private apiUrl = 'http://localhost:3000/api/books'; // Your backend URL

  // Inject HttpClient in the constructor
  constructor(private http: HttpClient) { }

    // Method to GET all books - MODIFIED FOR SEARCH TERM
  getBooks(searchTerm?: string): Observable<Book[]> {
      let params = new HttpParams(); // Initialize HttpParams
  
      // If a search term is provided and not empty, add it to the params
      if (searchTerm && searchTerm.trim() !== '') {
        params = params.set('search', searchTerm.trim()); // Key is 'search', matching req.query.search in backend
      }
  
      // Make the GET request, including the params object
      // The params object will automatically append '?search=term' if needed
      return this.http.get<Book[]>(this.apiUrl, { params: params });
    }
  

  // Method to GET a single book by ID
  getBook(id: string): Observable<Book> {
    const url = `${this.apiUrl}/${id}`; // Construct URL like /api/books/xyz
    return this.http.get<Book>(url);
  }

  // Method to CREATE (POST) a new book
  // Takes a Book object (without _id) as input
  addBook(book: Omit<Book, '_id'>): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  // Method to UPDATE (PUT) an existing book
  // Takes the ID and the updated book data
  updateBook(id: string, book: Partial<Book>): Observable<Book> {
    const url = `${this.apiUrl}/${id}`;
    // Send partial updates or the full book object
    return this.http.put<Book>(url, book);
  }

  // Method to DELETE a book by ID
  deleteBook(id: string): Observable<any> { // Or Observable<object> or specific delete response type
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url); // Response might just be a success message/status
  }
}