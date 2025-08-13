
import React, { useEffect, useState } from 'react'
import PouchDB from 'pouchdb-browser'
import { useTranslation } from 'react-i18next'

const db = new PouchDB('pfm-local')

// Optional remote sync if provided
const remoteUrl = import.meta.env.VITE_COUCH_URL
if (remoteUrl) {
  const remote = new PouchDB(remoteUrl)
  db.sync(remote, { live: true, retry: true })
    .on('error', console.error)
}

export default function Expenses() {
  const { t, i18n } = useTranslation()
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [note, setNote] = useState('')
  const [items, setItems] = useState([])
  const [listening, setListening] = useState(false)
  const [voiceText, setVoiceText] = useState('')

  const load = async () => {
    const res = await db.allDocs({ include_docs: true, descending: true })
    setItems(res.rows.filter(r => r.doc.type === 'expense').map(r => r.doc))
  }

  useEffect(() => {
    load()
    const changes = db.changes({ since: 'now', live: true, include_docs: true })
      .on('change', load)
    return () => changes.cancel()
  }, [])

  const addExpense = async () => {
    if (!amount) return
    const doc = {
      _id: new Date().toISOString(),
      type: 'expense',
      amount: Number(amount),
      category,
      note
    }
    await db.put(doc)
    setAmount(''); setNote('')
  }

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { alert('Speech Recognition not supported'); return }
    const recog = new SR()
    recog.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-IN'
    recog.interimResults = false
    recog.maxAlternatives = 1
    recog.onstart = () => setListening(true)
    recog.onend = () => setListening(false)
    recog.onresult = (e) => {
      const text = e.results[0][0].transcript
      setVoiceText(text)
      // basic parse: extract first number as amount
      const match = text.replace(/,/g,'').match(/(\d+(?:\.\d+)?)/)
      if (match) setAmount(match[1])
      if (/rent|kiraya|kirāyā/i.test(text)) setCategory('rent')
      if (/food|khana|khaana|ration/i.test(text)) setCategory('food')
      if (/travel|bus|auto|safar/i.test(text)) setCategory('travel')
    }
    recog.start()
  }

  return (
    <section>
      <h2>{t('add_expense')}</h2>
      <div style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
        <input placeholder={t('amount')} value={amount} onChange={e => setAmount(e.target.value)} />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="food">Food</option>
          <option value="rent">Rent</option>
          <option value="travel">Travel</option>
          <option value="other">Other</option>
        </select>
        <input placeholder={t('note')} value={note} onChange={e => setNote(e.target.value)} />
        <div>
          <button onClick={startVoice}>🎙 {listening ? 'Listening...' : t('voice_input')}</button>
          <span style={{ marginLeft: 8, opacity: 0.8 }}>{voiceText}</span>
        </div>
        <button onClick={addExpense}>{t('save')}</button>
      </div>

      <h3 style={{ marginTop: 24 }}>Recent</h3>
      <ul>
        {items.map(it => (
          <li key={it._id}>
            ₹{it.amount} — {it.category} {it.note ? '– ' + it.note : ''}
          </li>
        ))}
      </ul>
    </section>
  )
}
