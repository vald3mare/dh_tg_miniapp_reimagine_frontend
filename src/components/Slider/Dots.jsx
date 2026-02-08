import { useContext } from 'react';
import { SliderContext } from './SliderContext';

const Dots = () => {
  const { current, goTo, slideCount } = useContext(SliderContext);

  return (
    <ul className="slider__dots">
      {Array.from({ length: slideCount }).map((_, idx) => (
        <li key={idx}>
          <button
            className={`slider__dot ${idx === current ? 'slider__dot--active' : ''}`}
            onClick={() => goTo(idx)}
            aria-label={`Перейти к слайду ${idx + 1}`}
            aria-current={idx === current ? 'true' : 'false'}
          ></button>
        </li>
      ))}
    </ul>
  );
};

export default Dots;