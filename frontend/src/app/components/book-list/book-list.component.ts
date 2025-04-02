import { Component, OnInit, ViewChild } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select'; 
// Import Material Sort modules
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
// Import Material Paginator modules
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';

import { BookService, Book, GetBooksResponse } from '../../services/book.service';

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
    MatInputModule,
    MatSelectModule,       // For genre dropdown
    MatSortModule,         // For column sorting
    MatPaginatorModule     // For pagination
  ],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  isLoading = true;
  errorMessage = '';
  totalBooks = 0; // Total count for pagination

  // Define columns to display in the table
  displayedColumns: string[] = ['coverImageUrl','title', 'author', 'genre', 'publicationYear', 'rating', 'actions'];
  
  // Search and Filter Controls
  searchControl = new FormControl('');
  genreFilterControl = new FormControl('');
  availableGenres: string[] = ['Fantasy', 'Science Fiction', 'Comedy', 'Real life', 'qa', 'Mystery', 'Thriller'];
  
  // Pagination Properties
  pageSize = 10; // Default items per page
  currentPageIndex = 0; // Initial page index (0-based)
  pageSizeOptions = [5, 10, 25, 50]; // Options for items per page dropdown
  
  // References to Sort and Paginator directives in the template
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    // Load initial data using default pagination state
    this.loadBooks();
    
    // Optional: Reload books when genre filter changes
    this.genreFilterControl.valueChanges.subscribe(() => {
      this.applyFiltersAndSearch();
    });
  }

  // Updated loadBooks signature (can remove defaults if always called via wrappers)
  loadBooks(
    searchTerm: string = '',
    genre: string = '',
    sortBy: string = '',
    sortOrder: 'asc' | 'desc' | '' = '',
    pageIndex: number = this.currentPageIndex, // Use component state
    pageSize: number = this.pageSize        // Use component state
  ): void {
    this.isLoading = true;
    this.errorMessage = '';
    console.log(`Calling getBooks with searchTerm: "${searchTerm}", genre: "${genre}", sortBy: "${sortBy}", sortOrder: "${sortOrder}", pageIndex: ${pageIndex}, pageSize: ${pageSize}`);
    
    this.bookService.getBooks(
      searchTerm, 
      genre, 
      sortBy, 
      sortOrder as ('asc' | 'desc' | undefined),
      pageIndex,
      pageSize
    ).subscribe({
      next: (response: GetBooksResponse) => {
        // Assign the books array from the response object to this.books
        this.books = response.books;
        // Assign the totalCount from the response object to this.totalBooks
        this.totalBooks = response.totalCount;

        console.log(`Data assigned: ${this.books.length} books on this page, totalCount: ${this.totalBooks}`);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading books:', err);
        this.errorMessage = 'Failed to load books.';
        this.isLoading = false;
        this.books = []; // Clear books on error
        this.totalBooks = 0; // Reset total count on error
      }
    });
  }

  // Applies all filters, search, sort, and current page settings
  applyFiltersAndSearch(): void {
    // Reset to first page whenever filters or search term change
    this.currentPageIndex = 0;
    // Update paginator UI if it exists
    if (this.paginator) { this.paginator.pageIndex = 0; }

    const searchTerm = this.searchControl.value ?? '';
    const genre = this.genreFilterControl.value ?? '';
    const sortBy = this.sort?.active ?? '';
    const sortOrder = this.sort?.direction ?? '';
    this.loadBooks(searchTerm, genre, sortBy, sortOrder, 0, this.pageSize);
  }

  // Method to clear all filters and search but maintain sort
  clearFiltersAndSearch(): void {
    this.searchControl.setValue('');
    this.genreFilterControl.setValue('');
    this.currentPageIndex = 0; // Reset to first page
    if (this.paginator) { this.paginator.pageIndex = 0; }

    const sortBy = this.sort?.active ?? '';
    const sortOrder = this.sort?.direction ?? '';
    this.loadBooks('', '', sortBy, sortOrder, 0, this.pageSize);
  }

  // Method triggered when the user clicks a sortable header
  handleSortChange(sort: Sort): void {
    console.log('Sort changed:', sort);
    this.currentPageIndex = 0; // Reset to first page on sort change
    if (this.paginator) { this.paginator.pageIndex = 0; }

    const searchTerm = this.searchControl.value ?? '';
    const genre = this.genreFilterControl.value ?? '';
    this.loadBooks(searchTerm, genre, sort.active, sort.direction, 0, this.pageSize);
  }

  // Handles paginator events (page change, page size change)
  handlePageEvent(event: PageEvent): void {
    console.log('Page event:', event);
    // Update component state based on paginator event
    this.currentPageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    // *** Check these lines carefully ***
    const searchTerm = this.searchControl.value ?? '';
    const genre = this.genreFilterControl.value ?? '';
    const sortBy = this.sort?.active ?? ''; // Reads current sort field
    const sortOrder = this.sort?.direction ?? ''; // Reads current sort direction
    // *** ------------------------- ***

    // Pass ALL current state parameters to loadBooks
    this.loadBooks(searchTerm, genre, sortBy, sortOrder, this.currentPageIndex, this.pageSize);
  }

  deleteBook(id: string | undefined): void {
    if (!id) return; // Guard against undefined id

    if (confirm('Are you sure you want to delete this book?')) { // Simple confirmation
      this.bookService.deleteBook(id).subscribe({
        next: () => {
          console.log(`Book with id ${id} deleted`);
          // Reload books with current filters, search, and sort after deletion
          this.applyFiltersAndSearch(); // Reset to first page after deletion
        },
        error: (err) => {
          console.error('Error deleting book:', err);
          this.errorMessage = 'Failed to delete book.';
        }
      });
    }
  }
}