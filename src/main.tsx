import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { seedInitialData } from './lib/seed'

// Quick seed trigger to easily populate initially on window start if db is empty (dev purpose).
// We expose it to window so user can trigger it from console.
(window as any).seedFirestore = seedInitialData;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
