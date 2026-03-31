/** Main books page: category filters + pagination + cart summary. */
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookList from '../components/BookList';
import CategoryFilter from '../components/CategoryFilter';
import CartSummary from '../components/CartSummary';

export default function BooksPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Mission 12: keep the user's list state (filters + paging) in the URL query string.
  // This makes "Continue Shopping" (navigate -1) return to the exact same view.
  const selectedCategories = searchParams.getAll('category');

  const pageNum = Number(searchParams.get('pageNum') ?? '1') || 1;
  const pageSize = Number(searchParams.get('pageSize') ?? '5') || 5;
  const sortOrder = (searchParams.get('sortOrder') ?? 'asc') as 'asc' | 'desc';

  const setSelectedCategories = (updater: (prev: string[]) => string[]) => {
    const next = updater(selectedCategories);
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.delete('category');
      next.forEach((c) => p.append('category', c));
      p.set('pageNum', '1'); // reset paging on filter change
      return p;
    });
  };

  const setPageNum = (nextPage: number) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set('pageNum', String(nextPage));
      return p;
    });
  };

  const setPageSize = (nextSize: number) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set('pageSize', String(nextSize));
      p.set('pageNum', '1');
      return p;
    });
  };

  const setSortOrder = (nextSort: 'asc' | 'desc') => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set('sortOrder', nextSort);
      p.set('pageNum', '1');
      return p;
    });
  };

  const [totalPages, setTotalPages] = useState(0);

  const selectedLabel = useMemo(() => {
    if (selectedCategories.length === 0) return 'All categories';
    if (selectedCategories.length === 1) return selectedCategories[0];
    return `${selectedCategories.length} categories`;
  }, [selectedCategories]);

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-3">
        <h1 className="m-0" style={{ color: '#000', fontWeight: 700 }}>
          Books
        </h1>

        <div className="d-flex gap-2 align-items-center">
          <span className="text-secondary small">Showing: {selectedLabel}</span>
          <CartSummary />
        </div>
      </div>

      <div className="row g-3">
        <aside className="col-12 col-md-3">
          <CategoryFilter
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </aside>
        <main className="col-12 col-md-9">
          <BookList
            selectedCategories={selectedCategories}
            pageNum={pageNum}
            pageSize={pageSize}
            sortOrder={sortOrder}
            setPageNum={setPageNum}
            setPageSize={setPageSize}
            setSortOrder={setSortOrder}
            onTotalPagesChange={setTotalPages}
          />
        </main>
      </div>

      {/* Pagination sits outside the sidebar/content row so it centers across the full page */}
      {totalPages > 1 && (
        <nav className="mt-4 d-flex justify-content-center">
          <ul className="pagination mb-0">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <li key={p} className={`page-item ${p === pageNum ? 'active' : ''}`}>
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

