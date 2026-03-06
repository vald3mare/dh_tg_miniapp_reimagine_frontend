import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react"
import Logo from '../components/Logo/Logo';
import Greeting from '../components/Greeting/Greeting'
import Button from '../components/Button/Button';

const logoUrl = 'https://s3.twcstorage.ru/dh-s3-storage/icons8-paw-100%201.svg';
const dogUrl = 'https://s3.twcstorage.ru/dh-s3-storage/Dog.png';

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

const WelcomeDemo = () => {
  return (
      <motion.div className='welcome-page'
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >   
        <Logo/>
        <Greeting />
        <div className='welcome-page__btn-container'>
          <Button text="Заказчикам" className="welcome-btn__button" variants={childVariants}/>
          <Button text="Исполнителям" className="welcome-btn__button" variants={childVariants}/>
        </div>
        {/* Кнопка 2 */}
      </motion.div>
  )
}

export default WelcomeDemo;