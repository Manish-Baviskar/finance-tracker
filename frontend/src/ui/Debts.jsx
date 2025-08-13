
import React, { useEffect, useState } from 'react'
import PouchDB from 'pouchdb-browser'
import { useTranslation } from 'react-i18next'

const db = new PouchDB('pfm-local')

export default function Debts() {
  const { t } = useTranslation()
  const [items, setItems] = useState([])
  const [name, setName] = useState('Shopkeeper')
  const [amount, setAmount] = useState('')

  const load = async () => {
    const res = await db.allDocs({ include_docs: true })
    const debts = res.rows.filter(r => r.doc.type === 'debt').map(r => r.doc)
    setItems(debts)
  }

  useEffect(() => {
    load()
    const changes = db.changes({ since: 'now', live: true, include_docs: true })
      .on('change', load)
    return () => changes.cancel()
  }, [])

  const addDebt = async () => {
    if (!name || !amount) return
    await db.put({
      _id: `debt-${Date.now()}`,
      type: 'debt',
      name,
      amount: Number(amount),
      paid: 0
    })
    setAmount('')
  }

  const pay = async (doc) => {
    const payAmt = Math.min(100, doc.amount - doc.paid) // demo: pay ₹100 each click
    doc.paid += payAmt
    await db.put(doc)
  }

  return (
    <section>
      <h2>{t('my_debts')}</h2>
      <div style={{ display:'flex', gap:8, marginBottom: 12 }}>
        <input placeholder="Lender name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} />
        <button onClick={addDebt}>Add</button>
      </div>
      <ul style={{ listStyle:'none', padding:0 }}>
        {items.map(d => {
          const remaining = d.amount - d.paid
          const pct = Math.round((d.paid / d.amount) * 100)
          const color = remaining <= 0 ? '#16a34a' : pct > 50 ? '#f59e0b' : '#ef4444'
          return (
            <li key={d._id} style={{ marginBottom:12, padding:12, border:'1px solid #e5e7eb', borderRadius:8 }}>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <strong>{d.name}</strong>
                <span>₹{d.paid} / ₹{d.amount}</span>
              </div>
              <div style={{ height:8, background:'#e5e7eb', borderRadius:999, marginTop:8 }}>
                <div style={{ width: pct+'%', height:'100%', background: color, borderRadius:999 }}></div>
              </div>
              <div style={{ marginTop:8, display:'flex', gap:8 }}>
                <button disabled={remaining<=0} onClick={() => pay(d)}>{remaining<=0 ? 'Cleared' : 'Pay ₹100'}</button>
                <span style={{ opacity:0.7 }}>{pct}%</span>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
