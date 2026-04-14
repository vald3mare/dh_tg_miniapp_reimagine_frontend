import { useState, useEffect, useCallback } from 'react';
import { useUser } from '../context/UserContext';
import { fetchPets, addPet as apiAddPet, deletePet as apiDeletePet } from '../api';

const STORAGE_KEY = 'dh_pets';

function loadCache() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []; }
  catch { return []; }
}

function saveCache(pets) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(pets)); }
  catch { /* ignore */ }
}

/*
 * usePets — питомцы хранятся на бэкенде (привязаны к аккаунту).
 * localStorage используется только как кеш для мгновенного отображения
 * до загрузки с сервера.
 */
export function usePets() {
  const { initDataRaw } = useUser();
  const [pets, setPets] = useState(loadCache);
  const [synced, setSynced] = useState(false);

  // Загружаем с бэкенда при наличии авторизации
  useEffect(() => {
    if (!initDataRaw) return;
    fetchPets(initDataRaw)
      .then(data => {
        const list = data.pets ?? [];
        setPets(list);
        saveCache(list);
        setSynced(true);
      })
      .catch(() => {
        // fallback: оставляем локальный кеш
        setSynced(true);
      });
  }, [initDataRaw]);

  const addPet = useCallback(async (pet) => {
    // Оптимистичное обновление — UI реагирует мгновенно
    const tempId = Date.now();
    const optimistic = { ...pet, id: tempId, ID: tempId };
    setPets(prev => {
      const next = [...prev, optimistic];
      saveCache(next);
      return next;
    });

    if (!initDataRaw) return;
    try {
      const data = await apiAddPet(pet, initDataRaw);
      // Заменяем временный ID на реальный с бэкенда
      setPets(prev => {
        const next = prev.map(p => (p.id === tempId ? { ...data.pet, id: data.pet.ID } : p));
        saveCache(next);
        return next;
      });
    } catch {
      // Откатываем если ошибка
      setPets(prev => {
        const next = prev.filter(p => p.id !== tempId);
        saveCache(next);
        return next;
      });
    }
  }, [initDataRaw]);

  const removePet = useCallback(async (id) => {
    // Оптимистичное удаление
    setPets(prev => {
      const next = prev.filter(p => p.id !== id && p.ID !== id);
      saveCache(next);
      return next;
    });

    if (!initDataRaw) return;
    const realId = id;
    apiDeletePet(realId, initDataRaw).catch(() => {
      // Если ошибка — перезагружаем с бэкенда
      fetchPets(initDataRaw).then(data => {
        const list = data.pets ?? [];
        setPets(list);
        saveCache(list);
      });
    });
  }, [initDataRaw]);

  return { pets, addPet, removePet, synced };
}
