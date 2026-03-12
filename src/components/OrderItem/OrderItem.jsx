import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import { acceptOrder } from '../../api';
import './OrderItem.css';

const OrderItem = ({ order, onAccepted }) => {
  const { initDataRaw } = useUser();
  const [accepting, setAccepting] = useState(false);

  const handleAccept = async () => {
    if (!initDataRaw) return;
    setAccepting(true);
    try {
      await acceptOrder(order.ID, initDataRaw);
      onAccepted?.(order.ID);
    } catch (err) {
      console.error('Ошибка при принятии заявки:', err);
      if (window.Telegram?.WebApp?.showAlert) {
        window.Telegram.WebApp.showAlert(`Ошибка: ${err.message}`);
      }
    } finally {
      setAccepting(false);
    }
  };

  const serviceEmoji = {
    'Выгул': '🐕',
    'Зооняня': '🏠',
    'Кинолог': '🎓',
    'Передержка': '🛏️',
    'Ветеринар': '💊',
  };

  const emoji = Object.entries(serviceEmoji).find(([k]) =>
    order.ServiceType?.includes(k)
  )?.[1] || '🐾';

  return (
    <motion.div
      className="order-item"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="order-item__header">
        <span className="order-item__emoji">{emoji}</span>
        <span className="order-item__type">{order.ServiceType || 'Услуга'}</span>
        {order.Price > 0 && (
          <span className="order-item__price">{order.Price}₽</span>
        )}
      </div>

      {order.Description && (
        <p className="order-item__description">{order.Description}</p>
      )}

      {order.CustomerName && (
        <p className="order-item__customer">Клиент: {order.CustomerName}</p>
      )}

      {order.ScheduledAt && (
        <p className="order-item__date">
          {new Date(order.ScheduledAt).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      )}

      <motion.button
        className="order-item__btn"
        onClick={handleAccept}
        disabled={accepting}
        whileTap={{ scale: 0.95 }}
      >
        {accepting ? 'Принимаем...' : 'Взять заявку'}
      </motion.button>
    </motion.div>
  );
};

export default OrderItem;
