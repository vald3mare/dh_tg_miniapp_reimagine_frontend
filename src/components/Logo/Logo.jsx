import './Logo.css';
import { motion } from "motion/react"

const logoUrl = 'https://s3.twcstorage.ru/dh-s3-storage/icons8-paw-100%201.svg';

const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const Logo = () => {
  return (
    <div className='logo'>
        <motion.img 
            className='logo__image'
            src={logoUrl}
            alt="logo"
            variants={childVariants}
        />
        <motion.h2 className='logo__title' variants={childVariants}><span>СОБАЧЬЕ СЧАСТЬЕ</span></motion.h2>
    </div>
  )
}

export default Logo;