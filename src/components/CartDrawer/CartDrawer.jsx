import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';
import { customerCreateOrder } from '../../api';
import Rectangle from '../../assets/Rectangle.svg';
import './CartDrawer.css';

const UNDO_DURATION = 3000;
const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const Btn = ({ className, onClick, disabled, children, tapScale = 0.93, rotate = 0 }) => (
  <motion.button
    className={className}
    onClick={onClick}
    disabled={disabled}
    whileTap={{ scale: tapScale, rotate }}
    transition={{ type: 'spring', stiffness: 500, damping: 28 }}
  >
    {children}
  </motion.button>
);

const CartDrawer = () => {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, clearCart, restoreItems, total } = useCart();
  const { user, initDataRaw } = useUser();

  const [name, setName]         = useState(user ? (`${user.first_name || ''} ${user.last_name || ''}`).trim() : '');
  const [contact, setContact]   = useState(user?.username ? `@${user.username}` : '');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState(null);

  const [undoSnapshot, setUndoSnapshot] = useState(null);
  const [undoProgress, setUndoProgress] = useState(1);
  const timerRef = useRef(null);

  /* Запускаем обратный отсчёт когда появляется снапшот */
  useEffect(() => {
    if (!undoSnapshot) return;

    const start = Date.now();
    setUndoProgress(1);

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const prog = Math.max(0, 1 - elapsed / UNDO_DURATION);
      setUndoProgress(prog);
      if (elapsed >= UNDO_DURATION) {
        clearInterval(timerRef.current);
        const wasLast = undoSnapshot.wasLast;
        setUndoSnapshot(null);
        if (wasLast) closeCart();
      }
    }, 50);

    return () => clearInterval(timerRef.current);
  }, [undoSnapshot]);

  const handleRemove = (itemId) => {
    clearInterval(timerRef.current);
    setUndoSnapshot({ items: [...items], wasLast: items.length === 1 });
    removeFromCart(itemId);
  };

  const handleUpdateQty = (itemId, qty) => {
    if (qty <= 0) {
      clearInterval(timerRef.current);
      setUndoSnapshot({ items: [...items], wasLast: items.length === 1 });
    }
    updateQuantity(itemId, qty);
  };

  const handleUndo = () => {
    clearInterval(timerRef.current);
    restoreItems(undoSnapshot.items);
    setUndoSnapshot(null);
    setUndoProgress(1);
  };

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
    clearInterval(timerRef.current);
    setUndoSnapshot(null);
    closeCart();
    setSubmitted(false);
    setError(null);
  };

  const hasUndo      = undoSnapshot !== null;
  const showUndoFull = hasUndo && items.length === 0;   // последний — большой по центру
  const showUndoBanner = hasUndo && items.length > 0;   // не последний — компактная полоска
  const showEmpty    = !hasUndo && items.length === 0;
  const secondsLeft  = Math.ceil(undoProgress * (UNDO_DURATION / 1000));
  const dashOffset   = CIRCUMFERENCE * (1 - undoProgress);

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
              <Btn className="cart-drawer__close" onClick={handleClose} tapScale={0.85} rotate={90}>×</Btn>
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
                  {/* Компактный баннер для не-последнего товара */}
                  <AnimatePresence>
                    {showUndoBanner && (
                      <motion.div
                        className="cart-undo-banner"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="cart-undo-banner__circle-wrap">
                          <svg width="32" height="32" style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="16" cy="16" r="12" fill="none" stroke="#f0e0f7" strokeWidth="3" />
                            <circle
                              cx="16" cy="16" r="12"
                              fill="none" stroke="#EA6CCB" strokeWidth="3"
                              strokeLinecap="round"
                              strokeDasharray={2 * Math.PI * 12}
                              strokeDashoffset={2 * Math.PI * 12 * (1 - undoProgress)}
                              style={{ transition: 'stroke-dashoffset 0.05s linear' }}
                            />
                          </svg>
                          <span className="cart-undo-banner__seconds">{secondsLeft}</span>
                        </div>
                        <span className="cart-undo-banner__label">Товар удалён</span>
                        <Btn className="cart-undo-banner__btn" onClick={handleUndo} tapScale={0.92}>
                          Отменить
                        </Btn>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Большой undo для последнего товара */}
                  {showUndoFull && (
                    <div className="cart-undo">
                      <div className="cart-undo__circle-wrap">
                        <svg width="72" height="72" style={{ transform: 'rotate(-90deg)' }}>
                          <circle
                            cx="36" cy="36" r={RADIUS}
                            fill="none" stroke="#f0f0f0" strokeWidth="4"
                          />
                          <circle
                            cx="36" cy="36" r={RADIUS}
                            fill="none" stroke="#EA6CCB" strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={CIRCUMFERENCE}
                            strokeDashoffset={dashOffset}
                            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
                          />
                        </svg>
                        <span className="cart-undo__seconds">{secondsLeft}</span>
                      </div>
                      <p className="cart-undo__label">Последний товар удалён</p>
                      <Btn className="cart-undo__btn" onClick={handleUndo} tapScale={0.95}>
                        Отменить
                      </Btn>
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
                      <motion.div
                        className="cart-item"
                        key={item.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.22, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                      >
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
                          <Btn
                            className="cart-item__qty-btn"
                            onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                            tapScale={0.82}
                          >−</Btn>
                          <span>{item.quantity}</span>
                          <Btn
                            className="cart-item__qty-btn"
                            onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                            tapScale={0.82}
                          >+</Btn>
                        </div>
                        <p className="cart-item__price">{(item.price * item.quantity).toLocaleString('ru-RU')}₽</p>
                        <Btn
                          className="cart-item__remove"
                          onClick={() => handleRemove(item.id)}
                          tapScale={0.8}
                          rotate={90}
                        >✕</Btn>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Форма */}
                <div className="cart-drawer__form-section">
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
                  <Btn
                    className="cart-drawer__submit"
                    onClick={handleSubmit}
                    disabled={submitting || items.length === 0}
                    tapScale={0.97}
                  >
                    {submitting ? 'ОТПРАВЛЯЕМ...' : 'SUBMIT'}
                  </Btn>
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
