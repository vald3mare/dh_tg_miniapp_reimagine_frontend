import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Logo from '../components/Logo/Logo';
import Greeting from '../components/Greeting/Greeting';
import Button from '../components/Button/Button';
import { useUser } from '../context/UserContext';
import { setRole } from '../api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, when: 'beforeChildren', staggerChildren: 0.2 },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const Welcome = () => {
  const navigate = useNavigate();
  const { user, initDataRaw, roles, effectiveRole, loading } = useUser();

  // Если пользователь уже авторизован — редиректим по эффективной роли
  if (!loading && user) {
    if (roles.length > 1 && !effectiveRole) return <Navigate to="/role-picker" replace />;
    if (effectiveRole === 'admin')    return <Navigate to="/admin" replace />;
    if (effectiveRole === 'executor') return <Navigate to="/executor/home" replace />;
    if (effectiveRole === 'customer') return <Navigate to="/home" replace />;
  }

  const handleCustomer = () => {
    if (initDataRaw) setRole('customer', initDataRaw).catch(() => {});
    navigate('/home');
  };

  const handleExecutor = () => {
    if (initDataRaw) setRole('executor', initDataRaw).catch(() => {});
    navigate('/executor/home');
  };

  return (
    <motion.div
      className='welcome-page'
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: 10, transition: { duration: 0.15, ease: 'easeIn' } }}
    >
      <Logo />
      <Greeting />
      <div className='welcome-page__btn-container'>
        <Button
          text="Заказчикам"
          className="welcome-btn__button"
          variants={childVariants}
          onClick={handleCustomer}
        />
        <Button
          text="Исполнителям"
          className="welcome-btn__button"
          variants={childVariants}
          onClick={handleExecutor}
        />
      </div>
    </motion.div>
  );
};

export default Welcome;
