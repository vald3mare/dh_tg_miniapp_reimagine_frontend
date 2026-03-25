import { AnimatePresence, motion } from 'framer-motion';
import CatalogItem from '../CatalogItem/CatalogItem';

const CatalogModal = ({ item, payingId, onClose, onBuy, onAddToCart }) => (
  <AnimatePresence>
    {item && (
      <motion.div
        className="backdrop"
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh', overflow: 'hidden' }}
        >
          <CatalogItem
            id={item.id}
            name={item.name}
            backgroundImage={item.backgroundImage}
            description={item.description}
            fullDescription={item.fullDescription}
            price={item.price}
            isExpanded={true}
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
