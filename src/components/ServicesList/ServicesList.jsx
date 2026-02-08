import './ServicesList.css';
import ServiceItem from '../ServiceItem/ServiceItem';

const ServicesList = ({ services, expanded = false }) => {
  const displayedServices = expanded ? services : services.slice(0, 4);

  return (
    <div className="services-list">
      <div className="services-list__header">
        <h2 className="services-list__title">Наши услуги</h2>
        <a href="/catalog" className="services-list__link">Каталог &gt;</a>
      </div>
      <div className="services-list__items">
        {displayedServices.map((service) => (
          <ServiceItem
            key={service.id}
            name={service.name}
            backgroundImage={service.backgroundImage}
          />
        ))}
      </div>
    </div>
  );
};

export default ServicesList;