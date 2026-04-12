import { useState, useEffect } from 'react';
import { fetchCustomerOrders } from '../api';

/*
 * useCustomerOrders — загружает заказы покупателя.
 * Если эндпоинт /orders/my не реализован на бэкенде — возвращает пустой массив,
 * не показывая ошибку пользователю (graceful degradation).
 */
export function useCustomerOrders(initDataRaw) {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!initDataRaw) { setLoading(false); return; }

    fetchCustomerOrders(initDataRaw)
      .then(data => setOrders(data.orders ?? []))
      .catch(() => setOrders([]))    // тихо игнорируем ошибку — покажем пустой список
      .finally(() => setLoading(false));
  }, [initDataRaw]);

  return { orders, loading };
}
