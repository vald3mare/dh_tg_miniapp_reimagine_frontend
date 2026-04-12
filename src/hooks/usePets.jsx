import { useState, useCallback } from 'react';

const STORAGE_KEY = 'dh_pets';

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []; }
  catch { return []; }
}

function persist(pets) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(pets)); }
  catch { /* localStorage недоступен */ }
}

/*
 * usePets — хранит питомцев в localStorage.
 * Пока нет бэкенд-эндпоинта, данные локальные.
 * Когда API появится — заменяем load/persist на fetch-вызовы.
 */
export function usePets() {
  const [pets, setPets] = useState(load);

  const addPet = useCallback((pet) => {
    setPets(prev => {
      const next = [...prev, { ...pet, id: Date.now() }];
      persist(next);
      return next;
    });
  }, []);

  const removePet = useCallback((id) => {
    setPets(prev => {
      const next = prev.filter(p => p.id !== id);
      persist(next);
      return next;
    });
  }, []);

  return { pets, addPet, removePet };
}
