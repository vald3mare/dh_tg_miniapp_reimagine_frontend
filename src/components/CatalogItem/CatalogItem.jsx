import './CatalogItem.css';
import { motion } from 'framer-motion';
import Button from '../Button/Button';

/*
 * Палитра фонов для image-area: назначается по id карточки (id % length),
 * чтобы каждая услуга имела свой цвет-плейсхолдер.
 * Когда изображения появятся в /public/images/ — заменяем <div> на <img>.
 */
const PLACEHOLDER_COLORS = ['#E8EDFF', '#FFE0F7', '#E8F5E9', '#FFF3E0'];

/*
 * layout-проп убран — он вызывал getBoundingClientRect() на каждый рендер
 * и перестройку layout у всех соседних элементов (layout thrashing).
 * layoutId оставлен — он нужен только для анимации открытия модального окна
 * (shared element transition между карточкой и CatalogModal).
 * react.dev/reference/react/useState — стейт должен быть минимальным.
 */
const CatalogItem = ({
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
  onAddToCart = () => {},
}) => {
  const placeholderBg = PLACEHOLDER_COLORS[id % PLACEHOLDER_COLORS.length] ?? '#E8EDFF';

  return (
    <motion.div
      className={`catalog-item${isExpanded ? ' catalog-item--expanded' : ''}`}
      /*
       * layoutId убран — shared layout animation переносит элемент через всё
       * DOM-дерево, и любой overflow:hidden на промежуточных контейнерах
       * обрезает карточку во время перехода (артефакт «срезанных углов»).
       *
       * Вместо этого анимация открытия/закрытия сделана в CatalogModal
       * через scale + opacity — без переноса между DOM-позициями.
       * Это быстрее, предсказуемее и без артефактов на мобиле.
       */
      onClick={!isExpanded ? onClick : undefined}
      whileTap={!isExpanded ? { scale: 0.97 } : undefined}
      transition={{ duration: 0.15 }}
    >
      {/* ── Компактная карточка ── */}
      {!isExpanded && (
        <>
          <div
            className="catalog-item__image-area"
            style={{ background: placeholderBg }}
          />
          <div className="catalog-item__content">
            <p className="catalog-item__name">{name}</p>
            <p className="catalog-item__description">
              {description.length > 60 ? `${description.slice(0, 60)}…` : description}
            </p>
            <div className="catalog-item__footer">
              <button
                className="catalog-item__add-btn"
                onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
              >
                В корзину
              </button>
              <span className="catalog-item__price">{price} ₽</span>
            </div>
          </div>
        </>
      )}

      {/* ── Раскрытая карточка (в модальном окне) ── */}
      {isExpanded && (
        <>
          <button className="catalog-item__close" onClick={onClose} aria-label="Закрыть">
            ×
          </button>
          <div
            className="catalog-item__image-area catalog-item__image-area--expanded"
            style={{ background: placeholderBg }}
          />
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
                text={isPaying ? 'Оформляем…' : 'Купить в 1 клик'}
                onClick={onBuy}
                disabled={isPaying}
              />
              <button className="catalog-item__cart-btn" onClick={onAddToCart} aria-label="В корзину">
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
