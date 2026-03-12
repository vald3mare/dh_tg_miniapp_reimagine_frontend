import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useUser } from './context/UserContext';

import BottomNav from './components/BottomNav/BottomNav';
import ExecutorBottomNav from './components/ExecutorBottomNav/ExecutorBottomNav';
import AdminNav from './components/AdminNav/AdminNav';

import Welcome from './pages/Welcome';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Profile from './pages/Profile';

import ExecutorHome from './pages/ExecutorHome';
import ExecutorOrders from './pages/ExecutorOrders';
import ExecutorProfilePage from './pages/ExecutorProfilePage';

import AdminStats from './pages/admin/AdminStats';
import AdminCatalog from './pages/admin/AdminCatalog';
import AdminAchievements from './pages/admin/AdminAchievements';
import AdminUsers from './pages/admin/AdminUsers';
import AdminOrders from './pages/admin/AdminOrders';

const EXECUTOR_PATHS = ['/executor/home', '/executor/orders', '/executor/profile'];
const ADMIN_PATHS    = ['/admin', '/admin/catalog', '/admin/achievements', '/admin/users', '/admin/orders'];

// Простой guard: редиректит если роль не совпадает
const RoleGuard = ({ allowed, children }) => {
  const { role, loading } = useUser();
  if (loading) return null;
  if (!allowed.includes(role)) return <Navigate to="/" replace />;
  return children;
};

const App = () => {
  const location = useLocation();
  const { role } = useUser();

  const isAdmin    = ADMIN_PATHS.some(p => location.pathname === p);
  const isExecutor = EXECUTOR_PATHS.some(p => location.pathname.startsWith(p));
  const showNav    = location.pathname !== '/';

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Welcome — определяет роль */}
          <Route path="/" element={<Welcome />} />

          {/* Заказчики */}
          <Route path="/home"    element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
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
        </Routes>
      </AnimatePresence>

      {showNav && (
        isAdmin    ? <AdminNav /> :
        isExecutor ? <ExecutorBottomNav /> :
                     <BottomNav />
      )}
    </div>
  );
};

export default App;
