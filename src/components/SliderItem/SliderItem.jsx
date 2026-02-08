import './SliderItem.css';

const SliderItem = ({ image, title, subtitle, buttonText, buttonLink }) => {
  return (
    <div className='slider-item'
        style={{ backgroundImage: image ? `url(${image})` : 'none', backgroundColor: image ? 'transparent' : '#5C6BC0' }}
    >
      <h2>{title}</h2>
      <p>{subtitle}</p>
      <a href={buttonLink} className='slider-button'>
        {buttonText}
      </a>
    </div>
  );
};

export default SliderItem;