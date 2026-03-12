import { createContext, useContext, useState, useEffect } from 'react';
import { retrieveRawInitData } from '@tma.js/sdk';
import { fetchProfile } from '../api';

const UserContext = createContext({
  user: null,
  loading: true,
  error: null,
  initDataRaw: null,
  role: 'customer',
  roles: ['customer'],
  activeRole: null,
  effectiveRole: 'customer',
  setActiveRole: () => {},
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initDataRaw, setInitDataRaw] = useState(null);
  const [activeRole, setActiveRoleState] = useState(null);

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

  // Инициализируем activeRole из localStorage когда пользователь загрузился
  useEffect(() => {
    if (user) {
      const key = `dh_active_role_${user.telegram_id}`;
      const stored = localStorage.getItem(key);
      if (stored) setActiveRoleState(stored);
    }
  }, [user?.telegram_id]);

  const setActiveRole = (r) => {
    if (user) {
      localStorage.setItem(`dh_active_role_${user.telegram_id}`, r);
    }
    setActiveRoleState(r);
  };

  const clearActiveRole = () => {
    if (user) {
      localStorage.removeItem(`dh_active_role_${user.telegram_id}`);
    }
    setActiveRoleState(null);
  };

  // Первичная роль из БД (используется для прав доступа)
  const role = user?.role || 'customer';

  // Массив всех ролей пользователя
  const roles = (user?.roles && user.roles.length > 0)
    ? user.roles
    : [role];

  // Эффективная роль: выбранная пользователем или единственная доступная
  const effectiveRole = activeRole || (roles.length === 1 ? roles[0] : null);

  return (
    <UserContext.Provider value={{
      user, loading, error, initDataRaw,
      role, roles,
      activeRole, effectiveRole,
      setActiveRole, clearActiveRole,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
