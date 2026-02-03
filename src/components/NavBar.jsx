import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
  const [bouncing, setBouncing] = useState(false);

  const itemRefs = useRef([]);
  const [indicatorLeft, setIndicatorLeft] = useState(0);

  const indicatorSize = 72; // размер синего круга

  const activeIndex = navItems.findIndex(item => item.path === location.pathname);
  const currentIndex = activeIndex !== -1 ? activeIndex : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Обновление позиции индикатора (точно по центру активного пункта)
  useLayoutEffect(() => {
    const updateIndicator = () => {
      if (itemRefs.current[currentIndex]) {
        const item = itemRefs.current[currentIndex];
        const { offsetLeft, offsetWidth } = item;
        const center = offsetLeft + offsetWidth / 2;
        const newLeft = center - indicatorSize / 2;
        setIndicatorLeft(newLeft);
      }
    };

    updateIndicator();
  }, [currentIndex, mounted]);

  // Анимация bounce при смене активного пункта
  useEffect(() => {
    if (mounted) {
      setBouncing(true);
    }
  }, [currentIndex]);

  return (
    <nav className={`bottom-nav ${mounted ? 'mounted' : ''}`}>
      <div
        className={`indicator ${bouncing ? 'bouncing' : ''}`}
        style={{ left: indicatorLeft }}
        onAnimationEnd={() => setBouncing(false)}
      />

      {navItems.map((item, index) => {
        const isActive = index === currentIndex;

        return (
          <NavLink
            ref={el => (itemRefs.current[index] = el)}
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