import './Button.css';
import { motion } from 'motion/react';

const Button = ({ text = '', className = '', childVariants = '', onClick, disabled = false }) => (
  <motion.button
    className={className}
    variants={childVariants}
    onClick={onClick}
    disabled={disabled}
    whileTap={{ scale: 0.96 }}
    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
  >
    {text}
  </motion.button>
);

export default Button;
