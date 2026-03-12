import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { fetchAchievements } from '../../api';
import AchievementCard from '../AchievementCard/AchievementCard';
import './ExecutorProfile.css';

const ExecutorProfile = () => {
  const { user, initDataRaw } = useUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!initDataRaw) { setLoading(false); return; }
    fetchAchievements(initDataRaw)
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [initDataRaw]);

  const ordersCompleted = data?.orders_completed ?? 0;
  const rating = data?.rating ?? 0;
  const achievements = data?.achievements ?? [];

  const earnedCount = achievements.filter(a => a.earned).length;
  const nextAchievement = achievements.find(a => !a.earned && a.ConditionType === 'orders_completed');
  const progress = nextAchievement
    ? Math.min((ordersCompleted / nextAchievement.Threshold) * 100, 100)
    : 100;

  const avatarUrl = user?.PhotoURL || user?.photo_url;
  const name = [user?.FirstName || user?.first_name, user?.LastName || user?.last_name]
    .filter(Boolean).join(' ') || 'Исполнитель';

  return (
    <div className="executor-profile">
      <div className="executor-profile__card">
        {avatarUrl ? (
          <img className="executor-profile__avatar" src={avatarUrl} alt={name} />
        ) : (
          <div className="executor-profile__avatar executor-profile__avatar--placeholder">
            {name.charAt(0)}
          </div>
        )}
        <div className="executor-profile__info">
          <h2 className="executor-profile__name">{name}</h2>
          <span className="executor-profile__role">Исполнитель</span>
        </div>
      </div>

      <div className="executor-profile__stats">
        <div className="executor-profile__stat">
          <span className="executor-profile__stat-value">{ordersCompleted}</span>
          <span className="executor-profile__stat-label">Заказов</span>
        </div>
        <div className="executor-profile__stat">
          <span className="executor-profile__stat-value">{rating > 0 ? rating.toFixed(1) : '—'}</span>
          <span className="executor-profile__stat-label">Рейтинг</span>
        </div>
        <div className="executor-profile__stat">
          <span className="executor-profile__stat-value">{earnedCount}</span>
          <span className="executor-profile__stat-label">Ачивок</span>
        </div>
      </div>

      {nextAchievement && (
        <div className="executor-profile__progress-block">
          <div className="executor-profile__progress-label">
            <span>До «{nextAchievement.Name}»</span>
            <span>{ordersCompleted} / {nextAchievement.Threshold}</span>
          </div>
          <div className="executor-profile__progress-bar">
            <div
              className="executor-profile__progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="executor-profile__achievements">
        <h3 className="executor-profile__section-title">Достижения</h3>
        {loading ? (
          <p className="executor-profile__loading">Загрузка...</p>
        ) : achievements.length === 0 ? (
          <p className="executor-profile__empty">Выполняйте заказы, чтобы получать ачивки</p>
        ) : (
          achievements.map(a => (
            <AchievementCard key={a.ID} achievement={a} />
          ))
        )}
      </div>
    </div>
  );
};

export default ExecutorProfile;
