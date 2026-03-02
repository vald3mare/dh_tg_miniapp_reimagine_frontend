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

const WelcomeDemo = () => {
  return (
    <motion.div className='welcome-page'
        variants={containerVariants}
        initial="hidden"
        animate="visible"
    >   
        <Logo/>
        <Greeting />
        <Button text="Заказчикам"/>
        <Button text="Исполнителям"/>
        {/* Кнопка 2 */}
    </motion.div>
  )
}

export default WelcomeDemo;