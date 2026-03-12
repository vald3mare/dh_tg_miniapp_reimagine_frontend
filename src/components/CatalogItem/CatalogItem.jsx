import './CatalogItem.css';
import { motion } from 'framer-motion';
import Button from '../Button/Button';

const CatalogItem = (props) => {
  const {
    id,
    name,
    price,
    description = '',
    fullDescription = '',
    backgroundImage,
    isExpanded = false,
    isPaying = false,
    onClick,
    onClose,
    onBuy,
    onAddToCart = () => console.log('В корзину'),
  } = props;

  return (
    <motion.div
      className={`catalog-item ${isExpanded ? 'catalog-item--expanded' : ''}`}
      layoutId={`item-${id}`}
      layout
      onClick={!isExpanded ? onClick : undefined}
      transition={{ duration: 0.35, type: 'spring' }}
    >
      {/* ==================== КОМПАКТНАЯ КАРТОЧКА ==================== */}
      {!isExpanded && (
        <>
          <div className="catalog-item__image-bg" style={{ backgroundImage: `url(${backgroundImage})` }} />
          <div className="catalog-item__overlay">
            <h3 className="catalog-item__name">{name}</h3>
            <p className="catalog-item__description">
              {description.slice(0, 100)}{description.length > 100 ? '...' : ''}
            </p>
            <p className="catalog-item__price">{price} ₽</p>
          </div>
          <button className="catalog-item__add-to-cart" onClick={(e) => { e.stopPropagation(); onAddToCart(); }}>+</button>
        </>
      )}

      {/* ==================== РАСКРЫТАЯ КАРТОЧКА ==================== */}
      {isExpanded && (
        <>
          <div className="catalog-item__header">
            <button className="catalog-item__close" onClick={onClose}>×</button>
          </div>

          <div className="catalog-item__image-wrapper">
            <img src={backgroundImage} alt={name} className="catalog-item__image" />
          </div>

          <div className="catalog-item__body">
            <h3 className="catalog-item__name--expanded">{name}</h3>
            <p className="catalog-item__description--expanded">{description}</p>

            <div className="catalog-item__additional">
              {fullDescription.split('\n').map((line, i) => (
                <p key={i}>{line.trim() || <br />}</p>
              ))}
            </div>

            <div className="catalog-item__actions">
              <Button
                className="catalog-item__buy-btn"
                text={isPaying ? 'Оформляем...' : 'Купить в 1 клик'}
                onClick={onBuy}
                disabled={isPaying}
              />
              <button className="catalog-item__cart-btn" onClick={onAddToCart}>
                🛒
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default CatalogItem;
