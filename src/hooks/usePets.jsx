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

export function usePets() {
  const { initDataRaw } = useUser();
  const [pets, setPets] = useState(loadCache);
  const [synced, setSynced] = useState(false);

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
        setSynced(true);
      });
  }, [initDataRaw]);

  const addPet = useCallback(async (pet) => {
    const tempId = crypto.randomUUID();
    const optimistic = { ...pet, id: tempId, ID: tempId };
    setPets(prev => {
      const next = [...prev, optimistic];
      saveCache(next);
      return next;
    });

    if (!initDataRaw) return;
    try {
      const data = await apiAddPet(pet, initDataRaw);
      setPets(prev => {
        // Backend returns ID (PascalCase from GORM); normalize to both id and ID
        const next = prev.map(p => (p.id === tempId ? { ...data.pet, id: data.pet.ID } : p));
        saveCache(next);
        return next;
      });
    } catch {
      setPets(prev => {
        const next = prev.filter(p => p.id !== tempId);
        saveCache(next);
        return next;
      });
    }
  }, [initDataRaw]);

  const removePet = useCallback(async (id) => {
    setPets(prev => {
      // Check both id and ID because server pets have ID (GORM), optimistic pets have id
      const next = prev.filter(p => p.id !== id && p.ID !== id);
      saveCache(next);
      return next;
    });

    if (!initDataRaw) return;
    apiDeletePet(id, initDataRaw).catch(() => {
      fetchPets(initDataRaw).then(data => {
        const list = data.pets ?? [];
        setPets(list);
        saveCache(list);
      });
    });
  }, [initDataRaw]);

  return { pets, addPet, removePet, synced };
}
