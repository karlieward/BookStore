import { useState, useEffect } from 'react';
import type { Book } from '../types/Book';

const API_BASE = import.meta.env.VITE_API_URL || '';

interface BooksResponse {
  books: Book[];
  totalNumBooks: number;
}

function BookList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const base = API_BASE || '';
        const params = new URLSearchParams({
          pageNum: String(pageNum),
          pageSize: String(pageSize),
          sortOrder,
        });
        const res = await fetch(`${base}/Books?${params}`, {
          cache: 'no-store',
        });
        const data: BooksResponse = await res.json();
        setBooks(data.books);
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
      } catch (err) {
        console.error('Failed to fetch books:', err);
      }
    };
    fetchBooks();
  }, [pageNum, pageSize, sortOrder]);

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPageNum(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as 'asc' | 'desc');
    setPageNum(1);
  };

  return (
    <div className="container py-4">
      <h1
        className="mb-4"
        style={{ color: '#000', fontWeight: 700 }}
      >
        Bookstore
      </h1>

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

      <div className="row g-3">
        {books.map((book) => (
          <div key={book.bookId} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{book.title}</h5>
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
            </div>
          </div>
        ))}
      </div>

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
