import React, { createContext, useState, useEffect } from 'react';
import { retrieveRawInitData } from '@tma.js/sdk';

export const UserContext = createContext(null);

const API_URL = 'https://vald3mare-dh-tg-miniapp-reimagine-backend-e40f.twc1.net/';

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initData, setInitData] = useState(null);

  useEffect(() => {
    // Ждем инициализации Telegram.WebApp (300ms должно быть достаточно)
    const initTimer = setTimeout(() => {
      let initDataRaw = retrieveRawInitData();
      
      if (!initDataRaw && window.Telegram?.WebApp?.initData) {
        initDataRaw = window.Telegram.WebApp.initData;
      }

      if (!initDataRaw) {
        setError('Не удалось получить данные Telegram');
        setIsLoading(false);
        return;
      }

      // Сохраняем initData для использования в других компонентах
      setInitData(initDataRaw);

      fetch(API_URL, {
        method: 'POST',
        headers: {
          Authorization: `tma ${initDataRaw}`,
        },
      })
      .then(res => {
        if (!res.ok) throw new Error(`Сервер ответил ${res.status}`);
        return res.json();
      })
      .then(data => {
        setUser(data);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
    }, 300); // 300ms для инициализации Telegram.WebApp

    return () => clearTimeout(initTimer);
  }, []);

  const refreshUser = () => {
    let initDataRaw = retrieveRawInitData();
    if (!initDataRaw && window.Telegram?.WebApp?.initData) {
      initDataRaw = window.Telegram.WebApp.initData;
    }
    
    if (!initDataRaw) {
      setError('Не удалось получить данные Telegram');
      return;
    }

    setIsLoading(true);
    fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `tma ${initDataRaw}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error(`Сервер ответил ${res.status}`);
        return res.json();
      })
      .then(data => {
        setUser(data);
        addLog('✅ Данные обновлены');
      })
      .catch(err => {
        addLog('❌ Ошибка при обновлении: ' + err.message);
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
  };

  const value = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    initData, // Передаем инит дату которая уже валидна
    refreshUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}