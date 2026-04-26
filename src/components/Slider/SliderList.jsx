import { useContext, useRef } from 'react';
import { SliderContext } from './SliderContext';

const SWIPE_THRESHOLD = 40;
const SLIDE_TRANSITION = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)';

const SliderList = () => {
  const { current, slides, next, prev } = useContext(SliderContext);
  const listRef      = useRef(null);
  const touchStartX  = useRef(null);
  const dragOffset   = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return;
    const offset = e.targetTouches[0].clientX - touchStartX.current;
    dragOffset.current = offset;
    if (listRef.current) {
      listRef.current.style.transition = 'none';
      listRef.current.style.transform  = `translateX(calc(-${current * 100}% + ${offset}px))`;
    }
  };

  const handleTouchEnd = () => {
    const offset = dragOffset.current;
    if (offset < -SWIPE_THRESHOLD) next();
    else if (offset > SWIPE_THRESHOLD) prev();
    if (listRef.current) {
      listRef.current.style.transition = SLIDE_TRANSITION;
      listRef.current.style.transform  = `translateX(-${current * 100}%)`;
    }
    touchStartX.current = null;
    dragOffset.current  = 0;
  };

  return (
    <div className="slider__window">
      <div
        ref={listRef}
        className="slider__list"
        style={{
          transform:  `translateX(-${current * 100}%)`,
          transition: SLIDE_TRANSITION,
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
