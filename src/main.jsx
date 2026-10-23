import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { CarritoProvider } from './context/CarritoContext.jsx'

import 'bootstrap/dist/css/bootstrap.min.css'
import './css/main.css'; // 👈 Importas tu CSS original

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CarritoProvider>
      <App />
    </CarritoProvider>
  </StrictMode>,
)