import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { PrivyProvider } from './providers/PrivyProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <PrivyProvider>
        <App />
      </PrivyProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
