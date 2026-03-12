import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { admin } from '../../api';
import PageTransition from '../../components/PageTransition/PageTransition';
import './admin.css';

const StatRow = ({ label, value }) => (
  <div className="admin-stat-row">
    <span className="admin-stat-row__label">{label}</span>
    <span className="admin-stat-row__value">{value}</span>
  </div>
);

const AdminStats = () => {
  const { initDataRaw } = useUser();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!initDataRaw) return;
    admin.getStats(initDataRaw)
      .then(d => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [initDataRaw]);

  return (
    <PageTransition>
      <div className="admin-page">
        <h1 className="admin-page-title">Статистика</h1>

        {loading && <p className="admin-empty">Загрузка...</p>}

        {stats && (
          <>
            <div className="admin-section">
              <p className="admin-section__title">Пользователи</p>
              <StatRow label="Всего" value={stats.users?.total ?? 0} />
              <StatRow label="Заказчики" value={stats.users?.customers ?? 0} />
              <StatRow label="Исполнители" value={stats.users?.executors ?? 0} />
            </div>

            <div className="admin-section">
              <p className="admin-section__title">Финансы</p>
              <StatRow
                label="Общий доход"
                value={`${(stats.payments?.total_revenue ?? 0).toLocaleString('ru-RU')} ₽`}
              />
              <StatRow label="Успешных платежей" value={stats.payments?.succeeded ?? 0} />
              <StatRow label="Всего платежей" value={stats.payments?.total ?? 0} />
            </div>

            <div className="admin-section">
              <p className="admin-section__title">Заявки</p>
              <StatRow label="Всего" value={stats.orders?.total ?? 0} />
              <StatRow label="Открытые" value={stats.orders?.open ?? 0} />
              <StatRow label="В работе" value={stats.orders?.accepted ?? 0} />
              <StatRow label="Выполнены" value={stats.orders?.done ?? 0} />
            </div>

            {stats.top_services?.length > 0 && (
              <div className="admin-section">
                <p className="admin-section__title">Топ услуг</p>
                {stats.top_services.map((s, i) => (
                  <StatRow key={i} label={s.name} value={`${s.count} шт`} />
                ))}
              </div>
            )}

            {stats.recent_payments?.length > 0 && (
              <div className="admin-section">
                <p className="admin-section__title">Последние транзакции</p>
                {stats.recent_payments.map(p => (
                  <div className="admin-stat-row" key={p.id}>
                    <span className="admin-stat-row__label" style={{ flex: 1 }}>
                      {p.description || `Платёж #${p.id}`}
                      <span style={{ display: 'block', fontSize: 11, color: '#aaa' }}>{p.created_at}</span>
                    </span>
                    <span className={`admin-stat-row__value ${p.status === 'succeeded' ? '' : 'admin-stat-row__value--muted'}`}>
                      {p.status === 'succeeded' ? '+' : ''}{p.amount} ₽
                    </span>
                  </div>
                ))}
              </div>
            )}

            {(!stats.recent_payments || stats.recent_payments.length === 0) && (
              <div className="admin-section">
                <p className="admin-section__title">Транзакции</p>
                <p className="admin-empty">Платежей пока нет</p>
              </div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default AdminStats;
