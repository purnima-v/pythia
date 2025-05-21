import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { Providers } from './providers'
// import { PrivyProvider } from './providers/PrivyProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Providers>
        {/* <PrivyProvider> */}
        <App />
        {/* </PrivyProvider> */}
      </Providers>
    </BrowserRouter>
  </React.StrictMode>,
)
