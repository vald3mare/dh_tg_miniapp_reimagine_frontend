import './UserPreview.css';
import ellipse from '../../assets/profile_skeleton.svg';
import { useUser } from '../../context/UserContext';
import * as m from 'motion/react-m';

/*
 * layoutId здесь сохранён для анимации перехода Home → Profile.
 * Важно: layoutId без layout-пропа не вызывает непрерывного пересчёта layout —
 * анимация срабатывает только при монтировании/размонтировании.
 * react.dev/learn/sharing-state-between-components
 */
const UserPreview = () => {
  const { user } = useUser();

  const displayName = user
    ? (`${user.first_name || ''} ${user.last_name || ''}`).trim() || user.username || 'Пользователь'
    : 'Пользователь';

  const displaySub = user
    ? (user.username ? `@${user.username}` : '📍 Санкт-Петербург')
    : '';

  const photoSrc = user?.photo_url || ellipse;

  return (
    <div className="user-preview">
      <div className="user-preview__inner">
        <m.img
          className="user-preview__icon"
          src={photoSrc}
          alt="Фото пользователя"
          layoutId="profile-avatar"
        />
        <div className="user-preview__info">
          <m.span
            className="user-preview__name"
            layoutId="profile-fullname"
          >
            {displayName}
          </m.span>
          <span className="user-preview__sub">{displaySub}</span>
        </div>
      </div>
    </div>
  );
};

export default UserPreview;
