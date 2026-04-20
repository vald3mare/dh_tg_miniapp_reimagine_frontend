import { useNavigate, useLocation } from 'react-router-dom'
import * as m from 'motion/react-m'

import HomeIcon from '@mui/icons-material/Home'
import PetsIcon from '@mui/icons-material/Pets'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import PersonIcon from '@mui/icons-material/Person'

import './BottomNav.css'

// Стабильные константы вне компонента — framer-motion не перезапускает анимацию
const ICON_ANIMATE_ACTIVE   = { scale: [1, 1.1, 1.08], y: [0, -2, 0] };
const ICON_ANIMATE_INACTIVE = { scale: 1, y: 0 };
const ICON_TRANSITION_ACTIVE   = { duration: 0.35, ease: 'easeOut' };
const ICON_TRANSITION_INACTIVE = { type: 'spring', stiffness: 400, damping: 28 };

const CUSTOMER_TABS = [
  { path: '/home',     label: 'Главная', icon: HomeIcon },
  { path: '/catalog',  label: 'Каталог', icon: PetsIcon },
  { path: '/tariffs',  label: 'Тарифы',  icon: CreditCardIcon },
  { path: '/profile',  label: 'Профиль', icon: PersonIcon },
]

const BottomNav = ({ tabs = CUSTOMER_TABS, pillId = 'active-pill' }) => {
  const navigate  = useNavigate()
  const location  = useLocation()
  const activeIdx = tabs.findIndex(t => t.path === location.pathname)

  return (
    <div className="bottom-nav-wrapper">
      <nav className="bottom-nav">
        {tabs.map((tab, index) => {
          const Icon     = tab.icon
          const isActive = index === activeIdx

          return (
            <m.button
              key={tab.path}
              className="bottom-nav-item"
              onClick={() => navigate(tab.path)}
              aria-current={isActive ? 'page' : undefined}
              whileTap={{ scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              {isActive && (
                <m.div
                  className="bottom-nav-pill"
                  layoutId={pillId}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}

              <m.div
                className="bottom-nav-icon-wrap"
                animate={isActive ? ICON_ANIMATE_ACTIVE : ICON_ANIMATE_INACTIVE}
                transition={isActive ? ICON_TRANSITION_ACTIVE : ICON_TRANSITION_INACTIVE}
              >
                <Icon className={`icon ${isActive ? 'icon--active' : ''}`} />
              </m.div>

              <m.span
                animate={{ opacity: isActive ? 1 : 0.45 }}
                transition={{ duration: 0.2 }}
                className={`bottom-nav-label ${isActive ? 'bottom-nav-label--active' : ''}`}
              >
                {tab.label}
              </m.span>
            </m.button>
          )
        })}
      </nav>
    </div>
  )
}

export default BottomNav
