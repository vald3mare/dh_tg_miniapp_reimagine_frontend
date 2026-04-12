import { useState, useCallback } from 'react';

const STORAGE_KEY = 'dh_profile_overrides';

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}; }
  catch { return {}; }
}

/*
 * useProfileOverrides — локальные переопределения профиля:
 * displayName, city, avatarDataUrl (base64 фото).
 *
 * Telegram не позволяет менять данные пользователя из Mini App,
 * поэтому храним оверрайды локально. Когда бэкенд добавит
 * эндпоинт обновления профиля — заменяем localStorage на API.
 */
export function useProfileOverrides() {
  const [overrides, setOverrides] = useState(load);

  const saveOverrides = useCallback((patch) => {
    setOverrides(prev => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }
      catch { /* ignore */ }
      return next;
    });
  }, []);

  return { overrides, saveOverrides };
}
