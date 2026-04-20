import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import './RolePicker.css';

const ROLE_CONFIG = {
  customer: {
    emoji: '🛒',
    label: 'Покупатель',
    desc: 'Каталог услуг, оплата, корзина',
    path: '/home',
  },
  executor: {
    emoji: '🐾',
    label: 'Исполнитель',
    desc: 'Лента заявок, ачивки, профиль',
    path: '/executor/home',
  },
  admin: {
    emoji: '👑',
    label: 'Администратор',
    desc: 'Управление каталогом, пользователями и статистикой',
    path: '/admin',
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, when: 'beforeChildren', staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

const RolePicker = () => {
  const navigate = useNavigate();
  const { roles, setActiveRole } = useUser();

  const handlePick = (roleKey) => {
    setActiveRole(roleKey);
    navigate(ROLE_CONFIG[roleKey].path, { replace: true });
  };

  // Показываем только те роли, что есть у пользователя
  const availableRoles = Object.keys(ROLE_CONFIG).filter(r => roles.includes(r));

  return (
    <motion.div
      className="role-picker"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="role-picker__header" variants={cardVariants}>
        <span className="role-picker__logo">🐶</span>
        <h1 className="role-picker__title">Выберите режим</h1>
        <p className="role-picker__sub">У вас несколько ролей — выберите, в каком режиме войти</p>
      </motion.div>

      <div className="role-picker__cards">
        {availableRoles.map((roleKey) => {
          const cfg = ROLE_CONFIG[roleKey];
          return (
            <motion.button
              key={roleKey}
              className={`role-picker__card role-picker__card--${roleKey}`}
              variants={cardVariants}
              whileTap={{ scale: 0.97 }}
              onClick={() => handlePick(roleKey)}
            >
              <span className="role-picker__card-emoji">{cfg.emoji}</span>
              <div className="role-picker__card-text">
                <span className="role-picker__card-label">{cfg.label}</span>
                <span className="role-picker__card-desc">{cfg.desc}</span>
              </div>
              <span className="role-picker__card-arrow">→</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RolePicker;
