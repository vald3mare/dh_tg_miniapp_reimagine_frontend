import Header from '../components/Header/Header';
import CatalogList from '../components/CatalogList/CatalogList';
import { useCatalog } from '../hooks/useCatalog';

const Catalog = () => {
  const { catalog, loading, error } = useCatalog();

  if (loading) return <p>Загрузка каталога...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div className='catalog-page'>
      <Header />
      <CatalogList
        catalog={catalog}
        expanded={true}
        showTitle={false}
      />
    </div>
  );
};

export default Catalog;
