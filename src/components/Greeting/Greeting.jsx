import './Greeting.css';
import { motion } from "motion/react"

const dogUrl = 'https://s3.twcstorage.ru/dh-s3-storage/Dog.png';

const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const Greeting = () => {
  return (
    <div className='greeting'>
        <motion.div className='greeting__title-container'
            variants={childVariants}
        >
            <h2 className='greeting__title'>Привет!</h2>
            <p className='greeting__description'>Рады Вас видеть!</p>
        </motion.div>
        <motion.div className="welcome-blob1" 
            initial={{opacity: 0}}
            animate={{opacity: 0.12}}
            transition={{
                duration: 0.6,
            }}
        />
        <motion.div className="welcome-blob2" 
            initial={{opacity: 0}}
            animate={{opacity: 0.12}}
            transition={{
                duration: 0.7,
            }}
        />
        <div className='dog-image'>
            <motion.img 
                src={dogUrl} 
                alt="dog-image"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{
                    duration: 0.9,
                }}
            />
        </div>
    </div>
  )
}

export default Greeting;