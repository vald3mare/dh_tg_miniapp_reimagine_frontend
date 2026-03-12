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
              <p className="admin-section__title">Заявки</p>
              <StatRow label="Всего" value={stats.orders?.total ?? 0} />
              <StatRow label="Открытые" value={stats.orders?.open ?? 0} />
              <StatRow label="В работе" value={stats.orders?.accepted ?? 0} />
              <StatRow label="Выполнены" value={stats.orders?.done ?? 0} />
            </div>

            <div className="admin-section">
              <p className="admin-section__title">Платежи</p>
              <StatRow label="Всего" value={stats.payments?.total ?? 0} />
              <StatRow label="Успешных" value={stats.payments?.succeeded ?? 0} />
            </div>

            <div className="admin-section">
              <p className="admin-section__title">Каталог</p>
              <StatRow label="Услуг в каталоге" value={stats.catalog?.total ?? 0} />
            </div>

            {stats.top_services?.length > 0 && (
              <div className="admin-section">
                <p className="admin-section__title">Топ услуг (по оплатам)</p>
                {stats.top_services.map((s, i) => (
                  <StatRow key={i} label={s.Name} value={`${s.Count} шт`} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default AdminStats;
