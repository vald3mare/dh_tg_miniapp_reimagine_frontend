import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { admin } from '../../api';
import PageTransition from '../../components/PageTransition/PageTransition';
import './admin.css';

const STATUS_OPTIONS = ['open', 'accepted', 'done', 'canceled'];

const AdminOrders = () => {
  const { initDataRaw } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    if (!initDataRaw) return;
    admin.getOrders(initDataRaw).then(d => { setOrders(d.orders || []); setLoading(false); });
  };

  useEffect(() => { load(); }, [initDataRaw]);

  const handleStatusChange = async (id, status) => {
    await admin.updateOrderStatus(id, status, initDataRaw);
    load();
  };

  return (
    <PageTransition>
      <div className="admin-page">
        <h1 className="admin-page-title">Заявки</h1>

        {loading && <p className="admin-empty">Загрузка...</p>}

        <div className="admin-section">
          {orders.length === 0 && !loading && <p className="admin-empty">Нет заявок</p>}
          {orders.map(order => (
            <div className="admin-list-item" key={order.ID} style={{ flexWrap: 'wrap', gap: 8 }}>
              <div className="admin-list-item__info">
                <div className="admin-list-item__name">
                  {order.ServiceType || 'Услуга'}
                  {order.Price > 0 && <span style={{ color: '#EA6CCB', marginLeft: 8 }}>{order.Price}₽</span>}
                </div>
                <div className="admin-list-item__sub">
                  {order.CustomerName && `${order.CustomerName} · `}
                  {order.Description || '—'}
                </div>
              </div>
              <select
                className="admin-input admin-input--small"
                style={{ width: 'auto' }}
                value={order.Status}
                onChange={e => handleStatusChange(order.ID, e.target.value)}
              >
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminOrders;
