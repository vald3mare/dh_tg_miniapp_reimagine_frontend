import { useContext } from 'react';
import { motion } from 'framer-motion';
import { SliderContext } from './SliderContext';

const Dots = () => {
  const { current, goTo, slideCount } = useContext(SliderContext);

  return (
    <ul className="slider__dots">
      {Array.from({ length: slideCount }).map((_, idx) => (
        <motion.li 
          key={idx}
          layout
          className="slider__dot-wrapper"
        >
          <motion.button
            className={`slider__dot ${idx === current ? 'slider__dot--active' : ''}`}
            layoutId={idx === current ? 'active-dot' : undefined}
            onClick={() => goTo(idx)}
            aria-label={`Перейти к слайду ${idx + 1}`}
            aria-current={idx === current ? 'true' : 'false'}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 28,
              duration: 0.35,
            }}
          ></motion.button>
        </motion.li>
      ))}
    </ul>
  );
};

export default Dots;