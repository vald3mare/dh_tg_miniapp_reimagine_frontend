import './Profileblock.css';
import { motion } from 'framer-motion';

const ProfileBlock = (props) => {
    const {
      id,
      title,
      buttonLink,
      buttonText,
      name,
      description,
      fullname,
      tgnickname
    } = props

  return (
    <motion.div 
      className="profile"
      layoutId="header"
    >
      {/* Заголовок профиля (перетекает из хедера) */}
      <motion.h1 
        className="profile__title" 
        layoutId="profile-header-title"
      >
        Профиль
      </motion.h1>

      {/* Аватар (перетекает из хедера) */}
      <motion.div 
        className="profile__avatar" 
        layoutId="profile-avatar"
      />

      <div className="profile__info">
        <motion.h2 
          className="profile__fullname" 
          layoutId="profile-fullname"
        >
          Имя Фамилия /
        </motion.h2>
        <p className="profile__nickname">@tgnickname</p>
        <p className="profile__subscription">Подписка активна до 31.05.2026</p>
      </div>

      {/* Кнопка внизу (как в вашем дизайне) */}
      <button className="profile__button">
        Управление подпиской
      </button>

      {/* Секция Заказы */}
      <div className="profile__orders">
        <h3 className="profile__orders-title">Заказы</h3>
        {/* Здесь будут заказы */}
      </div>
    </motion.div>
  );
};

export default ProfileBlock;