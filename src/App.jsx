import { Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav/BottomNav'

import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Profile from './pages/Profile'
import Welcome from './pages/Welcome'
import WelcomeDemo from './pages/welcome-demo'

const App = () => {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<WelcomeDemo />} />
        <Route path="/home" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <BottomNav />
    </div>
  )
}

export default App
