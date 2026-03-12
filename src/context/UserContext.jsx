import { createContext, useContext, useState, useEffect } from 'react';
import { retrieveRawInitData } from '@tma.js/sdk';
import { fetchProfile } from '../api';

const UserContext = createContext({
  user: null,
  loading: true,
  error: null,
  initDataRaw: null,
  role: 'customer',
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initDataRaw, setInitDataRaw] = useState(null);

  useEffect(() => {
    let raw;
    try {
      raw = retrieveRawInitData();
    } catch (err) {
      console.warn('Вне Telegram Mini App:', err);
      setLoading(false);
      return;
    }

    if (!raw) {
      console.warn('initDataRaw пустая.');
      setLoading(false);
      return;
    }

    setInitDataRaw(raw);

    fetchProfile(raw)
      .then(data => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка при получении профиля:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const role = user?.Role || user?.role || 'customer';

  return (
    <UserContext.Provider value={{ user, loading, error, initDataRaw, role }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
