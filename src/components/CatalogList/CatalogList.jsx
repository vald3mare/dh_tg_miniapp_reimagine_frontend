import './CatalogList.css';
import CatalogItem from '../CatalogItem/CatalogItem';
import CatalogModal from './CatalogModal';
import { useState, useMemo, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useCart } from '../../context/CartContext';
import { createPayment } from '../../api';
import { tgAlert, tgOpenLink } from '../../utils/tg';
import Rectangle from '../../assets/Rectangle.svg';


// Wrapper мемоизирован: перерисовывается только когда меняется конкретный item или isPaying
const CatalogRow = memo(({ item, isPaying, onSelect, onBuy, onAddToCart }) => (
  <CatalogItem
    id={item.id}
    name={item.name}
    backgroundImage={item.backgroundImage}
    description={item.description}
    fullDescription={item.fullDescription}
    price={item.price}
    isExpanded={false}
    isPaying={isPaying}
    onClick={() => onSelect(item.id)}
    onBuy={() => onBuy(item.id)}
    onAddToCart={() => onAddToCart(item)}
  />
));

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

  const handleSelect    = useCallback((id) => setSelectedId(id), []);
  const handleModalClose = useCallback(() => setSelectedId(null), []);
  const handleModalAddToCart = useCallback((item) => {
    handleAddToCart(item);
    setSelectedId(null);
  }, [handleAddToCart]);

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
          <CatalogRow
            key={item.id}
            item={item}
            isPaying={payingId === item.id}
            onSelect={handleSelect}
            onBuy={handleBuy}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      <CatalogModal
        item={selectedItem}
        payingId={payingId}
        onClose={handleModalClose}
        onBuy={handleBuy}
        onAddToCart={handleModalAddToCart}
      />
    </div>
  );
};

export default memo(CatalogList);
