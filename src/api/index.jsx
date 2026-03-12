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

export async function fetchCatalog() {
  const res = await fetch(`${BASE_URL}/catalog`);
  if (!res.ok) throw new Error(`Ошибка каталога: ${res.status}`);
  return res.json();
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

/** Мои принятые заявки */
export async function fetchMyOrders(initDataRaw) {
  const res = await fetch(`${BASE_URL}/executor/orders/my`, {
    headers: { Authorization: `tma ${initDataRaw}` },
  });
  if (!res.ok) throw new Error(`Ошибка: ${res.status}`);
  return res.json();
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
};
