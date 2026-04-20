import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const CartContext = createContext({
  items: [],
  isOpen: false,
  total: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  restoreItems: () => {},
  openCart: () => {},
  closeCart: () => {},
});

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = useCallback((item) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id, qty) => {
    if (qty <= 0) { removeFromCart(id); return; }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  }, [removeFromCart]);

  const clearCart    = useCallback(() => setItems([]), []);
  const restoreItems = useCallback((snapshot) => setItems(snapshot), []);
  const openCart     = useCallback(() => setIsOpen(true), []);
  const closeCart    = useCallback(() => setIsOpen(false), []);

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  );

  const value = useMemo(() => ({
    items, isOpen, total,
    addToCart, removeFromCart, updateQuantity, clearCart, restoreItems,
    openCart, closeCart,
  }), [items, isOpen, total, addToCart, removeFromCart, updateQuantity, clearCart, restoreItems, openCart, closeCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
