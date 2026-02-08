// src/context/UserContext.js (обновленный)
import React, { createContext, useContext, useState, useEffect } from 'react';
import { retrieveRawInitData } from '@tma.js/sdk';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let initDataRaw;
    try {
      initDataRaw = retrieveRawInitData();
    } catch (err) {
      console.warn('Не удалось получить initDataRaw. Возможно, приложение запущено вне Telegram Mini App.', err);
      return;
    }

    if (!initDataRaw) {
      console.warn('initDataRaw пустая.');
      return;
    }

    const PROFILE_ENDPOINT = 'https://vald3mare-dh-tg-miniapp-reimagine-backend-e40f.twc1.net';

    fetch(PROFILE_ENDPOINT, {
      method: 'GET',
      headers: {
        'Authorization': `tma ${initDataRaw}`
      },
    })
    .then(response => {
      if (!response.ok) {
        // Для отладки: логируем текст ответа, если не JSON
        return response.text().then(text => {
          throw new Error(`Ошибка ${response.status}: ${text}`);
        });
      }
      return response.json();
    })
    .then(data => {
      setUser(data.user); // Или data, в зависимости от структуры
    })
    .catch((err) => {
      console.error('Ошибка при получении профиля:', err);
      setUser(null);
    });
  }, []);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);