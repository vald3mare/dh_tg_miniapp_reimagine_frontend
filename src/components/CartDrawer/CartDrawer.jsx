import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';
import { customerCreateOrder } from '../../api';
import Rectangle from '../../assets/Rectangle.svg';
import './CartDrawer.css';

const UNDO_DURATION    = 3000;
const RADIUS_BIG       = 26;
const RADIUS_SMALL     = 12;
const C_BIG            = 2 * Math.PI * RADIUS_BIG;
const C_SMALL          = 2 * Math.PI * RADIUS_SMALL;

const Btn = ({ className, onClick, disabled, children, tapScale = 0.93, rotate = 0 }) => (
  <m.button
    className={className}
    onClick={onClick}
    disabled={disabled}
    whileTap={{ scale: tapScale, rotate }}
    transition={{ type: 'spring', stiffness: 500, damping: 28 }}
  >
    {children}
  </m.button>
);

const CartDrawer = () => {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, clearCart, restoreItems, total } = useCart();
  const { user, initDataRaw } = useUser();

  const [name, setName]           = useState(user ? (`${user.first_name || ''} ${user.last_name || ''}`).trim() : '');
  const [contact, setContact]     = useState(user?.username ? `@${user.username}` : '');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState(null);

  const [undoSnapshot, setUndoSnapshot] = useState(null);
  const [secondsLeft, setSecondsLeft]   = useState(3);

  // Refs для прямого обновления SVG — без React ре-рендера каждый кадр
  const rafRef         = useRef(null);
  const circleBigRef   = useRef(null);
  const circleSmallRef = useRef(null);

  useEffect(() => {
    if (!undoSnapshot) return;

    const start = Date.now();
    let lastSecs = Math.ceil(UNDO_DURATION / 1000);
    setSecondsLeft(lastSecs);

    const tick = () => {
      const elapsed = Date.now() - start;
      const prog    = Math.max(0, 1 - elapsed / UNDO_DURATION);

      // Обновляем SVG напрямую — ноль React ре-рендеров
      if (circleBigRef.current)   circleBigRef.current.style.strokeDashoffset   = C_BIG   * (1 - prog);
      if (circleSmallRef.current) circleSmallRef.current.style.strokeDashoffset = C_SMALL * (1 - prog);

      // React state обновляем только при смене секунды (3 раза за всё время)
      const secs = Math.ceil(prog * (UNDO_DURATION / 1000));
      if (secs !== lastSecs) {
        lastSecs = secs;
        setSecondsLeft(secs);
      }

      if (elapsed >= UNDO_DURATION) {
        const wasLast = undoSnapshot.wasLast;
        setUndoSnapshot(null);
        if (wasLast) closeCart();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [undoSnapshot, closeCart]);

  const handleRemove = useCallback((itemId) => {
    cancelAnimationFrame(rafRef.current);
    setUndoSnapshot({ items: [...items], wasLast: items.length === 1 });
    removeFromCart(itemId);
  }, [items, removeFromCart]);

  const handleUpdateQty = useCallback((itemId, qty) => {
    if (qty <= 0) {
      cancelAnimationFrame(rafRef.current);
      setUndoSnapshot({ items: [...items], wasLast: items.length === 1 });
    }
    updateQuantity(itemId, qty);
  }, [items, updateQuantity]);

  const handleUndo = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    restoreItems(undoSnapshot.items);
    setUndoSnapshot(null);
  }, [undoSnapshot, restoreItems]);

  const handleClose = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setUndoSnapshot(null);
    closeCart();
    setSubmitted(false);
    setError(null);
  }, [closeCart]);

  const handleSubmit = useCallback(async () => {
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
  }, [name, contact, items, total, initDataRaw, clearCart]);

  const hasUndo        = undoSnapshot !== null;
  const showUndoFull   = hasUndo && items.length === 0;
  const showUndoBanner = hasUndo && items.length > 0;
  const showEmpty      = !hasUndo && items.length === 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          className="cart-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <m.div
            className="cart-drawer"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="cart-drawer__header">
              <h2 className="cart-drawer__title">ВАШ ЗАКАЗ 🐾</h2>
              <Btn className="cart-drawer__close" onClick={handleClose} tapScale={0.85} rotate={90}>×</Btn>
            </div>

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
                <div className="cart-drawer__items">
                  <AnimatePresence>
                    {showUndoBanner && (
                      <m.div
                        className="cart-undo-banner"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="cart-undo-banner__circle-wrap">
                          <svg width="32" height="32" style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="16" cy="16" r={RADIUS_SMALL} fill="none" stroke="#f0e0f7" strokeWidth="3" />
                            <circle
                              ref={circleSmallRef}
                              cx="16" cy="16" r={RADIUS_SMALL}
                              fill="none" stroke="#EA6CCB" strokeWidth="3"
                              strokeLinecap="round"
                              strokeDasharray={C_SMALL}
                              strokeDashoffset={0}
                            />
                          </svg>
                          <span className="cart-undo-banner__seconds">{secondsLeft}</span>
                        </div>
                        <span className="cart-undo-banner__label">Товар удалён</span>
                        <Btn className="cart-undo-banner__btn" onClick={handleUndo} tapScale={0.92}>
                          Отменить
                        </Btn>
                      </m.div>
                    )}
                  </AnimatePresence>

                  {showUndoFull && (
                    <div className="cart-undo">
                      <div className="cart-undo__circle-wrap">
                        <svg width="72" height="72" style={{ transform: 'rotate(-90deg)' }}>
                          <circle cx="36" cy="36" r={RADIUS_BIG} fill="none" stroke="#f0f0f0" strokeWidth="4" />
                          <circle
                            ref={circleBigRef}
                            cx="36" cy="36" r={RADIUS_BIG}
                            fill="none" stroke="#EA6CCB" strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={C_BIG}
                            strokeDashoffset={0}
                          />
                        </svg>
                        <span className="cart-undo__seconds">{secondsLeft}</span>
                      </div>
                      <p className="cart-undo__label">Последний товар удалён</p>
                      <Btn className="cart-undo__btn" onClick={handleUndo} tapScale={0.95}>Отменить</Btn>
                    </div>
                  )}

                  {showEmpty && (
                    <div className="cart-empty">
                      <p className="cart-empty__title">ВАША КОРЗИНА ПУСТА :(</p>
                      <p className="cart-empty__sub">Добавьте товар в корзину,<br />чтобы он отобразился тут.</p>
                    </div>
                  )}

                  <AnimatePresence initial={false}>
                    {items.map(item => (
                      <m.div
                        className="cart-item"
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.94 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                      >
                        <img className="cart-item__img" src={item.image || Rectangle} alt={item.name} loading="lazy" />
                        <div className="cart-item__info">
                          <p className="cart-item__name">{item.name}</p>
                          <p className="cart-item__sku">Арт: {String(item.id).padStart(3, '0')}</p>
                        </div>
                        <div className="cart-item__qty">
                          <Btn className="cart-item__qty-btn" onClick={() => handleUpdateQty(item.id, item.quantity - 1)} tapScale={0.82}>−</Btn>
                          <span>{item.quantity}</span>
                          <Btn className="cart-item__qty-btn" onClick={() => handleUpdateQty(item.id, item.quantity + 1)} tapScale={0.82}>+</Btn>
                        </div>
                        <p className="cart-item__price">{(item.price * item.quantity).toLocaleString('ru-RU')}₽</p>
                        <Btn className="cart-item__remove" onClick={() => handleRemove(item.id)} tapScale={0.8} rotate={90}>✕</Btn>
                      </m.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="cart-drawer__form-section">
                  <div className="cart-drawer__total-row">
                    <span className="cart-drawer__total-label">Итоговая цена:</span>
                    <span className="cart-drawer__total-value">{total.toLocaleString('ru-RU')}₽</span>
                  </div>
                  <p className="cart-drawer__form-title">
                    ЗАПОЛНИТЕ ФОРМУ, МЫ СВЯЖЕМСЯ<br />С ВАМИ В БЛИЖАЙШЕЕ ВРЕМЯ
                  </p>
                  <input className="cart-drawer__input" placeholder="Как вас зовут?" value={name} onChange={e => setName(e.target.value)} />
                  <input className="cart-drawer__input" placeholder="@никнейм в тг" value={contact} onChange={e => setContact(e.target.value)} />
                  <Btn
                    className="cart-drawer__submit"
                    onClick={handleSubmit}
                    disabled={submitting || items.length === 0}
                    tapScale={0.97}
                  >
                    {submitting ? 'ОТПРАВЛЯЕМ...' : 'SUBMIT'}
                  </Btn>
                  {error && <p className="cart-drawer__error">⚠️ {error}</p>}
                </div>
              </>
            )}
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
