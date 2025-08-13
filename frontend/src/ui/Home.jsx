
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function Home() {
  const { t } = useTranslation()
  return (
    <section>
      <h2>{t('welcome')}</h2>
      <p>Offline-first PWA with multilingual support and voice input.</p>
    </section>
  )
}
