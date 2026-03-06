import './Button.css';
import { motion } from "motion/react"
import React from 'react'

const Button = (props) => {
  const {
    text = '',
    className = '',
    childVariants = '',
  } = props

  return (
    <>
      <motion.button 
        className={className}
        variants={childVariants}
      >
        {text}
      </motion.button>
    </>
  )
}

export default Button;