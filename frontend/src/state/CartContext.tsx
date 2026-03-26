/** Cart Context: provides session-persistent cart state and helpers (add/increment/decrement/totals). */
import React, { createContext, useContext, useMemo, useState } from 'react';

// Mission 12: cart state lives in Context so it persists while the user navigates (session lifetime).
export type CartItem = {
  bookId: number;
  title: string;
  price: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  increment: (bookId: number) => void;
  decrement: (bookId: number) => void;
  remove: (bookId: number) => void;
  clear: () => void;
  totalQuantity: number;
  grandTotal: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart: CartContextValue['addToCart'] = (item, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((x) => x.bookId === item.bookId);
      if (existing) {
        return prev.map((x) =>
          x.bookId === item.bookId
            ? { ...x, quantity: x.quantity + quantity }
            : x,
        );
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const increment = (bookId: number) => {
    setItems((prev) =>
      prev.map((x) => (x.bookId === bookId ? { ...x, quantity: x.quantity + 1 } : x)),
    );
  };

  const decrement = (bookId: number) => {
    setItems((prev) =>
      prev
        .map((x) =>
          x.bookId === bookId ? { ...x, quantity: Math.max(1, x.quantity - 1) } : x,
        )
        .filter((x) => x.quantity > 0),
    );
  };

  const remove = (bookId: number) => {
    setItems((prev) => prev.filter((x) => x.bookId !== bookId));
  };

  const clear = () => setItems([]);

  const totalQuantity = useMemo(
    () => items.reduce((sum, x) => sum + x.quantity, 0),
    [items],
  );

  const grandTotal = useMemo(
    () => items.reduce((sum, x) => sum + x.price * x.quantity, 0),
    [items],
  );

  const value: CartContextValue = {
    items,
    addToCart,
    increment,
    decrement,
    remove,
    clear,
    totalQuantity,
    grandTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

