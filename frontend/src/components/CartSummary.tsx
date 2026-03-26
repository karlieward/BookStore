/** Small cart summary + offcanvas preview shown on the main books page. */
import { useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { Offcanvas } from 'bootstrap';
import { useCart } from '../state/CartContext';

export default function CartSummary() {
  const { totalQuantity, grandTotal } = useCart();
  const offcanvasId = useId().replace(/:/g, '');
  const navigate = useNavigate();

  return (
    <>
      {/*
        ===================== TA NOTE (Bootstrap extra #2) =====================
        Bootstrap component used: Offcanvas (`offcanvas offcanvas-end`)
        Where to find it: `frontend/src/components/CartSummary.tsx` (this component)
        What it does: cart summary slides in from the right
        ============================================================================ 
      */}
      <button
        type="button"
        className="btn btn-outline-primary btn-sm"
        data-bs-toggle="offcanvas"
        data-bs-target={`#${offcanvasId}`}
        aria-controls={offcanvasId}
      >
        Cart: {totalQuantity} (${grandTotal.toFixed(2)})
      </button>

      <div
        className="offcanvas offcanvas-end"
        tabIndex={-1}
        id={offcanvasId}
        aria-labelledby={`${offcanvasId}-label`}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id={`${offcanvasId}-label`}>
            Cart summary
          </h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" />
        </div>
        <div className="offcanvas-body">
          <div className="mb-3">
            <div className="fw-semibold">Items</div>
            <div>{totalQuantity}</div>
          </div>
          <div className="mb-3">
            <div className="fw-semibold">Total</div>
            <div>${grandTotal.toFixed(2)}</div>
          </div>
          <button
            type="button"
            className="btn btn-primary w-100"
            onClick={() => {
              const el = document.getElementById(offcanvasId);
              if (el) {
                const instance = Offcanvas.getInstance(el) ?? new Offcanvas(el);
                instance.hide();
              }
              navigate('/cart');
            }}
          >
            View cart
          </button>
        </div>
      </div>
    </>
  );
}

