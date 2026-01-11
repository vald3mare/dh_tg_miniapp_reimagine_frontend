import React, { createContext, useState, useEffect } from 'react';
import { retrieveRawInitData } from '@tma.js/sdk';

export const UserContext = createContext(null);

const API_URL = 'https://vald3mare-dh-tg-miniapp-reimagine-backend-e40f.twc1.net/';

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initDataRaw = retrieveRawInitData();

    if (!initDataRaw) {
      setError('Не удалось получить данные Telegram');
      setIsLoading(false);
      return;
    }

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
        console.log('Успешная авторизация:', data);
      })
      .catch(err => {
        console.error('Ошибка авторизации:', err);
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const refreshUser = () => {
    const initDataRaw = retrieveRawInitData();
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
        console.log('Данные обновлены:', data);
      })
      .catch(err => {
        console.error('Ошибка при обновлении:', err);
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
  };

  const value = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    refreshUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}