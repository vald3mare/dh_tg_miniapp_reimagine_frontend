import './Logo.css';
import { motion } from "motion/react"

const logoUrl = '/images/paw.svg';

const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const Logo = () => {
  return (
    <div className='logo'>
        <m.img 
            className='logo__image'
            src={logoUrl}
            alt="logo"
            variants={childVariants}
        />
        <m.h2 className='logo__title' variants={childVariants}><span>СОБАЧЬЕ СЧАСТЬЕ</span></m.h2>
    </div>
  )
}

export default Logo;