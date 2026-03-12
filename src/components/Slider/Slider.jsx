import { useEffect, useState, useCallback, Children, cloneElement } from 'react';
import { SliderContext } from './SliderContext';
import SliderList from './SliderList';
import Dots from './Dots';
import './Slider.css';

export const Slider = (props) => {
  const {
    children,
    autoPlay = false,
    autoPlayTime = 3000,
  } = props;

  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const slideCount = Children.count(children);

  useEffect(() => {
    setSlides(
      Children.map(children, (child, idx) =>
        cloneElement(child, {
          className: 'slider__item',
          key: idx,
          style: { ...child.props.style, height: '100%' },
        })
      )
    );
  }, [children]);

  const prev = useCallback(() =>
    setCurrent(curr => (curr === 0 ? slideCount - 1 : curr - 1)),
    [slideCount]
  );

  const next = useCallback(() =>
    setCurrent(curr => (curr === slideCount - 1 ? 0 : curr + 1)),
    [slideCount]
  );

  const goTo = useCallback((idx) => setCurrent(idx), []);

  useEffect(() => {
    if (!autoPlay || slideCount === 0) return;
    const interval = setInterval(next, autoPlayTime);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayTime, slideCount, next]);

  return (
    <SliderContext.Provider value={{ current, slides, prev, next, goTo, slideCount }}>
      <div className="slider" role="region" aria-label="Слайдер">
        <SliderList />
        <Dots />
      </div>
    </SliderContext.Provider>
  );
};
