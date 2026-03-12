import cart from '../../assets/shopping-cart.svg';
import { useCart } from '../../context/CartContext';
import './ShoppingCart.css';

const ShoppingCart = () => {
  const { items, openCart } = useCart();
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <button className="shopping-cart" onClick={openCart} aria-label="Корзина">
      <img src={cart} alt="" />
      {count > 0 && <span className="shopping-cart__badge">{count}</span>}
    </button>
  );
};

export default ShoppingCart;
