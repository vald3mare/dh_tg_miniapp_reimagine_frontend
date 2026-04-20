import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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
  clearActiveRole: () => {},
});

export const UserProvider = ({ children }) => {
  const [user, setUser]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
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

  useEffect(() => {
    if (!user) return;
    const stored = localStorage.getItem(`dh_active_role_${user.telegram_id}`);
    if (stored) setActiveRoleState(stored);
  }, [user?.telegram_id]);

  const setActiveRole = useCallback((r) => {
    setActiveRoleState(prev => {
      if (prev === r) return prev;
      return r;
    });
    // Side-effect: write to localStorage. user.telegram_id is captured via ref pattern
    // to avoid stale closure — we access it at call time via the setter.
    setUser(u => {
      if (u) localStorage.setItem(`dh_active_role_${u.telegram_id}`, r);
      return u;
    });
  }, []);

  const clearActiveRole = useCallback(() => {
    setActiveRoleState(null);
    setUser(u => {
      if (u) localStorage.removeItem(`dh_active_role_${u.telegram_id}`);
      return u;
    });
  }, []);

  const role = user?.role || 'customer';

  const roles = useMemo(
    () => user?.roles?.length > 0 ? user.roles : [user?.role || 'customer'],
    [user],
  );

  const effectiveRole = activeRole || (roles.length === 1 ? roles[0] : null);

  const value = useMemo(() => ({
    user, loading, error, initDataRaw,
    role, roles,
    activeRole, effectiveRole,
    setActiveRole, clearActiveRole,
  }), [user, loading, error, initDataRaw, role, roles, activeRole, effectiveRole, setActiveRole, clearActiveRole]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
