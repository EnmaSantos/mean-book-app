import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
// Import ReactiveFormsModule and FormControl
import { ReactiveFormsModule, FormControl } from '@angular/forms';
// Import Angular Material Modules needed
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// Import Material Form Field modules needed for search input
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { BookService, Book } from '../../services/book.service';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,    // For FormControl
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,    // For Search Input
    MatInputModule
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
  searchControl = new FormControl('');

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.loadBooks();
  }

   // Modify loadBooks to accept search term
   loadBooks(searchTerm: string = ''): void { // Default to empty string if no term provided
    this.isLoading = true;
    this.errorMessage = '';
    console.log(`Calling getBooks with searchTerm: "${searchTerm}"`); // Log search term being used
    // Pass the search term to the service method
    this.bookService.getBooks(searchTerm).subscribe({
      next: (data) => {
        this.books = data;
        console.log(`Data assigned to this.books (search: "${searchTerm}"):`, this.books);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading books:', err);
        this.errorMessage = 'Failed to load books.';
        this.isLoading = false;
      }
    });
  }

  // Method called when user clicks search button or presses Enter
  performSearch(): void {
    // Use nullish coalescing operator (??) to provide '' if value is null/undefined
    this.loadBooks(this.searchControl.value ?? '');
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