import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// S3/CDN URLs for fast dynamic load (replace with your actual URLs)
const logoUrl = 'https://s3.twcstorage.ru/dh-s3-storage/icons8-paw-100%201.svg';
const dogUrl = 'https://s3.twcstorage.ru/dh-s3-storage/Dog.png';

const Welcome = () => {
  const navigate = useNavigate();

  const handleOwnerClick = () => {
    navigate('/home');
  };

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

  return (
    <motion.div
      className="welcome-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="welcome-blob1" />
      <div className="welcome-blob2" />

      <motion.img
        src={logoUrl}
        alt="Собачье Счастье"
        className="welcome-logo"
        variants={childVariants}
      />

      <motion.div variants={childVariants} className="welcome-text-container">
        <h1 className="welcome-title">Привет!</h1>
        <h2 className="welcome-subtitle">Ради Вас увидели!</h2>
      </motion.div>

      <motion.button
        onClick={handleOwnerClick}
        className="welcome-button"
        variants={childVariants}
      >
        Хозяевам
      </motion.button>

      <motion.button
        className="welcome-button"
        variants={childVariants}
      >
        Исполнителям
      </motion.button>

      <motion.img
        src={dogUrl}
        alt="Dog"
        className="welcome-dog"
        variants={childVariants}
      />
    </motion.div>
  );
};

export default Welcome;