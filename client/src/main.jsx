import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#12121f',
          color: '#fff',
          border: '1px solid rgba(168, 85, 247, 0.35)',
          boxShadow: '0 0 20px rgba(168, 85, 247, 0.15)',
        },
        success: {
          iconTheme: {
            primary: '#22d3ee',
            secondary: '#12121f',
          },
        },
        error: {
          iconTheme: {
            primary: '#f472b6',
            secondary: '#12121f',
          },
        },
      }}
    />
  </StrictMode>,
)
