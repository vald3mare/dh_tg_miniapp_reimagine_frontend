import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import BottomNav from './components/BottomNav/BottomNav';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Profile from './pages/Profile';

const App = () => {
  const location = useLocation();

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </AnimatePresence>
      <BottomNav />
    </div>
  );
};

export default App;
