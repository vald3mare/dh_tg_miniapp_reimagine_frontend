const BASE_URL = import.meta.env.VITE_API_URL || 'https://vald3mare-dh-tg-miniapp-reimagine-backend-e40f.twc1.net';

/**
 * Все обращения к бэкенду идут через этот файл.
 * Менять хост нужно только в .env (VITE_API_URL).
 */

export async function fetchProfile(initDataRaw) {
  const res = await fetch(`${BASE_URL}/profile`, {
    headers: { Authorization: `tma ${initDataRaw}` },
  });
  if (!res.ok) throw new Error(`Ошибка профиля: ${res.status}`);
  return res.json();
}

/*
 * _catalogPromise — дедупликатор одновременных запросов.
 * Если fetchCatalog() вызвать несколько раз подряд (например, Home + Catalog
 * монтируются одновременно), к бэкенду улетит ровно один запрос.
 * Promise сбрасывается после settle, чтобы следующий вызов мог повторить запрос.
 */
let _catalogPromise = null;

export function prefetchCatalog() {
  if (!_catalogPromise) {
    _catalogPromise = fetch(`${BASE_URL}/catalog`)
      .then(res => {
        if (!res.ok) throw new Error(`Ошибка каталога: ${res.status}`);
        return res.json();
      })
      .finally(() => { _catalogPromise = null; });
  }
  return _catalogPromise;
}

export async function fetchCatalog() {
  return prefetchCatalog();
}

/**
 * Создаёт платёж в ЮKassa и возвращает { payment_id, confirmation_url, status }.
 * Требует авторизации — передаём initDataRaw из UserContext.
 */
export async function createPayment(itemId, initDataRaw) {
  const res = await fetch(`${BASE_URL}/payment/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `tma ${initDataRaw}`,
    },
    body: JSON.stringify({ item_id: itemId }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Ошибка: ${res.status}`);
  return data;
}

/** Устанавливает роль пользователя (customer | executor) */
export async function setRole(role, initDataRaw) {
  const res = await fetch(`${BASE_URL}/profile/role`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `tma ${initDataRaw}`,
    },
    body: JSON.stringify({ role }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Ошибка: ${res.status}`);
  return data;
}

/**
 * Создаёт заявку из корзины покупателя (публичный эндпоинт).
 * Не требует авторизации — используется из CartDrawer.
 */
export async function createOrder(orderData) {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Ошибка отправки заявки: ${res.status}`);
  return data;
}

/** Список открытых заявок для ленты исполнителей */
export async function fetchOrders() {
  const res = await fetch(`${BASE_URL}/executor/orders`);
  if (!res.ok) throw new Error(`Ошибка заявок: ${res.status}`);
  return res.json();
}

/** Принять заявку */
export async function acceptOrder(id, initDataRaw) {
  const res = await fetch(`${BASE_URL}/executor/orders/${id}/accept`, {
    method: 'POST',
    headers: { Authorization: `tma ${initDataRaw}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Ошибка: ${res.status}`);
  return data;
}

/** Мои принятые заявки (исполнитель) */
export async function fetchMyOrders(initDataRaw) {
  const res = await fetch(`${BASE_URL}/executor/orders/my`, {
    headers: { Authorization: `tma ${initDataRaw}` },
  });
  if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
  return res.json();
}

/** Мои заказы (покупатель) */
export async function fetchCustomerOrders(initDataRaw) {
  const res = await fetch(`${BASE_URL}/orders/my`, {
    headers: { Authorization: `tma ${initDataRaw}` },
  });
  if (!res.ok) throw new Error(`Ошибка заказов: ${res.status}`);
  return res.json();
}

/**
 * Создаёт заявку от авторизованного клиента (TMA).
 * data: { service_type, description?, price?, scheduled_at? }
 */
export async function customerCreateOrder(data, initDataRaw) {
  const res = await fetch(`${BASE_URL}/customer/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `tma ${initDataRaw}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Ошибка: ${res.status}`);
  return json;
}

/**
 * Исполнитель обновляет статус своей заявки.
 * status: 'in_progress' | 'done'
 */
export async function updateExecutorOrderStatus(id, status, initDataRaw) {
  const res = await fetch(`${BASE_URL}/executor/orders/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `tma ${initDataRaw}`,
    },
    body: JSON.stringify({ status }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Ошибка: ${res.status}`);
  return data;
}

/** Ачивки текущего исполнителя */
export async function fetchAchievements(initDataRaw) {
  const res = await fetch(`${BASE_URL}/executor/achievements`, {
    headers: { Authorization: `tma ${initDataRaw}` },
  });
  if (!res.ok) throw new Error(`Ошибка ачивок: ${res.status}`);
  return res.json();
}

// ── Admin API ──────────────────────────────────────────────────────────────

async function adminRequest(path, method = 'GET', body, initDataRaw) {
  const res = await fetch(`${BASE_URL}/admin${path}`, {
    method,
    headers: {
      Authorization: `tma ${initDataRaw}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Ошибка: ${res.status}`);
  return data;
}

export const admin = {
  getStats:              (r)          => adminRequest('/stats', 'GET', null, r),
  // catalog
  getCatalog:            (r)          => adminRequest('/catalog', 'GET', null, r),
  createCatalogItem:     (body, r)    => adminRequest('/catalog', 'POST', body, r),
  updateCatalogItem:     (id, body, r)=> adminRequest(`/catalog/${id}`, 'PUT', body, r),
  deleteCatalogItem:     (id, r)      => adminRequest(`/catalog/${id}`, 'DELETE', null, r),
  // achievements
  getAchievements:       (r)          => adminRequest('/achievements', 'GET', null, r),
  createAchievement:     (body, r)    => adminRequest('/achievements', 'POST', body, r),
  updateAchievement:     (id, body, r)=> adminRequest(`/achievements/${id}`, 'PUT', body, r),
  deleteAchievement:     (id, r)      => adminRequest(`/achievements/${id}`, 'DELETE', null, r),
  // users
  getUsers:              (r)          => adminRequest('/users', 'GET', null, r),
  setUserRole:           (id, role, r)=> adminRequest(`/users/${id}/role`, 'PUT', { role }, r),
  grantAchievement:      (id, achievementId, r) => adminRequest(`/users/${id}/achievement`, 'POST', { achievement_id: achievementId }, r),
  // orders
  getOrders:             (r)          => adminRequest('/orders', 'GET', null, r),
  updateOrderStatus:     (id, status, r) => adminRequest(`/orders/${id}/status`, 'PUT', { status }, r),
  // executor applications
  getApplications:       (r, status)  => adminRequest(`/applications${status ? `?status=${status}` : ''}`, 'GET', null, r),
  approveApplication:    (id, r)      => adminRequest(`/applications/${id}/approve`, 'POST', {}, r),
  rejectApplication:     (id, note, r)=> adminRequest(`/applications/${id}/reject`, 'POST', { note }, r),
};
