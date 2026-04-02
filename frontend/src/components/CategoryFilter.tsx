/** Sidebar filter component: fetches distinct categories and lets the user select them. */
import { useEffect, useMemo, useState } from 'react';
import { Tooltip } from 'bootstrap';
import { API_BASE_URL } from '../api/booksApi';

// Categories load from the deployed API so the sidebar works on Azure Static Web Apps.

type Props = {
  selectedCategories: string[];
  setSelectedCategories: (updater: (prev: string[]) => string[]) => void;
};

export default function CategoryFilter({ selectedCategories, setSelectedCategories }: Props) {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/Books/categories`, { cache: 'no-store' });
        const data: string[] = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    // Initialize any Bootstrap tooltips on the page.
    // (Keeps it simple: re-scan on mount; Bootstrap ignores already-initialized nodes.)
    const nodes = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const instances = Array.from(nodes).map((el) => new Tooltip(el));
    return () => instances.forEach((i) => i.dispose());
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    );
  };

  const allSelected = useMemo(() => selectedCategories.length === 0, [selectedCategories.length]);

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title m-0">Categories</h5>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setSelectedCategories(() => [])}
            disabled={allSelected}
          >
            Clear
          </button>
        </div>

        {loading && (
          <div className="text-secondary small">Loading categories…</div>
        )}

        {!loading && (
          <div className="d-grid gap-1">
            {categories.map((cat) => {
              const id = `cat-${cat.replace(/\s+/g, '-').toLowerCase()}`;
              return (
                <div key={cat} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={id}
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryChange(cat)}
                  />
                  <label className="form-check-label" htmlFor={id}>
                    {cat}
                  </label>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

