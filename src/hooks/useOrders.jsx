import { useState, useEffect } from 'react';
import { fetchOrders } from '../api';

const CACHE_KEY = 'exec_orders_cache';
const CACHE_TTL = 30 * 1000; // 30s — заявки меняются часто

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    return Date.now() - ts < CACHE_TTL ? data : null;
  } catch { return null; }
}

function writeCache(data) {
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() })); } catch {}
}

let _promise = null;

function loadOrders() {
  const cached = readCache();
  if (cached) return Promise.resolve(cached);
  if (!_promise) {
    _promise = fetchOrders()
      .then(data => { writeCache(data); return data; })
      .finally(() => { _promise = null; });
  }
  return _promise;
}

export function useOrders() {
  const [orders, setOrders] = useState(() => readCache()?.orders ?? []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrders()
      .then(data => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { orders, loading, error };
}
