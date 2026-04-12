import { useContext } from 'react';
import { SliderContext } from './SliderContext';

/*
 * Dots — индикаторы слайдов.
 *
 * Анимация «пилюли» реализована через CSS transition (width + background),
 * а не через framer-motion layoutId/layout.
 *
 * Причина: layout-пропы framer-motion вызывают getBoundingClientRect()
 * на каждый рендер и перестройку layout всего поддерева — это замедляет
 * страницу на мобильных устройствах.
 * CSS transition выполняется на GPU без участия JS-потока.
 * react.dev/learn/you-might-not-need-an-effect — предпочитай CSS там, где он справляется.
 */
const Dots = () => {
  const { current, goTo, slideCount } = useContext(SliderContext);

  return (
    <ul className="slider__dots" role="tablist" aria-label="Слайды">
      {Array.from({ length: slideCount }).map((_, idx) => (
        <li key={idx} className="slider__dot-wrapper" role="presentation">
          <button
            className={`slider__dot${idx === current ? ' slider__dot--active' : ''}`}
            role="tab"
            aria-selected={idx === current}
            aria-label={`Слайд ${idx + 1}`}
            onClick={() => goTo(idx)}
          />
        </li>
      ))}
    </ul>
  );
};

export default Dots;
