import { useState, useEffect } from 'react';
import { fetchCatalog } from '../api';

const CACHE_KEY = 'dh_catalog';
const CACHE_TTL = 5 * 60 * 1000; // 5 минут

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { ts, items } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    return items;
  } catch {
    return null;
  }
}

function writeCache(items) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), items }));
  } catch {
    // sessionStorage может быть недоступен (приватный режим и т.п.)
  }
}

/*
 * useCatalog — хук с двухуровневым кешем:
 * 1. sessionStorage (TTL 5 мин) — мгновенный результат при повторной навигации
 * 2. Дедупликация через _catalogPromise в api/index — один запрос при параллельных вызовах
 *
 * Паттерн «ленивый initialState» (функция в useState) гарантирует,
 * что readCache() вызывается только один раз при монтировании.
 * react.dev/reference/react/useState#avoiding-recreating-the-initial-state
 */
export function useCatalog() {
  const [catalog, setCatalog] = useState(() => readCache() ?? []);
  const [loading, setLoading] = useState(() => !readCache());
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (readCache()) return; // актуальные данные есть — запрос не нужен

    fetchCatalog()
      .then(data => {
        const items = data.items ?? [];
        writeCache(items);
        setCatalog(items);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { catalog, loading, error };
}
