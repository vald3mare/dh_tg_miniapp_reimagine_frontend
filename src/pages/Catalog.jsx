import Header from "../components/Header/Header";
import CatalogList from "../components/CatalogList/CatalogList";

const Catalog = () => {
  return (
    <div className='catalog-page'>
      <Header />
      <CatalogList 
        catalog={[
          { id: 1, name: 'Услуга 1', backgroundImage: '/path/to/your-svg.svg' },
          { id: 2, name: 'Услуга 2', backgroundImage: '/path/to/another-svg.svg' },
          { id: 3, name: 'Услуга 3', backgroundImage: '/path/to/another-svg.svg' },
          { id: 4, name: 'Услуга 4', backgroundImage: '/path/to/another-svg.svg' },
          { id: 5, name: 'Услуга 5', backgroundImage: '/path/to/another-svg.svg' },
          { id: 6, name: 'Услуга 6', backgroundImage: '/path/to/another-svg.svg' },
          { id: 7, name: 'Услуга 7', backgroundImage: '/path/to/another-svg.svg' },
          { id: 8, name: 'Услуга 8', backgroundImage: '/path/to/another-svg.svg' },
        ]}
        expanded={true}
        showTitle={false}
      />
    </div>
  );
};

export default Catalog;