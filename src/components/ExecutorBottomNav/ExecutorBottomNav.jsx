import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

import HomeIcon from '@mui/icons-material/Home';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonIcon from '@mui/icons-material/Person';

import './ExecutorBottomNav.css';

const TABS = [
  { path: '/executor/home',    label: 'Главная', icon: HomeIcon },
  { path: '/executor/orders',  label: 'Заявки',  icon: ListAltIcon },
  { path: '/executor/profile', label: 'Профиль', icon: PersonIcon },
];

const ExecutorBottomNav = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const activeIdx = TABS.findIndex(t => t.path === location.pathname);

  return (
    <div className="bottom-nav-wrapper">
      <nav className="bottom-nav">
        {TABS.map((tab, index) => {
          const Icon     = tab.icon;
          const isActive = index === activeIdx;

          return (
            <motion.button
              key={tab.path}
              className="bottom-nav-item"
              onClick={() => navigate(tab.path)}
              aria-current={isActive ? 'page' : undefined}
              whileTap={{ scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              {isActive && (
                <motion.div
                  className="bottom-nav-pill"
                  layoutId="active-pill-executor"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}

              <motion.div
                className="bottom-nav-icon-wrap"
                animate={
                  isActive
                    ? { scale: [1, 1.1, 1.08], y: [0, -2, 0] }
                    : { scale: 1, y: 0 }
                }
                transition={
                  isActive
                    ? { duration: 0.35, ease: 'easeOut' }
                    : { type: 'spring', stiffness: 400, damping: 28 }
                }
              >
                <Icon className={`icon ${isActive ? 'icon--active' : ''}`} />
              </motion.div>

              <motion.span
                animate={{ opacity: isActive ? 1 : 0.45 }}
                transition={{ duration: 0.2 }}
                className={`bottom-nav-label ${isActive ? 'bottom-nav-label--active' : ''}`}
              >
                {tab.label}
              </motion.span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};

export default ExecutorBottomNav;
