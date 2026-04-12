import { AnimatePresence, motion } from 'framer-motion';
import CatalogItem from '../CatalogItem/CatalogItem';

/*
 * Анимация модального окна: backdrop появляется через opacity,
 * карточка — через scale (0.92 → 1) + opacity.
 *
 * Такой подход быстрее и надёжнее, чем layoutId shared layout animation:
 * нет переноса элемента между DOM-позициями, нет конфликта с overflow:hidden
 * на промежуточных контейнерах, нет артефакта «срезанных углов».
 */
const BACKDROP_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const CARD_VARIANTS = {
  hidden: { opacity: 0, scale: 0.92, y: 12 },
  visible: { opacity: 1, scale: 1,    y: 0  },
  exit:   { opacity: 0, scale: 0.95, y: 8   },
};

const CatalogModal = ({ item, payingId, onClose, onBuy, onAddToCart }) => (
  <AnimatePresence>
    {item && (
      <motion.div
        key="backdrop"
        className="catalog-modal__backdrop"
        variants={BACKDROP_VARIANTS}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{ duration: 0.2 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.55)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
      >
        <motion.div
          key="card"
          variants={CARD_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{ width: '90vw', maxWidth: 480 }}
        >
          <CatalogItem
            id={item.id}
            name={item.name}
            backgroundImage={item.backgroundImage}
            description={item.description}
            fullDescription={item.fullDescription}
            price={item.price}
            isExpanded
            isPaying={payingId === item.id}
            onClose={onClose}
            onBuy={() => onBuy(item.id)}
            onAddToCart={() => onAddToCart(item)}
          />
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default CatalogModal;
