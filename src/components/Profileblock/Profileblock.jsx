import './Profileblock.css';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import ellipse from '../../assets/profile_skeleton.svg';
import ProfileBlockSkeleton from './ProfileBlockSkeleton';

const ProfileBlock = () => {
  const { user, loading } = useUser();

  if (loading) return <ProfileBlockSkeleton />;

  const displayName = user
    ? (`${user.first_name || ''} ${user.last_name || ''}`).trim() || user.username || 'Имя пользователя'
    : 'Имя пользователя';
  const nickname = user?.username ? `@${user.username}` : '';
  const photoSrc = user?.photo_url || ellipse;

  return (
    <motion.div
      className="profile"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8, transition: { duration: 0.15, ease: 'easeIn' } }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
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
          {displayName}
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
