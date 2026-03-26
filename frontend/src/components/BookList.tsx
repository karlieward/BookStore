/** Book list component: fetches books from API with filters + paging + sort, and renders cards. */
import { useState, useEffect } from 'react';
import type { Book } from '../types/Book';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../state/CartContext';

const API_BASE = import.meta.env.VITE_API_URL || '';

/** API response shape from /Books endpoint */
interface BooksResponse {
  books: Book[];
  totalNumBooks: number;
}

type Props = {
  selectedCategories: string[];
  pageNum: number;
  pageSize: number;
  sortOrder: 'asc' | 'desc';
  setPageNum: (p: number) => void;
  setPageSize: (s: number) => void;
  setSortOrder: (s: 'asc' | 'desc') => void;
};

function BookList({
  selectedCategories,
  pageNum,
  pageSize,
  sortOrder,
  setPageNum,
  setPageSize,
  setSortOrder,
}: Props) {
  const [books, setBooks] = useState<Book[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Refetch when pagination or sort changes
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const base = API_BASE || '';
        const params = new URLSearchParams({
          pageNum: String(pageNum),
          pageSize: String(pageSize),
          sortOrder,
        });

        selectedCategories.forEach((c) => params.append('categories', c));

        const res = await fetch(`${base}/api/Books?${params}`, {
          cache: 'no-store', // Prevent cached responses when changing sort
        });
        const data: BooksResponse = await res.json();
        setBooks(data.books);
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
      } catch (err) {
        console.error('Failed to fetch books:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [pageNum, pageSize, sortOrder, selectedCategories]);

  // pageNum reset handled by BooksPage (URL params) so state survives navigation

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as 'asc' | 'desc');
  };

  return (
    <div>
      <div className="mb-3 d-flex flex-wrap gap-3 align-items-center justify-content-center">
        <div>
          <label htmlFor="pageSize" className="me-2">
            Results per page:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="form-select form-select-sm w-auto d-inline-block"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div>
          <label htmlFor="sortOrder" className="me-2">
            Sort by title:
          </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={handleSortChange}
            className="form-select form-select-sm w-auto d-inline-block"
          >
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>
        </div>
      </div>

      {/*
        ===================== TA NOTE (Bootstrap extra #1) =====================
        Bootstrap component used: Spinner (`spinner-border`)
        Where to find it: `frontend/src/components/BookList.tsx` (right above the spinner)
        Why it's here: shows a loading indicator while books are fetching
        =============================================================================
      */}
      {loading && (
        <div className="d-flex justify-content-center my-4" aria-live="polite">
          <div className="spinner-border" role="status" aria-label="Loading books" />
        </div>
      )}

      <div className="row g-3">
        {books.map((book) => (
          <div key={book.bookId} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">
                  <Link to={`/details/${book.bookId}`} className="text-decoration-none">
                    {book.title}
                  </Link>
                </h5>
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
                  <li>
                    <strong>Price:</strong> ${book.price.toFixed(2)}
                  </li>
                </ul>
              </div>
              <div className="card-footer bg-white border-top-0 pt-0">
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  // TA NOTE (Bootstrap extra): Tooltip on Add to cart (initialized in `CategoryFilter.tsx`)
                  data-bs-toggle="tooltip"
                  data-bs-title="Adds the book to your cart, then opens the cart."
                  onClick={() => {
                    addToCart({ bookId: book.bookId, title: book.title, price: book.price }, 1);
                    navigate('/cart');
                  }}
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic pagination: one button per page */}
      {totalPages > 1 && (
        <nav className="mt-4 d-flex justify-content-center">
          <ul className="pagination mb-0">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <li
                key={p}
                className={`page-item ${p === pageNum ? 'active' : ''}`}
              >
                <button
                  type="button"
                  className="page-link"
                  onClick={() => setPageNum(p)}
                >
                  {p}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

export default BookList;
