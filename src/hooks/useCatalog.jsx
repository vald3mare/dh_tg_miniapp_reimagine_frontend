import { useState, useEffect } from 'react';
import { fetchCatalog } from '../api';

/**
 * Хук для загрузки каталога услуг.
 * Используется в Home и Catalog — один источник истины.
 */
export function useCatalog() {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCatalog()
      .then(data => {
        setCatalog(data.items || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { catalog, loading, error };
}
