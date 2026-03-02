import './CatalogItem.css';
import { motion } from "motion/react"

const CatalogItem = ({ id, name, price, description, backgroundImage, isExpanded = false, onClick, onClose }) => {
  return (
    <motion.div
      className={`catalog-item ${isExpanded ? 'expanded' : ''}`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundColor: backgroundImage ? 'lightgray' : 'lightgray',
      }}
      layoutId={`item-${id}`}
      layout
      onClick={!isExpanded ? onClick : undefined}
      transition={{ duration: 0.3 }}
    >
      <motion.h3 className="catalog-item__name" layout>
        {name}
      </motion.h3>
      <motion.p className="catalog-item_description" layout>
        {description}
      </motion.p>
      <motion.p className="catalog-item_price" layout>
        {price}
      </motion.p>
      {isExpanded && (
        <>
          <motion.button
            className="catalog-item__close"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={onClose}
          >
            ×
          </motion.button>
          <motion.div
            className="catalog-item__additional"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Здесь добавьте дополнительную информацию, которая не влезала в мини-версию. 
                Для примера: */}
            <p>Полное описание услуги, детали, условия и т.д.</p>
            {/* Если есть дополнительные поля в объекте item, отобразите их здесь */}
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default CatalogItem;