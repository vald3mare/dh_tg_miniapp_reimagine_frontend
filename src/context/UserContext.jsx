import React, { createContext, useState, useEffect } from 'react';
import { retrieveRawInitData } from '@tma.js/sdk';

export const UserContext = createContext(null);

const API_URL = 'https://vald3mare-dh-tg-miniapp-reimagine-backend-e40f.twc1.net';

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initData, setInitData] = useState(null); // raw initData (trusted после бека)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        // 1️⃣ Получаем initData ОДИН РАЗ
        let initDataRaw = retrieveRawInitData();

        if (!initDataRaw && window.Telegram?.WebApp?.initData) {
          initDataRaw = window.Telegram.WebApp.initData;
        }

        if (!initDataRaw) {
          throw new Error('Не удалось получить initData');
        }

        // 2️⃣ Валидируем initData на беке
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: {
            Authorization: `tma ${initDataRaw}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Auth failed: ${res.status}`);
        }

        const data = await res.json();

        if (cancelled) return;

        // 3️⃣ Сохраняем ОДИН РАЗ
        setInitData(initDataRaw); // теперь это trusted initData
        setUser(data);
      } catch (err) {
        if (!cancelled) {
          console.error('User init error:', err);
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * ❗️refreshUser НЕ дергает retrieveRawInitData
   * Использует уже валидированную initData
   */
  const refreshUser = async () => {
    if (!initData) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Authorization: `tma ${initData}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Refresh failed: ${res.status}`);
      }

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    initData,              // 🔐 trusted initData
    isLoading,
    error,
    isAuthenticated: true,
    refreshUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}
