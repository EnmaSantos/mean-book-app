// src/app/components/book-edit/book-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router'; // Import ActivatedRoute and RouterLink
import { BookService, Book } from '../../services/book.service';

@Component({
  selector: 'app-book-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // Add RouterLink for Cancel button
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css']
})
export class BookEditComponent implements OnInit {
  bookForm!: FormGroup;
  bookId: string | null = null; // To store the ID from the route
  isLoading = true; // Start in loading state
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute // Inject ActivatedRoute to get route params
  ) { }

  ngOnInit(): void {
    // Initialize the form (similar to Add component)
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      author: ['', Validators.required],
      genre: [''],
      publicationYear: [null, [Validators.min(0), Validators.max(new Date().getFullYear())]]
    });

    // Get the book ID from the route parameters
    // Using snapshot is simple for components that are always recreated on navigation
    this.bookId = this.route.snapshot.paramMap.get('id');
    // Alternatively, use paramMap observable for components that might reuse the instance
    // this.route.paramMap.subscribe(params => {
    //   this.bookId = params.get('id');
    //   if (this.bookId) {
    //     this.loadBookData(this.bookId);
    //   } else { ... handle error ... }
    // });

    if (this.bookId) {
      this.loadBookData(this.bookId);
    } else {
      // Handle the case where ID is missing (optional, depends on routing setup)
      this.errorMessage = 'Book ID not found in URL.';
      this.isLoading = false;
      console.error('Book ID is null or missing from route parameters.');
      // Optionally navigate back or show a more specific error state
      // this.router.navigate(['/']);
    }
  }

  loadBookData(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.bookService.getBook(id).subscribe({
      next: (bookData) => {
        if (bookData) {
          // Use patchValue to populate the form with fetched data
          // patchValue is safer than setValue if the form model doesn't exactly match the data model
          this.bookForm.patchValue(bookData);
          this.isLoading = false;
        } else {
           this.errorMessage = 'Book not found.';
           this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error loading book data:', err);
        this.errorMessage = `Failed to load book data. ${err.message || ''}`;
         if (err.status === 404) {
            this.errorMessage = 'Book not found.';
         }
        this.isLoading = false;
        // Optionally navigate away if the book isn't found
         // this.router.navigate(['/']);
      }
    });
  }

  // Getter methods for easier access to form controls in the template (optional but helpful)
  get title() { return this.bookForm.get('title'); }
  get author() { return this.bookForm.get('author'); }
  get publicationYear() { return this.bookForm.get('publicationYear'); }


  onSubmit(): void {
    if (this.bookForm.invalid || !this.bookId) {
      this.bookForm.markAllAsTouched(); // Show validation errors
      return; // Stop if form invalid or ID missing
    }

    this.isSubmitting = true;
    this.errorMessage = '';

     // Prepare data (ensure publicationYear is a number or null)
     const formData = this.bookForm.value;
     const bookDataToUpdate = {
       ...formData,
       publicationYear: formData.publicationYear ? Number(formData.publicationYear) : undefined
     };

    this.bookService.updateBook(this.bookId, bookDataToUpdate).subscribe({
      next: (updatedBook) => {
        console.log('Book updated successfully:', updatedBook);
        this.isSubmitting = false;
        // Navigate back to the book list page on success
        this.router.navigate(['/']); // Navigate to the list view
      },
      error: (err) => {
        console.error('Error updating book:', err);
        this.errorMessage = `Failed to update book. Error: ${err.message || 'Unknown error'}`;
         if (err.error && typeof err.error === 'object') {
             this.errorMessage += ` Details: ${JSON.stringify(err.error)}`;
         }
        this.isSubmitting = false;
      }
    });
  }
}