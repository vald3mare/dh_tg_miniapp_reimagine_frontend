import './CatalogItem.css';

const CatalogItem = ({ key, name, price, description, backgroundImage }) => {
  return (
    <div 
      className="catalog-item"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundColor: backgroundImage ? 'lightgray' : 'lightgray', // Цвет фона, если изображения нет
      }}
    >
      <h3 className="catalog-item__name">{name}</h3>
      <p className='catalog-item_description'>{description}</p>
      <p className='catalog-item_price'>{price}</p>
      <p className='catalog-item_key'>{key}</p>
    </div>
  );
};

export default CatalogItem;