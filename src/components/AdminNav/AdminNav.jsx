import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import BarChartIcon from '@mui/icons-material/BarChart';
import PetsIcon from '@mui/icons-material/Pets';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PeopleIcon from '@mui/icons-material/People';
import ListAltIcon from '@mui/icons-material/ListAlt';
import '../BottomNav/BottomNav.css';

const TABS = [
  { path: '/admin',              label: 'Стата',   icon: BarChartIcon },
  { path: '/admin/catalog',      label: 'Каталог', icon: PetsIcon },
  { path: '/admin/achievements', label: 'Ачивки',  icon: EmojiEventsIcon },
  { path: '/admin/users',        label: 'Юзеры',   icon: PeopleIcon },
  { path: '/admin/orders',       label: 'Заявки',  icon: ListAltIcon },
];

const AdminNav = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const activeIdx = TABS.findIndex(t => t.path === location.pathname);

  return (
    <div className="bottom-nav-wrapper">
      <nav className="bottom-nav" style={{ maxWidth: '420px' }}>
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
                  layoutId="active-pill-admin"
                  style={{ background: '#333' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <motion.div
                className="bottom-nav-icon-wrap"
                animate={isActive ? { scale: [1, 1.1, 1.08], y: [0, -2, 0] } : { scale: 1, y: 0 }}
                transition={isActive ? { duration: 0.35, ease: 'easeOut' } : { type: 'spring', stiffness: 400, damping: 28 }}
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

export default AdminNav;
