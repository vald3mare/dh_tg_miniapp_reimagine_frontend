import './Button.css';
import { motion } from 'motion/react';

const Button = (props) => {
  const {
    text = '',
    className = '',
    childVariants = '',
    onClick,
    disabled = false,
  } = props;

  return (
    <motion.button
      className={className}
      variants={childVariants}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </motion.button>
  );
};

export default Button;
