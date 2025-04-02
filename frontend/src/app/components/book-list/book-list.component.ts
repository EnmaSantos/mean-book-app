// src/app/components/book-list/book-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
// Import Angular Material Modules
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // For delete/edit icons
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // For loading

import { BookService, Book } from '../../services/book.service';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    // Add Material Modules here
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'] // You might add styles here later
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  isLoading = true;
  errorMessage = '';

  // Define columns to display in the table
  displayedColumns: string[] = ['coverImageUrl','title', 'author', 'genre', 'publicationYear', 'rating', 'actions'];
  // Note: 'actions' is for edit/delete buttons, 'coverImageUrl' is for displaying the image

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    // ... (loadBooks logic remains the same) ...
     this.isLoading = true; // Set loading state
     this.errorMessage = ''; // Clear previous errors
     this.bookService.getBooks().subscribe({
       next: (data) => {
         this.books = data; // Assign fetched data to the books array
         this.isLoading = false; // Turn off loading state
         console.log('Books loaded:', this.books);
       },
       error: (err) => {
         console.error('Error loading books:', err);
         this.errorMessage = 'Failed to load books. Please ensure the backend server is running.';
         this.isLoading = false; // Turn off loading state even on error
       }
     });
  }

  deleteBook(id: string | undefined): void {
     // ... (deleteBook logic remains the same) ...
      if (!id) return; // Guard against undefined id

      if (confirm('Are you sure you want to delete this book?')) { // Simple confirmation
        this.bookService.deleteBook(id).subscribe({
          next: () => {
            console.log(`Book with id ${id} deleted`);
            this.loadBooks();
          },
          error: (err) => {
            console.error('Error deleting book:', err);
            this.errorMessage = 'Failed to delete book.';
          }
        });
      }
  }
}