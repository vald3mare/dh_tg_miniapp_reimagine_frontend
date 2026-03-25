import { useState, useEffect } from 'react';
import OrderItem from '../OrderItem/OrderItem';
import './OrderList.css';

const OrderList = ({ orders = [], showTitle = true, limit }) => {
  const [localOrders, setLocalOrders] = useState(orders);

  // Синхронизируем с пропом при обновлении данных от родителя
  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  const displayed = limit ? localOrders.slice(0, limit) : localOrders;

  const handleAccepted = (id) => {
    setLocalOrders(prev => prev.filter(o => o.ID !== id));
  };

  if (localOrders.length === 0) {
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
      {displayed.map(order => (
        <OrderItem key={order.ID} order={order} onAccepted={handleAccepted} />
      ))}
    </div>
  );
};

export default OrderList;
