/**
 * Form to insert a new book via `addBook` → POST `/api/Books/AddBook`.
 * `bookId` stays 0; the database assigns the real id when the row is saved.
 */
import { useState } from 'react';
import type { Book } from '../types/Book';
import { addBook } from '../api/booksApi';

interface NewBookFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const NewBookForm = ({ onSuccess, onCancel }: NewBookFormProps) => {
  const [formData, setFormData] = useState<Book>({
    bookId: 0,
    title: '',
    author: '',
    publisher: '',
    isbn: '',
    classification: '',
    category: '',
    pageCount: 0,
    price: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addBook(formData);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 mb-4 shadow-sm">
      <h5 className="card-title mb-4">Add New Book</h5>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Author</label>
          <input
            type="text"
            className="form-control"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Publisher</label>
          <input
            type="text"
            className="form-control"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">ISBN</label>
          <input
            type="text"
            className="form-control"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Classification</label>
          <input
            type="text"
            className="form-control"
            name="classification"
            value={formData.classification}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Category</label>
          <input
            type="text"
            className="form-control"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Page Count</label>
          <input
            type="number"
            className="form-control"
            name="pageCount"
            value={formData.pageCount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Price ($)</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="mt-4 d-flex gap-2">
        <button type="submit" className="btn btn-dark">
          Add Book
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default NewBookForm;
