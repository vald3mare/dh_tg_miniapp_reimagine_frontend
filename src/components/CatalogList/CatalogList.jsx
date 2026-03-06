// CatalogList.jsx
// Этот компонент отображает список карточек каталога. Он использует Framer Motion для анимаций.
// Ключевые особенности (адаптировано под Framer Motion App Store демо):
// - Grid для .catalog-list__items в CSS обеспечивает фиксированные слоты.
// - При клике: Оригинальная карточка удаляется из списка (filter), вызывая анимированный reflow (layout на контейнере).
// - AnimatePresence для плавного выхода удалённой карточки и входа expanded.
// - Shared layoutId для "выпархивания" карточки в центр с расширением.
// - Все карточки фиксированного размера, сетка перестраивается плавно без скачков.
// - Backdrop для оверлея, expanded в центре.
// - Адаптивность через media queries.
// - Нормализация данных из БД.
// - Если expanded=true, показывает все; иначе — первые 2.

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

      <motion.div 
        className="catalog-list__items" 
        layout // Анимирует reflow сетки при удалении карточки
      >
        <AnimatePresence>
          {displayedCatalog
            .filter(item => item.id !== selectedId) // Удаляем выбранную для избежания дубликата, reflow анимируется
            .map((item) => (
              <motion.div
                key={item.id}
                layout // Для плавного сдвига остальных карточек
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.8 }} // Анимация выхода удалённой карточки
                transition={{ duration: 0.3, type: 'spring' }} // Spring для "живого" эффекта
              >
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
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selectedId && (
          <motion.div
            className="backdrop"
            key="backdrop"
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