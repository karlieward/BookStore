/**
 * Form to update an existing book via `updateBook` → PUT `/api/Books/UpdateBook/{id}`.
 * Local state starts as a copy of the row selected on the admin table.
 */
import { useState } from 'react';
import type { Book } from '../types/Book';
import { updateBook } from '../api/booksApi';

interface EditBookFormProps {
  book: Book;
  onSuccess: () => void;
  onCancel: () => void;
}

const EditBookForm = ({ book, onSuccess, onCancel }: EditBookFormProps) => {
  const [formData, setFormData] = useState<Book>({ ...book });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBook(formData.bookId, formData);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 mb-4 shadow-sm border-warning">
      <h5 className="card-title mb-4">Edit Book</h5>

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
          Save Changes
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditBookForm;
