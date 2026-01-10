import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar'
import Home from './pages/Home';
import Services from './pages/Services';


const App = () => {
  return (
    <div className="app-container">
      {/* Основной контент страниц */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        {/* Добавляй новые страницы сюда */}
        {/* <Route path="/tariffs" element={<Tariffs />} /> */}
        {/* <Route path="/profile" element={<Profile />} /> */}
      </Routes>

      {/* Навбар всегда внизу */}
      <NavBar />
    </div>
  );
}

export default App