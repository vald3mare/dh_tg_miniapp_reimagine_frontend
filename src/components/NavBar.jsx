import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PetsIcon from '@mui/icons-material/Pets';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PersonIcon from '@mui/icons-material/Person';
import './NavBar.css';

const navItems = [
  { path: '/', label: 'Главная', icon: <HomeIcon />, key: 'home' },
  { path: '/services', label: 'Услуги', icon: <PetsIcon />, key: 'services' },
  { path: '/tariffs', label: 'Тарифы', icon: <CreditCardIcon />, key: 'tariffs' },
  { path: '/profile', label: 'Профиль', icon: <PersonIcon />, key: 'profile' },
];

const NavBar = () => {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeIndex = navItems.findIndex(item => item.path === location.pathname);
  const currentIndex = activeIndex !== -1 ? activeIndex : 0;

  return (
    <nav
      className={`bottom-nav ${mounted ? 'mounted' : ''}`}
      style={{ '--active-index': currentIndex }}
    >
      <div className="indicator" />

      {navItems.map((item, index) => {
        const isActive = index === currentIndex;

        return (
          <NavLink
            key={item.key}
            to={item.path}
            className={`nav-item ${isActive ? 'active' : ''}`}
            aria-label={item.label}
          >
            <div className="nav-icon">{item.icon}</div>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default NavBar;