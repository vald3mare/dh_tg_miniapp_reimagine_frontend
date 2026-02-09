import { Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav/BottomNav'

import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Profile from './pages/Profile'

const App = () => {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/profile" element={<Profile />} />
        {/* если нужно */}
        {/* <Route path="/tariffs" element={<Tariffs />} /> */}
      </Routes>
      <BottomNav />
    </div>
  )
}

export default App
