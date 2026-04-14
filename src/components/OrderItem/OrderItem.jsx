import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import { acceptOrder } from '../../api';
import './OrderItem.css';
import { tgAlert } from '../../utils/tg';

// Выносим константу на уровень модуля — не пересоздаётся на каждый рендер
const SERVICE_EMOJI = {
  'Выгул': '🐕',
  'Зооняня': '🏠',
  'Кинолог': '🎓',
  'Передержка': '🛏️',
  'Ветеринар': '💊',
};

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
      tgAlert(`Ошибка: ${err.message}`);
    } finally {
      setAccepting(false);
    }
  };

  const emoji = Object.entries(SERVICE_EMOJI).find(([k]) =>
    order.service_type?.includes(k)
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
        <span className="order-item__type">{order.service_type || 'Услуга'}</span>
        {order.price > 0 && (
          <span className="order-item__price">{order.price}₽</span>
        )}
      </div>

      {order.description && (
        <p className="order-item__description">{order.description}</p>
      )}

      {order.customer_name && (
        <p className="order-item__customer">Клиент: {order.customer_name}</p>
      )}

      {order.scheduled_at && (
        <p className="order-item__date">
          {new Date(order.scheduled_at).toLocaleDateString('ru-RU', {
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
