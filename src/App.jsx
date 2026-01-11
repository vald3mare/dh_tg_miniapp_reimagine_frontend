import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar'
import Home from './pages/Home';
import Services from './pages/Services';
import Profile from './pages/Profile';


const App = () => {
  return (
    <div className="app-container">
      {/* Основной контент страниц */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      {/* Навбар всегда внизу */}
      <NavBar />
    </div>
  );
}

export default App