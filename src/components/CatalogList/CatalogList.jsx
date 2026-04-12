import './CatalogList.css';
import CatalogItem from '../CatalogItem/CatalogItem';
import CatalogModal from './CatalogModal';
import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useCart } from '../../context/CartContext';
import { createPayment } from '../../api';
import { tgAlert, tgOpenLink } from '../../utils/tg';
import Rectangle from '../../assets/Rectangle.svg';

/*
 * motion.div с layout-пропом убран — он вызывал пересчёт layout всего дерева
 * при любом изменении стейта (selectedId, payingId), что давало заметный лаг
 * на мобильных устройствах.
 * Теперь используются обычные div; анимация открытия карточки работает
 * через layoutId в самом CatalogItem (shared element transition).
 * react.dev/learn/keeping-components-pure — рендер должен быть быстрым и без побочных эффектов.
 */
const CatalogList = ({
  catalog = [],
  expanded = false,
  showTitle = true,
  carousel = false,
}) => {
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

  /* В карусели показываем все карточки; в сетке — все или 2 первых */
  const displayedCatalog = carousel || expanded
    ? normalizedCatalog
    : normalizedCatalog.slice(0, 2);

  const handleBuy = useCallback(async (itemId) => {
    if (!initDataRaw) return;
    setPayingId(itemId);
    try {
      const data = await createPayment(itemId, initDataRaw);
      if (data.confirmation_url) tgOpenLink(data.confirmation_url);
    } catch (err) {
      console.error('Ошибка создания платежа:', err);
      tgAlert(`Ошибка оплаты: ${err.message}`);
    } finally {
      setPayingId(null);
    }
  }, [initDataRaw]);

  const handleAddToCart = useCallback((item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price) || 0,
      image: item.backgroundImage,
    });
  }, [addToCart]);

  const selectedItem = normalizedCatalog.find(i => i.id === selectedId);

  return (
    <div className="catalog-list">
      {showTitle && (
        <div className="catalog-list__header">
          <h2 className="catalog-list__title">Наши услуги</h2>
          <Link to="/catalog" className="catalog-list__link">Каталог →</Link>
        </div>
      )}

      <div className={`catalog-list__items${carousel ? ' catalog-list__items--carousel' : ''}`}>
        {displayedCatalog.map((item) => (
          <CatalogItem
            key={item.id}
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
            onAddToCart={() => handleAddToCart(item)}
          />
        ))}
      </div>

      <CatalogModal
        item={selectedItem}
        payingId={payingId}
        onClose={() => setSelectedId(null)}
        onBuy={handleBuy}
        onAddToCart={(item) => {
          handleAddToCart(item);
          setSelectedId(null);
        }}
      />
    </div>
  );
};

export default CatalogList;
