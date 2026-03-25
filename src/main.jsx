import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './App.css'
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <UserProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </UserProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>
);