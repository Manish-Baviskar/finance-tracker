
import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function App() {
  const { t, i18n } = useTranslation()

  const changeLang = (lng) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('lng', lng)
  }

  return (
    <div style={{ fontFamily: 'system-ui, Arial', padding: 16 }}>
      <header style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0 }}>{t('app_title')}</h1>
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link to="/">Home</Link>
          <Link to="/expenses">Expenses</Link>
          <Link to="/debts">Debts</Link>
        </nav>
        <div>
          <label style={{ marginRight: 8 }}>{t('language')}:</label>
          <button onClick={() => changeLang('en')}>EN</button>
          <button onClick={() => changeLang('hi')}>हिंदी</button>
        </div>
      </header>
      <main style={{ marginTop: 24 }}>
        <Outlet />
      </main>
    </div>
  )
}
