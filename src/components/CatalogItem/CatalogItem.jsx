import './CatalogItem.css';
import { motion } from "framer-motion"

const CatalogItem = (props) => {
    const {
      id,
      name,
      price,
      description,
      fullDescription='',
      backgroundImage,
      isExpanded = false,
      onClick,
      onClose,
    } = props

    return (
      <motion.div
        className={`catalog-item ${isExpanded ? 'catalog-item--expanded' : ''}`}
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          backgroundColor: backgroundImage ? 'lightgray' : 'lightgray',
        }}
        layoutId={`item-${id}`} // Shared ID для морфинга
        layout
        onClick={!isExpanded ? onClick : undefined}
        transition={{ duration: 0.4, type: 'spring' }} // Spring для bouncy вылета
      >
        <motion.h3 className="catalog-item__name" layout>
          {name}
        </motion.h3>
        <motion.p className="catalog-item__description" layout>
          {isExpanded ? description : `${description.slice(0, 100)}...`}
        </motion.p>
        <motion.p className="catalog-item__price" layout>
          {price}
        </motion.p>
        {isExpanded && (
          <>
            <motion.button
              className="catalog-item__close"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              onClick={onClose}
            >
              ×
            </motion.button>
            <motion.div
              className="catalog-item__additional"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {fullDescription.split('\n').map((line, index) => (
                <p key={index} className='catalog-item__additional-description'>{line.trim() || <br />}</p>
              ))}
            </motion.div>
          </>
        )}
      </motion.div>
    )
}

export default CatalogItem;