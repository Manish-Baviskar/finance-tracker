
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './ui/App.jsx'
import Home from './ui/Home.jsx'
import Expenses from './ui/Expenses.jsx'
import Debts from './ui/Debts.jsx'
import './ui/i18n.js'

const router = createBrowserRouter([
  { path: '/', element: <App />, children: [
    { index: true, element: <Home /> },
    { path: 'expenses', element: <Expenses /> },
    { path: 'debts', element: <Debts /> },
  ]}
])

function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('Service worker registered'))
      .catch(err => console.error('SW registration failed', err));
  }
}
registerSW();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
