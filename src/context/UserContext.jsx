import { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  const userRef = useRef(null); // стабильная ссылка на user для useCallback без stale closure

  const [retryCount, setRetryCount] = useState(0);

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
    setLoading(true);
    setError(null);

    fetchProfile(raw)
      .then(data => {
        userRef.current = data.user;
        setUser(data.user);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка при получении профиля:', err);
        setError(err.name === 'AbortError' ? 'timeout' : err.message);
        setLoading(false);
      });
  }, [retryCount]);

  const retry = useCallback(() => setRetryCount(n => n + 1), []);

  useEffect(() => {
    if (!user) return;
    const stored = localStorage.getItem(`dh_active_role_${user.telegram_id}`);
    if (stored) setActiveRoleState(stored);
  }, [user?.telegram_id]);

  const setActiveRole = useCallback((r) => {
    const u = userRef.current;
    if (u) localStorage.setItem(`dh_active_role_${u.telegram_id}`, r);
    setActiveRoleState(r);
  }, []);

  const clearActiveRole = useCallback(() => {
    const u = userRef.current;
    if (u) localStorage.removeItem(`dh_active_role_${u.telegram_id}`);
    setActiveRoleState(null);
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
    setActiveRole, clearActiveRole, retry,
  }), [user, loading, error, initDataRaw, role, roles, activeRole, effectiveRole, setActiveRole, clearActiveRole, retry]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
