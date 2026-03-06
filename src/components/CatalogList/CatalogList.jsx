import './CatalogList.css';
import CatalogItem from '../CatalogItem/CatalogItem';
import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import Rectangle from '../../assets/Rectangle.svg'

const CatalogList = (props) => {
  const {
    catalog = [],
    expanded = false,
    showTitle = true,
  } = props

  const [selectedId, setSelectedId] = useState(null)

  const normalizedCatalog = catalog.map(item => ({
    id: item.ID,
    name: item.name || 'Без названия',
    description: item.description || 'Заглушка описания',
    fullDescription: item.full_description || 'Заглушка',
    price: item.price != null ? String(item.price) : '',
    backgroundImage: item.image_url || Rectangle,
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

      <motion.div className="catalog-list__items" layout> 
        {displayedCatalog.map((item) => (
          <motion.div key={item.id} layout>
            <CatalogItem
              id={item.id}
              name={item.name}
              backgroundImage={item.backgroundImage}
              description={item.description}
              fullDescription={item.fullDescription}
              price={item.price}
              onClick={() => setSelectedId(item.id)}
              isExpanded={false}
            />
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedId && (
          <motion.div
            className="backdrop"
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
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
              style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh', overflow: 'hidden' }}
            >
              <CatalogItem
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
  )
}

export default CatalogList;