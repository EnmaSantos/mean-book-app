// src/app/services/book.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { Observable } from 'rxjs'; // Import Observable

// (Optional but recommended) Define an interface for the Book object
// This should match the structure of your backend Book model
export interface Book {
  _id?: string; // Optional because it's generated by MongoDB
  title: string;
  author: string;
  genre?: string; // Optional fields marked with ?
  publicationYear?: number;
  // Add rating and coverImageUrl later when implementing those features
  createdAt?: Date; // Automatically added by timestamps: true
  updatedAt?: Date; // Automatically added by timestamps: true
}


@Injectable({
  providedIn: 'root'
})
export class BookService {
  // Define the base URL of your backend API
  private apiUrl = 'http://localhost:3000/api/books'; // Your backend URL

  // Inject HttpClient in the constructor
  constructor(private http: HttpClient) { }

  // Method to GET all books
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
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