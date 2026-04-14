import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useUser } from './context/UserContext';
import { prefetchCatalog } from './api';
import CartDrawer from './components/CartDrawer/CartDrawer';

import BottomNav from './components/BottomNav/BottomNav';
import ExecutorBottomNav from './components/ExecutorBottomNav/ExecutorBottomNav';
import AdminNav from './components/AdminNav/AdminNav';

import Welcome from './pages/Welcome';
import RolePicker from './pages/RolePicker';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Tariffs from './pages/Tariffs';
import Profile from './pages/Profile';

import ExecutorHome from './pages/ExecutorHome';
import ExecutorOrders from './pages/ExecutorOrders';
import ExecutorProfilePage from './pages/ExecutorProfilePage';

import AdminStats from './pages/admin/AdminStats';
import AdminCatalog from './pages/admin/AdminCatalog';
import AdminAchievements from './pages/admin/AdminAchievements';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';
import AdminApplications from './pages/admin/AdminApplications';

const EXECUTOR_PATHS = ['/executor/home', '/executor/orders', '/executor/profile'];
const ADMIN_PATHS    = ['/admin', '/admin/catalog', '/admin/achievements', '/admin/users', '/admin/orders', '/admin/applications'];

// Guard: проверяет effectiveRole (выбранную) или primaryRole
const RoleGuard = ({ allowed, children }) => {
  const { role, effectiveRole, loading } = useUser();
  if (loading) return null;
  const check = effectiveRole || role;
  if (!allowed.includes(check)) return <Navigate to="/" replace />;
  return children;
};

// Кнопка смены роли — показывается только у мульти-ролевых пользователей
const SwitchRoleButton = () => {
  const { roles, clearActiveRole } = useUser();
  const navigate = useNavigate();
  if (roles.length <= 1) return null;

  const handleSwitch = () => {
    clearActiveRole();
    navigate('/role-picker', { replace: true });
  };

  return (
    <button
      onClick={handleSwitch}
      style={{
        position: 'fixed', bottom: 72, right: 16,
        zIndex: 200,
        background: '#476CEE',
        color: '#fff',
        border: 'none',
        borderRadius: '50%',
        width: 44, height: 44,
        fontSize: 20,
        cursor: 'pointer',
        boxShadow: '0 4px 16px rgba(71,108,238,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      title="Сменить роль"
    >
      ⇄
    </button>
  );
};

const App = () => {
  const location = useLocation();
  const { effectiveRole, role } = useUser();

  /*
   * Prefetch каталога при старте приложения — запрос улетает сразу,
   * ещё пока юзер видит Welcome/RolePicker страницу.
   * К моменту перехода на /home данные уже готовы или почти готовы.
   * sessionStorage кеш в useCatalog сделает повторные заходы мгновенными.
   */
  useEffect(() => { prefetchCatalog(); }, []);

  const isAdmin    = ADMIN_PATHS.some(p => location.pathname === p);
  const isExecutor = EXECUTOR_PATHS.some(p => location.pathname.startsWith(p));
  const showNav    = location.pathname !== '/';

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Welcome & RolePicker */}
          <Route path="/" element={<Welcome />} />
          <Route path="/role-picker" element={<RolePicker />} />

          {/* Заказчики */}
          <Route path="/home"    element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/tariffs" element={<Tariffs />} />
          <Route path="/profile" element={<Profile />} />

          {/* Исполнители */}
          <Route path="/executor/home"    element={<ExecutorHome />} />
          <Route path="/executor/orders"  element={<ExecutorOrders />} />
          <Route path="/executor/profile" element={<ExecutorProfilePage />} />

          {/* Админка */}
          <Route path="/admin" element={
            <RoleGuard allowed={['admin']}><AdminStats /></RoleGuard>
          } />
          <Route path="/admin/catalog" element={
            <RoleGuard allowed={['admin']}><AdminCatalog /></RoleGuard>
          } />
          <Route path="/admin/achievements" element={
            <RoleGuard allowed={['admin']}><AdminAchievements /></RoleGuard>
          } />
          <Route path="/admin/users" element={
            <RoleGuard allowed={['admin']}><AdminUsers /></RoleGuard>
          } />
          <Route path="/admin/orders" element={
            <RoleGuard allowed={['admin']}><AdminOrders /></RoleGuard>
          } />
          <Route path="/admin/applications" element={
            <RoleGuard allowed={['admin']}><AdminApplications /></RoleGuard>
          } />
        </Routes>
      </AnimatePresence>

      {showNav && location.pathname !== '/role-picker' && (
        isAdmin    ? <AdminNav /> :
        isExecutor ? <ExecutorBottomNav /> :
                     <BottomNav />
      )}
      <SwitchRoleButton />
      <CartDrawer />
    </div>
  );
};

export default App;
