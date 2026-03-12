import './CatalogList.css';
import CatalogItem from '../CatalogItem/CatalogItem';
import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import { useCart } from '../../context/CartContext';
import { createPayment } from '../../api';
import Rectangle from '../../assets/Rectangle.svg';

const CatalogList = (props) => {
  const {
    catalog = [],
    expanded = false,
    showTitle = true,
  } = props;

  const { initDataRaw } = useUser();
  const { addToCart } = useCart();
  const [selectedId, setSelectedId] = useState(null);
  const [payingId, setPayingId] = useState(null);

  const normalizedCatalog = useMemo(() => catalog.map(item => ({
    id: item.ID,
    name: item.name || 'Без названия',
    description: item.description || '',
    fullDescription: item.full_description || '',
    price: item.price != null ? String(item.price) : '',
    backgroundImage: item.image_url || Rectangle,
    type: item.type || '',
  })), [catalog]);

  const displayedCatalog = expanded ? normalizedCatalog : normalizedCatalog.slice(0, 2);

  const handleBuy = useCallback(async (itemId) => {
    if (!initDataRaw) {
      console.warn('initDataRaw недоступен — пользователь не авторизован');
      return;
    }
    setPayingId(itemId);
    try {
      const data = await createPayment(itemId, initDataRaw);
      if (data.confirmation_url) {
        if (window.Telegram?.WebApp?.openLink) {
          window.Telegram.WebApp.openLink(data.confirmation_url);
        } else {
          window.location.href = data.confirmation_url;
        }
      }
    } catch (err) {
      console.error('Ошибка создания платежа:', err);
      if (window.Telegram?.WebApp?.showAlert) {
        window.Telegram.WebApp.showAlert(`Ошибка оплаты: ${err.message}`);
      }
    } finally {
      setPayingId(null);
    }
  }, [initDataRaw]);

  const selectedItem = normalizedCatalog.find(i => i.id === selectedId);

  return (
    <div className="catalog-list">
      {showTitle && (
        <div className="catalog-list__header">
          <h2 className="catalog-list__title">Наши услуги</h2>
          <Link to="/catalog" className="catalog-list__link">Каталог</Link>
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
              isExpanded={false}
              isPaying={payingId === item.id}
              onClick={() => setSelectedId(item.id)}
              onBuy={() => handleBuy(item.id)}
              onAddToCart={() => addToCart({ id: item.id, name: item.name, price: parseFloat(item.price) || 0, image: item.backgroundImage })}
            />
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedId && selectedItem && (
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
                id={selectedItem.id}
                name={selectedItem.name}
                backgroundImage={selectedItem.backgroundImage}
                description={selectedItem.description}
                fullDescription={selectedItem.fullDescription}
                price={selectedItem.price}
                isExpanded={true}
                isPaying={payingId === selectedId}
                onClose={() => setSelectedId(null)}
                onBuy={() => handleBuy(selectedId)}
                onAddToCart={() => { addToCart({ id: selectedItem.id, name: selectedItem.name, price: parseFloat(selectedItem.price) || 0, image: selectedItem.backgroundImage }); setSelectedId(null); }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CatalogList;
