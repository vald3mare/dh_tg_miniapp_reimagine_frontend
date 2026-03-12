const BASE_URL = import.meta.env.VITE_API_URL ?? '';

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
