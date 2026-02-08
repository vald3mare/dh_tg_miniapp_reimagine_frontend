import { useContext, useState } from 'react';
import { SliderContext } from './SliderContext';

const SliderList = () => {
  const { current, slides, next, prev } = useContext(SliderContext);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 150) {
      next();
    }

    if (touchStart - touchEnd < -150) {
      prev();
    }
  };

  return (
    <div className="slider__window">
      <div
        className="slider__list"
        style={{ transform: `translateX(-${current * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {slides}
      </div>
    </div>
  );
};

export default SliderList;