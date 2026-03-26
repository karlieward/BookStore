/** Root app shell: sets up routing + top navbar. */
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import './App.css';
import BooksPage from './pages/BooksPage';
import CartPage from './pages/CartPage';
import BookDetailsPage from './pages/BookDetailsPage';
import { useCart } from './state/CartContext';

function App() {
  // Mission 12: Router + cart provider keep navigation/cart state consistent across pages.
  const { totalQuantity } = useCart();

  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand fw-semibold" to="/">
            Bookstore
          </Link>
          <div className="ms-auto d-flex gap-2">
            <Link className="btn btn-outline-light btn-sm" to="/cart">
              Cart ({totalQuantity})
            </Link>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<BooksPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/details/:bookId" element={<BookDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
