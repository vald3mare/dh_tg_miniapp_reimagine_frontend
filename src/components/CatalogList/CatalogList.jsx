import './CatalogList.css';
import CatalogItem from '../CatalogItem/CatalogItem';
import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";

const CatalogList = ({ catalog = [], expanded = false, showTitle = true }) => {
  const [selectedId, setSelectedId] = useState(null);

  // Нормализация данных из БД (ID → id, image_url → backgroundImage и т.д.)
  const normalizedCatalog = catalog.map(item => ({
    id: item.ID || item.id,
    name: item.name || 'Без названия',
    description: item.description || '',
    price: item.price != null ? String(item.price) : '',
    backgroundImage: item.image_url || '',
    type: item.type || '',
  }));

  const displayedCatalog = expanded ? normalizedCatalog : normalizedCatalog.slice(0, 2);

  return (
    <div className="catalog-list">
      {showTitle && (
        <div className="catalog-list__header">
          <h2 className="catalog-list__title">Наши услуги</h2>
          <a href="/catalog" className="catalog-list__link">Каталог</a>
        </div>
      )}

      <div className="catalog-list__items">
        {displayedCatalog.map((item) => (
          <CatalogItem
            key={item.id}
            id={item.id}
            name={item.name}
            backgroundImage={item.backgroundImage}
            description={item.description}
            price={item.price}
            onClick={() => setSelectedId(item.id)}
            isExpanded={false}
          />
        ))}
      </div>

      <AnimatePresence mode="popLayout">
        {selectedId && (
          <motion.div
            className="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setSelectedId(null)}
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
              style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh', overflow: 'auto' }}
            >
              <CatalogItem
                key={`expanded-${selectedId}`}
                id={selectedId}
                {...normalizedCatalog.find(i => i.id === selectedId)}
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