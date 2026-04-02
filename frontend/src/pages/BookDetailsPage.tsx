/** Book details page: shows one book via `/details/:bookId`. */
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Book } from '../types/Book';
import { useCart } from '../state/CartContext';
import { API_BASE_URL } from '../api/booksApi';

export default function BookDetailsPage() {
  const { bookId } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    // Mission 12: parametric route (`/details/:bookId`) pulls the ID from the URL.
    const fetchBook = async () => {
      if (!bookId) return;
      try {
        setLoading(true);
        // Single-book GET uses the same backend base URL as the rest of the app.
        const res = await fetch(
          `${API_BASE_URL}/api/Books/${bookId}`,
          { cache: 'no-store' }
        );
        if (!res.ok) throw new Error(`Failed to load book ${bookId}`);
        const data: Book = await res.json();
        setBook(data);
      } catch (err) {
        console.error('Failed to fetch book:', err);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [bookId]);

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
        <h1 className="m-0" style={{ color: '#000', fontWeight: 700 }}>
          Book Details
        </h1>
        <Link to="/" className="btn btn-outline-primary">
          Back to Books
        </Link>
      </div>

      {loading && (
        <div className="d-flex justify-content-center my-4" aria-live="polite">
          <div className="spinner-border" role="status" aria-label="Loading book" />
        </div>
      )}

      {!loading && !book && <div className="alert alert-warning">Book not found.</div>}

      {!loading && book && (
        <div className="card">
          <div className="card-body">
            <h3 className="card-title">{book.title}</h3>
            <div className="row g-3">
              <div className="col-12 col-md-8">
                <ul className="list-unstyled mb-0">
                  <li>
                    <strong>Author:</strong> {book.author}
                  </li>
                  <li>
                    <strong>Publisher:</strong> {book.publisher}
                  </li>
                  <li>
                    <strong>ISBN:</strong> {book.isbn}
                  </li>
                  <li>
                    <strong>Classification:</strong> {book.classification}
                  </li>
                  <li>
                    <strong>Category:</strong> {book.category}
                  </li>
                  <li>
                    <strong>Pages:</strong> {book.pageCount}
                  </li>
                </ul>
              </div>
              <div className="col-12 col-md-4">
                <div className="p-3 border rounded bg-light">
                  <div className="text-secondary">Price</div>
                  <div className="fs-4 fw-semibold mb-3">${book.price.toFixed(2)}</div>
                  <button
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={() =>
                      addToCart({ bookId: book.bookId, title: book.title, price: book.price }, 1)
                    }
                  >
                    Add to cart
                  </button>
                  <Link to="/cart" className="btn btn-outline-secondary w-100 mt-2">
                    View cart
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

