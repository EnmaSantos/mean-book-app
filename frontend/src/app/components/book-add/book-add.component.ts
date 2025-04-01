// src/app/components/book-add/book-add.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// Import ReactiveFormsModule specific directives/classes if needed, or rely on global provide
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Ensure ReactiveFormsModule is imported here
import { Router } from '@angular/router'; // Import Router for navigation
import { BookService } from '../../services/book.service'; // Import BookService

@Component({
  selector: 'app-book-add',
  standalone: true,
  // Import CommonModule and ReactiveFormsModule for standalone components
  imports: [CommonModule, ReactiveFormsModule],
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
      publicationYear: [null, [Validators.min(0), Validators.max(new Date().getFullYear())]] // Optional, numeric, sensible range
    });
  }

  // Getter methods for easier access to form controls in the template (optional but helpful)
  get title() { return this.bookForm.get('title'); }
  get author() { return this.bookForm.get('author'); }
  get publicationYear() { return this.bookForm.get('publicationYear'); }


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
      publicationYear: formData.publicationYear ? Number(formData.publicationYear) : undefined
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