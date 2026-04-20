import { useNavigate } from 'react-router-dom';
import * as m from 'motion/react-m';
import { useUser } from '../context/UserContext';
import { setRole } from '../api';
import { hapticMedium } from '../utils/tg';
import './Welcome.css';

const PAW_ICON_URL  = '/images/paw.svg';
const DOG_IMAGE_URL = '/images/dog.svg';

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, when: 'beforeChildren', staggerChildren: 0.2 },
  },
};

const childVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};


const Welcome = () => {
  const navigate = useNavigate();
  const { user, initDataRaw } = useUser();

  const handleCustomer = () => {
    hapticMedium();
    if (initDataRaw) setRole('customer', initDataRaw).catch(() => {});
    navigate('/home');
  };

  const handleExecutor = () => {
    hapticMedium();
    if (initDataRaw) setRole('executor', initDataRaw).catch(() => {});
    navigate('/executor/home');
  };

  return (
    <m.div
      className="welcome"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: 10, transition: { duration: 0.15, ease: 'easeIn' } }}
    >
      {/* ── Blue hero ── */}
      <div className="welcome__hero">
        <div className="welcome__blob welcome__blob--left" />
        <div className="welcome__blob welcome__blob--right" />
        <div className="welcome__blob welcome__blob--top-right" />

        <m.div className="welcome__header" variants={childVariants}>
          <img className="welcome__paw" src={PAW_ICON_URL} alt="🐾" />
          <h2 className="welcome__brand">СОБАЧЬЕ СЧАСТЬЕ</h2>
        </m.div>

        <m.div className="welcome__greeting" variants={childVariants}>
          <h1 className="welcome__greeting-title">Привет!</h1>
          <p className="welcome__greeting-subtitle">
            <span className="accent">Рады</span>{' Вас видеть!'}
          </p>
        </m.div>

        {/*<div className="welcome__divider" />*/}

        <m.div className="welcome__dog-wrap" variants={childVariants}>
          {DOG_IMAGE_URL
            ? <img className="welcome__dog" src={DOG_IMAGE_URL} alt="собака" />
            : <div className="welcome__dog-placeholder">🐕</div>
          }
        </m.div>
      </div>

      {/* ── White bottom section ── */}
      <m.div className="welcome__bottom" variants={childVariants}>
        <p className="welcome__prompt">Я здесь как</p>

        <m.button
          className="welcome__btn welcome__btn--primary"
          whileTap={{ scale: 0.97 }}
          onClick={handleCustomer}
        >
          Хозяин питомца
        </m.button>

        <m.button
          className="welcome__btn welcome__btn--ghost"
          whileTap={{ scale: 0.95 }}
          onClick={handleExecutor}
        >
          Исполнитель
        </m.button>

        <span className="welcome__badge">Популярное</span>
        <p className="welcome__ad-text">
          какой-то дополнительный рекламный текст текст текст текст
        </p>
      </m.div>
    </m.div>
  );
};

export default Welcome;
