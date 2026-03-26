/** Cart page: shows line items, quantities, subtotals, and totals. */
import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../state/CartContext';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, increment, decrement, remove, totalQuantity, grandTotal, clear } = useCart();

  const lines = useMemo(
    () =>
      items.map((x) => ({
        ...x,
        subtotal: x.price * x.quantity,
      })),
    [items],
  );

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
        <h1 className="m-0" style={{ color: '#000', fontWeight: 700 }}>
          Shopping Cart
        </h1>
        <div className="d-flex gap-2">
          {/* Mission 12: return the user to where they were in the book list */}
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
            Continue Shopping
          </button>
          <Link to="/" className="btn btn-outline-primary">
            Back to All Books
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="alert alert-info">
          Your cart is empty. <Link to="/">Browse books</Link>.
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Book</th>
                  <th className="text-end">Price</th>
                  <th className="text-center">Qty</th>
                  <th className="text-end">Subtotal</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {lines.map((x) => (
                  <tr key={x.bookId}>
                    <td className="fw-semibold">{x.title}</td>
                    <td className="text-end">${x.price.toFixed(2)}</td>
                    <td className="text-center" style={{ width: 180 }}>
                      <div className="btn-group" role="group" aria-label={`Quantity for ${x.title}`}>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => decrement(x.bookId)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="btn btn-outline-secondary disabled" aria-disabled="true">
                          {x.quantity}
                        </span>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => increment(x.bookId)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="text-end">${x.subtotal.toFixed(2)}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => remove(x.bookId)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan={3} className="text-end">
                    Total ({totalQuantity} items)
                  </th>
                  <th className="text-end">${grandTotal.toFixed(2)}</th>
                  <th />
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="d-flex flex-wrap gap-2 justify-content-end">
            <button type="button" className="btn btn-outline-danger" onClick={clear}>
              Clear Cart
            </button>
            <button type="button" className="btn btn-success" disabled>
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

