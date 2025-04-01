// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component'; // Import list component
import { BookAddComponent } from './components/book-add/book-add.component'; // Import add component
import { BookEditComponent } from './components/book-edit/book-edit.component'; // <-- Import edit component


export const routes: Routes = [
  // Route for the home page (display book list)
  {
    path: '', // Empty path means the base URL (e.g., http://localhost:4200/)
    component: BookListComponent,
    title: 'My Book Collection' // Optional: Set browser tab title
  },
  // Route for the 'add book' page
  {
    path: 'add', // URL path will be /add (e.g., http://localhost:4200/add)
    component: BookAddComponent,
    title: 'Add New Book' // Optional: Set browser tab title
  },

  {
    path: 'edit/:id', // ':id' is a route parameter
    component: BookEditComponent,
    title: 'Edit Book'
  }

  // Optional: Redirect '/books' to the base path if needed
  // { path: 'books', redirectTo: '', pathMatch: 'full' },

  // We'll add routes for editing later
  // { path: 'edit/:id', component: BookEditComponent },

  // Optional: Wildcard route for 404 Not Found pages (add a NotFoundComponent later)
  // { path: '**', component: NotFoundComponent }
];