import './CatalogList.css';
import CatalogItem from '../CatalogItem/CatalogItem';
import { useState } from 'react';
import { motion, AnimatePresence } from "motion/react"

const CatalogList = ({ catalog = [], expanded = false, showTitle = true }) => {
  const [selectedId, setSelectedId] = useState(null);
  const displayedCatalog = expanded ? catalog : catalog.slice(0, 4);

  return (
    <div className="catalog-list">
      {showTitle && (
        <div className="catalog-list__header">
          <h2 className="catalog-list__title">Наши услуги</h2>
          <a href="/catalog" className="catalog-list__link">Каталог &gt;</a>
        </div>
      )}
      <div className="catalog-list__items">
        {displayedCatalog.map((item) => (
          selectedId !== item.id ? (
            <CatalogItem
              key={item.id}
              id={item.id}
              name={item.name}
              backgroundImage={item.image_url}
              description={item.description}
              price={item.price}
              onClick={() => setSelectedId(item.id)}
            />
          ) : null
        ))}
      </div>
      <AnimatePresence>
        {selectedId && (
          <motion.div
            className="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedId(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'relative' }}
            >
              <CatalogItem
                key={selectedId}
                id={selectedId}
                {...catalog.find((item) => item.id === selectedId)}
                isExpanded={true}
                onClose={() => setSelectedId(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CatalogList;