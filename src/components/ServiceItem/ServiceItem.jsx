import './ServiceItem.css';

const ServiceItem = ({ name, backgroundImage }) => {
  return (
    <div 
      className="service-item"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundColor: backgroundImage ? 'lightgray' : 'lightgray',
      }}
    >
      {/* Если нужно отобразить имя, раскомментируй: */}
      {/* <h3 className="service-item__name">{name}</h3> */}
    </div>
  );
};

export default ServiceItem;