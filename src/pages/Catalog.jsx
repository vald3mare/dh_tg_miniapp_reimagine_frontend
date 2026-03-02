import Header from "../components/Header/Header";
import CatalogList from "../components/CatalogList/CatalogList";
import { useState, useEffect } from 'react';

const Catalog = () => {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://vald3mare-dh-tg-miniapp-reimagine-backend-e40f.twc1.net/catalog')
      .then(res => {
        if (!res.ok) throw new Error(`Ошибка ${res.status}`);
        return res.json();
      })
      .then(data => {
        setCatalog(data.items || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
        console.error(err);
      });
  }, []);

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