import './Profileblock.css';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import ellipse from '../../assets/profile_skeleton.svg';

const ProfileBlock = () => {
  const { user, loading } = useUser();

  const displayName = user
    ? `${user.FirstName || ''} ${user.LastName || ''}`.trim() || user.Username || 'Имя пользователя'
    : 'Имя пользователя';
  const nickname = user?.Username ? `@${user.Username}` : '';
  const photoSrc = user?.PhotoURL || ellipse;

  return (
    <motion.div
      className="profile"
      layoutId="header"
    >
      <motion.h1
        className="profile__title"
        layoutId="profile-header-title"
      >
        Профиль
      </motion.h1>

      <motion.img
        className="profile__avatar"
        layoutId="profile-avatar"
        src={photoSrc}
        alt="Аватар"
      />

      <div className="profile__info">
        <motion.h2
          className="profile__fullname"
          layoutId="profile-fullname"
        >
          {loading ? '...' : displayName}
        </motion.h2>
        {nickname && <p className="profile__nickname">{nickname}</p>}
        <p className="profile__subscription">Подписка активна до 31.05.2026</p>
      </div>

      <button className="profile__button">
        Управление подпиской
      </button>

      <div className="profile__orders">
        <h3 className="profile__orders-title">Заказы</h3>
      </div>
    </motion.div>
  );
};

export default ProfileBlock;
