import { AnimatePresence, motion } from 'framer-motion';
import CatalogItem from '../CatalogItem/CatalogItem';

const CatalogModal = ({ item, payingId, onClose, onBuy, onAddToCart }) => (
  <AnimatePresence>
    {item && (
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.12 }}
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
        <div
          style={{ width: '90vw', maxWidth: 480 }}
          onClick={e => e.stopPropagation()}
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
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default CatalogModal;
