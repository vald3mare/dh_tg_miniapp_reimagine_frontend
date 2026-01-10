import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PetsIcon from '@mui/icons-material/Pets';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PersonIcon from '@mui/icons-material/Person';
import './NavBar.css';

// Массив пунктов меню
const navItems = [
  { path: '/', label: 'Главная', icon: <HomeIcon />, key: 'home' },
  { path: '/services', label: 'Услуги', icon: <PetsIcon />, key: 'services' },
  { path: '/tariffs', label: 'Тарифы', icon: <CreditCardIcon />, key: 'tariffs' },
  { path: '/profile', label: 'Профиль', icon: <PersonIcon />, key: 'profile' },
];

const NavBar = () => {
  const location = useLocation(); // для определения активного пункта

  return (
    <nav className="nav-bar">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;

        return (
          <NavLink
            key={item.key}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
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