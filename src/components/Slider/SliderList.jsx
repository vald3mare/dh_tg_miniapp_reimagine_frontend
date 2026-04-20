import { useContext, useState } from 'react';
import { SliderContext } from './SliderContext';

const SWIPE_THRESHOLD = 40;

const SliderList = () => {
  const { current, slides, next, prev } = useContext(SliderContext);
  const [touchStart, setTouchStart] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setDragging(true);
  };

  const handleTouchMove = (e) => {
    if (touchStart === null) return;
    const offset = e.targetTouches[0].clientX - touchStart;
    setDragOffset(offset);
  };

  const handleTouchEnd = () => {
    if (dragOffset < -SWIPE_THRESHOLD) next();
    else if (dragOffset > SWIPE_THRESHOLD) prev();
    setDragOffset(0);
    setDragging(false);
    setTouchStart(null);
  };

  return (
    <div className="slider__window">
      <div
        className="slider__list"
        style={{
          transform: `translateX(calc(-${current * 100}% + ${dragOffset}px))`,
          transition: dragging ? 'none' : 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
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
