import './Button.css';
import * as m from 'motion/react-m';

const Button = ({ text = '', className = '', childVariants = '', onClick, disabled = false }) => (
  <m.button
    className={className}
    variants={childVariants}
    onClick={onClick}
    disabled={disabled}
    whileTap={{ scale: 0.96 }}
    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
  >
    {text}
  </m.button>
);

export default Button;
