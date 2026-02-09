import './CatalogItem.css';

const CatalogItem = ({ name, backgroundImage }) => {
  return (
    <div 
      className="catalog-item"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundColor: backgroundImage ? 'lightgray' : 'lightgray', // Цвет фона, если изображения нет
      }}
    >
      {/* Если нужно отобразить имя, раскомментируй: */}
      {/* <h3 className="catalog-item__name">{name}</h3> */}
    </div>
  );
};

export default CatalogItem;