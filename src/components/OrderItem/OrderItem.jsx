import { memo, useState } from 'react';
import * as m from 'motion/react-m';
import { useUser } from '../../context/UserContext';
import { acceptOrder } from '../../api';
import './OrderItem.css';
import { tgAlert } from '../../utils/tg';

const SERVICE_EMOJI = {
  'Выгул': '🐕',
  'Зооняня': '🏠',
  'Кинолог': '🎓',
  'Передержка': '🛏️',
  'Ветеринар': '💊',
};

const ITEM_INITIAL    = { opacity: 0, y: 12 };
const ITEM_ANIMATE    = { opacity: 1, y: 0 };
const ITEM_TRANSITION = { duration: 0.3, ease: 'easeOut' };
const WHILETAP        = { scale: 0.95 };

const OrderItem = memo(({ order, onAccepted }) => {
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
    <m.div
      className="order-item"
      initial={ITEM_INITIAL}
      animate={ITEM_ANIMATE}
      transition={ITEM_TRANSITION}
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

      <m.button
        className="order-item__btn"
        onClick={handleAccept}
        disabled={accepting}
        whileTap={WHILETAP}
      >
        {accepting ? 'Принимаем...' : 'Взять заявку'}
      </m.button>
    </m.div>
  );
});

export default OrderItem;
