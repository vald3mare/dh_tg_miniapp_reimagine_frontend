import './Greeting.css';
import { motion } from "motion/react"
import Button from '../Button/Button';
import '../Button/Button.css'

const dogUrl = '/images/dog.svg';

const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const Greeting = () => {
  return (
    <div className='greeting'>
        <m.div className='greeting__title-container'
            variants={childVariants}
        >
            <h2 className='greeting__title'>Привет!</h2>
            <p className='greeting__description'>Рады Вас видеть!</p>
        </m.div>
        <m.div className="welcome-blob1" 
            initial={{opacity: 0}}
            animate={{opacity: 0.12}}
            transition={{
                duration: 0.6,
            }}
        />
        <m.div className="welcome-blob2" 
            initial={{opacity: 0}}
            animate={{opacity: 0.12}}
            transition={{
                duration: 0.7,
            }}
        />
        {/*<div className='dog-image'>
            <m.img 
                src={dogUrl} 
                alt="dog-image"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{
                    duration: 0.9,
                }}
            />
        </div>*/}
    </div>
  )
}

export default Greeting;