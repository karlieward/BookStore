/**
 * HTTP helpers for the Books API (list + admin CRUD).
 * `API_BASE_URL` is shared by this module and by components that call `/api/Books` directly
 * (catalog list, categories sidebar, book details) so the deployed Azure frontend always
 * targets the same backend as the admin forms below.
 */
import type { Book } from '../types/Book';

interface FetchBooksResponse {
  books: Book[];
  totalNumBooks: number;
}

// Deployed backend (Azure App Service). Override at build time with VITE_API_BASE_URL if needed.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  'https://bookstore-ward-backend-gwhxb9ebebd2gqau.westus2-01.azurewebsites.net';

const API_URL = `${API_BASE_URL}/api/Books`;

export const fetchBooks = async (
  pageSize: number,
  pageNum: number,
  selectedCategories: string[]
): Promise<FetchBooksResponse> => {
  try {
    // Turn the selected categories into repeated query string values.
    const categoryParams = selectedCategories
      .map((cat) => `categories=${encodeURIComponent(cat)}`)
      .join('&');

    // Request one page of books from the backend.
    const response = await fetch(
      `${API_URL}?pageSize=${pageSize}&pageNum=${pageNum}${selectedCategories.length ? `&${categoryParams}` : ''}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

// POST matches `BooksController.AddBook`.
export const addBook = async (newBook: Book): Promise<Book> => {
  try {
    const response = await fetch(`${API_URL}/AddBook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBook),
    });

    if (!response.ok) {
      throw new Error('Failed to add book');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
};

// PUT matches `BooksController.UpdateBook`.
export const updateBook = async (
  bookId: number,
  updatedBook: Book
): Promise<Book> => {
  try {
    const response = await fetch(`${API_URL}/UpdateBook/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedBook),
    });

    return await response.json();
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

// DELETE matches `BooksController.DeleteBook`.
export const deleteBook = async (bookId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/DeleteBook/${bookId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete book');
    }
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};
