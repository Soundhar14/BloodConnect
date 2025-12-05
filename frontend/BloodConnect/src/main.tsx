// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css'; 
import App from './App';
import { BrowserRouter } from 'react-router-dom'; 
import { AuthProvider } from './context/AuthProvider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter> {/* Wrap App for routing */}
      <AuthProvider> {/* Wrap App with AuthProvider */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
