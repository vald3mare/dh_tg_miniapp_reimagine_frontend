import Header from '../components/Header/Header';
import CatalogList from '../components/CatalogList/CatalogList';
import CatalogListSkeleton from '../components/CatalogList/CatalogListSkeleton';
import PageTransition from '../components/PageTransition/PageTransition';
import { useCatalog } from '../hooks/useCatalog';

const Catalog = () => {
  const { catalog, loading, error } = useCatalog();

  return (
    <PageTransition>
      <div className='catalog-page'>
        <Header />
        {loading
          ? <CatalogListSkeleton count={4} showTitle={false} />
          : error
            ? <p>Ошибка: {error}</p>
            : <CatalogList catalog={catalog} expanded={true} showTitle={false} />
        }
      </div>
    </PageTransition>
  );
};

export default Catalog;
