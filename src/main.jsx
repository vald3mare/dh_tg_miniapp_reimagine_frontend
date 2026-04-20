import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import { LazyMotion, domMax } from 'motion/react';
import App from './App.jsx'
import './App.css'
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

// ── Инициализация Telegram Mini App ──────────────────────────────────────────
const twa = window.Telegram?.WebApp;
if (twa) {
  twa.ready();
  twa.expand();                                         // полноэкранный режим
  twa.enableClosingConfirmation();                      // «Закрыть приложение?» при свайпе
  twa.disableVerticalSwipes?.();                        // убираем свайп-вниз (API 7.7+)
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <LazyMotion features={domMax} strict>
      <ErrorBoundary>
        <UserProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </UserProvider>
      </ErrorBoundary>
    </LazyMotion>
  </BrowserRouter>
);