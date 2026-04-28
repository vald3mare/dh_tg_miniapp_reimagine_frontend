import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { useEffect, lazy, Suspense } from 'react';
import { useUser } from './context/UserContext';
import { prefetchCatalog } from './api';
import { ROUTES } from './routes';
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

// Executor + Admin страницы — lazy loaded, грузятся только при первом переходе
const ExecutorHome        = lazy(() => import('./pages/ExecutorHome'));
const ExecutorOrders      = lazy(() => import('./pages/ExecutorOrders'));
const ExecutorProfilePage = lazy(() => import('./pages/ExecutorProfilePage'));

const AdminStats        = lazy(() => import('./pages/admin/AdminStats'));
const AdminCatalog      = lazy(() => import('./pages/admin/AdminCatalog'));
const AdminAchievements = lazy(() => import('./pages/admin/AdminAchievements'));
const AdminUsers        = lazy(() => import('./pages/admin/AdminUsers'));
const AdminOrders       = lazy(() => import('./pages/admin/AdminOrders'));
const AdminApplications = lazy(() => import('./pages/admin/AdminApplications'));

const EXECUTOR_PATHS = [ROUTES.EXECUTOR_HOME, ROUTES.EXECUTOR_ORDERS, ROUTES.EXECUTOR_PROFILE];
const ADMIN_PATHS    = [ROUTES.ADMIN, ROUTES.ADMIN_CATALOG, ROUTES.ADMIN_ACHIEVEMENTS, ROUTES.ADMIN_USERS, ROUTES.ADMIN_ORDERS, ROUTES.ADMIN_APPLICATIONS];

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
  const showNav    = location.pathname !== ROUTES.WELCOME;

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Welcome & RolePicker */}
          <Route path={ROUTES.WELCOME}     element={<Welcome />} />
          <Route path={ROUTES.ROLE_PICKER} element={<RolePicker />} />

          {/* Заказчики */}
          <Route path={ROUTES.HOME}    element={<Home />} />
          <Route path={ROUTES.CATALOG} element={<Catalog />} />
          <Route path={ROUTES.TARIFFS} element={<Tariffs />} />
          <Route path={ROUTES.PROFILE} element={<Profile />} />

          {/* Исполнители */}
          <Route path={ROUTES.EXECUTOR_HOME}    element={<Suspense fallback={null}><ExecutorHome /></Suspense>} />
          <Route path={ROUTES.EXECUTOR_ORDERS}  element={<Suspense fallback={null}><ExecutorOrders /></Suspense>} />
          <Route path={ROUTES.EXECUTOR_PROFILE} element={<Suspense fallback={null}><ExecutorProfilePage /></Suspense>} />

          {/* Админка — lazy loaded, грузится только при первом переходе */}
          <Route path={ROUTES.ADMIN} element={
            <RoleGuard allowed={['admin']}><Suspense fallback={null}><AdminStats /></Suspense></RoleGuard>
          } />
          <Route path={ROUTES.ADMIN_CATALOG} element={
            <RoleGuard allowed={['admin']}><Suspense fallback={null}><AdminCatalog /></Suspense></RoleGuard>
          } />
          <Route path={ROUTES.ADMIN_ACHIEVEMENTS} element={
            <RoleGuard allowed={['admin']}><Suspense fallback={null}><AdminAchievements /></Suspense></RoleGuard>
          } />
          <Route path={ROUTES.ADMIN_USERS} element={
            <RoleGuard allowed={['admin']}><Suspense fallback={null}><AdminUsers /></Suspense></RoleGuard>
          } />
          <Route path={ROUTES.ADMIN_ORDERS} element={
            <RoleGuard allowed={['admin']}><Suspense fallback={null}><AdminOrders /></Suspense></RoleGuard>
          } />
          <Route path={ROUTES.ADMIN_APPLICATIONS} element={
            <RoleGuard allowed={['admin']}><Suspense fallback={null}><AdminApplications /></Suspense></RoleGuard>
          } />
        </Routes>
      </AnimatePresence>

      {showNav && location.pathname !== ROUTES.ROLE_PICKER && (
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
