import { useState, useCallback, useMemo } from 'react';
import OrderItem from '../OrderItem/OrderItem';
import './OrderList.css';

const OrderList = ({ orders = [], showTitle = true, limit }) => {
  const [removedIds, setRemovedIds] = useState(() => new Set());

  const handleAccepted = useCallback((id) => {
    setRemovedIds(prev => { const s = new Set(prev); s.add(id); return s; });
  }, []);

  const visible = useMemo(() => {
    const filtered = removedIds.size > 0 ? orders.filter(o => !removedIds.has(o.ID)) : orders;
    return limit ? filtered.slice(0, limit) : filtered;
  }, [orders, removedIds, limit]);

  if (visible.length === 0) {
    return (
      <div className="order-list order-list--empty">
        <p>Нет открытых заявок</p>
      </div>
    );
  }

  return (
    <div className="order-list">
      {showTitle && (
        <div className="order-list__header">
          <h2 className="order-list__title">Заявки</h2>
        </div>
      )}
      {visible.map(order => (
        <OrderItem key={order.ID} order={order} onAccepted={handleAccepted} />
      ))}
    </div>
  );
};

export default OrderList;
