import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import HomeIcon from '@mui/icons-material/Home'
import PetsIcon from '@mui/icons-material/Pets'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import PersonIcon from '@mui/icons-material/Person'

import './BottomNav.css'

const TABS = [
  { path: '/', label: 'Главная', icon: HomeIcon },
  { path: '/catalog', label: 'Каталог', icon: PetsIcon },
  { path: '/tariffs', label: 'Тарифы', icon: CreditCardIcon },
  { path: '/profile', label: 'Профиль', icon: PersonIcon },
]

const BottomNav = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const index = TABS.findIndex(t => t.path === location.pathname)
    if (index !== -1) setActiveIndex(index)
  }, [location.pathname])

  return (
    <div className="bottom-nav-wrapper">
      <nav className="bottom-nav" aria-label="Основная навигация">
        <div
          className="bottom-nav-active"
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        />

        {TABS.map((tab, index) => {
          const Icon = tab.icon
          const isActive = index === activeIndex

          return (
            <button
              key={tab.path}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(tab.path)}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="icon" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default BottomNav
