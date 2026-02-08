import { useContext } from 'react';
import { SliderContext } from './SliderContext';

const Arrows = () => {
  const { prev, next } = useContext(SliderContext);

  return (
    <nav className="slider__arrows">
      <button className="slider__arrow slider__arrow--prev" onClick={prev} aria-label="Предыдущий слайд">
        &lt;
      </button>
      <button className="slider__arrow slider__arrow--next" onClick={next} aria-label="Следующий слайд">
        &gt;
      </button>
    </nav>
  );
};

export default Arrows;