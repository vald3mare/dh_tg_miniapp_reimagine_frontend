import React, { createContext, useState, useEffect } from 'react';
import { retrieveRawInitData } from '@tma.js/sdk';

export const UserContext = createContext(null);

const API_URL = 'https://vald3mare-dh-tg-miniapp-reimagine-backend-e40f.twc1.net/';

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugLogs, setDebugLogs] = useState([]);

  const addLog = (msg) => {
    console.log(msg);
    setDebugLogs(prev => [...prev, msg].slice(-10)); // Хранит последние 10 логов
  };

  useEffect(() => {
    // Пробуем оба варианта получения initData
    let initDataRaw = retrieveRawInitData();
    
    addLog('🔍 retrieveRawInitData(): ' + (initDataRaw ? 'got' : 'null'));
    addLog('🔍 window.Telegram.WebApp.initData: ' + (window.Telegram?.WebApp?.initData ? 'got' : 'null'));
    
    // Если TMA.js вернула пусто, используем window.Telegram напрямую
    if (!initDataRaw && window.Telegram?.WebApp?.initData) {
      initDataRaw = window.Telegram.WebApp.initData;
      addLog('✅ Используем window.Telegram.WebApp.initData');
    }

    if (!initDataRaw) {
      addLog('❌ initDataRaw is empty or undefined');
      setError('Не удалось получить данные Telegram');
      setIsLoading(false);
      return;
    }

    addLog('✅ Итоговая initData length: ' + initDataRaw.length);
    addLog('✅ Первые 80 символов: ' + initDataRaw.substring(0, 80) + '...');

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
        addLog('✅ Успешная авторизация');
      })
      .catch(err => {
        addLog('❌ Ошибка авторизации: ' + err.message);
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
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
    refreshUser,
    debugLogs,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}