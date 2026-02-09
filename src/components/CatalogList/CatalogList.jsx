import './CatalogList.css';
import CatalogItem from '../CatalogItem/CatalogItem';

const CatalogList = ({ catalog = [], expanded = false, showTitle = true }) => {
  const displayedcatalog = expanded ? catalog : catalog.slice(0, 4);

  return (
    <div className="catalog-list">
      {showTitle && (
        <div className="catalog-list__header">
          <h2 className="catalog-list__title">Наши услуги</h2>
          <a href="/catalog" className="catalog-list__link">Каталог &gt;</a>
        </div>
      )}
      <div className="catalog-list__items">
        {displayedcatalog.map((item) => (
          <CatalogItem
            key={item.id}
            name={item.name}
            backgroundImage={item.image_url}
          />
        ))}
      </div>
    </div>
  );
};

export default CatalogList;