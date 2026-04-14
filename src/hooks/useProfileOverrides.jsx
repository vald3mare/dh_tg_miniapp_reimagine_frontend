import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../context/UserContext';
import { updateProfileSettings } from '../api';

const STORAGE_KEY = 'dh_profile_overrides';

function loadCache() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}; }
  catch { return {}; }
}

function saveCache(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  catch { /* ignore */ }
}

/*
 * useProfileOverrides — display_name, city, avatar хранятся на бэкенде.
 * При старте берём значения из профиля (user.display_name / user.city / user.avatar_data_url),
 * localStorage — быстрый кеш чтобы не мигало при каждом открытии.
 */
export function useProfileOverrides() {
  const { user, initDataRaw } = useUser();
  const [overrides, setOverrides] = useState(loadCache);

  // Синхронизируем с данными профиля из бэкенда (приоритет над кешем)
  useEffect(() => {
    if (!user) return;
    const fromServer = {
      displayName:    user.display_name    || '',
      city:           user.city            || '',
      avatarDataUrl:  user.avatar_data_url || '',
    };
    // Обновляем только если пришло что-то непустое
    setOverrides(prev => {
      const merged = {
        displayName:   fromServer.displayName   || prev.displayName   || '',
        city:          fromServer.city          || prev.city          || '',
        avatarDataUrl: fromServer.avatarDataUrl || prev.avatarDataUrl || '',
      };
      saveCache(merged);
      return merged;
    });
  }, [user]);

  const saveOverrides = useCallback(async (patch) => {
    // Обновляем локально сразу
    setOverrides(prev => {
      const next = { ...prev, ...patch };
      saveCache(next);
      return next;
    });

    if (!initDataRaw) return;

    // Сохраняем на бэкенд
    const apiPatch = {};
    if (patch.displayName   !== undefined) apiPatch.display_name    = patch.displayName;
    if (patch.city          !== undefined) apiPatch.city            = patch.city;
    if (patch.avatarDataUrl !== undefined) apiPatch.avatar_data_url = patch.avatarDataUrl;

    if (Object.keys(apiPatch).length > 0) {
      updateProfileSettings(apiPatch, initDataRaw).catch(() => {
        // Тихо игнорируем — данные в localStorage уже сохранены
      });
    }
  }, [initDataRaw]);

  return { overrides, saveOverrides };
}
