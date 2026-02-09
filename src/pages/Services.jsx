import Header from "../components/Header/Header";
import ServicesList from "../components/ServicesList/ServicesList";

const Services = () => {
  return (
    <div className='services-page'>
      <Header />
      <ServicesList 
        services={[
          { id: 1, name: 'Услуга 1', backgroundImage: '/path/to/your-svg.svg' },
          { id: 2, name: 'Услуга 2', backgroundImage: '/path/to/another-svg.svg' },
          { id: 3, name: 'Услуга 3', backgroundImage: '/path/to/another-svg.svg' },
          { id: 4, name: 'Услуга 4', backgroundImage: '/path/to/another-svg.svg' },
          { id: 5, name: 'Услуга 5', backgroundImage: '/path/to/another-svg.svg' },
          { id: 6, name: 'Услуга 6', backgroundImage: '/path/to/another-svg.svg' },
        ]}
        expanded={true}
      />
    </div>
  );
};

export default Services;