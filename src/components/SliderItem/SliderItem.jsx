import './SliderItem.css';

/*
 * SliderItem — баннер-карточка в стиле Vivid Paws.
 * Картинка-иллюстрация справа — серый плейсхолдер, заменяется реальным
 * изображением из /public/images/ когда оно будет готово.
 */
const SliderItem = ({ title, subtitle, buttonText, buttonLink }) => (
  <div className="slider-item">
    {/* Декоративные блобы (абсолютные — исключение, только для фоновых элементов) */}
    <div className="slider-item__blob slider-item__blob--lg" aria-hidden="true" />
    <div className="slider-item__blob slider-item__blob--sm" aria-hidden="true" />

    {/* Текст и CTA слева */}
    <div className="slider-item__content">
      <h2 className="slider-item__title">
        {title || 'Первая прогулка\nбесплатно!'}
      </h2>
      <p className="slider-item__subtitle">
        {subtitle || 'Для новых пользователей'}
      </p>
      {buttonText && (
        <a href={buttonLink || '#'} className="slider-item__btn">
          {buttonText}
        </a>
      )}
      {!buttonText && (
        <button className="slider-item__btn">Попробовать</button>
      )}
    </div>

    {/* Плейсхолдер иллюстрации справа */}
    <div className="slider-item__image" aria-hidden="true" />
  </div>
);

export default SliderItem;
