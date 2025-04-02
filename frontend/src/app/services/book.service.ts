// src/app/services/book.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define Book interface
export interface Book {
  _id?: string;
  title: string;
  author: string;
  genre?: string;
  publicationYear?: number;
  rating?: number; 
  coverImageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the expected response structure for getBooks
export interface GetBooksResponse {
  books: Book[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:3000/api/books';

  constructor(private http: HttpClient) { }

  // Method to GET books - MODIFIED FOR SEARCH, FILTER, SORT, & PAGINATION
  getBooks(
    searchTerm?: string,
    genre?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    pageIndex: number = 0, // Default to first page
    pageSize: number = 10  // Default page size
  ): Observable<GetBooksResponse> { // Update return type to match new response format

    let params = new HttpParams(); // Initialize HttpParams

    // Add search term if provided
    if (searchTerm && searchTerm.trim() !== '') {
      params = params.set('search', searchTerm.trim());
    }

    // Add genre if provided
    if (genre && genre.trim() !== '') {
       params = params.set('genre', genre.trim());
    }

    // --- ADD SORTING PARAMS ---
    if (sortBy && sortBy.trim() !== '') {
       params = params.set('sortBy', sortBy.trim());
       // Only add sortOrder if sortBy is present and sortOrder is 'desc'
       // (Backend defaults to 'asc' if sortOrder is missing)
       if (sortOrder === 'desc') {
          params = params.set('sortOrder', 'desc');
       }
    }
    
    // --- ADD PAGINATION PARAMS ---
    params = params.set('pageIndex', pageIndex.toString());
    params = params.set('pageSize', pageSize.toString());
    // ---------------------------

    // Make the GET request, including the params object
    console.log('Sending getBooks request with params:', params.toString());
    return this.http.get<GetBooksResponse>(this.apiUrl, { params });
  }

  // Method to GET a single book by ID
  getBook(id: string): Observable<Book> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Book>(url);
  }

  // Method to CREATE (POST) a new book
  addBook(book: Omit<Book, '_id'>): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  // Method to UPDATE (PUT) an existing book
  updateBook(id: string, book: Partial<Book>): Observable<Book> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Book>(url, book);
  }

  // Method to DELETE a book by ID
  deleteBook(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}