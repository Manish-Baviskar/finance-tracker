
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: { translation: {
    app_title: 'PFM App',
    add_expense: 'Add Expense',
    my_debts: 'My Debts',
    savings_goals: 'Savings Goals',
    welcome: 'Track your expenses. Clear your debts. Save more.',
    amount: 'Amount',
    category: 'Category',
    note: 'Note',
    save: 'Save',
    language: 'Language',
    voice_input: 'Voice Input'
  }},
  hi: { translation: {
    app_title: 'पीएफ़एम ऐप',
    add_expense: 'खर्च जोड़ें',
    my_debts: 'मेरा कर्ज',
    savings_goals: 'बचत लक्ष्य',
    welcome: 'खर्च ट्रैक करें। कर्ज चुकाएँ। ज़्यादा बचत करें।',
    amount: 'राशि',
    category: 'श्रेणी',
    note: 'नोट',
    save: 'सेव करें',
    language: 'भाषा',
    voice_input: 'वॉइस इनपुट'
  }}
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('lng') || 'en',
    interpolation: { escapeValue: false }
  })

export default i18n
