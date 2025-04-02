// src/app/components/book-add/book-add.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// Import ReactiveFormsModule specific directives/classes if needed, or rely on global provide
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Ensure ReactiveFormsModule is imported here
import { Router } from '@angular/router'; // Import Router for navigation
import { BookService } from '../../services/book.service'; // Import BookService
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'; // For the submit button
import { RouterLink } from '@angular/router'; // For the cancel link
@Component({
  selector: 'app-book-add',
  standalone: true,
  imports: [ // <-- CHECK THIS ARRAY
    CommonModule,
    ReactiveFormsModule,
    RouterLink, // If using cancel link
    MatFormFieldModule, // <--- MAKE SURE THIS IS HERE
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './book-add.component.html',
  styleUrls: ['./book-add.component.css']
})
export class BookAddComponent implements OnInit {
  bookForm!: FormGroup; // Use the definite assignment assertion (!)
  isSubmitting = false;
  errorMessage = '';

  // Inject FormBuilder, BookService, and Router
  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Initialize the form group
    this.bookForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]], // Title is required, min 3 chars
      author: ['', Validators.required], // Author is required
      genre: [''], // Optional
      publicationYear: [null, [Validators.min(0), Validators.max(new Date().getFullYear())]], // Optional, numeric, sensible range
      rating: [null, [Validators.min(1), Validators.max(5)]], // Optional, numeric, 1-5 range
      coverImageUrl: [''] // Optional, for future use
    });
  }

  // Getter methods for easier access to form controls in the template (optional but helpful)
  get title() { return this.bookForm.get('title'); }
  get author() { return this.bookForm.get('author'); }
  get publicationYear() { return this.bookForm.get('publicationYear'); }
  get rating() { return this.bookForm.get('rating'); }
  get coverImageUrl() { return this.bookForm.get('coverImageUrl'); }
  get genre() { return this.bookForm.get('genre'); }


  onSubmit(): void {
    if (this.bookForm.invalid) {
      // Mark all fields as touched to display validation errors
      this.bookForm.markAllAsTouched();
      return; // Stop submission if form is invalid
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    // Prepare data (ensure publicationYear is a number or null)
    const formData = this.bookForm.value;
    const bookData = {
      ...formData,
      publicationYear: formData.publicationYear ? Number(formData.publicationYear) : undefined,
      rating: formData.rating ? Number(formData.rating) : undefined // Handle rating too
    };


    this.bookService.addBook(bookData).subscribe({
      next: (newBook) => {
        console.log('Book added successfully:', newBook);
        this.isSubmitting = false;
        // Navigate back to the book list page on success
        this.router.navigate(['/']); // Assumes base route is the list
      },
      error: (err) => {
        console.error('Error adding book:', err);
        this.errorMessage = `Failed to add book. Error: ${err.message || 'Unknown error'}`;
        // Check for specific backend validation errors if available
        if (err.error && typeof err.error === 'object') {
             // You might parse specific validation messages from err.error here
             this.errorMessage += ` Details: ${JSON.stringify(err.error)}`;
        }
        this.isSubmitting = false;
      }
    });
  }
}