import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';
import { customerCreateOrder } from '../../api';
import Rectangle from '../../assets/Rectangle.svg';
import './CartDrawer.css';

const CartDrawer = () => {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const { user, initDataRaw } = useUser();

  const [name, setName] = useState(
    user ? (`${user.first_name || ''} ${user.last_name || ''}`).trim() : ''
  );
  const [contact, setContact] = useState(user?.username ? `@${user.username}` : '');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const serviceType = items.map(i => i.name).join(', ');
      const description = items.map(i => `${i.name} x${i.quantity}`).join('; ');
      await customerCreateOrder({
        service_type: serviceType,
        description,
        price: total,
        customer_name: name.trim(),
        customer_contact: contact.trim(),
      }, initDataRaw);
      setSubmitted(true);
      clearCart();
    } catch (err) {
      setError(err.message || 'Не удалось отправить заявку — попробуйте ещё раз');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    closeCart();
    setSubmitted(false);
    setError(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="cart-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="cart-drawer"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Шапка */}
            <div className="cart-drawer__header">
              <h2 className="cart-drawer__title">ВАШ ЗАКАЗ 🐾</h2>
              <button className="cart-drawer__close" onClick={handleClose}>×</button>
            </div>

            {/* Успешная отправка */}
            {submitted ? (
              <div className="cart-success">
                <p className="cart-success__badge">⭐ Форма отправлена</p>
                <h3 className="cart-success__title">
                  <span className="cart-success__pink">СПАСИБО</span> ЗА ОБРАЩЕНИЕ!
                </h3>
                <p className="cart-success__sub">Мы свяжемся с вами в ближайшее время,<br />чтобы ответить на ваши вопросы</p>
                <div className="cart-success__illustration">🐕‍🦺</div>
              </div>
            ) : (
              <>
                {/* Список товаров */}
                <div className="cart-drawer__items">
                  {items.length === 0 ? (
                    <div className="cart-empty">
                      <p className="cart-empty__title">ВАША КОРЗИНА ПУСТА :(</p>
                      <p className="cart-empty__sub">Добавьте товар в корзину,<br />чтобы он отобразился тут.</p>
                    </div>
                  ) : (
                    items.map(item => (
                      <div className="cart-item" key={item.id}>
                        <img
                          className="cart-item__img"
                          src={item.image || Rectangle}
                          alt={item.name}
                          loading="lazy"
                        />
                        <div className="cart-item__info">
                          <p className="cart-item__name">{item.name}</p>
                          <p className="cart-item__sku">Арт: {String(item.id).padStart(3, '0')}</p>
                        </div>
                        <div className="cart-item__qty">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                        </div>
                        <p className="cart-item__price">{(item.price * item.quantity).toLocaleString('ru-RU')}₽</p>
                        <button className="cart-item__remove" onClick={() => removeFromCart(item.id)}>✕</button>
                      </div>
                    ))
                  )}
                </div>

                {/* Форма */}
                <div className="cart-drawer__form-section">
                  <div className="cart-drawer__divider" />
                  <div className="cart-drawer__total-row">
                    <span className="cart-drawer__total-label">Итоговая цена:</span>
                    <span className="cart-drawer__total-value">{total.toLocaleString('ru-RU')}₽</span>
                  </div>
                  <p className="cart-drawer__form-title">
                    ЗАПОЛНИТЕ ФОРМУ, МЫ СВЯЖЕМСЯ<br />С ВАМИ В БЛИЖАЙШЕЕ ВРЕМЯ
                  </p>
                  <input
                    className="cart-drawer__input"
                    placeholder="Как вас зовут?"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                  <input
                    className="cart-drawer__input"
                    placeholder="@никнейм в тг"
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                  />
                  <button
                    className="cart-drawer__submit"
                    onClick={handleSubmit}
                    disabled={submitting || items.length === 0}
                  >
                    {submitting ? 'ОТПРАВЛЯЕМ...' : 'SUBMIT'}
                  </button>
                  {error && (
                    <p className="cart-drawer__error">⚠️ {error}</p>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
