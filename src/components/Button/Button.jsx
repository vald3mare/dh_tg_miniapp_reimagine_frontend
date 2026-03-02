import './Button.css';
import { motion } from "motion/react"

const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const Button = ({text}) => {
  return (
    <motion.div className='welcome-btn' variants={childVariants}>
        <button className='welcome-btn__button'>{text}</button>
    </motion.div>
  )
}

export default Button;